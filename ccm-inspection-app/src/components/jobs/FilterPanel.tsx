import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  Drawer,
  FormControlLabel,
  IconButton,
  Popover,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import type { FilterState } from '../../types'
import { INSPECTION_TYPES } from '../../data/mockData'

interface Props {
  anchorEl: HTMLElement | null
  onClose: () => void
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export default function FilterPanel({ anchorEl, onClose, filters, onFiltersChange }: Props) {
  const open = Boolean(anchorEl)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleLocationChange = (value: string) => {
    onFiltersChange({ ...filters, location: value })
  }

  const handleTypeToggle = (type: string) => {
    const current = filters.typeOfInspection
    const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
    onFiltersChange({ ...filters, typeOfInspection: next })
  }

  const handleBrandChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    onFiltersChange({ ...filters, brand: (value as FilterState['brand']) ?? '' })
  }

  const handleEarlyBirdChange = (_: React.MouseEvent<HTMLElement>, value: string | null) => {
    if (value) onFiltersChange({ ...filters, earlyBird: value as FilterState['earlyBird'] })
  }

  const handleClearAll = () => {
    onFiltersChange({ location: '', typeOfInspection: [], brand: '', earlyBird: 'all' })
  }

  const hasAnyFilter =
    filters.location ||
    filters.typeOfInspection.length > 0 ||
    filters.brand ||
    filters.earlyBird !== 'all'

  const filterContent = (
    <>
      {/* Header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle2">Filter Jobs</Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {hasAnyFilter && (
            <Button size="small" color="error" onClick={handleClearAll} sx={{ fontSize: '0.75rem' }}>
              Clear All
            </Button>
          )}
          <IconButton size="small" onClick={onClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        {/* Location */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Location
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="City or state…"
            value={filters.location}
            onChange={(e) => handleLocationChange(e.target.value)}
            sx={{ mt: 1 }}
          />
        </Box>

        <Divider />

        {/* Type of Inspection */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Inspection Type
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column' }}>
            {INSPECTION_TYPES.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    size="small"
                    checked={filters.typeOfInspection.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                  />
                }
                label={<Typography variant="body2">{type}</Typography>}
                sx={{ mx: 0, height: 32 }}
              />
            ))}
          </Box>
        </Box>

        <Divider />

        {/* Brand */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Brand
          </Typography>
          <ToggleButtonGroup
            value={filters.brand || null}
            exclusive
            onChange={handleBrandChange}
            size="small"
            sx={{ mt: 1 }}
          >
            <ToggleButton value="Bluey" sx={{ px: 2, textTransform: 'none', fontWeight: 600 }}>
              Bluey
            </ToggleButton>
            <ToggleButton value="Yellowy" sx={{ px: 2, textTransform: 'none', fontWeight: 600 }}>
              Yellowy
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Divider />

        {/* Early Bird */}
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Early Bird
          </Typography>
          <ToggleButtonGroup
            value={filters.earlyBird}
            exclusive
            onChange={handleEarlyBirdChange}
            size="small"
            sx={{ mt: 1 }}
          >
            <ToggleButton value="all" sx={{ px: 2, textTransform: 'none' }}>
              All Jobs
            </ToggleButton>
            <ToggleButton value="early_bird_only" sx={{ px: 2, textTransform: 'none', fontWeight: 600 }}>
              Early Bird Only
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
    </>
  )

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '85vh', overflowY: 'auto' } }}
      >
        {/* Drag handle */}
        <Box sx={{ display: 'flex', justifyContent: 'center', pt: 1.5, pb: 0.5 }}>
          <Box sx={{ width: 36, height: 4, borderRadius: 2, bgcolor: 'divider' }} />
        </Box>
        {filterContent}
      </Drawer>
    )
  }

  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      PaperProps={{ sx: { width: 340, mt: 1, borderRadius: 2, boxShadow: 4 } }}
    >
      {filterContent}
    </Popover>
  )
}

// ── Active filter chips displayed below the toolbar ────────────────────────

interface ActiveFilterChipsProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function ActiveFilterChips({ filters, onFiltersChange }: ActiveFilterChipsProps) {
  const chips: { key: string; label: string; onDelete: () => void }[] = []

  if (filters.location) {
    chips.push({
      key: 'location',
      label: `Location: ${filters.location}`,
      onDelete: () => onFiltersChange({ ...filters, location: '' }),
    })
  }

  filters.typeOfInspection.forEach((type) => {
    chips.push({
      key: `type-${type}`,
      label: type,
      onDelete: () =>
        onFiltersChange({
          ...filters,
          typeOfInspection: filters.typeOfInspection.filter((t) => t !== type),
        }),
    })
  })

  if (filters.brand) {
    chips.push({
      key: 'brand',
      label: `Brand: ${filters.brand}`,
      onDelete: () => onFiltersChange({ ...filters, brand: '' }),
    })
  }

  if (filters.earlyBird === 'early_bird_only') {
    chips.push({
      key: 'earlyBird',
      label: 'Early Bird Only',
      onDelete: () => onFiltersChange({ ...filters, earlyBird: 'all' }),
    })
  }

  if (chips.length === 0) return null

  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 0.75,
        alignItems: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: '#FAFBFF',
      }}
    >
      <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5 }}>
        Filters:
      </Typography>
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          label={chip.label}
          size="small"
          onDelete={chip.onDelete}
          color="primary"
          variant="outlined"
          sx={{ fontSize: '0.78rem' }}
        />
      ))}
      {chips.length > 1 && (
        <Button
          size="small"
          color="error"
          sx={{ fontSize: '0.75rem', ml: 0.5, minWidth: 0 }}
          onClick={() =>
            onFiltersChange({ location: '', typeOfInspection: [], brand: '', earlyBird: 'all' })
          }
        >
          Clear all
        </Button>
      )}
    </Box>
  )
}
