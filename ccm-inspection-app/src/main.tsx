import React from 'react'
import ReactDOM from 'react-dom/client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import App from './App'
import theme from './theme'
import { JobsProvider } from './context/JobsContext'
import 'leaflet/dist/leaflet.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <JobsProvider>
          <App />
        </JobsProvider>
      </LocalizationProvider>
    </ThemeProvider>
  </React.StrictMode>
)
