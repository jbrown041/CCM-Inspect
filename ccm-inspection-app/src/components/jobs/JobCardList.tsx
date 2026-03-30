import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import type { Job } from '../../types'
import InspectionStatusChip from '../common/InspectionStatusChip'
import EarlyBirdChip from '../common/EarlyBirdChip'
import BrandChip from '../common/BrandChip'

interface Props {
  jobs: Job[]
  onSelectJob: (jobId: string) => void
  onScheduleJob?: (job: Job) => void
  readOnly?: boolean
}

export default function JobCardList({ jobs, onSelectJob, onScheduleJob, readOnly }: Props) {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5, overflowY: 'auto', height: '100%' }}>
      {jobs.map((job) => (
        <Card
          key={job.id}
          variant="outlined"
          sx={{ borderRadius: 2, transition: 'box-shadow 0.15s', '&:hover': { boxShadow: 2 } }}
        >
          <CardActionArea onClick={() => onSelectJob(job.id)} sx={{ p: 0 }}>
            <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
              {/* Title row */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="subtitle2" fontWeight={700} noWrap>
                    {job.jobName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {job.city}, {job.state} · {job.typeOfInspection}
                  </Typography>
                </Box>
                <InspectionStatusChip status={job.inspectionStatus} />
              </Box>

              {/* Meta row */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap', mt: 1 }}>
                <BrandChip brand={job.brand} />
                {job.isEarlyBird && <EarlyBirdChip size="small" />}
                {job.isScheduled ? (
                  <Chip
                    icon={<CalendarMonthIcon />}
                    label={job.assignedDate ?? ''}
                    size="small"
                    sx={{ bgcolor: 'success.50', color: 'success.dark', '& .MuiChip-icon': { fontSize: 14 } }}
                  />
                ) : (
                  !readOnly && onScheduleJob ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      onClick={(e) => { e.stopPropagation(); onScheduleJob(job) }}
                      sx={{ textTransform: 'none', py: 0, fontSize: '0.72rem', minHeight: 24 }}
                    >
                      Schedule
                    </Button>
                  ) : (
                    <Chip label="Unscheduled" size="small" color="warning" variant="outlined" />
                  )
                )}
                <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                  {job.totalSqFt?.toLocaleString()} sq ft
                </Typography>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  )
}
