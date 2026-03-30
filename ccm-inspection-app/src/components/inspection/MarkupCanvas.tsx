import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import PushPinIcon from '@mui/icons-material/PushPin'
import EditIcon from '@mui/icons-material/Edit'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import TextFieldsIcon from '@mui/icons-material/TextFields'
import LooksOneIcon from '@mui/icons-material/LooksOne'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import { useRef, useState, useCallback } from 'react'
import type { Markup, AnnotationType } from '../../types'
import { SEVERITY_CONFIG } from '../../data/inspectionConstants'
import type { SeverityLevel } from '../../data/inspectionConstants'

interface Props {
  markups: Markup[]
  assetType: string
  assetLabel: string
  selectedMarkupId: string | null
  onSelectMarkup: (id: string | null) => void
  onAddMarkup: (markup: Markup) => void
  onDeleteMarkup: (id: string) => void
}

type Tool = AnnotationType

const TOOLS: { type: Tool; icon: React.ReactNode; label: string }[] = [
  { type: 'pin', icon: <PushPinIcon fontSize="small" />, label: 'Pin' },
  { type: 'free_draw', icon: <EditIcon fontSize="small" />, label: 'Free Draw' },
  { type: 'line', icon: <HorizontalRuleIcon fontSize="small" />, label: 'Line' },
  { type: 'rectangle', icon: <CropSquareIcon fontSize="small" />, label: 'Rectangle' },
  { type: 'text', icon: <TextFieldsIcon fontSize="small" />, label: 'Text / Note' },
  { type: 'numbered_callout', icon: <LooksOneIcon fontSize="small" />, label: 'Numbered Callout' },
]

function assetBg(type: string) {
  if (type === 'satellite_image')
    return 'linear-gradient(135deg, #1a2a3a 0%, #2d4a5a 40%, #1e3a2a 70%, #2a3a1a 100%)'
  if (type === 'roof_photo')
    return 'linear-gradient(135deg, #4a4a4a 0%, #6a6a6a 40%, #5a5a3a 70%, #4a4a4a 100%)'
  return 'linear-gradient(135deg, #f0f0e8 0%, #e8e8dc 100%)'
}

function assetLabelColor(type: string) {
  return type === 'roof_drawing' ? '#333' : '#ccc'
}

function assetIcon(type: string) {
  if (type === 'satellite_image') return <SatelliteAltIcon sx={{ opacity: 0.3, fontSize: 64 }} />
  if (type === 'roof_photo') return <PhotoCameraIcon sx={{ opacity: 0.3, fontSize: 64 }} />
  return <ArchitectureIcon sx={{ opacity: 0.3, fontSize: 64 }} />
}

/* Severity color for markup dots */
function markupColor(markup: Markup) {
  if (!markup.severity) return '#1565C0'
  return SEVERITY_CONFIG[markup.severity as SeverityLevel]?.color ?? '#1565C0'
}

/* Callout count */
function calloutNumber(markup: Markup, allMarkups: Markup[]) {
  const callouts = allMarkups.filter((m) => m.annotationType === 'numbered_callout')
  return callouts.findIndex((m) => m.id === markup.id) + 1
}

