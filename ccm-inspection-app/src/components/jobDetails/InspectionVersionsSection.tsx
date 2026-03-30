import {
  Box,
  Button,
  Chip,
  Divider,
  Tooltip,
  Typography,
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import VisibilityIcon from '@mui/icons-material/Visibility'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
import HistoryIcon from '@mui/icons-material/History'
import dayjs from 'dayjs'
import type { InspectionVersion } from '../../types'
import InspectionStatusChip from '../common/InspectionStatusChip'
import SectionCard from './SectionCard'

interface Props {
  versions: InspectionVersion[]
  onStartNew: () => void
  onResume: (version: InspectionVersion) => void
  onView: (version: InspectionVersion) => void
  onViewReport: (version: InspectionVersion) => void
  onCreateFromVersion: (version: InspectionVersion) => void
  readOnly?: boolean
}

export default function InspectionVersionsSection({
  versions,
  onStartNew,
  onResume,
  onView,
  onViewReport,
  onCreateFromVersion,
  readOnly = false,
}: Props) {
  const sorted = [...versions].sort((a, b) => b.versionNumber - a.versionNumber)
  const hasInProgress = versions.some((v) => v.status === 'In Progress')

  return (
    <SectionCard
      title="Inspection Versions"
      action={
        !readOnly && (
          <Tooltip
            title={
              hasInProgress
                ? 'Resume the in-progress inspection below, or create a new version from a prior completed version'
                : 'Start a new inspection'
            }
          >
            <span>
              <Button
                size="small"
                variant="contained"
                startIcon={<AddCircleOutlineIcon fontSize="small" />}
                onClick={onStartNew}
                disabled={hasInProgress}
                sx={{ textTransform: 'none', fontSize: '0.78rem' }}
              >
                New Inspection
              </Button>
            </span>
          </Tooltip>
        )
      }
    >
      {versions.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1.5 }}>
          <HistoryIcon sx={{ fontSize: 40, opacity: 0.25, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            No inspections have been started for this job.
          </Typography>
          {!readOnly && (
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={onStartNew}
              sx={{ mt: 0.5 }}
            >
              Start Inspection
            </Button>
          )}
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {sorted.map((v, i) => (
            <Box key={v.id}>
              {i > 0 && <Divider sx={{ my: 1.5 }} />}
              <VersionRow
                version={v}
                onResume={onResume}
                onView={onView}
                onViewReport={onViewReport}
                onCreateFrom={onCreateFromVersion}
                readOnly={readOnly}
              />
            </Box>
          ))}
        </Box>
      )}
    </SectionCard>
  )
}

// ── Single version row ───────────────────────────────────────────────────────

interface VersionRowProps {
  version: InspectionVersion
  onResume: (v: InspectionVersion) => void
  onView: (v: InspectionVersion) => void
  onViewReport: (v: InspectionVersion) => void
  onCreateFrom: (v: InspectionVersion) => void
  readOnly: boolean
}

function VersionRow({ version, onResume, onView, onViewReport, onCreateFrom, readOnly }: VersionRowProps) {
  const isInProgress = version.status === 'In Progress'
  const isCompleted = version.status === 'Completed' || version.status === 'Report Generated'
  const hasReport = version.status === 'Report Generated' && version.reportUrl

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 1.5, sm: 2 },
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: isInProgress ? 'rgba(21, 101, 192, 0.04)' : 'transparent',
        border: isInProgress ? '1px solid rgba(21, 101, 192, 0.15)' : '1px solid transparent',
      }}
    >
      {/* Version label */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1, minWidth: 0 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1,
            bgcolor: isInProgress ? 'primary.main' : 'grey.100',
            color: isInProgress ? 'white' : 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.85rem',
            flexShrink: 0,
          }}
        >
          v{version.versionNumber}
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="subtitle2">Version {version.versionNumber}</Typography>
            {version.basedOnVersionId && (
              <Chip
                label="Based on prior version"
                size="small"
                variant="outlined"
                color="default"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" display="block">
            {dayjs(version.createdDate).format('MMM D, YYYY')} · {version.createdBy}
          </Typography>
        </Box>
      </Box>

      {/* Status */}
      <InspectionStatusChip status={version.status} />

      {/* Actions */}
      {!readOnly && (
        <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0, flexWrap: 'wrap' }}>
          {isInProgress && (
            <Button
              size="small"
              variant="contained"
              startIcon={<PlayArrowIcon fontSize="small" />}
              onClick={() => onResume(version)}
              sx={{ textTransform: 'none', fontSize: '0.78rem' }}
            >
              Resume
            </Button>
          )}

          {isCompleted && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon fontSize="small" />}
              onClick={() => onView(version)}
              sx={{ textTransform: 'none', fontSize: '0.78rem' }}
            >
              View
            </Button>
          )}

          {hasReport && (
            <Button
              size="small"
              variant="outlined"
              color="success"
              startIcon={<PictureAsPdfIcon fontSize="small" />}
              onClick={() => onViewReport(version)}
              sx={{ textTransform: 'none', fontSize: '0.78rem' }}
            >
              Report
            </Button>
          )}

          {isCompleted && (
            <Tooltip title="Start a new inspection version based on this one">
              <Button
                size="small"
                variant="text"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={() => onCreateFrom(version)}
                sx={{ textTransform: 'none', fontSize: '0.78rem' }}
              >
                Use as Base
              </Button>
            </Tooltip>
          )}
        </Box>
      )}
    </Box>
  )
}
