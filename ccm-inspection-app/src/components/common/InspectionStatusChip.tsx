import { Box, Typography } from '@mui/material'
import type { InspectionStatus } from '../../types'

interface Props {
  status: InspectionStatus | 'Scheduled'
  size?: 'small' | 'medium'
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  'Scheduled':        { bg: '#DBEAFE', color: '#1D4ED8', label: 'Scheduled' },
  'In Progress':      { bg: '#FEF3C7', color: '#B45309', label: 'In Progress' },
  'Canceled':         { bg: '#FEE2E2', color: '#991B1B', label: 'Canceled' },
  'Completed':        { bg: '#DCFCE7', color: '#166534', label: 'Complete' },
  'Complete':         { bg: '#DCFCE7', color: '#166534', label: 'Complete' },
  'On Hold':          { bg: '#FEF9C3', color: '#854D0E', label: 'On Hold' },
  'Report Generated': { bg: '#EDE9FE', color: '#5B21B6', label: 'Report Generated' },
  'Not Started':      { bg: '#F3F4F6', color: '#6B7280', label: 'Not Started' },
  'Requested':        { bg: '#FEF3C7', color: '#B45309', label: 'Requested' },
  'Needs Follow-Up':  { bg: '#FEE2E2', color: '#991B1B', label: 'Needs Follow-Up' },
}

export default function InspectionStatusChip({ status, size = 'small' }: Props) {
  const style = STATUS_STYLES[status] ?? { bg: '#F3F4F6', color: '#6B7280', label: status }
  const py = size === 'small' ? '2px' : '4px'
  const px = size === 'small' ? '10px' : '14px'
  const fontSize = size === 'small' ? '0.72rem' : '0.8rem'
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        bgcolor: style.bg,
        borderRadius: '999px',
        px,
        py,
        whiteSpace: 'nowrap',
      }}
    >
      <Typography sx={{ fontSize, fontWeight: 600, color: style.color, lineHeight: 1.4 }}>
        {style.label}
      </Typography>
    </Box>
  )
}
