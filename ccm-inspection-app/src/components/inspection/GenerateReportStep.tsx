import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HomeIcon from '@mui/icons-material/Home'
import dayjs from 'dayjs'
import type { Job, InspectionVersion, Markup } from '../../types'
import { SEVERITY_LEVELS, SEVERITY_CONFIG } from '../../data/inspectionConstants'
import type { SeverityLevel } from '../../data/inspectionConstants'
import BrandChip from '../common/BrandChip'
import EarlyBirdChip from '../common/EarlyBirdChip'

interface Props {
  job: Job
  version: InspectionVersion
  markups: Markup[]
  markedUpImageUrl?: string | null
  onBackToJob: () => void
}

export default function GenerateReportStep({ job, version, markups, markedUpImageUrl, onBackToJob }: Props) {
  const generatedDate = dayjs().format('MMMM D, YYYY')

  const bySeverity = SEVERITY_LEVELS.map((level) => ({
    level,
    items: markups.filter((m) => m.severity === level),
  })).filter((g) => g.items.length > 0)

  const callouts = markups.filter((m) => m.annotationType === 'numbered_callout')

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left: success panel + download */}
      <Box
        sx={{
          width: { xs: '100%', md: 280 },
          flexShrink: 0,
          borderRight: { md: '1px solid' },
          borderColor: 'divider',
          bgcolor: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 1.5 }}>
          <CheckCircleIcon sx={{ fontSize: 56, color: 'success.main' }} />
          <Typography variant="h6" fontWeight={700}>Report Generated</Typography>
          <Typography variant="body2" color="text.secondary">
            The inspection report for <strong>{job.jobName}</strong> Version {version.versionNumber} is ready.
          </Typography>
        </Box>

        <Divider />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
              Report Details
            </Typography>
            {[
              { label: 'Version', value: `v${version.versionNumber}` },
              { label: 'Generated', value: generatedDate },
              { label: 'Inspector', value: version.createdBy },
              { label: 'Total Findings', value: String(markups.length) },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
                <Typography variant="body2" color="text.secondary">{label}</Typography>
                <Typography variant="body2" fontWeight={500}>{value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        <Divider />

        <Button
          variant="contained"
          size="large"
          startIcon={<DownloadIcon />}
          fullWidth
          sx={{ fontWeight: 700 }}
          onClick={() => alert('PDF download — will be wired to a real PDF generator in production.')}
        >
          Download PDF
        </Button>

        <Button
          variant="outlined"
          startIcon={<HomeIcon />}
          fullWidth
          onClick={onBackToJob}
          sx={{ textTransform: 'none' }}
        >
          Back to Job
        </Button>
      </Box>

      {/* Right: in-app report preview */}
      <Box sx={{ flex: 1, overflowY: 'auto', bgcolor: '#E8E8E8', p: 3 }}>
        <Box sx={{ maxWidth: 760, mx: 'auto', display: 'flex', flexDirection: 'column', gap: 0, boxShadow: 4 }}>

          {/* ── Cover Page ──────────────────────────────────── */}
          <Paper elevation={0} sx={{ borderRadius: 0, p: 5, bgcolor: '#0d47a1', color: 'white', minHeight: 320, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="overline" sx={{ opacity: 0.7, letterSpacing: '0.15em' }}>
                CCM Inspection Report
              </Typography>
              <Typography variant="h4" fontWeight={700} sx={{ mt: 1, lineHeight: 1.2, mb: 0.5 }}>
                {job.jobName}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.85, fontWeight: 400 }}>
                {job.city}, {job.state}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                {[
                  { label: 'Report Version', value: `Version ${version.versionNumber}` },
                  { label: 'Generated', value: generatedDate },
                  { label: 'Inspector', value: version.createdBy },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography variant="caption" sx={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem' }}>
                      {label}
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>

          {/* ── Section 2: Job & Inspection Summary ─────────── */}
          <Paper elevation={0} sx={{ borderRadius: 0, p: 4, borderTop: '4px solid #1565C0' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Job & Inspection Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 2 }}>
              {[
                { label: 'Inspection Type', value: job.typeOfInspection },
                { label: 'Membrane Type', value: job.membraneType },
                { label: 'Total Sq Ft', value: job.totalSqFt.toLocaleString() },
                { label: 'Roofer', value: job.roofer },
                { label: 'Assembly Letter', value: job.assemblyLetterStatus },
                { label: 'Warranty Status', value: job.warrantyStatus || 'N/A' },
              ].map(({ label, value }) => (
                <Box key={label}>
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.68rem' }}>
                    {label}
                  </Typography>
                  <Typography variant="body2" fontWeight={500} sx={{ mt: 0.25 }}>{value}</Typography>
                </Box>
              ))}
            </Box>
            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
              <BrandChip brand={job.brand} />
              {job.isEarlyBird && <EarlyBirdChip />}
            </Box>
          </Paper>

          {/* ── Section 3: Findings Summary ──────────────────── */}
          <Paper elevation={0} sx={{ borderRadius: 0, p: 4, bgcolor: '#F8F9FB' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Findings Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {SEVERITY_LEVELS.map((level) => {
                const count = markups.filter((m) => m.severity === level).length
                const cfg = SEVERITY_CONFIG[level]
                return (
                  <Box
                    key={level}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      minWidth: 100,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h4" fontWeight={800} sx={{ color: cfg.color }}>{count}</Typography>
                    <Typography variant="caption" sx={{ color: cfg.color, fontWeight: 600 }}>{level}</Typography>
                  </Box>
                )
              })}
            </Box>
          </Paper>

          {/* ── Section 4: Findings by Severity ──────────────── */}
          <Paper elevation={0} sx={{ borderRadius: 0, p: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Findings by Severity</Typography>
            <Divider sx={{ mb: 3 }} />

            {bySeverity.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No findings recorded.</Typography>
            ) : (
              bySeverity.map(({ level, items }) => {
                const cfg = SEVERITY_CONFIG[level as SeverityLevel]
                return (
                  <Box key={level} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, p: 1.25, bgcolor: cfg.bg, borderRadius: 1, border: `1px solid ${cfg.border}` }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: cfg.color, flexShrink: 0 }} />
                      <Typography variant="subtitle1" fontWeight={700} sx={{ color: cfg.color }}>
                        {level} — {items.length} Finding{items.length !== 1 ? 's' : ''}
                      </Typography>
                    </Box>
                    {items.map((m) => (
                      <Box
                        key={m.id}
                        sx={{
                          ml: 2,
                          mb: 1.5,
                          pl: 2,
                          borderLeft: `3px solid ${cfg.border}`,
                          py: 0.5,
                        }}
                      >
                        <Typography variant="subtitle2">{m.issueCategory}</Typography>
                        {m.note && (
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
                            {m.note}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                          Markup type: {m.annotationType.replace('_', ' ')}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )
              })
            )}
          </Paper>

          {/* ── Section 5: Marked-Up Visuals ─────────────────── */}
          <Paper elevation={0} sx={{ borderRadius: 0, p: 4, bgcolor: '#F8F9FB' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Marked-Up Visuals</Typography>
            <Divider sx={{ mb: 2 }} />
            {markedUpImageUrl ? (
              <Box
                component="img"
                src={markedUpImageUrl}
                alt="Marked-up inspection canvas"
                sx={{ width: '100%', borderRadius: 1, display: 'block', boxShadow: 2 }}
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  bgcolor: '#2d3849',
                  borderRadius: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)' }}>
                  {job.primaryAsset.label}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem' }}>
                  Use "Save" in the markup step to capture the canvas image
                </Typography>
                {callouts.map((m, i) => (
                  <Box
                    key={m.id}
                    sx={{
                      position: 'absolute',
                      left: `${m.position.x}%`,
                      top: `${m.position.y}%`,
                      transform: 'translate(-50%,-50%)',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      bgcolor: SEVERITY_CONFIG[m.severity as SeverityLevel]?.color ?? '#1565C0',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                    }}
                  >
                    {i + 1}
                  </Box>
                ))}
              </Box>
            )}
            {callouts.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Callout Reference
                </Typography>
                {callouts.map((m, i) => (
                  <Box key={m.id} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mt: 0.75 }}>
                    <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: SEVERITY_CONFIG[m.severity as SeverityLevel]?.color ?? '#1565C0', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, flexShrink: 0 }}>
                      {i + 1}
                    </Box>
                    <Typography variant="body2">
                      <strong>{m.issueCategory || 'Uncategorized'}</strong>
                      {m.severity && ` (${m.severity})`}
                      {m.note && ` — ${m.note}`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* ── Section 6: Additional Notes ───────────────────── */}
          <Paper elevation={0} sx={{ borderRadius: 0, p: 4 }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>Additional Notes & Observations</Typography>
            <Divider sx={{ mb: 2 }} />
            {markups.some((m) => m.note) ? (
              <List disablePadding>
                {markups.filter((m) => m.note).map((m) => (
                  <ListItem key={m.id} disablePadding sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={<Typography variant="body2">{m.note}</Typography>}
                      secondary={<Typography variant="caption" color="text.secondary">{m.issueCategory}</Typography>}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary">No additional notes recorded.</Typography>
            )}
          </Paper>

          {/* Footer */}
          <Paper elevation={0} sx={{ borderRadius: 0, p: 3, bgcolor: '#0d47a1', color: 'white' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                CCM Inspection App · {generatedDate} · Version {version.versionNumber}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.5 }}>Confidential</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}
