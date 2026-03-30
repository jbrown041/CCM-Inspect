import { useState } from 'react'
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
} from '@mui/material'
import dayjs, { type Dayjs } from 'dayjs'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { useJobs } from '../../context/JobsContext'
import { CURRENT_USER_ID } from '../../data/mockData'
import type { Job } from '../../types'
import ScheduleJobDrawer from '../jobs/ScheduleJobDrawer'

function getWeekMonday(date: Dayjs): Dayjs {
  const d = date.day() // 0=Sun, 1=Mon...6=Sat
  const offset = d === 0 ? -6 : 1 - d
  return date.add(offset, 'day').startOf('day')
}

const MAX_VISIBLE = 2

function deriveStatus(job: Job): 'Scheduled' | 'Confirmed' {
  return job.inspectionStatus === 'Completed' ||
    job.inspectionStatus === 'Report Generated' ||
    job.inspectionStatus === 'In Progress'
    ? 'Confirmed'
    : 'Scheduled'
}

const STATUS_STYLES = {
  Scheduled: { chipBg: '#EDE7F6', chipColor: '#5E35B1', border: '#7C4DFF' },
  Confirmed: { chipBg: '#E8F5E9', chipColor: '#2E7D32', border: '#43A047' },
}

export default function SchedulePage() {
  const { jobs, scheduleJob } = useJobs()
  const [weekStart, setWeekStart] = useState(() => getWeekMonday(dayjs()))
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set())
  const [drawerJob, setDrawerJob] = useState<Job | null>(null)

  const myJobs = jobs.filter(
    (j) => j.repId === CURRENT_USER_ID && j.isScheduled && j.assignedDate
  )

  const weekDays = Array.from({ length: 5 }, (_, i) => weekStart.add(i, 'day'))
  const weekEnd = weekStart.add(4, 'day')
  const today = dayjs().startOf('day')

  const monthLabel = (() => {
    const startMonth = weekStart.format('MMMM YYYY')
    const endMonth = weekEnd.format('MMMM YYYY')
    return startMonth === endMonth ? startMonth : `${weekStart.format('MMM')} – ${weekEnd.format('MMM YYYY')}`
  })()

  const rangeLabel = `${weekStart.format('MMMM D, YYYY')} \u2013 ${weekEnd.format('MMMM D, YYYY')}`

  const jobsForDay = (day: Dayjs) =>
    myJobs.filter((j) => j.assignedDate === day.format('YYYY-MM-DD'))

  const toggleExpand = (dateStr: string) =>
    setExpandedDays((prev) => {
      const next = new Set(prev)
      if (next.has(dateStr)) next.delete(dateStr)
      else next.add(dateStr)
      return next
    })

  const openReschedule = (job: Job) => {
    setDrawerJob(job)
  }

  const openAddToSchedule = (dateStr: string) => {
    // Find the first unscheduled job for the current user
    const unscheduled = jobs.find(
      (j) => j.repId === CURRENT_USER_ID && !j.isScheduled
    )
    if (unscheduled) {
      // Pre-fill the date by temporarily setting assignedDate
      setDrawerJob({ ...unscheduled, assignedDate: dateStr })
    }
  }

  const handleDrawerSave = (jobId: string, date: string, timeFrom?: string, timeTo?: string) => {
    scheduleJob(jobId, date, timeFrom, timeTo)
    setDrawerJob(null)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      {/* Page header */}
      <Box
        sx={{
          px: 4,
          pt: 3,
          pb: 2.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          flexShrink: 0,
        }}
      >
        <Typography variant="h4" fontWeight={700} sx={{ mb: 2.5 }}>
          My Schedule
        </Typography>

        {/* Week controls */}
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outlined"
            endIcon={<KeyboardArrowDownIcon />}
            sx={{
              borderRadius: 6,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            {monthLabel}
          </Button>

          <Button
            variant="outlined"
            onClick={() => setWeekStart(getWeekMonday(dayjs()))}
            sx={{
              borderRadius: 6,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.875rem',
              borderColor: 'divider',
              color: 'text.primary',
            }}
          >
            Today
          </Button>

          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => setWeekStart((w) => w.subtract(7, 'day'))}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setWeekStart((w) => w.add(7, 'day'))}
              sx={{ border: '1px solid', borderColor: 'divider' }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {rangeLabel}
          </Typography>
        </Stack>
      </Box>

      {/* Calendar grid */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 4, pt: 2.5, pb: 4 }}>
        {/* Day header row */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 2,
            mb: 2,
          }}
        >
          {weekDays.map((day) => {
            const isToday = day.isSame(today, 'day')
            return (
              <Box key={day.format('YYYY-MM-DD')} sx={{ textAlign: 'center', pb: 1 }}>
                {isToday && (
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    color="primary.main"
                    sx={{ display: 'block', mb: 0.25, fontSize: '0.7rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}
                  >
                    Today
                  </Typography>
                )}
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: isToday ? 'primary.main' : 'text.primary' }}
                >
                  {day.format('ddd, MMMM D')}
                </Typography>
                {isToday && (
                  <Box
                    sx={{
                      height: 2,
                      bgcolor: 'primary.main',
                      borderRadius: 1,
                      mt: 0.75,
                      mx: 'auto',
                      width: '60%',
                    }}
                  />
                )}
              </Box>
            )
          })}
        </Box>

        {/* Day columns */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 2,
            alignItems: 'start',
          }}
        >
          {weekDays.map((day) => {
            const dateStr = day.format('YYYY-MM-DD')
            const dayJobs = jobsForDay(day)
            const expanded = expandedDays.has(dateStr)
            const visible = expanded ? dayJobs : dayJobs.slice(0, MAX_VISIBLE)
            const hiddenCount = dayJobs.length - MAX_VISIBLE

            return (
              <Box key={dateStr} sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {visible.map((job) => {
                  const status = deriveStatus(job)
                  const styles = STATUS_STYLES[status]
                  return (
                    <Box
                      key={job.id}
                      onClick={() => openReschedule(job)}
                      sx={{
                        bgcolor: 'background.paper',
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderLeft: `4px solid ${styles.border}`,
                        p: 1.5,
                        cursor: 'pointer',
                        transition: 'box-shadow 0.15s ease',
                        '&:hover': {
                          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                          bgcolor: 'grey.50',
                        },
                      }}
                    >
                      <Chip
                        label={status}
                        size="small"
                        sx={{
                          bgcolor: styles.chipBg,
                          color: styles.chipColor,
                          fontWeight: 700,
                          fontSize: '0.65rem',
                          height: 20,
                          mb: 0.75,
                        }}
                      />
                      {(job.scheduledTimeFrom || job.scheduledTimeTo) && (
                        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {[job.scheduledTimeFrom, job.scheduledTimeTo]
                              .filter(Boolean)
                              .join(' \u2013 ')}
                          </Typography>
                        </Stack>
                      )}
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        sx={{ lineHeight: 1.3, mb: 0.5 }}
                      >
                        {job.jobName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {job.city}, {job.state}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {job.roofer}
                      </Typography>
                    </Box>
                  )
                })}

                {/* Show more / less toggle */}
                {hiddenCount > 0 && !expanded && (
                  <Button
                    size="small"
                    onClick={() => toggleExpand(dateStr)}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      color: 'primary.main',
                      justifyContent: 'flex-start',
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    Show more ({hiddenCount})
                  </Button>
                )}
                {expanded && dayJobs.length > MAX_VISIBLE && (
                  <Button
                    size="small"
                    onClick={() => toggleExpand(dateStr)}
                    sx={{
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      color: 'primary.main',
                      justifyContent: 'flex-start',
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    Show less
                  </Button>
                )}

                {/* Add to schedule */}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AddCircleOutlineIcon sx={{ fontSize: '16px !important' }} />}
                  onClick={() => openAddToSchedule(dateStr)}
                  sx={{
                    borderRadius: 6,
                    textTransform: 'none',
                    fontSize: '0.75rem',
                    borderStyle: 'dashed',
                    color: 'text.secondary',
                    borderColor: 'divider',
                    justifyContent: 'center',
                    '&:hover': {
                      borderStyle: 'dashed',
                      bgcolor: 'action.hover',
                      borderColor: 'text.secondary',
                    },
                  }}
                >
                  Add to schedule
                </Button>
              </Box>
            )
          })}
        </Box>
      </Box>

      {/* Schedule/Reschedule drawer */}
      <ScheduleJobDrawer
        job={drawerJob}
        onClose={() => setDrawerJob(null)}
        onSave={handleDrawerSave}
      />
    </Box>
  )
}
