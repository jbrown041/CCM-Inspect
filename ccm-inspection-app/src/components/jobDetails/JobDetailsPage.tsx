import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Box,
  Breadcrumbs,
  Button,
  Chip,
  Grid,
  Link,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import PersonSearchIcon from '@mui/icons-material/PersonSearch'
import { useJobs } from '../../context/JobsContext'
import { reps, CURRENT_USER_ID } from '../../data/mockData'
import type { InspectionVersion } from '../../types'
import JobSummarySection from './JobSummarySection'
import StatusPrioritySection from './StatusPrioritySection'
import ContextSection from './ContextSection'
import InspectionVersionsSection from './InspectionVersionsSection'
import NewVersionFromPriorDialog from './NewVersionFromPriorDialog'
import EarlyBirdChip from '../common/EarlyBirdChip'
import InspectionStatusChip from '../common/InspectionStatusChip'

export default function JobDetailsPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const navigate = useNavigate()
  const { jobs, addInspectionVersion } = useJobs()

  const [newVersionDialogSource, setNewVersionDialogSource] = useState<InspectionVersion | null>(null)

  const job = jobs.find((j) => j.id === jobId)

  if (!job) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Job not found
        </Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate('/jobs')}>
          Back to Jobs
        </Button>
      </Box>
    )
  }

  const isReadOnly = job.repId !== CURRENT_USER_ID
  const ownerRep = reps.find((r) => r.id === job.repId)
  const hasInProgress = job.inspectionVersions.some((v) => v.status === 'In Progress')
  const inProgressVersion = job.inspectionVersions.find((v) => v.status === 'In Progress')

  // ── Inspection actions ────────────────────────────────────────────────────

  const handleStartNew = () => {
    const newVersion: InspectionVersion = {
      id: `iv-${Date.now()}`,
      versionNumber: job.inspectionVersions.length + 1,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Alex Rivera',
      status: 'In Progress',
      markups: [],
    }
    addInspectionVersion(job.id, newVersion)
    // Navigate into wizard immediately
    navigate(`/jobs/${job.id}/inspect/${newVersion.id}`)
  }

  const handleResume = (version: InspectionVersion) => {
    navigate(`/jobs/${job.id}/inspect/${version.id}`)
  }

  const handleView = (version: InspectionVersion) => {
    // Completed versions open wizard in read-only review (for now navigate to wizard)
    navigate(`/jobs/${job.id}/inspect/${version.id}`)
  }

  const handleViewReport = (version: InspectionVersion) => {
    // Navigate to wizard on report step
    navigate(`/jobs/${job.id}/inspect/${version.id}`)
  }

  const handleCreateFromVersion = (version: InspectionVersion) => {
    setNewVersionDialogSource(version)
  }

  const handleConfirmNewFromPrior = () => {
    if (!newVersionDialogSource) return
    const newVersion: InspectionVersion = {
      id: `iv-${Date.now()}`,
      versionNumber: job.inspectionVersions.length + 1,
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Alex Rivera',
      status: 'In Progress',
      basedOnVersionId: newVersionDialogSource.id,
      markups: [...newVersionDialogSource.markups], // carry forward markups
    }
    addInspectionVersion(job.id, newVersion)
    setNewVersionDialogSource(null)
    navigate(`/jobs/${job.id}/inspect/${newVersion.id}`)
  }

  // ── Primary inspection CTA ────────────────────────────────────────────────

  const renderPrimaryCTA = () => {
    if (isReadOnly) return null

    if (hasInProgress && inProgressVersion) {
      return (
        <Button
          variant="contained"
          size="large"
          startIcon={<PlayArrowIcon />}
          onClick={() => handleResume(inProgressVersion)}
          sx={{ fontWeight: 700 }}
        >
          Resume Inspection (v{inProgressVersion.versionNumber})
        </Button>
      )
    }

    return (
      <Button
        variant="contained"
        size="large"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleStartNew}
        sx={{ fontWeight: 700 }}
      >
        Start Inspection
      </Button>
    )
  }

  return (
    <Box sx={{ height: '100vh', overflow: 'auto', bgcolor: 'background.default' }}>
      {/* ── Page header ─────────────────────────────────────────────── */}
      <Box
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          pt: 2.5,
          pb: 2,
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 1.5 }}>
          <Link
            component="button"
            variant="body2"
            color="inherit"
            underline="hover"
            onClick={() => navigate('/jobs')}
            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
          >
            <ArrowBackIcon sx={{ fontSize: 14 }} />
            Jobs
          </Link>
          <Typography variant="body2" color="text.primary">
            {job.jobName}
          </Typography>
        </Breadcrumbs>

        {/* Title row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { md: 'center' },
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {job.jobName}
              </Typography>
              {job.isEarlyBird && <EarlyBirdChip size="medium" />}
              {!job.isScheduled && (
                <Chip label="Unscheduled" size="small" color="warning" variant="outlined" />
              )}
            </Box>
            <Typography variant="body2" color="text.secondary">
              {job.city}, {job.state} · {job.typeOfInspection}
            </Typography>
          </Box>

          {/* Primary CTA */}
          {renderPrimaryCTA()}
        </Box>

        {/* Read-only banner */}
        {isReadOnly && ownerRep && (
          <Alert
            severity="info"
            icon={<PersonSearchIcon />}
            sx={{ mt: 1.5, py: 0.5, borderRadius: 1 }}
          >
            Viewing <strong>{ownerRep.name}</strong>'s job — read-only
          </Alert>
        )}
      </Box>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, py: 3, maxWidth: 1400, mx: 'auto', width: '100%', boxSizing: 'border-box' }}>
        <Grid container spacing={3}>
          {/* Left column: summary + context */}
          <Grid size={{ xs: 12, lg: 7, xl: 5 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <JobSummarySection job={job} />
              <ContextSection job={job} />
            </Box>
          </Grid>

          {/* Middle / right columns on xl: status + versions side by side */}
          <Grid size={{ xs: 12, lg: 5, xl: 3 }}>
            <StatusPrioritySection job={job} />
          </Grid>

          <Grid size={{ xs: 12, lg: 12, xl: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Current inspection status callout */}
              <Box
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Current Status
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    <InspectionStatusChip status={job.inspectionStatus} size="medium" />
                  </Box>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
                    Versions
                  </Typography>
                  <Typography variant="h5" fontWeight={700} color="primary.main">
                    {job.inspectionVersions.length}
                  </Typography>
                </Box>
              </Box>

              <InspectionVersionsSection
                versions={job.inspectionVersions}
                onStartNew={handleStartNew}
                onResume={handleResume}
                onView={handleView}
                onViewReport={handleViewReport}
                onCreateFromVersion={handleCreateFromVersion}
                readOnly={isReadOnly}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* ── Dialogs ─────────────────────────────────────────────────── */}
      <NewVersionFromPriorDialog
        open={Boolean(newVersionDialogSource)}
        sourceVersion={newVersionDialogSource}
        onClose={() => setNewVersionDialogSource(null)}
        onConfirm={handleConfirmNewFromPrior}
      />
    </Box>
  )
}
