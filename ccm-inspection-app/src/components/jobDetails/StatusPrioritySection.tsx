import { Box, Divider, Typography } from '@mui/material'
import type { Job } from '../../types'
import InspectionStatusChip from '../common/InspectionStatusChip'
import EarlyBirdChip from '../common/EarlyBirdChip'
import SectionCard from './SectionCard'

interface Props {
  job: Job
}

function StatusRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.25 }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography variant="body2" fontWeight={500}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Box>
  )
}

export default function StatusPrioritySection({ job }: Props) {
  return (
    <SectionCard title="Status & Priority">
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <StatusRow
          label="Inspection Status"
          value={<InspectionStatusChip status={job.inspectionStatus} size="medium" />}
        />
        <Divider />

        <StatusRow
          label="Early Bird"
          value={
            job.isEarlyBird ? (
              <EarlyBirdChip size="medium" />
            ) : (
              <Typography variant="body2" color="text.secondary">
                No
              </Typography>
            )
          }
        />
        <Divider />

        <StatusRow
          label="Assembly Letter Status"
          value={
            <Typography variant="body2" fontWeight={500}>
              {job.assemblyLetterStatus || '—'}
            </Typography>
          }
        />
        <Divider />

        <StatusRow
          label="Warranty Status"
          value={
            job.warrantyStatus ? (
              <Typography variant="body2" fontWeight={500}>
                {job.warrantyStatus}
              </Typography>
            ) : (
              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                No warranty info
              </Typography>
            )
          }
        />
      </Box>
    </SectionCard>
  )
}
