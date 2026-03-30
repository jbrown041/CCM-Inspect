import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import EditIcon from '@mui/icons-material/Edit'
import type { Job, InspectionVersion, Markup } from '../../types'
import { SEVERITY_LEVELS, SEVERITY_CONFIG } from '../../data/inspectionConstants'
import type { SeverityLevel } from '../../data/inspectionConstants'


interface Props {
  job: Job
  version: InspectionVersion
  markups: Markup[]
  onEditStep: (stepIndex: number) => void
  onGenerate: () => void
}

export default function ReviewStep({ job, version, markups, onEditStep, onGenerate }: Props) {
  const incomplete = markups.filter((m) => !m.issueCategory || !m.severity)
  const canGenerate = incomplete.length === 0 && markups.length > 0

  const bySeverity = SEVERITY_LEVELS.map((level) => ({
    level,
    items: markups.filter((m) => m.severity === level),
  })).filter((g) => g.items.length > 0)

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Validation banner */}
      {incomplete.length > 0 ? (
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFF3E0', border: '1px solid #FFCC80', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <WarningAmberIcon sx={{ color: '#E65100', mt: 0.25 }} />
          <Box>
            <Typography variant="subtitle2" color="warning.dark">
              {incomplete.length} markup{incomplete.length !== 1 ? 's' : ''} missing issue details
            </Typography>
            <Typography variant="body2" sx={{ color: '#E65100', opacity: 0.9 }}>
              Go back to <strong>Issue Details</strong> to complete all required fields before generating the report.
            </Typography>
            <Button size="small" variant="outlined" color="warning" sx={{ mt: 1, textTransform: 'none' }} onClick={() => onEditStep(2)}>
              Complete Issue Details
            </Button>
          </Box>
        </Paper>
      ) : markups.length === 0 ? (
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#FFF3E0', border: '1px solid #FFCC80', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
          <WarningAmberIcon sx={{ color: '#E65100', mt: 0.25 }} />
          <Box>
            <Typography variant="subtitle2" color="warning.dark">No markups added</Typography>
            <Typography variant="body2" sx={{ color: '#E65100', opacity: 0.9 }}>
              Add at least one markup before generating the report.
            </Typography>
            <Button size="small" variant="outlined" color="warning" sx={{ mt: 1, textTransform: 'none' }} onClick={() => onEditStep(1)}>
              Go to Markup
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#E8F5E9', border: '1px solid #A5D6A7', borderRadius: 2, display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <CheckCircleOutlineIcon sx={{ color: '#2E7D32' }} />
          <Typography variant="subtitle2" color="success.dark">
            All {markups.length} markup{markups.length !== 1 ? 's' : ''} are complete — ready to generate report
          </Typography>
        </Paper>
      )}

      {/* Job & inspection summary */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#F8F9FB', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem', fontWeight: 700 }}>
            Job & Inspection Summary
          </Typography>
          <Button size="small" startIcon={<EditIcon fontSize="small" />} onClick={() => onEditStep(0)} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
            Edit
          </Button>
        </Box>
        <Box sx={{ p: 2.5, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 2 }}>
          {[
            { label: 'Job', value: job.jobName },
            { label: 'Location', value: `${job.city}, ${job.state}` },
            { label: 'Inspection Type', value: job.typeOfInspection },
            { label: 'Membrane', value: job.membraneType },
            { label: 'Version', value: `v${version.versionNumber}` },
            { label: 'Inspector', value: version.createdBy },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                {label}
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25 }}>{value}</Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Findings summary */}
      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#F8F9FB', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.72rem', fontWeight: 700 }}>
            Findings Summary
          </Typography>
          <Button size="small" startIcon={<EditIcon fontSize="small" />} onClick={() => onEditStep(2)} sx={{ textTransform: 'none', fontSize: '0.75rem' }}>
            Edit
          </Button>
        </Box>
        <Box sx={{ p: 2.5 }}>
          {/* Counts by severity */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            {SEVERITY_LEVELS.map((level) => {
              const count = markups.filter((m) => m.severity === level).length
              const cfg = SEVERITY_CONFIG[level]
              return (
                <Box key={level} sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                  <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: cfg.color }} />
                  <Typography variant="body2" color="text.secondary">{level}:</Typography>
                  <Typography variant="body2" fontWeight={700} color={count > 0 ? cfg.color : 'text.disabled'}>
                    {count}
                  </Typography>
                </Box>
              )
            })}
          </Box>

          {/* Grouped by severity */}
          {bySeverity.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No findings yet.</Typography>
          ) : (
            bySeverity.map(({ level, items }) => {
              const cfg = SEVERITY_CONFIG[level as SeverityLevel]
              return (
                <Box key={level} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Chip
                      label={level}
                      size="small"
                      sx={{ bgcolor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, fontWeight: 700, fontSize: '0.72rem' }}
                    />
                    <Typography variant="caption" color="text.secondary">{items.length} finding{items.length !== 1 ? 's' : ''}</Typography>
                  </Box>
                  <List disablePadding dense>
                    {items.map((m) => (
                      <ListItem key={m.id} disablePadding sx={{ pl: 1.5, py: 0.25 }}>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              <strong>{m.issueCategory || 'Uncategorized'}</strong>
                              {m.note && ` — ${m.note.slice(0, 80)}${m.note.length > 80 ? '…' : ''}`}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ mt: 1 }} />
                </Box>
              )
            })
          )}
        </Box>
      </Paper>

      {/* Generate CTA */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button variant="outlined" onClick={() => onEditStep(2)} sx={{ textTransform: 'none' }}>
          Back to Issue Details
        </Button>
        <Button
          variant="contained"
          size="large"
          disabled={!canGenerate}
          onClick={onGenerate}
          sx={{ px: 4, fontWeight: 700 }}
        >
          Generate Report
        </Button>
      </Box>
    </Box>
  )
}
