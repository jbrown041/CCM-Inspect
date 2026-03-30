import { Box, Paper, Typography } from '@mui/material'

interface Props {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}

export default function SectionCard({ title, children, action }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      {/* Section header */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          bgcolor: '#F8F9FB',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="subtitle2"
          sx={{
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontSize: '0.72rem',
            color: 'text.secondary',
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>
        {action}
      </Box>
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Paper>
  )
}
