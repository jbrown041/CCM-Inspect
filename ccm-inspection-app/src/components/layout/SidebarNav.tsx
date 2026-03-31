import { Box, Tooltip, Typography } from '@mui/material'
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined'
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined'
// import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined'  // Jobs — restore later
// import MenuBookOutlinedIcon from '@mui/icons-material/MenuBookOutlined'     // Catalog — restore later
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import { useNavigate, useLocation } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Inspections', icon: FindInPageOutlinedIcon, path: '/jobs' as string | null },
  { label: 'Schedule', icon: CalendarTodayOutlinedIcon, path: '/schedule' as string | null },
  // { label: 'Jobs',    icon: InventoryOutlinedIcon, path: null },   // hidden — restore later
  // { label: 'Catalog', icon: MenuBookOutlinedIcon,  path: null },   // hidden — restore later
  { label: 'Account', icon: PersonOutlinedIcon, path: '/account' },
]

function isActive(path: string | null, pathname: string): boolean {
  if (!path) return false
  if (path === '/jobs') {
    return (
      pathname === '/' ||
      (pathname.startsWith('/jobs') && !pathname.startsWith('/jobs/')) ||
      pathname.startsWith('/job/') ||
      (pathname.startsWith('/inspections') && !pathname.startsWith('/inspections/')) ||
      pathname.startsWith('/inspection/')
    )
  }
  return pathname.startsWith(path)
}

export default function SidebarNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      component="nav"
      sx={{
        width: 72,
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        bgcolor: 'background.paper',
        borderRight: '1px solid',
        borderColor: 'divider',
        py: 1.5,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <Box
        onClick={() => navigate('/jobs')}
        sx={{
          width: 44,
          height: 44,
          borderRadius: 2,
          bgcolor: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          mb: 3,
          flexShrink: 0,
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="/radius-logo.png"
          alt="Radius"
          sx={{ width: 34, height: 34, objectFit: 'contain' }}
        />
      </Box>

      {/* Nav items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path, location.pathname)
          const Icon = item.icon
          return (
            <Tooltip key={item.label} title={item.label} placement="right">
              <Box
                onClick={() => item.path && navigate(item.path)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                  py: 1,
                  px: 0.5,
                  width: 56,
                  borderRadius: 2,
                  cursor: item.path ? 'pointer' : 'default',
                  color: active ? 'primary.main' : 'text.secondary',
                  bgcolor: active ? 'primary.50' : 'transparent',
                  '&:hover': {
                    bgcolor: item.path ? (active ? 'primary.50' : 'action.hover') : 'transparent',
                  },
                  transition: 'all 0.15s ease',
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? 'white' : 'inherit',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon fontSize="small" />
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.62rem',
                    fontWeight: active ? 700 : 400,
                    lineHeight: 1,
                    color: 'inherit',
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            </Tooltip>
          )
        })}
      </Box>
    </Box>
  )
}
