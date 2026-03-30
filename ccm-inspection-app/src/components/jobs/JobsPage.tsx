import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMediaQuery, useTheme } from '@mui/material'
import {
  Badge,
  Box,
  Button,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import TableRowsIcon from '@mui/icons-material/TableRows'
import MapIcon from '@mui/icons-material/Map'
import SearchIcon from '@mui/icons-material/Search'
import WorkOffIcon from '@mui/icons-material/WorkOff'
import type { GridSortModel } from '@mui/x-data-grid'
import type { FilterState, Job } from '../../types'
import { CURRENT_USER_ID } from '../../data/mockData'
import { useJobs } from '../../context/JobsContext'
import JobsTable from './JobsTable'
import JobCardList from './JobCardList'
import JobsMap from './JobsMap'
import FilterPanel, { ActiveFilterChips } from './FilterPanel'
import ScheduleJobDrawer from './ScheduleJobDrawer'

type AssignmentTab = 'mine' | 'unassigned' | 'all'

const DEFAULT_FILTERS: FilterState = {
  location: '',
  typeOfInspection: [],
  brand: '',
  earlyBird: 'all',
}

function applyFilters(jobs: Job[], filters: FilterState, search: string): Job[] {
  return jobs.filter((job) => {
    if (search) {
      const q = search.toLowerCase()
      if (
        !job.jobName.toLowerCase().includes(q) &&
        !job.jobNumber.toLowerCase().includes(q) &&
        !job.city.toLowerCase().includes(q) &&
        !job.roofer.toLowerCase().includes(q)
      ) return false
    }
    if (filters.location) {
      const q = filters.location.toLowerCase()
      if (!job.city.toLowerCase().includes(q) && !job.state.toLowerCase().includes(q)) return false
    }
    if (filters.typeOfInspection.length > 0) {
      if (!filters.typeOfInspection.includes(job.typeOfInspection)) return false
    }
    if (filters.brand) {
      if (job.brand !== filters.brand) return false
    }
    if (filters.earlyBird === 'early_bird_only') {
      if (!job.isEarlyBird) return false
    }
    return true
  })
}

export default function JobsPage() {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { jobs, scheduleJob: contextScheduleJob } = useJobs()
  const [viewMode, setViewMode] = useState<'table' | 'map'>('table')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)
  const [assignmentTab, setAssignmentTab] = useState<AssignmentTab>('mine')
  const [search, setSearch] = useState('')
  const [scheduleJob, setScheduleJob] = useState<Job | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: 'assignedDate', sort: 'asc' }])

  const isReadOnly = assignmentTab !== 'mine'

  const sourceJobs = useMemo(() => {
    if (assignmentTab === 'mine') return jobs.filter((j) => j.repId === CURRENT_USER_ID)
    if (assignmentTab === 'unassigned') return jobs.filter((j) => j.repId === null)
    return jobs
  }, [jobs, assignmentTab])

  const filteredJobs = useMemo(() => applyFilters(sourceJobs, filters, search), [sourceJobs, filters, search])

  const activeFilterCount = useMemo(() => {
    let n = 0
    if (filters.location) n++
    if (filters.typeOfInspection.length > 0) n++
    if (filters.brand) n++
    if (filters.earlyBird !== 'all') n++
    return n
  }, [filters])

  const handleScheduleSave = (jobId: string, date: string, timeFrom?: string, timeTo?: string) => {
    contextScheduleJob(jobId, date, timeFrom, timeTo)
    setScheduleJob(null)
  }

  const handleRowClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* ── Page header ─────────────────────────────────────────────── */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 2.5, pb: 0, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1.5, fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Inspections
        </Typography>

        {/* Assignment tabs + search + controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', pb: 0 }}>
          {/* Assignment tabs */}
          <Box sx={{ display: 'flex', gap: 0.75 }}>
            {([
              { key: 'mine', label: 'Assigned to me' },
              { key: 'unassigned', label: 'Unassigned' },
              { key: 'all', label: 'View All' },
            ] as { key: AssignmentTab; label: string }[]).map(({ key, label }) => (
              <Button
                key={key}
                variant={assignmentTab === key ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setAssignmentTab(key)}
                sx={{
                  textTransform: 'none',
                  fontWeight: assignmentTab === key ? 700 : 400,
                  borderRadius: 5,
                  px: 2,
                  fontSize: '0.82rem',
                  boxShadow: 'none',
                  '&:hover': { boxShadow: 'none' },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* Search */}
          <TextField
            size="small"
            placeholder="Search jobs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: { xs: '100%', sm: 240 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Filter */}
          <Tooltip title="Filter">
            <Badge badgeContent={activeFilterCount} color="primary">
              <Button
                variant={activeFilterCount > 0 ? 'contained' : 'outlined'}
                size="small"
                startIcon={<FilterListIcon />}
                onClick={(e) => setFilterAnchor(e.currentTarget)}
                sx={{ textTransform: 'none', borderRadius: 1 }}
              >
                Filter
              </Button>
            </Badge>
          </Tooltip>

          {/* View toggle */}
          {!isMobile && (
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, v) => { if (v) setViewMode(v) }}
              size="small"
              sx={{ flexShrink: 0 }}
            >
              <ToggleButton value="table" aria-label="Table view">
                <Tooltip title="Table view"><TableRowsIcon fontSize="small" /></Tooltip>
              </ToggleButton>
              <ToggleButton value="map" aria-label="Map view">
                <Tooltip title="Map view"><MapIcon fontSize="small" /></Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </Box>

        {/* Results count */}
        <Box sx={{ py: 1, mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
      </Box>

      {/* ── Active filter chips ──────────────────────────────────────── */}
      <ActiveFilterChips filters={filters} onFiltersChange={setFilters} />

      {/* ── Content area ────────────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {filteredJobs.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              gap: 2,
              color: 'text.secondary',
            }}
          >
            <WorkOffIcon sx={{ fontSize: 56, opacity: 0.3 }} />
            <Typography variant="h6" color="text.secondary">No jobs found</Typography>
            <Typography variant="body2" color="text.secondary">
              {activeFilterCount > 0 || search
                ? 'Try adjusting or clearing your filters.'
                : assignmentTab === 'unassigned'
                ? 'No unassigned jobs.'
                : 'No jobs are currently assigned to you.'}
            </Typography>
            {(activeFilterCount > 0 || search) && (
              <Button variant="outlined" onClick={() => { setFilters(DEFAULT_FILTERS); setSearch('') }}>
                Clear Filters
              </Button>
            )}
          </Box>
        ) : isMobile ? (
          <JobCardList
            jobs={filteredJobs}
            onSelectJob={handleRowClick}
            onScheduleJob={setScheduleJob}
            readOnly={isReadOnly}
          />
        ) : viewMode === 'table' ? (
          <JobsTable
            jobs={filteredJobs}
            onScheduleJob={setScheduleJob}
            onSelectJob={handleRowClick}
            selectedJobId={selectedJobId}
            sortModel={sortModel}
            onSortModelChange={setSortModel}
            readOnly={isReadOnly}
          />
        ) : (
          <JobsMap
            jobs={filteredJobs}
            selectedJobId={selectedJobId}
            onSelectJob={(id) => { setSelectedJobId(id); navigate(`/jobs/${id}`) }}
            onScheduleJob={setScheduleJob}
            readOnly={isReadOnly}
          />
        )}
      </Box>

      {/* ── Panels and dialogs ───────────────────────────────────────── */}
      <FilterPanel
        anchorEl={filterAnchor}
        onClose={() => setFilterAnchor(null)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <ScheduleJobDrawer
        job={scheduleJob}
        onClose={() => setScheduleJob(null)}
        onSave={handleScheduleSave}
      />
    </Box>
  )
}
