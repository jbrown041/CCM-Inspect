import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1565C0',
      dark: '#0d47a1',
      light: '#1e88e5',
    },
    secondary: {
      main: '#F57C00',
    },
    background: {
      default: '#F4F6F9',
      paper: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
    },
    warning: {
      main: '#E65100',
    },
    info: {
      main: '#0277BD',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#0d47a1',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: '#F4F6F9',
        },
      },
    },
  },
})

export default theme
