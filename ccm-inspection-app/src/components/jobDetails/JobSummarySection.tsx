import { Box, Grid, Typography } from '@mui/material'
import dayjs from 'dayjs'
import type { Job } from '../../types'
import BrandChip from '../common/BrandChip'
import SectionCard from './SectionCard'
import LocationOnIcon from '@mui/icons-material/LocationOn'

interface Props {
  job: Job
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.05em', fontSize: '0.7rem' }}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.25 }}>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography variant="body2" fontWeight={500}>
            {value || '—'}
          </Typography>
        ) : (
          value
        )}
      </Box>
    </Box>
  )
}

export default function JobSummarySection({ job }: Props) {
  return (
    <SectionCard title="Job Summary">
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <Field
            label="Location"
            value={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocationOnIcon fontSize="small" color="action" />
                <Typography variant="body2" fontWeight={500}>
                  {job.city}, {job.state}
                </Typography>
              </Box>
            }
          />
        </Grid>

        <Grid size={{ xs: 6, sm: 4 }}>
          <Field
            label="Assigned Date"
            value={job.assignedDate ? dayjs(job.assignedDate).format('MMM D, YYYY') : 'Not Scheduled'}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Field label="Inspection Type" value={job.typeOfInspection} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Field label="Membrane Type" value={job.membraneType} />
        </Grid>

        <Grid size={{ xs: 6, sm: 4 }}>
          <Field label="Total Sq Ft" value={job.totalSqFt.toLocaleString()} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Field label="Roofer" value={job.roofer} />
        </Grid>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Field
            label="Brand"
            value={<BrandChip brand={job.brand} />}
          />
        </Grid>
      </Grid>
    </SectionCard>
  )
}
