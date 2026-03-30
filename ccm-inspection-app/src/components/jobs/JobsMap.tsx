import { useState } from 'react'
import { MapContainer, TileLayer, Marker, Tooltip as LeafletTooltip } from 'react-leaflet'
import L from 'leaflet'
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  IconButton,
  Link,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import dayjs from 'dayjs'
import type { Job } from '../../types'
import EarlyBirdChip from '../common/EarlyBirdChip'

// Fix Leaflet default icon resolution in Vite
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({ iconUrl, iconRetinaUrl, shadowUrl })

function makePin(color: string, size = 30): L.DivIcon {
  const h = Math.round(size * 1.3)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${h}" viewBox="0 0 30 39"><path fill="${color}" stroke="white" stroke-width="2" d="M15 1C8.373 1 3 6.373 3 13c0 9.188 12 25 12 25s12-15.812 12-25C27 6.373 21.627 1 15 1z"/><circle cx="15" cy="13" r="5" fill="white"/></svg>`
  return L.divIcon({ html: svg, className: '', iconSize: [size, h], iconAnchor: [size / 2, h], popupAnchor: [0, -h] })
}

function pinColor(job: Job, selected: boolean): string {
  if (selected) return '#1565C0'
  if (job.isScheduled) return '#2E7D32'
  if (job.brand === 'Yellowy') return '#B8860B'
  return '#1565C0'
}

interface Props {
  jobs: Job[]
  selectedJobId: string | null
  onSelectJob: (jobId: string) => void
  onScheduleJob: (job: Job) => void
  readOnly?: boolean
}

// ── Job detail preview panel ──────────────────────────────────────────────

