import {
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import EditNoteIcon from '@mui/icons-material/EditNote'
import type { Markup } from '../../types'
import { ISSUE_CATEGORIES, SEVERITY_LEVELS, SEVERITY_CONFIG } from '../../data/inspectionConstants'
import type { SeverityLevel } from '../../data/inspectionConstants'

interface Props {
  markups: Markup[]
  selectedMarkupId: string | null
  onSelectMarkup: (id: string | null) => void
  onUpdateMarkup: (id: string, patch: Partial<Markup>) => void
}

export default function IssueDetailsStep({
  markups,
  selectedMarkupId,
  onSelectMarkup,
  onUpdateMarkup,
}: Props) {
  const selectedMarkup = markups.find((m) => m.id === selectedMarkupId) ?? null
  const incompleteMarkups = markups.filter((m) => !m.issueCategory || !m.severity)

  return (
    <Box sx={{ display: 'flex', height: '100%', gap: 0, overflow: 'hidden' }}>
      {/* ── Left: markup list ─────────────────────────────── */}
      <Box
        sx={{
          width: { xs: '100%', md: 280 },
          flexShrink: 0,
          borderRight: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="subtitle2">Markups</Typography>
          {incompleteMarkups.length > 0 && (
            <Typography variant="caption" color="warning.main">
              {incompleteMarkups.length} incomplete
            </Typography>
          )}
        </Box>

        {markups.length === 0 ? (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <EditNoteIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
            <Typography variant="body2" color="text.secondary">
              No markups yet. Go back to the Markup step to add annotations.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.75 }}>
            {markups.map((m, i) => {
              const isSelected = m.id === selectedMarkupId
              const isIncomplete = !m.issueCategory || !m.severity
              return (
                <Box
                  key={m.id}
                  onClick={() => onSelectMarkup(m.id)}
                  sx={{
                    p: 1.5,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: isSelected ? 'primary.main' : isIncomplete ? 'warning.light' : 'divider',
                    bgcolor: isSelected ? 'primary.50' : isIncomplete ? '#FFF8F0' : 'background.paper',
                    cursor: 'pointer',
                    '&:hover': { borderColor: 'primary.light' },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" fontWeight={600} sx={{ textTransform: 'capitalize' }}>
                      #{i + 1} · {m.annotationType.replace('_', ' ')}
                    </Typography>
                    {isIncomplete ? (
                      <Chip label="Incomplete" size="small" color="warning" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                    ) : (
                      <Chip label="Done" size="small" color="success" variant="outlined" sx={{ height: 18, fontSize: '0.65rem' }} />
                    )}
                  </Box>
                  {m.issueCategory && (
                    <Typography variant="caption" color="text.secondary" noWrap display="block">
                      {m.issueCategory}
                    </Typography>
                  )}
                  {m.severity && (
                    <Chip
                      label={m.severity}
                      size="small"
                      sx={{
                        mt: 0.5,
                        height: 18,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        bgcolor: SEVERITY_CONFIG[m.severity as SeverityLevel]?.bg,
                        color: SEVERITY_CONFIG[m.severity as SeverityLevel]?.color,
                      }}
                    />
                  )}
                </Box>
              )
            })}
          </Box>
        )}
      </Box>

      {/* ── Right: issue detail form ───────────────────────── */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
        {!selectedMarkup ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 2, color: 'text.secondary' }}>
            <EditNoteIcon sx={{ fontSize: 56, opacity: 0.25 }} />
            <Typography variant="h6" color="text.secondary">
              Select a markup to add issue details
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Click a markup from the list on the left to describe the issue found at that location.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxWidth: 560 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Issue Details
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Markup #{markups.findIndex((m) => m.id === selectedMarkup.id) + 1} ·{' '}
              <span style={{ textTransform: 'capitalize' }}>
                {selectedMarkup.annotationType.replace('_', ' ')}
              </span>
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Issue Category */}
              <FormControl fullWidth size="small" required>
                <InputLabel>Issue Category</InputLabel>
                <Select
                  label="Issue Category"
                  value={selectedMarkup.issueCategory}
                  onChange={(e) => onUpdateMarkup(selectedMarkup.id, { issueCategory: e.target.value })}
                >
                  {ISSUE_CATEGORIES.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
                {!selectedMarkup.issueCategory && (
                  <FormHelperText error>Required</FormHelperText>
                )}
              </FormControl>

              {/* Severity */}
              <Box>
                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem', display: 'block', mb: 1 }}>
                  Severity *
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {SEVERITY_LEVELS.map((level) => {
                    const cfg = SEVERITY_CONFIG[level]
                    const isSelected = selectedMarkup.severity === level
                    return (
                      <Button
                        key={level}
                        variant={isSelected ? 'contained' : 'outlined'}
                        size="small"
                        onClick={() => onUpdateMarkup(selectedMarkup.id, { severity: level })}
                        sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          minWidth: 80,
                          ...(isSelected
                            ? { bgcolor: cfg.color, borderColor: cfg.color, '&:hover': { bgcolor: cfg.color } }
                            : { color: cfg.color, borderColor: cfg.border, '&:hover': { bgcolor: cfg.bg } }),
                        }}
                      >
                        {level}
                      </Button>
                    )
                  })}
                </Box>
                {!selectedMarkup.severity && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    Required
                  </Typography>
                )}
              </Box>

              {/* Notes */}
              <TextField
                label="Notes"
                multiline
                rows={4}
                fullWidth
                size="small"
                placeholder="Describe the issue in detail…"
                value={selectedMarkup.note}
                onChange={(e) => onUpdateMarkup(selectedMarkup.id, { note: e.target.value })}
                helperText="Optional — describe the specific location, extent, or context of the issue."
              />

              {/* Navigation between markups */}
              {markups.length > 1 && (
                <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={markups[0].id === selectedMarkup.id}
                    onClick={() => {
                      const idx = markups.findIndex((m) => m.id === selectedMarkup.id)
                      if (idx > 0) onSelectMarkup(markups[idx - 1].id)
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    ← Previous
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    disabled={markups[markups.length - 1].id === selectedMarkup.id}
                    onClick={() => {
                      const idx = markups.findIndex((m) => m.id === selectedMarkup.id)
                      if (idx < markups.length - 1) onSelectMarkup(markups[idx + 1].id)
                    }}
                    sx={{ textTransform: 'none' }}
                  >
                    Next →
                  </Button>
                  <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center', ml: 0.5 }}>
                    {markups.findIndex((m) => m.id === selectedMarkup.id) + 1} of {markups.length}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
