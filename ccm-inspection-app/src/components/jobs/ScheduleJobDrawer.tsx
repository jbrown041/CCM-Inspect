import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  Divider,
  FormControlLabel,
  IconButton,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs, { Dayjs } from 'dayjs'
import { useState, useEffect } from 'react'
import type { Job } from '../../types'
import { useJobs } from '../../context/JobsContext'

interface Props {
  job: Job | null
  onClose: () => void
  onSave: (jobId: string, date: string, timeFrom?: string, timeTo?: string) => void
}

const TIME_OPTIONS = [
  '6:00 AM', '6:30 AM', '7:00 AM', '7:30 AM',
  '8:00 AM', '8:30 AM', '9:00 AM', '9:30 AM',
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
]

export default function ScheduleJobDrawer({ job, onClose, onSave }: Props) {
  const { jobs } = useJobs()
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null)
  const [timeFrom, setTimeFrom] = useState('8:00 AM')
  const [timeTo, setTimeTo] = useState('9:00 AM')
  const [sendReminders, setSendReminders] = useState(true)

  useEffect(() => {
    if (job?.assignedDate) {
      setSelectedDate(dayjs(job.assignedDate))
      setTimeFrom(job.scheduledTimeFrom ?? '8:00 AM')
      setTimeTo(job.scheduledTimeTo ?? '9:00 AM')
    } else {
      setSelectedDate(dayjs())
      setTimeFrom('8:00 AM')
      setTimeTo('9:00 AM')
    }
  }, [job])

  // Jobs already scheduled on the selected date (excluding current job)
  const sameDay = selectedDate
    ? jobs.filter(
        (j) =>
          j.isScheduled &&
          j.id !== job?.id &&
          j.assignedDate === selectedDate.format('YYYY-MM-DD')
      )
    : []

  const handleSave = () => {
    if (!job || !selectedDate) return
    onSave(job.id, selectedDate.format('YYYY-MM-DD'), timeFrom, timeTo)
  }

  return (
    <Dialog open={Boolean(job)} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1.5, pr: 6 }}>
        <Typography variant="h6" fontWeight={600}>Schedule</Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <Box sx={{ display: 'flex', minHeight: 420 }}>
        {/* Left: form */}
        <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, borderRight: '1px solid', borderColor: 'divider' }}>
          {/* Date */}
          <Box>
            <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem', mb: 0.75, display: 'block' }}>
              Date
            </Typography>
            <DatePicker
              value={selectedDate}
              onChange={setSelectedDate}
              disablePast
              slotProps={{ textField: { fullWidth: true, size: 'small' } }}
            />
          </Box>

          {/* Time range */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem', mb: 0.75, display: 'block' }}>
                From
              </Typography>
              <Select
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
                size="small"
                fullWidth
              >
                {TIME_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: '0.7rem', mb: 0.75, display: 'block' }}>
                To
              </Typography>
              <Select
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
                size="small"
                fullWidth
              >
                {TIME_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </Select>
            </Box>
          </Box>

          {/* Send reminders */}
          <FormControlLabel
            control={
              <Checkbox
                checked={sendReminders}
                onChange={(e) => setSendReminders(e.target.checked)}
                size="small"
                color="primary"
              />
            }
            label={<Typography variant="body2">Send reminders</Typography>}
            sx={{ ml: 0 }}
          />

          {/* Inspection details reference */}
          {job && (
            <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
              <Box sx={{ px: 2, py: 1.25, bgcolor: 'grey.50' }}>
                <Typography variant="subtitle2">Inspection Details</Typography>
              </Box>
              <Box sx={{ px: 2, py: 1.5 }}>
                {[
                  { label: 'Job Name', value: job.jobName },
                  { label: 'Job Start Date', value: job.jobStartDate ?? '—' },
                  { label: 'Job Completion Date', value: job.jobCompletionDate ?? '—' },
                  { label: 'Contact Name', value: job.contacts[1]?.notes ?? job.contacts[0]?.company ?? '—' },
                  { label: 'Contact Phone', value: job.contacts[0]?.phone ?? '—' },
                ].map(({ label, value }) => (
                  <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.75 }}>
                    <Typography variant="body2" color="text.secondary">{label}</Typography>
                    <Typography variant="body2" fontWeight={500}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Right: day schedule context */}
        <Box sx={{ width: 280, p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography variant="subtitle2" fontWeight={700}>
            {selectedDate ? selectedDate.format('dddd, MMMM D, YYYY') : 'Select a date'}
          </Typography>

          {/* Current job preview */}
          {selectedDate && job && (
            <Box
              sx={{
                p: 1.5,
                borderRadius: 1.5,
                bgcolor: 'primary.main',
                color: 'white',
              }}
            >
              <Typography variant="subtitle2" fontWeight={700} noWrap>{job.jobName}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption" noWrap>{job.city}, {job.state}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                <CheckCircleIcon sx={{ fontSize: 13 }} />
                <Typography variant="caption">{selectedDate.format('MMM D')}, {timeFrom} - {timeTo}</Typography>
              </Box>
            </Box>
          )}

          {/* Other jobs on that day */}
          {sameDay.length > 0 ? (
            sameDay.map((j) => (
              <Box
                key={j.id}
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography variant="subtitle2" fontWeight={600} noWrap>{j.jobName}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <LocationOnIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" noWrap>{j.city}, {j.state}</Typography>
                </Box>
                {j.scheduledTimeFrom && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                    <CheckCircleIcon sx={{ fontSize: 13, color: 'success.main' }} />
                    <Typography variant="caption" color="text.secondary">
                      Scheduled for {dayjs(j.assignedDate).format('MMM D')}, {j.scheduledTimeFrom} - {j.scheduledTimeTo}
                    </Typography>
                  </Box>
                )}
              </Box>
            ))
          ) : selectedDate ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              No other jobs scheduled on this day.
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Divider />

      <Box sx={{ px: 2.5, py: 1.5, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!selectedDate}
        >
          Schedule
        </Button>
      </Box>
    </Dialog>
  )
}
