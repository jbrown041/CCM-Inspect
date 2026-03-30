import { Box, Button, Chip, Divider, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material'
import ArticleIcon from '@mui/icons-material/Article'
import FolderZipIcon from '@mui/icons-material/FolderZip'
import DescriptionIcon from '@mui/icons-material/Description'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import dayjs from 'dayjs'
import type { Job } from '../../types'
import SectionCard from './SectionCard'

interface Props {
  job: Job
}

function docIcon(type: string) {
  if (type === 'PDF') return <ArticleIcon color="error" fontSize="small" />
  if (type === 'Archive') return <FolderZipIcon color="warning" fontSize="small" />
  return <DescriptionIcon color="info" fontSize="small" />
}

export default function ContextSection({ job }: Props) {
  return (
    <>
      {/* Comments */}
      <SectionCard title="Comments">
        {job.comments.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1, color: 'text.secondary' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 36, opacity: 0.3 }} />
            <Typography variant="body2" color="text.secondary">
              No comments on this job
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {job.comments.map((comment, i) => (
              <Box key={comment.id}>
                {i > 0 && <Divider sx={{ my: 1.5 }} />}
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      flexShrink: 0,
                      mt: 0.25,
                    }}
                  >
                    {comment.author
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="subtitle2">{comment.author}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {dayjs(comment.date).format('MMM D, YYYY')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6 }}>
                      {comment.text}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </SectionCard>

      {/* Related Documents */}
      <SectionCard title="Related Documents">
        {job.relatedDocuments.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 1 }}>
            <FolderOpenIcon sx={{ fontSize: 36, opacity: 0.3, color: 'text.secondary' }} />
            <Typography variant="body2" color="text.secondary">
              No related documents
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {job.relatedDocuments.map((doc, i) => (
              <Box key={doc.id}>
                {i > 0 && <Divider component="li" />}
                <ListItem
                  disablePadding
                  sx={{ py: 1 }}
                  secondaryAction={
                    <Button
                      size="small"
                      endIcon={<OpenInNewIcon fontSize="small" />}
                      href={doc.url}
                      target="_blank"
                      sx={{ textTransform: 'none', fontSize: '0.78rem' }}
                    >
                      View
                    </Button>
                  }
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {docIcon(doc.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={500} noWrap sx={{ maxWidth: 280 }}>
                        {doc.name}
                      </Typography>
                    }
                    secondary={
                      <Chip label={doc.type} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', mt: 0.25 }} />
                    }
                  />
                </ListItem>
              </Box>
            ))}
          </List>
        )}
      </SectionCard>
    </>
  )
}
