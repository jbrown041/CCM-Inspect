import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import type { InspectionVersion } from '../../types'
import InspectionStatusChip from '../common/InspectionStatusChip'
import dayjs from 'dayjs'

interface Props {
  open: boolean
  sourceVersion: InspectionVersion | null
  onClose: () => void
  onConfirm: () => void
}

export default function NewVersionFromPriorDialog({ open, sourceVersion, onClose, onConfirm }: Props) {
  if (!sourceVersion) return null

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6">Create New Version</Typography>
        <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="body2" color="text.secondary">
          You're creating a new inspection version based on a prior completed version. The new version
          will carry forward all markups, issue details, and notes from the source version.
        </Typography>

        {/* Source version summary */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'grey.50',
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2">Version {sourceVersion.versionNumber}</Typography>
            <Typography variant="caption" color="text.secondary">
              {dayjs(sourceVersion.createdDate).format('MMM D, YYYY')} · {sourceVersion.createdBy}
            </Typography>
          </Box>
          <InspectionStatusChip status={sourceVersion.status} />
        </Box>

        <Box
          sx={{
            p: 1.5,
            bgcolor: 'primary.50',
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'primary.100',
          }}
        >
          <Typography variant="body2" color="primary.dark" fontWeight={600}>
            The new version will begin as "In Progress" and can be edited freely. The source version
            remains unchanged and viewable.
          </Typography>
        </Box>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 2.5, py: 1.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          variant="contained"
          startIcon={<ContentCopyIcon />}
          onClick={onConfirm}
        >
          Create New Version
        </Button>
      </DialogActions>
    </Dialog>
  )
}