export default function MarkupCanvas({
  markups,
  assetType,
  assetLabel,
  selectedMarkupId,
  onSelectMarkup,
  onAddMarkup,
  onDeleteMarkup,
}: Props) {
  const [activeTool, setActiveTool] = useState<Tool>('pin')
  const canvasRef = useRef<HTMLDivElement>(null)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Drawing state for free_draw / line / rectangle
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [drawPath, setDrawPath] = useState<{ x: number; y: number }[]>([])

  const getPct = useCallback((e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    return {
      x: Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
      y: Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)),
    }
  }, [])

  const handleCanvasMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== canvasRef.current && !(e.target as HTMLElement).classList.contains('canvas-bg')) return
      const pos = getPct(e)

      if (activeTool === 'pin' || activeTool === 'text' || activeTool === 'numbered_callout') {
        const newMarkup: Markup = {
          id: `m-${Date.now()}`,
          annotationType: activeTool,
          position: pos,
          issueCategory: '',
          severity: '',
          note: '',
        }
        onAddMarkup(newMarkup)
        onSelectMarkup(newMarkup.id)
        return
      }

      // For draw tools, start tracking
      setIsDrawing(true)
      setDrawStart(pos)
      setDrawPath([pos])
    },
    [activeTool, getPct, onAddMarkup, onSelectMarkup]
  )

  const handleCanvasMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing) return
      const pos = getPct(e)
      setDrawPath((prev) => [...prev, pos])
    },
    [isDrawing, getPct]
  )

  const handleCanvasMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (!isDrawing || !drawStart) return
      setIsDrawing(false)
      const endPos = getPct(e)

      if (activeTool === 'free_draw') {
        const newMarkup: Markup = {
          id: `m-${Date.now()}`,
          annotationType: 'free_draw',
          position: drawPath[0] ?? drawStart,
          path: drawPath,
          issueCategory: '',
          severity: '',
          note: '',
        }
        onAddMarkup(newMarkup)
        onSelectMarkup(newMarkup.id)
      } else if (activeTool === 'line' || activeTool === 'rectangle') {
        const newMarkup: Markup = {
          id: `m-${Date.now()}`,
          annotationType: activeTool,
          position: drawStart,
          endPosition: endPos,
          issueCategory: '',
          severity: '',
          note: '',
        }
        onAddMarkup(newMarkup)
        onSelectMarkup(newMarkup.id)
      }

      setDrawStart(null)
      setDrawPath([])
    },
    [isDrawing, drawStart, drawPath, activeTool, getPct, onAddMarkup, onSelectMarkup]
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', gap: 0, overflow: 'hidden' }}>

      {/* ── Vertical toolbar (tablet/desktop) ──────────────── */}
      {!isMobile && (
        <Box
          sx={{
            width: 56,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 0.5,
            py: 2,
            bgcolor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          {TOOLS.map((tool) => (
            <Tooltip key={tool.type} title={tool.label} placement="right">
              <IconButton
                size="small"
                onClick={() => setActiveTool(tool.type)}
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: activeTool === tool.type ? 'primary.main' : 'transparent',
                  color: activeTool === tool.type ? 'white' : 'text.secondary',
                  '&:hover': {
                    bgcolor: activeTool === tool.type ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                {tool.icon}
              </IconButton>
            </Tooltip>
          ))}
          <Box sx={{ flex: 1 }} />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', textAlign: 'center', px: 0.5 }}>
            {TOOLS.find((t) => t.type === activeTool)?.label}
          </Typography>
        </Box>
      )}

      {/* ── Canvas area ──────────────────────────────────────── */}
      <Box
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          cursor: activeTool === 'pin' || activeTool === 'text' || activeTool === 'numbered_callout' ? 'crosshair' : 'crosshair',
          userSelect: 'none',
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        ref={canvasRef}
      >
        {/* Asset background */}
        <Box
          className="canvas-bg"
          sx={{
            position: 'absolute',
            inset: 0,
            background: assetBg(assetType),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          <Box sx={{ color: assetLabelColor(assetType), pointerEvents: 'none' }}>
            {assetIcon(assetType)}
          </Box>
          <Typography variant="caption" sx={{ color: assetLabelColor(assetType), opacity: 0.5, pointerEvents: 'none' }}>
            {assetLabel}
          </Typography>

          {/* Grid overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)
              `,
              backgroundSize: '10% 10%',
              pointerEvents: 'none',
            }}
          />
        </Box>

        {/* SVG layer for lines, rectangles, free draw */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
        >
          {markups.map((m) => {
            const color = markupColor(m)
            if (m.annotationType === 'line' && m.endPosition) {
              return (
                <line
                  key={m.id}
                  x1={`${m.position.x}%`}
                  y1={`${m.position.y}%`}
                  x2={`${m.endPosition.x}%`}
                  y2={`${m.endPosition.y}%`}
                  stroke={color}
                  strokeWidth={selectedMarkupId === m.id ? 4 : 2.5}
                  strokeLinecap="round"
                />
              )
            }
            if (m.annotationType === 'rectangle' && m.endPosition) {
              const x = Math.min(m.position.x, m.endPosition.x)
              const y = Math.min(m.position.y, m.endPosition.y)
              const w = Math.abs(m.endPosition.x - m.position.x)
              const h = Math.abs(m.endPosition.y - m.position.y)
              return (
                <rect
                  key={m.id}
                  x={`${x}%`}
                  y={`${y}%`}
                  width={`${w}%`}
                  height={`${h}%`}
                  fill="none"
                  stroke={color}
                  strokeWidth={selectedMarkupId === m.id ? 3 : 2}
                  strokeDasharray={selectedMarkupId === m.id ? '0' : '6 3'}
                />
              )
            }
            if (m.annotationType === 'free_draw' && m.path && m.path.length > 1) {
              const d = m.path
                .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`)
                .join(' ')
              return (
                <path
                  key={m.id}
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={selectedMarkupId === m.id ? 3 : 2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            }
            return null
          })}

          {/* Live preview while drawing */}
          {isDrawing && drawPath.length > 1 && activeTool === 'free_draw' && (
            <path
              d={drawPath.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x}% ${p.y}%`).join(' ')}
              fill="none"
              stroke="#1565C0"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.6}
            />
          )}
        </svg>

        {/* Point / callout markup dots */}
        {markups.map((m) => {
          if (['line', 'rectangle', 'free_draw'].includes(m.annotationType)) return null
          const isSelected = m.id === selectedMarkupId
          const color = markupColor(m)
          const isCallout = m.annotationType === 'numbered_callout'
          const num = isCallout ? calloutNumber(m, markups) : null

          return (
            <Box
              key={m.id}
              onClick={(e) => {
                e.stopPropagation()
                onSelectMarkup(isSelected ? null : m.id)
              }}
              sx={{
                position: 'absolute',
                left: `${m.position.x}%`,
                top: `${m.position.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isSelected ? 10 : 2,
                cursor: 'pointer',
              }}
            >
              {isCallout ? (
                <Box
                  sx={{
                    width: isSelected ? 30 : 24,
                    height: isSelected ? 30 : 24,
                    borderRadius: '50%',
                    bgcolor: color,
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: isSelected ? '0.8rem' : '0.7rem',
                    fontWeight: 700,
                    boxShadow: isSelected ? `0 0 0 3px white, 0 0 0 5px ${color}` : '0 2px 6px rgba(0,0,0,0.4)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {num}
                </Box>
              ) : (
                <Box
                  sx={{
                    width: isSelected ? 20 : 14,
                    height: isSelected ? 20 : 14,
                    borderRadius: '50%',
                    bgcolor: color,
                    border: '2.5px solid white',
                    boxShadow: isSelected ? `0 0 0 2px ${color}` : '0 2px 6px rgba(0,0,0,0.4)',
                    transition: 'all 0.15s ease',
                  }}
                />
              )}
              {/* Incomplete warning */}
              {!m.issueCategory && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    bgcolor: '#FF7043',
                    border: '1.5px solid white',
                  }}
                />
              )}
            </Box>
          )
        })}

        {/* Empty canvas hint */}
        {markups.length === 0 && !isDrawing && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'rgba(0,0,0,0.5)',
              color: 'white',
              px: 2,
              py: 1,
              borderRadius: 4,
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
            }}
          >
            <Typography variant="caption">
              Select a tool and click the asset to add a markup
            </Typography>
          </Box>
        )}

        {/* Markup count badge */}
        {markups.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: 'rgba(0,0,0,0.55)',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              backdropFilter: 'blur(4px)',
            }}
          >
            <Typography variant="caption" fontWeight={600}>
              {markups.length} markup{markups.length !== 1 ? 's' : ''}
              {markups.filter((m) => !m.issueCategory).length > 0 && (
                <span style={{ color: '#FF7043' }}>
                  {' '}· {markups.filter((m) => !m.issueCategory).length} incomplete
                </span>
              )}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Horizontal toolbar (mobile) ───────────────────────── */}
      {isMobile && (
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            px: 1,
            py: 1,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
            overflowX: 'auto',
          }}
        >
          {TOOLS.map((tool) => (
            <Tooltip key={tool.type} title={tool.label} placement="top">
              <IconButton
                size="medium"
                onClick={() => setActiveTool(tool.type)}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1.5,
                  flexShrink: 0,
                  bgcolor: activeTool === tool.type ? 'primary.main' : 'transparent',
                  color: activeTool === tool.type ? 'white' : 'text.secondary',
                  '&:hover': {
                    bgcolor: activeTool === tool.type ? 'primary.dark' : 'action.hover',
                  },
                }}
              >
                {tool.icon}
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )}

      {/* ── Right: selected markup actions ───────────────────── */}
      {selectedMarkupId && !isMobile && (
        <Box
          sx={{
            width: 200,
            flexShrink: 0,
            borderLeft: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="subtitle2" gutterBottom>Selected Markup</Typography>
          {(() => {
            const m = markups.find((mk) => mk.id === selectedMarkupId)
            if (!m) return null
            return (
              <>
                <Chip label={m.annotationType.replace('_', ' ')} size="small" variant="outlined" sx={{ textTransform: 'capitalize', alignSelf: 'flex-start' }} />
                {m.issueCategory && (
                  <Typography variant="caption" color="text.secondary">{m.issueCategory}</Typography>
                )}
                {m.severity && (
                  <Chip
                    label={m.severity}
                    size="small"
                    sx={{
                      alignSelf: 'flex-start',
                      bgcolor: SEVERITY_CONFIG[m.severity as SeverityLevel]?.bg,
                      color: SEVERITY_CONFIG[m.severity as SeverityLevel]?.color,
                      border: `1px solid ${SEVERITY_CONFIG[m.severity as SeverityLevel]?.border}`,
                      fontWeight: 600,
                    }}
                  />
                )}
                {!m.issueCategory && (
                  <Typography variant="caption" color="warning.main">
                    ⚠ Issue details not yet filled in
                  </Typography>
                )}
                <Box sx={{ flex: 1 }} />
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon fontSize="small" />}
                  onClick={() => {
                    onDeleteMarkup(selectedMarkupId)
                    onSelectMarkup(null)
                  }}
                  sx={{ textTransform: 'none' }}
                >
                  Delete
                </Button>
              </>
            )
          })()}
        </Box>
      )}
    </Box>
  )
}
