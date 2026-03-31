import { useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Chip,
  IconButton,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CloseIcon from '@mui/icons-material/Close'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import type { Markup } from '../../types'
import { useJobs } from '../../context/JobsContext'
import { WIZARD_STEPS } from '../../data/inspectionConstants'
import SetupStep from './SetupStep'
import MarkupCanvas from './MarkupCanvas'
import IssueDetailsStep from './IssueDetailsStep'
import ReviewStep from './ReviewStep'
import GenerateReportStep from './GenerateReportStep'

export default function InspectionWizard() {
  const { jobId, versionId } = useParams<{ jobId: string; versionId: string }>()
  const navigate = useNavigate()
  const { jobs, updateInspectionVersion } = useJobs()

  const job = jobs.find((j) => j.id === jobId)
  const version = job?.inspectionVersions.find((v) => v.id === versionId)

  const [activeStep, setActiveStep] = useState(0)
  const [selectedMarkupId, setSelectedMarkupId] = useState<string | null>(null)
  const [draftMarkups, setDraftMarkups] = useState<Markup[]>(version?.markups ?? [])
  const [markedUpImageUrl, setMarkedUpImageUrl] = useState<string | null>(null)
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null)

  if (!job || !version) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">Inspection not found</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </Box>
    )
  }

  const syncMarkups = useCallback(
    (markups: Markup[]) => {
      updateInspectionVersion(job.id, version.id, { markups })
    },
    [job.id, version.id, updateInspectionVersion]
  )

  const handleNext = () => {
    // Sync markups to context when moving between steps
    syncMarkups(draftMarkups)
    setActiveStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1))
    setSelectedMarkupId(null)
  }

  const handleBack = () => {
    syncMarkups(draftMarkups)
    setActiveStep((s) => Math.max(s - 1, 0))
    setSelectedMarkupId(null)
  }

  const handleJumpToStep = (idx: number) => {
    syncMarkups(draftMarkups)
    setActiveStep(idx)
    setSelectedMarkupId(null)
  }

  const handleAddMarkup = (markup: Markup) => {
    setDraftMarkups((prev) => [...prev, markup])
  }

  const handleDeleteMarkup = (id: string) => {
    setDraftMarkups((prev) => prev.filter((m) => m.id !== id))
  }

  const handleUpdateMarkup = (id: string, patch: Partial<Markup>) => {
    setDraftMarkups((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  }

  const handleGenerate = () => {
    // Save final markups and mark as Report Generated
    updateInspectionVersion(job.id, version.id, {
      markups: draftMarkups,
      status: 'Report Generated',
      reportUrl: '#',
    })
    handleNext()
  }

  const handleExit = () => {
    syncMarkups(draftMarkups)
    navigate(`/jobs/${job.id}`)
  }

  const isMarkupStep = activeStep === 1
  const isIssueStep = activeStep === 2
  const isFullHeight = isMarkupStep || isIssueStep || activeStep === 4

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: 'background.default', overflow: 'hidden' }}>
      {/* ── Wizard AppBar ─────────────────────────────────────── */}
      <AppBar position="static" elevation={0} sx={{ bgcolor: '#0d47a1', borderBottom: '1px solid rgba(255,255,255,0.12)', flexShrink: 0 }}>
        <Toolbar sx={{ gap: 1.5, minHeight: '56px !important' }}>
          <WorkOutlineIcon fontSize="small" sx={{ opacity: 0.7 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" noWrap sx={{ lineHeight: 1.1 }}>
              {job.jobName}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.7 }}>
              Inspection · Version {version.versionNumber}
              {version.basedOnVersionId && ' · Based on prior version'}
            </Typography>
          </Box>

          {/* Version chip */}
          <Chip
            label={`v${version.versionNumber}`}
            size="small"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 700 }}
          />

          <Tooltip title="Save & exit to job details">
            <IconButton size="small" onClick={handleExit} sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* ── Stepper ───────────────────────────────────────────── */}
      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', px: { xs: 2, md: 4 }, py: 1.5, flexShrink: 0 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {WIZARD_STEPS.map((label, index) => (
            <Step key={label} completed={index < activeStep}>
              <StepLabel
                sx={{
                  cursor: index < activeStep ? 'pointer' : 'default',
                  '& .MuiStepLabel-label': { fontSize: { xs: '0.68rem', sm: '0.78rem' } },
                }}
                onClick={() => {
                  if (index < activeStep) handleJumpToStep(index)
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ── Step content ─────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          overflow: isFullHeight ? 'hidden' : 'auto',
          p: isFullHeight ? 0 : { xs: 2, sm: 3, md: 4 },
        }}
      >
        {activeStep === 0 && (
          <SetupStep job={job} version={version} onContinue={handleNext} />
        )}

        {activeStep === 1 && (
          <MarkupCanvas
            markups={draftMarkups}
            assetType={job.primaryAsset.type}
            assetLabel={job.primaryAsset.label}
            selectedMarkupId={selectedMarkupId}
            onSelectMarkup={setSelectedMarkupId}
            onAddMarkup={handleAddMarkup}
            onDeleteMarkup={handleDeleteMarkup}
            onSaveImage={setMarkedUpImageUrl}
            photoUrl={capturedPhotoUrl}
            onPhotoCapture={setCapturedPhotoUrl}
          />
        )}

        {activeStep === 2 && (
          <IssueDetailsStep
            markups={draftMarkups}
            selectedMarkupId={selectedMarkupId}
            onSelectMarkup={setSelectedMarkupId}
            onUpdateMarkup={handleUpdateMarkup}
          />
        )}

        {activeStep === 3 && (
          <ReviewStep
            job={job}
            version={version}
            markups={draftMarkups}
            onEditStep={handleJumpToStep}
            onGenerate={handleGenerate}
          />
        )}

        {activeStep === 4 && (
          <GenerateReportStep
            job={job}
            version={version}
            markups={draftMarkups}
            markedUpImageUrl={markedUpImageUrl}
            onBackToJob={handleExit}
          />
        )}
      </Box>

      {/* ── Bottom nav bar (steps 1–3 only) ──────────────────── */}
      {activeStep > 0 && activeStep < 3 && (
        <Box
          sx={{
            flexShrink: 0,
            px: 3,
            py: 1.5,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ textTransform: 'none' }}>
            Back
          </Button>

          {activeStep === 1 && (
            <Typography variant="caption" color="text.secondary">
              {draftMarkups.length} markup{draftMarkups.length !== 1 ? 's' : ''} added
            </Typography>
          )}
          {activeStep === 2 && (
            <Typography variant="caption" color={draftMarkups.filter((m) => !m.issueCategory || !m.severity).length > 0 ? 'warning.main' : 'success.main'}>
              {draftMarkups.filter((m) => m.issueCategory && m.severity).length} of {draftMarkups.length} complete
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === 1 && draftMarkups.length === 0}
            sx={{ textTransform: 'none', fontWeight: 700 }}
          >
            {activeStep === 2 ? 'Review' : 'Next'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
