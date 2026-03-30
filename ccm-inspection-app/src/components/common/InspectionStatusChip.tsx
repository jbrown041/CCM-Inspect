import { Chip } from '@mui/material'
import type { InspectionStatus } from '../../types'

interface Props {
  status: InspectionStatus
  size?: 'small' | 'medium'
}

type ChipColor = 'default' | 'primary' | 'success' | 'info' | 'warning' | 'error'

const statusConfig: Record<InspectionStatus, { color: ChipColor; variant: 'filled' | 'outlined' }> = {
  'Not Started': { color: 'default', variant: 'outlined' },
  'In Progress': { color: 'primary', variant: 'filled' },
  'Completed': { color: 'success', variant: 'filled' },
  'Report Generated': { color: 'info', variant: 'filled' },  'Requested': { color: 'warning', variant: 'outlined' },
  'Needs Follow-Up': { color: 'error', variant: 'outlined' },}

export default function InspectionStatusChip({ status, size = 'small' }: Props) {
  const { color, variant } = statusConfig[status]
  return <Chip label={status} color={color} variant={variant} size={size} />
}
