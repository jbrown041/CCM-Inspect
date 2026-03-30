import { Box, Button, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import type { GridColDef, GridSortModel, GridRenderCellParams, GridRowParams } from '@mui/x-data-grid'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import dayjs from 'dayjs'
import type { Job } from '../../types'

interface Props {
  jobs: Job[]
  onScheduleJob: (job: Job) => void
  onSelectJob: (jobId: string) => void
  selectedJobId?: string | null
  sortModel: GridSortModel
  onSortModelChange: (model: GridSortModel) => void
  readOnly?: boolean
}

function daysOld(dateStr: string | null): number | null {
  if (!dateStr) return null
  return dayjs().diff(dayjs(dateStr), 'day')
}

export default function JobsTable({
  jobs,
  onScheduleJob,
  onSelectJob,
  selectedJobId,
  sortModel,
  onSortModelChange,
  readOnly = false,
}: Props) {
  const columns: GridColDef<Job>[] = [
    {
      field: 'jobName',
      headerName: 'Job Name',
      flex: 2,
      minWidth: 200,
      renderCell: (params: GridRenderCellParams<Job>) => (
        <Box sx={{ py: 1, lineHeight: 1 }}>
          <Typography
            variant="body2"
            fontWeight={600}
            sx={{ color: 'primary.main', cursor: 'pointer', lineHeight: 1.35, display: 'block' }}
          >
            {params.row.jobName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3, display: 'block', mt: 0.25 }}>
            #{params.row.jobNumber}
          </Typography>
        </Box>
      ),
    },
    {
      field: 'assignedDate',
      headerName: 'Assigned',
      width: 130,
      sortComparator: (v1: string | null, v2: string | null) => {
        if (!v1 && !v2) return 0
        if (!v1) return 1
        if (!v2) return -1
        return v1 < v2 ? -1 : v1 > v2 ? 1 : 0
      },
      renderCell: (params: GridRenderCellParams<Job>) => {
        if (!params.row.assignedDate) return <Typography variant="body2" color="text.secondary">—</Typography>
        const days = daysOld(params.row.assignedDate)
        const isOld = days !== null && days > 10
        return (
          <Box sx={{ py: 1, lineHeight: 1 }}>
            <Typography variant="body2" fontWeight={700} sx={{ color: isOld ? 'error.main' : 'success.dark', lineHeight: 1.35, display: 'block' }}>
              {days} days
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3, display: 'block', mt: 0.25 }}>
              {dayjs(params.row.assignedDate).format('M/D/YYYY')}
            </Typography>
          </Box>
        )
      },
    },
    {
      field: 'typeOfInspection',
      headerName: 'Type',
      flex: 1.4,
      minWidth: 160,
      renderCell: (p: GridRenderCellParams<Job>) => (
        <Typography variant="body2">{p.row.typeOfInspection}</Typography>
      ),
    },
    {
      field: 'membraneType',
      headerName: 'Membrane Type',
      flex: 1.2,
      minWidth: 140,
      renderCell: (p: GridRenderCellParams<Job>) => (
        <Typography variant="body2">{p.row.membraneType}</Typography>
      ),
    },
    {
      field: 'totalSqFt',
      headerName: 'Total Sq Ft',
      type: 'number',
      width: 110,
      renderCell: (params: GridRenderCellParams<Job>) => (
        <Typography variant="body2">{(params.row.totalSqFt as number).toLocaleString()}</Typography>
      ),
    },
    {
      field: 'city',
      headerName: 'Location',
      width: 130,
      renderCell: (p: GridRenderCellParams<Job>) => (
        <Typography variant="body2">{p.row.city}</Typography>
      ),
    },
    {
      field: 'state',
      headerName: 'State',
      width: 70,
      renderCell: (p: GridRenderCellParams<Job>) => (
        <Typography variant="body2">{p.row.state}</Typography>
      ),
    },
    {
      field: 'roofer',
      headerName: 'Roofer',
      flex: 1.2,
      minWidth: 160,
      renderCell: (p: GridRenderCellParams<Job>) => (
        <Typography variant="body2">{p.row.roofer}</Typography>
      ),
    },
    ...(readOnly
      ? []
      : [
          {
            field: 'actions',
            headerName: '',
            width: 115,
            sortable: false,
            align: 'center' as const,
            renderCell: (params: GridRenderCellParams<Job>) => {
              if (!params.row.isScheduled) {
                return (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CalendarTodayIcon sx={{ fontSize: '0.85rem !important' }} />}
                    onClick={(e) => { e.stopPropagation(); onScheduleJob(params.row as Job) }}
                    sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap', textTransform: 'none' }}
                  >
                    Schedule
                  </Button>
                )
              }
              return null
            },
          } as GridColDef<Job>,
        ]),
  ]

  return (
    <DataGrid<Job>
      rows={jobs}
      columns={columns}
      sortModel={sortModel}
      onSortModelChange={onSortModelChange}
      onRowClick={(params: GridRowParams<Job>) => onSelectJob(params.row.id)}
      rowSelectionModel={selectedJobId ? { type: 'include', ids: new Set([selectedJobId]) } : { type: 'include', ids: new Set() }}
      rowHeight={56}
      disableColumnFilter
      disableColumnMenu
      pageSizeOptions={[25, 50, 100]}
      initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
      sx={{
        border: 'none',
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: '#FAFAFA',
          borderBottom: '1px solid #E8E8E8',
        },
        '& .MuiDataGrid-columnHeaderTitle': {
          fontWeight: 600,
          fontSize: '0.8rem',
          color: 'text.secondary',
        },
        '& .MuiDataGrid-row': {
          cursor: 'pointer',
          borderBottom: '1px solid #F0F0F0',
          '&:hover': { backgroundColor: '#F8FAFF' },
        },
        '& .MuiDataGrid-row.Mui-selected': {
          backgroundColor: '#EBF2FF !important',
          '&:hover': { backgroundColor: '#DDE8FF !important' },
        },
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          borderBottom: 'none',
          overflow: 'visible',
        },
        '& .MuiDataGrid-footerContainer': {
          borderTop: '1px solid #E0E0E0',
        },
      }}
    />
  )
}

