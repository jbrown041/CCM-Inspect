/**
 * Lightweight shared jobs store using React context.
 * Both JobsPage and JobDetailsPage read/write the same state.
 */
import { createContext, useContext, useState } from 'react'
import type { Job, InspectionVersion } from '../types'
import { allJobs as initialJobs } from '../data/mockData'

interface JobsContextValue {
  jobs: Job[]
  scheduleJob: (jobId: string, date: string, timeFrom?: string, timeTo?: string) => void
  addInspectionVersion: (jobId: string, version: InspectionVersion) => void
  updateInspectionVersion: (
    jobId: string,
    versionId: string,
    patch: Partial<InspectionVersion>
  ) => void
}

const JobsContext = createContext<JobsContextValue | null>(null)

export function JobsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)

  const scheduleJob = (jobId: string, date: string, timeFrom?: string, timeTo?: string) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, assignedDate: date, isScheduled: true, scheduledTimeFrom: timeFrom, scheduledTimeTo: timeTo } : j))
    )
  }

  const addInspectionVersion = (jobId: string, version: InspectionVersion) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j
        // Derive new inspection status from the new version's status
        const inspectionStatus = version.status
        return {
          ...j,
          inspectionVersions: [...j.inspectionVersions, version],
          inspectionStatus,
        }
      })
    )
  }

  const updateInspectionVersion = (
    jobId: string,
    versionId: string,
    patch: Partial<InspectionVersion>
  ) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j
        const updatedVersions = j.inspectionVersions.map((v) =>
          v.id === versionId ? { ...v, ...patch } : v
        )
        // Keep top-level inspectionStatus in sync with the latest version
        const latest = [...updatedVersions].sort((a, b) => b.versionNumber - a.versionNumber)[0]
        return {
          ...j,
          inspectionVersions: updatedVersions,
          inspectionStatus: latest?.status ?? j.inspectionStatus,
        }
      })
    )
  }

  return (
    <JobsContext.Provider value={{ jobs, scheduleJob, addInspectionVersion, updateInspectionVersion }}>
      {children}
    </JobsContext.Provider>
  )
}

export function useJobs() {
  const ctx = useContext(JobsContext)
  if (!ctx) throw new Error('useJobs must be used inside JobsProvider')
  return ctx
}
