import { Autocomplete, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import type { Rep } from '../../types'
import { CURRENT_USER_ID } from '../../data/mockData'

interface Props {
  reps: Rep[]
  selectedRepId: string | null
  onRepChange: (repId: string | null) => void
}

export default function RepSearch({ reps, selectedRepId, onRepChange }: Props) {
  const otherReps = reps.filter((r) => r.id !== CURRENT_USER_ID)
  const selectedRep = otherReps.find((r) => r.id === selectedRepId) ?? null

  return (
    <Autocomplete<Rep>
      options={otherReps}
      getOptionLabel={(r) => r.name}
      value={selectedRep}
      onChange={(_, newValue) => onRepChange(newValue?.id ?? null)}
      size="small"
      sx={{ width: 240 }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search rep…"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 0.5 }} />
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
    />
  )
}
