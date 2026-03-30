import { Chip } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'

interface Props {
  size?: 'small' | 'medium'
}

export default function EarlyBirdChip({ size = 'small' }: Props) {
  return (
    <Chip
      label="Early Bird"
      size={size}
      icon={<StarIcon />}
      sx={{
        backgroundColor: '#FFF3E0',
        color: '#E65100',
        border: '1px solid #FFB74D',
        fontWeight: 600,
        '& .MuiChip-icon': { color: '#E65100' },
      }}
    />
  )
}
