import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import JobsPage from './components/jobs/JobsPage'
import JobDetailsPage from './components/jobDetails/JobDetailsPage'
import InspectionWizard from './components/inspection/InspectionWizard'
import SchedulePage from './components/schedule/SchedulePage'
import AccountPage from './components/account/AccountPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" replace />} />
        <Route path="/inspections" element={<Navigate to="/jobs" replace />} />
        <Route
          path="/jobs"
          element={
            <AppLayout>
              <JobsPage />
            </AppLayout>
          }
        />
        <Route
          path="/jobs/:jobId"
          element={
            <AppLayout>
              <JobDetailsPage />
            </AppLayout>
          }
        />
        <Route
          path="/jobs/:jobId/inspect/:versionId"
          element={<InspectionWizard />}
        />
        <Route
          path="/schedule"
          element={
            <AppLayout>
              <SchedulePage />
            </AppLayout>
          }
        />
        <Route
          path="/account"
          element={
            <AppLayout>
              <AccountPage />
            </AppLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
