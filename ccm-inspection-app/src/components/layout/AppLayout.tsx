import { Box } from '@mui/material'
import SidebarNav from './SidebarNav'

interface Props {
  children: React.ReactNode
}

export default function AppLayout({ children }: Props) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <SidebarNav />
      <Box component="main" sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  )
}
