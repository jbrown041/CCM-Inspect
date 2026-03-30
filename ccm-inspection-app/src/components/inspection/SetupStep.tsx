import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import dayjs from 'dayjs'
import type { Job, InspectionVersion } from '../../types'
import InspectionStatusChip from '../common/InspectionStatusChip'
import BrandChip from '../common/BrandChip'
import EarlyBirdChip from '../common/EarlyBirdChip'

interface Props {
  job: Job
  version: InspectionVersion
  onContinue: () => void
}

const assetIcon = (type: string) => {
  if (type === 'satellite_image') return <SatelliteAltIcon color="action" />
  if (type === 'roof_photo') return <PhotoCameraIcon color="action" />
  return <ArchitectureIcon color="action" />
}

const assetLabel = (type: string) => {
  if (type === 'satellite_image') return 'Satellite Image'
  if (type === 'roof_photo') return 'Roof Photo'
  return 'Roof Drawing / Plan'
}

export default function SetupStep({ job, version, onContinue }: Props) {
  const isBasedOnPrior = Boolean(version.basedOnVersionId)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, maxWidth: 680, mx: 'auto' }}>
      {/* Version context banner */}
      {isBasedOnPrior && (
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: 'primary.50',
            border: '1px solid',
            borderColor: 'primary.200',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <CheckCircleIcon color="primary" />
          <Box>
            <Typography variant="subtitle2" color="primary.dark">
              New version based on a prior inspection
            </Typography>
            <Typography variant="body2" color="primary.dark" sx={{ opacity: 0.8 }}>
              Markups and findings from the source version have been carried forward. You can edit
              or remove them in the Markup and Issue Details steps.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Job summary */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#F8F9FB', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem', fontWeight: 700 }}>
            Job
          </Typography>
        </Box>
        <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="h6" fontWeight={700}>{job.jobName}</Typography>
              <Typography variant="body2" color="text.secondary">{job.city}, {job.state}</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {job.isEarlyBird && <EarlyBirdChip />}
              <BrandChip brand={job.brand} />
            </Box>
          </Box>
          <Divider />
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 2 }}>
            {[
              { label: 'Inspection Type', value: job.typeOfInspection },
              { label: 'Membrane Type', value: job.membraneType },
              { label: 'Total Sq Ft', value: job.totalSqFt.toLocaleString() },
              { label: 'Roofer', value: job.roofer },
            ].map(({ label, value }) => (
              <Box key={label}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                  {label}
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25 }}>{value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

      {/* Inspection version context */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#F8F9FB', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem', fontWeight: 700 }}>
            Inspection Version
          </Typography>
        </Box>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'primary.main', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
              v{version.versionNumber}
            </Box>
            <Box>
              <Typography variant="subtitle2">Version {version.versionNumber}</Typography>
              <Typography variant="caption" color="text.secondary">
                Started {dayjs(version.createdDate).format('MMM D, YYYY')} · {version.createdBy}
              </Typography>
            </Box>
          </Box>
          <InspectionStatusChip status={version.status} size="medium" />
        </Box>
      </Paper>

      {/* Primary asset */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#F8F9FB', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem', fontWeight: 700 }}>
            Primary Asset
          </Typography>
        </Box>
        <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
          {assetIcon(job.primaryAsset.type)}
          <Box>
            <Typography variant="subtitle2">{job.primaryAsset.label}</Typography>
            <Typography variant="caption" color="text.secondary">{assetLabel(job.primaryAsset.type)}</Typography>
          </Box>
          <Chip label="Ready" color="success" size="small" sx={{ ml: 'auto' }} />
        </Box>
      </Paper>

      {/* CTA */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" size="large" onClick={onContinue} sx={{ px: 4, fontWeight: 700 }}>
          Confirm & Begin Markup
        </Button>
      </Box>
    </Box>
  )
}
