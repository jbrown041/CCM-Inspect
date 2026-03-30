import { Chip } from '@mui/material'
import type { Brand } from '../../types'

interface Props {
  brand: Brand
  size?: 'small' | 'medium'
}

const brandConfig: Record<Brand, { bg: string; color: string; border: string }> = {
  Bluey: { bg: '#E3F2FD', color: '#1565C0', border: '#90CAF9' },
  Yellowy: { bg: '#FFF8E1', color: '#F57F17', border: '#FFE082' },
}

export default function BrandChip({ brand, size = 'small' }: Props) {
  const { bg, color, border } = brandConfig[brand]
  return (
    <Chip
      label={brand}
      size={size}
      sx={{
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
        fontWeight: 600,
      }}
    />
  )
}