function JobPreviewPanel({
  job,
  onBack,
  onOpenJob,
  onScheduleJob,
  readOnly,
}: {
  job: Job
  onBack: () => void
  onOpenJob: () => void
  onScheduleJob: () => void
  readOnly?: boolean
}) {
  const roofer = job.contacts.find((c) => c.role === 'roofer') ?? job.contacts[1]
  const owner = job.contacts.find((c) => c.role === 'owner') ?? job.contacts[0]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Hero photo */}
      <Box sx={{ position: 'relative', height: 140, flexShrink: 0 }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(https://picsum.photos/seed/${job.id}/300/140)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            bgcolor: 'grey.300',
          }}
        />
        <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 60%)' }} />
        <IconButton
          size="small"
          onClick={onBack}
          sx={{ position: 'absolute', top: 8, left: 8, bgcolor: 'rgba(255,255,255,0.88)', '&:hover': { bgcolor: 'white' } }}
        >
          <ArrowBackIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ lineHeight: 1.3, mb: 0.5 }}>
          {job.jobName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
          <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary', flexShrink: 0 }} />
          <Typography variant="caption" color="text.secondary">{job.city}, {job.state}</Typography>
        </Box>

        {/* Roofer contact card */}
        {roofer && (
          <Box sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, mb: 1.5 }}>
            <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.25 }}>{roofer.company}</Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.75 }}>
              {roofer.city}, {roofer.state}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
              <PhoneOutlinedIcon sx={{ fontSize: 13, color: 'primary.main' }} />
              <Link href={`tel:${roofer.phone}`} variant="caption" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                {roofer.phone}
              </Link>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <EmailOutlinedIcon sx={{ fontSize: 13, color: 'primary.main' }} />
              <Link href={`mailto:${roofer.email}`} variant="caption" sx={{ color: 'primary.main', textDecoration: 'none', wordBreak: 'break-all' }}>
                {roofer.email}
              </Link>
            </Box>
          </Box>
        )}

        {/* Inspection details */}
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
          <Box sx={{ px: 1.5, py: 1, bgcolor: 'grey.50' }}>
            <Typography variant="caption" fontWeight={700}>Inspection Details</Typography>
          </Box>
          <Box sx={{ px: 1.5, py: 0.5 }}>
            {[
              { label: 'Job Start Date', value: job.jobStartDate ?? '—' },
              { label: 'Job Completion Date', value: job.jobCompletionDate ?? '—' },
              { label: 'Contact Name', value: owner?.company ?? '—' },
              { label: 'Contact Phone', value: owner?.phone ?? '—' },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.6 }}>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
                <Typography variant="caption" fontWeight={500} sx={{ textAlign: 'right', maxWidth: '55%' }}>{value}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Action buttons */}
      <Divider />
      <Box sx={{ p: 1.5, display: 'flex', gap: 1, flexShrink: 0 }}>
        <Button fullWidth variant="outlined" size="small" onClick={onOpenJob} sx={{ textTransform: 'none', fontWeight: 600 }}>
          Open Job
        </Button>
        {!readOnly && (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            startIcon={<CalendarTodayIcon sx={{ fontSize: '0.85rem !important' }} />}
            onClick={onScheduleJob}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {job.isScheduled ? 'Reschedule' : 'Schedule'}
          </Button>
        )}
      </Box>
    </Box>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default function JobsMap({ jobs, onSelectJob, onScheduleJob, readOnly }: Props) {
  const [previewId, setPreviewId] = useState<string | null>(null)

  const previewJob = jobs.find((j) => j.id === previewId) ?? null
  const sortedJobs = [...jobs].sort((a, b) => {
    if (a.isScheduled === b.isScheduled) return 0
    return a.isScheduled ? -1 : 1
  })

  // Default center: Philadelphia area (matches mock data)
  const center: [number, number] = [39.95, -75.16]

  return (
    <Box sx={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
      {/* Left panel */}
      <Box
        sx={{
          width: { xs: '100%', md: 300 },
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          borderRight: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          overflow: 'hidden',
        }}
      >
        {previewJob ? (
          <JobPreviewPanel
            job={previewJob}
            onBack={() => setPreviewId(null)}
            onOpenJob={() => onSelectJob(previewJob.id)}
            onScheduleJob={() => onScheduleJob(previewJob)}
            readOnly={readOnly}
          />
        ) : (
          <>
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle2" color="text.secondary">
                {jobs.length} job{jobs.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
              {jobs.length === 0 && (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No jobs match the current filters.
                  </Typography>
                </Box>
              )}
              {sortedJobs.map((job) => {
                const isSelected = job.id === previewId
                return (
                  <Card
                    key={job.id}
                    elevation={0}
                    onClick={() => setPreviewId(job.id)}
                    sx={{
                      cursor: 'pointer',
                      border: '1px solid',
                      borderColor: isSelected ? 'primary.main' : 'divider',
                      bgcolor: isSelected ? '#EBF2FF' : 'background.paper',
                      transition: 'all 0.15s ease',
                      overflow: 'visible',
                      '&:hover': { borderColor: 'primary.light', bgcolor: '#F8F9FF' },
                    }}
                  >
                    <CardContent sx={{ py: 1.5, px: 1.75, '&:last-child': { pb: 1.5 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 0.5, mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={600} sx={{ lineHeight: 1.4, flex: 1, minWidth: 0 }}>
                          {job.jobName}
                        </Typography>
                        {job.isEarlyBird && <Box sx={{ flexShrink: 0 }}><EarlyBirdChip /></Box>}
                      </Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.4 }}>
                        {job.city}, {job.state}
                      </Typography>
                      {job.isScheduled && job.assignedDate && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ lineHeight: 1.4 }}>
                          {dayjs(job.assignedDate).format('MMM D, YYYY')}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </Box>
          </>
        )}
      </Box>

      {/* Right: Leaflet map */}
      <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <MapContainer
          center={center}
          zoom={9}
          style={{ height: '100%', width: '100%' }}
          zoomControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {jobs.map((job) => (
            <Marker
              key={job.id}
              position={[job.coordinates.lat, job.coordinates.lng]}
              icon={makePin(pinColor(job, job.id === previewId), job.id === previewId ? 38 : 30)}
              eventHandlers={{ click: () => setPreviewId(job.id) }}
            >
              <LeafletTooltip direction="top" offset={[0, -34]} opacity={0.95}>
                <strong>{job.jobName}</strong><br />
                {job.city}, {job.state}
              </LeafletTooltip>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  )
}
