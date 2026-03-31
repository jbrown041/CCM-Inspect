import {
  Box,
  Button,
  Chip,
  Divider,
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
import UndoIcon from '@mui/icons-material/Undo'
import ClearAllIcon from '@mui/icons-material/ClearAll'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import ZoomOutIcon from '@mui/icons-material/ZoomOut'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import ArchitectureIcon from '@mui/icons-material/Architecture'
import { useRef, useState, useEffect, useCallback } from 'react'
import { fabric } from 'fabric'
import type { Markup, AnnotationType, Asset } from '../../types'
import { SEVERITY_CONFIG } from '../../data/inspectionConstants'
import type { SeverityLevel } from '../../data/inspectionConstants'
import PhotoSourcePicker from './PhotoSourcePicker'

interface Props {
  markups: Markup[]
  assetType: string
  assetLabel: string
  /** The applicator's uploaded asset for this job, used in the source picker */
  applicatorAsset?: Asset | null
  selectedMarkupId: string | null
  onSelectMarkup: (id: string | null) => void
  onAddMarkup: (markup: Markup) => void
  onDeleteMarkup: (id: string) => void
  onClearAll?: () => void
  onSaveImage?: (dataUrl: string) => void
  photoUrl?: string | null
  onPhotoCapture?: (dataUrl: string) => void
}

const DRAW_COLORS = [
  { hex: '#D32F2F', label: 'Critical' },
  { hex: '#F57C00', label: 'Warning' },
  { hex: '#388E3C', label: 'Good' },
  { hex: '#FFFFFF', label: 'Note' },
]

type Tool = AnnotationType

// Key used to tag Fabric objects with their corresponding markup id
const MARKUP_ID_KEY = 'ccmMarkupId'

const TOOLS: { type: Tool; icon: React.ReactNode; label: string }[] = [
  { type: 'pin', icon: <PushPinIcon fontSize="small" />, label: 'Pin' },
  { type: 'free_draw', icon: <EditIcon fontSize="small" />, label: 'Free Draw' },
  { type: 'line', icon: <HorizontalRuleIcon fontSize="small" />, label: 'Line' },
  { type: 'rectangle', icon: <CropSquareIcon fontSize="small" />, label: 'Rectangle' },
  { type: 'text', icon: <TextFieldsIcon fontSize="small" />, label: 'Text / Note' },
  { type: 'numbered_callout', icon: <LooksOneIcon fontSize="small" />, label: 'Numbered Callout' },
]

function assetBgColor(type: string): string {
  if (type === 'satellite_image') return '#1e2d3a'
  if (type === 'roof_photo') return '#3a3a3a'
  return '#f0f0e8'
}

function assetLabelColor(type: string): string {
  return type === 'roof_drawing' ? '#333' : '#ccc'
}

function assetIcon(type: string) {
  if (type === 'satellite_image') return <SatelliteAltIcon sx={{ opacity: 0.3, fontSize: 64 }} />
  if (type === 'roof_photo') return <PhotoCameraIcon sx={{ opacity: 0.3, fontSize: 64 }} />
  return <ArchitectureIcon sx={{ opacity: 0.3, fontSize: 64 }} />
}

function markupColor(markup: Markup): string {
  if (!markup.severity) return '#1565C0'
  return SEVERITY_CONFIG[markup.severity as SeverityLevel]?.color ?? '#1565C0'
}

function calloutNumber(markup: Markup, allMarkups: Markup[]): number {
  const callouts = allMarkups.filter((m) => m.annotationType === 'numbered_callout')
  return callouts.findIndex((m) => m.id === markup.id) + 1
}

// Adds a single Markup to a Fabric canvas and registers it in the object map
function addMarkupToFabric(
  canvas: fabric.Canvas,
  markup: Markup,
  allMarkups: Markup[],
  objMap: Map<string, fabric.Object>
): void {
  const w = canvas.width!
  const h = canvas.height!
  const px = (markup.position.x / 100) * w
  const py = (markup.position.y / 100) * h
  const color = markupColor(markup)
  let obj: fabric.Object | null = null

  switch (markup.annotationType) {
    case 'pin':
    case 'text': {
      obj = new fabric.Circle({
        left: px - 8,
        top: py - 8,
        radius: 8,
        fill: color,
        stroke: 'white',
        strokeWidth: 2,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
      })
      break
    }
    case 'numbered_callout': {
      const num = calloutNumber(markup, allMarkups)
      const circle = new fabric.Circle({
        radius: 12,
        fill: color,
        stroke: 'white',
        strokeWidth: 2,
        originX: 'center',
        originY: 'center',
      })
      const label = new fabric.Text(String(num), {
        fontSize: 13,
        fill: 'white',
        fontWeight: 'bold',
        fontFamily: 'Arial',
        originX: 'center',
        originY: 'center',
      })
      obj = new fabric.Group([circle, label], {
        left: px - 12,
        top: py - 12,
        hasControls: false,
        hasBorders: false,
        lockMovementX: true,
        lockMovementY: true,
      })
      break
    }
    case 'free_draw': {
      if (!markup.path || markup.path.length < 2) return
      const d = markup.path
        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x / 100) * w} ${(p.y / 100) * h}`)
        .join(' ')
      obj = new fabric.Path(d, {
        fill: '',
        stroke: color,
        strokeWidth: 3,
        strokeLineCap: 'round',
        strokeLineJoin: 'round',
        hasControls: false,
        hasBorders: false,
      })
      break
    }
    case 'line': {
      if (!markup.endPosition) return
      const ex = (markup.endPosition.x / 100) * w
      const ey = (markup.endPosition.y / 100) * h
      obj = new fabric.Line([px, py, ex, ey], {
        stroke: color,
        strokeWidth: 2.5,
        strokeLineCap: 'round',
        hasControls: false,
        hasBorders: false,
      })
      break
    }
    case 'rectangle': {
      if (!markup.endPosition) return
      const rx = Math.min(px, (markup.endPosition.x / 100) * w)
      const ry = Math.min(py, (markup.endPosition.y / 100) * h)
      const rw = Math.abs(((markup.endPosition.x - markup.position.x) / 100) * w)
      const rh = Math.abs(((markup.endPosition.y - markup.position.y) / 100) * h)
      obj = new fabric.Rect({
        left: rx,
        top: ry,
        width: rw,
        height: rh,
        fill: '',
        stroke: color,
        strokeWidth: 2,
        strokeDashArray: [6, 3],
        hasControls: false,
        hasBorders: false,
      })
      break
    }
  }

  if (obj) {
    ;(obj as any)[MARKUP_ID_KEY] = markup.id
    objMap.set(markup.id, obj)
    canvas.add(obj)
  }
}

export default function MarkupCanvas({
  markups,
  assetType,
  assetLabel,
  applicatorAsset,
  selectedMarkupId,
  onSelectMarkup,
  onAddMarkup,
  onDeleteMarkup,
  onClearAll,
  onSaveImage,
  photoUrl,
  onPhotoCapture,
}: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [activeTool, setActiveTool] = useState<Tool>('pin')
  const [drawColor, setDrawColor] = useState('#D32F2F')
  const [pickerOpen, setPickerOpen] = useState(!photoUrl)
  const [zoomLevel, setZoomLevel] = useState(1)

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasElRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)
  const markupObjMap = useRef<Map<string, fabric.Object>>(new Map())
  const bgImageRef = useRef<fabric.Image | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const zoomLevelRef = useRef(1)
  const isPanningRef = useRef(false)
  const lastPanPosRef = useRef({ x: 0, y: 0 })

  // Stable refs for Fabric event handlers (avoid stale closures)
  const activeToolRef = useRef<Tool>('pin')
  const markupsRef = useRef<Markup[]>(markups)
  const onAddMarkupRef = useRef(onAddMarkup)
  const onSelectMarkupRef = useRef(onSelectMarkup)

  // Drawing state for rect/line tools
  const drawColorRef = useRef('#D32F2F')

  const drawingRef = useRef<{
    active: boolean
    start: { x: number; y: number } | null
    tempObj: fabric.Object | null
  }>({ active: false, start: null, tempObj: null })

  // Keep refs current
  useEffect(() => { activeToolRef.current = activeTool }, [activeTool])
  useEffect(() => { markupsRef.current = markups }, [markups])
  useEffect(() => { onAddMarkupRef.current = onAddMarkup }, [onAddMarkup])
  useEffect(() => { onSelectMarkupRef.current = onSelectMarkup }, [onSelectMarkup])
  useEffect(() => { drawColorRef.current = drawColor }, [drawColor])

  // ── Initialize Fabric canvas ─────────────────────────────────────────
  useEffect(() => {
    if (!canvasElRef.current || !containerRef.current) return
    const container = containerRef.current
    const w = container.clientWidth || 600
    const h = container.clientHeight || 400

    const canvas = new fabric.Canvas(canvasElRef.current, {
      isDrawingMode: false,
      width: w,
      height: h,
      selection: false,
      allowTouchScrolling: false,
    })
    fabricRef.current = canvas

    // Position Fabric's generated wrapper div to fill the container
    const wrapper = canvasElRef.current.parentElement
    if (wrapper) {
      wrapper.style.position = 'absolute'
      wrapper.style.inset = '0'
      wrapper.style.zIndex = '1'
    }

    // Thicker brush on touch devices (finger/glove use)
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches
    const brush = new fabric.PencilBrush(canvas)
    brush.color = drawColorRef.current
    brush.width = isTouchDevice ? 5 : 3
    canvas.freeDrawingBrush = brush

    // ── Fabric event: selection ──────────────────────────────────────
    canvas.on('selection:created', (e: any) => {
      const obj = e.selected?.[0]
      const mid = obj?.[MARKUP_ID_KEY]
      if (mid) onSelectMarkupRef.current(mid)
    })
    canvas.on('selection:updated', (e: any) => {
      const obj = e.selected?.[0]
      const mid = obj?.[MARKUP_ID_KEY]
      if (mid) onSelectMarkupRef.current(mid)
    })
    canvas.on('selection:cleared', () => onSelectMarkupRef.current(null))

    // ── Fabric event: free draw path created ─────────────────────────
    canvas.on('path:created', (e: any) => {
      const path = e.path as fabric.Path
      const cmds: any[][] = (path.path as any) ?? []
      const cw = canvas.width!
      const ch = canvas.height!

      const points = cmds
        .filter((cmd) => cmd[0] === 'M' || cmd[0] === 'L' || cmd[0] === 'Q')
        .map((cmd) => {
          const xi = cmd[0] === 'Q' ? 3 : 1
          const yi = cmd[0] === 'Q' ? 4 : 2
          return {
            x: Math.max(0, Math.min(100, (cmd[xi] / cw) * 100)),
            y: Math.max(0, Math.min(100, (cmd[yi] / ch) * 100)),
          }
        })

      const markupId = `m-${Date.now()}`
      ;(path as any)[MARKUP_ID_KEY] = markupId
      markupObjMap.current.set(markupId, path)
      path.set({ stroke: drawColorRef.current, fill: '' })

      const markup: Markup = {
        id: markupId,
        annotationType: 'free_draw',
        position: points[0] ?? { x: 50, y: 50 },
        path: points,
        issueCategory: '',
        severity: '',
        note: '',
      }
      onAddMarkupRef.current(markup)
      onSelectMarkupRef.current(markupId)
      canvas.renderAll()
    })

    // ── Fabric event: mouse down ─────────────────────────────────────
    canvas.on('mouse:down', (e: any) => {
      // Alt+drag or middle-click = pan
      if (e.e.altKey || (e.e as MouseEvent).button === 1) {
        isPanningRef.current = true
        lastPanPosRef.current = { x: e.e.clientX, y: e.e.clientY }
        canvas.setCursor('grabbing')
        return
      }
      const tool = activeToolRef.current
      if (canvas.isDrawingMode) return
      const pointer = canvas.getPointer(e.e)
      const cw = canvas.width!
      const ch = canvas.height!

      // Place point-based markups (pin / text / callout)
      if (['pin', 'text', 'numbered_callout'].includes(tool)) {
        const target = e.target
        if (target && (target as any)[MARKUP_ID_KEY]) return // clicked existing
        const markup: Markup = {
          id: `m-${Date.now()}`,
          annotationType: tool as AnnotationType,
          position: { x: (pointer.x / cw) * 100, y: (pointer.y / ch) * 100 },
          issueCategory: '',
          severity: '',
          note: '',
        }
        onAddMarkupRef.current(markup)
        onSelectMarkupRef.current(markup.id)
        return
      }

      // Start drawing rect or line
      if (tool === 'rectangle' || tool === 'line') {
        drawingRef.current.active = true
        drawingRef.current.start = { x: pointer.x, y: pointer.y }

        if (tool === 'rectangle') {
          const temp = new fabric.Rect({
            left: pointer.x, top: pointer.y,
            width: 1, height: 1,
            fill: '', stroke: '#1565C0',
            strokeWidth: 2, strokeDashArray: [6, 3],
            selectable: false, evented: false, opacity: 0.7,
          })
          canvas.add(temp)
          drawingRef.current.tempObj = temp
        } else {
          const temp = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
            stroke: '#1565C0', strokeWidth: 2.5,
            strokeLineCap: 'round',
            selectable: false, evented: false, opacity: 0.7,
          })
          canvas.add(temp)
          drawingRef.current.tempObj = temp
        }
      }
    })

    // ── Fabric event: mouse move (drawing preview) ───────────────────
    canvas.on('mouse:move', (e: any) => {
      // Handle pan drag
      if (isPanningRef.current) {
        const vpt = canvas.viewportTransform!
        vpt[4] += e.e.clientX - lastPanPosRef.current.x
        vpt[5] += e.e.clientY - lastPanPosRef.current.y
        lastPanPosRef.current = { x: e.e.clientX, y: e.e.clientY }
        canvas.requestRenderAll()
        return
      }
      if (!drawingRef.current.active || !drawingRef.current.start || !drawingRef.current.tempObj) return
      const pointer = canvas.getPointer(e.e)
      const start = drawingRef.current.start
      const obj = drawingRef.current.tempObj

      if (obj instanceof fabric.Rect) {
        obj.set({
          left: Math.min(start.x, pointer.x),
          top: Math.min(start.y, pointer.y),
          width: Math.abs(pointer.x - start.x),
          height: Math.abs(pointer.y - start.y),
        })
      } else if (obj instanceof fabric.Line) {
        obj.set({ x2: pointer.x, y2: pointer.y })
      }
      canvas.renderAll()
    })

    // ── Fabric event: mouse up (finish rect/line) ────────────────────
    canvas.on('mouse:up', (e: any) => {
      // End pan
      if (isPanningRef.current) {
        isPanningRef.current = false
        canvas.setCursor('default')
        canvas.setViewportTransform(canvas.viewportTransform!)
        return
      }
      if (!drawingRef.current.active || !drawingRef.current.start) return

      const tool = activeToolRef.current
      const pointer = canvas.getPointer(e.e)
      const start = drawingRef.current.start
      const cw = canvas.width!
      const ch = canvas.height!

      if (drawingRef.current.tempObj) {
        canvas.remove(drawingRef.current.tempObj)
        drawingRef.current.tempObj = null
      }
      drawingRef.current.active = false
      drawingRef.current.start = null

      if (Math.hypot(pointer.x - start.x, pointer.y - start.y) < 5) return

      const markup: Markup = {
        id: `m-${Date.now()}`,
        annotationType: tool as AnnotationType,
        position: { x: (start.x / cw) * 100, y: (start.y / ch) * 100 },
        endPosition: { x: (pointer.x / cw) * 100, y: (pointer.y / ch) * 100 },
        issueCategory: '',
        severity: '',
        note: '',
      }
      onAddMarkupRef.current(markup)
      onSelectMarkupRef.current(markup.id)
      canvas.renderAll()
    })

    // ── Mouse wheel: zoom ─────────────────────────────────────────────
    // Attach to the container div with { passive: false } so preventDefault works.
    // Browsers mark wheel events passive by default; attaching to the Fabric
    // internal canvas element doesn't reliably intercept them.
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()
      let zoom = canvas.getZoom()
      zoom *= 0.999 ** e.deltaY
      zoom = Math.max(0.5, Math.min(5, zoom))
      // e.offsetX/Y is relative to the container, which matches canvas coords at zoom=1
      canvas.zoomToPoint(new fabric.Point(e.offsetX, e.offsetY), zoom)
      const rounded = Math.round(zoom * 100) / 100
      setZoomLevel(rounded)
      zoomLevelRef.current = rounded
    }
    container.addEventListener('wheel', onWheel, { passive: false })

    // ── ResizeObserver ────────────────────────────────────────────────
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect
      if (width > 0 && height > 0) {
        canvas.setDimensions({ width, height })
        // Re-scale background photo to fill new dimensions
        if (bgImageRef.current) {
          bgImageRef.current.set({
            scaleX: width / (bgImageRef.current.width ?? 1),
            scaleY: height / (bgImageRef.current.height ?? 1),
          })
        }
        // Reset zoom/pan on resize
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
        setZoomLevel(1)
        zoomLevelRef.current = 1
        canvas.renderAll()
      }
    })
    ro.observe(container)

    return () => {
      ro.disconnect()
      container.removeEventListener('wheel', onWheel)
      canvas.dispose()
      fabricRef.current = null
      markupObjMap.current.clear()
    }
  }, [assetType]) // re-init only if asset type changes

  // ── Load photo as canvas object so it zooms with the viewport ────────
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas || !photoUrl) return
    fabric.Image.fromURL(
      photoUrl,
      (img) => {
        // Remove previous bg image object
        if (bgImageRef.current) canvas.remove(bgImageRef.current)
        img.set({
          left: 0,
          top: 0,
          scaleX: canvas.width! / (img.width ?? 1),
          scaleY: canvas.height! / (img.height ?? 1),
          selectable: false,
          evented: false,
          hoverCursor: 'default',
        })
        bgImageRef.current = img
        canvas.add(img)
        canvas.sendToBack(img)
        // Reset zoom/pan when a new photo is loaded
        canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
        setZoomLevel(1)
        zoomLevelRef.current = 1
        canvas.renderAll()
      },
      { crossOrigin: 'anonymous' },
    )
  }, [photoUrl])

  // ── Photo file input handler ─────────────────────────────────────────
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string
      if (dataUrl && onPhotoCapture) onPhotoCapture(dataUrl)
    }
    reader.readAsDataURL(file)
    // Reset input so the same file can be re-selected if needed
    e.target.value = ''
  }, [onPhotoCapture])

  const handleAddPhoto = useCallback(() => setPickerOpen(true), [])

  // ── Sync activeTool / drawColor → Fabric drawing mode ───────────────
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.isDrawingMode = activeTool === 'free_draw'
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = drawColor
      ;(canvas.freeDrawingBrush as fabric.PencilBrush).width = 3
    }
    canvas.renderAll()
  }, [activeTool, drawColor])

  // ── Zoom controls ─────────────────────────────────────────────────────
  const handleZoomIn = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const zoom = Math.min(canvas.getZoom() * 1.3, 5)
    canvas.zoomToPoint(new fabric.Point(canvas.width! / 2, canvas.height! / 2), zoom)
    const rounded = Math.round(zoom * 100) / 100
    setZoomLevel(rounded)
    zoomLevelRef.current = rounded
  }, [])

  const handleZoomOut = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const zoom = Math.max(canvas.getZoom() / 1.3, 0.5)
    canvas.zoomToPoint(new fabric.Point(canvas.width! / 2, canvas.height! / 2), zoom)
    const rounded = Math.round(zoom * 100) / 100
    setZoomLevel(rounded)
    zoomLevelRef.current = rounded
  }, [])

  const handleZoomReset = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0])
    setZoomLevel(1)
    zoomLevelRef.current = 1
  }, [])

  // ── Undo: remove last markup ──────────────────────────────────────────
  const handleUndo = useCallback(() => {
    if (markupsRef.current.length === 0) return
    const last = markupsRef.current[markupsRef.current.length - 1]
    onDeleteMarkup(last.id)
    onSelectMarkup(null)
  }, [onDeleteMarkup, onSelectMarkup])

  // ── Clear all markups ─────────────────────────────────────────────────
  const handleClearAll = useCallback(() => {
    markupsRef.current.forEach((m) => onDeleteMarkup(m.id))
    onSelectMarkup(null)
    if (onClearAll) onClearAll()
  }, [onDeleteMarkup, onSelectMarkup, onClearAll])

  // ── Save: export canvas as JPEG — store in wizard + optional download ────
  const handleSave = useCallback(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL({ format: 'jpeg', quality: 0.92 })
    // Pass image up to the wizard (for report preview)
    if (onSaveImage) onSaveImage(dataUrl)
    // Also trigger a local download as a convenience
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `inspection-markup-${Date.now()}.jpg`
    a.click()
  }, [onSaveImage])

  // ── Sync markups prop → Fabric objects ───────────────────────────────
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return

    const currentIds = new Set(markups.map((m) => m.id))
    const existingIds = new Set(markupObjMap.current.keys())

    // Remove deleted markups from canvas
    for (const [id, obj] of markupObjMap.current) {
      if (!currentIds.has(id)) {
        canvas.remove(obj)
        markupObjMap.current.delete(id)
      }
    }

    // Update colors on existing (severity may have changed)
    for (const markup of markups) {
      if (!existingIds.has(markup.id)) continue
      const obj = markupObjMap.current.get(markup.id)
      if (!obj) continue
      const color = markupColor(markup)
      if (['pin', 'text'].includes(markup.annotationType)) {
        if (obj.fill !== color) obj.set({ fill: color })
      } else if (markup.annotationType === 'numbered_callout') {
        const group = obj as fabric.Group
        const circle = group.getObjects('circle')[0]
        if (circle && circle.fill !== color) {
          circle.set({ fill: color })
          ;(group as any).dirty = true
        }
      } else {
        if (obj.stroke !== color) obj.set({ stroke: color })
      }
    }

    // Add new markups not yet in canvas
    for (const markup of markups) {
      if (existingIds.has(markup.id)) continue
      addMarkupToFabric(canvas, markup, markups, markupObjMap.current)
    }

    canvas.renderAll()
  }, [markups])

  // ── Sync selectedMarkupId → Fabric active object ─────────────────────
  useEffect(() => {
    const canvas = fabricRef.current
    if (!canvas) return
    canvas.discardActiveObject()
    if (selectedMarkupId) {
      const obj = markupObjMap.current.get(selectedMarkupId)
      if (obj) canvas.setActiveObject(obj)
    }
    canvas.renderAll()
  }, [selectedMarkupId])

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100%', gap: 0, overflow: 'hidden' }}>

      {/* ── Vertical toolbar (desktop) ──────────────────────────── */}
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
          {/* Photo capture button */}
          <Tooltip title={photoUrl ? 'Replace photo' : 'Add photo'} placement="right">
            <IconButton
              size="small"
              onClick={handleAddPhoto}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: photoUrl ? 'success.main' : 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: photoUrl ? 'success.dark' : 'primary.dark' },
                mb: 0.5,
              }}
            >
              <AddAPhotoIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Divider flexItem sx={{ my: 0.5, mx: 1 }} />

          {/* Tool buttons */}
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

          <Divider flexItem sx={{ my: 0.5, mx: 1 }} />

          {/* Color swatches */}
          {DRAW_COLORS.map((c) => (
            <Tooltip key={c.hex} title={c.label} placement="right">
              <Box
                onClick={() => setDrawColor(c.hex)}
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: '50%',
                  bgcolor: c.hex,
                  border: drawColor === c.hex ? '3px solid' : '2px solid',
                  borderColor: drawColor === c.hex ? 'primary.main' : 'divider',
                  cursor: 'pointer',
                  transform: drawColor === c.hex ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.15s ease',
                  boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.2)' : 'none',
                }}
              />
            </Tooltip>
          ))}

          <Box sx={{ flex: 1 }} />

          {/* Action buttons */}
          <Tooltip title="Undo last" placement="right">
            <span>
              <IconButton
                size="small"
                onClick={handleUndo}
                disabled={markups.length === 0}
                sx={{ width: 40, height: 40, borderRadius: 1.5, color: 'text.secondary' }}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Clear all" placement="right">
            <span>
              <IconButton
                size="small"
                onClick={handleClearAll}
                disabled={markups.length === 0}
                sx={{ width: 40, height: 40, borderRadius: 1.5, color: 'text.secondary' }}
              >
                <ClearAllIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Save as image" placement="right">
            <IconButton
              size="small"
              onClick={handleSave}
              sx={{ width: 40, height: 40, borderRadius: 1.5, color: 'primary.main' }}
            >
              <SaveAltIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.6rem', textAlign: 'center', px: 0.5, mt: 0.5 }}>
            {TOOLS.find((t) => t.type === activeTool)?.label}
          </Typography>
        </Box>
      )}

      {/* ── Canvas area ─────────────────────────────────────────── */}
      <Box
        ref={containerRef}
        sx={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
          bgcolor: assetBgColor(assetType),
          userSelect: 'none',
          touchAction: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Asset icon + label — sits behind canvas (pointer-events none) */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ color: assetLabelColor(assetType) }}>{assetIcon(assetType)}</Box>
          <Typography variant="caption" sx={{ color: assetLabelColor(assetType), opacity: 0.5 }}>
            {assetLabel}
          </Typography>
          {/* Subtle grid overlay */}
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
              `,
              backgroundSize: '10% 10%',
            }}
          />
        </Box>

        {/* Fabric canvas — Fabric will wrap this in .canvas-container */}
        <canvas ref={canvasElRef} />

        {/* No photo yet — source picker CTA overlay */}
        {!photoUrl && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              zIndex: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              bgcolor: 'rgba(0,0,0,0.35)',
              backdropFilter: 'blur(2px)',
            }}
          >
            <Box
              onClick={() => setPickerOpen(true)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 1.5,
                p: 4,
                borderRadius: 3,
                border: '2px dashed rgba(255,255,255,0.4)',
                cursor: 'pointer',
                color: 'white',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.7)' },
                transition: 'all 0.2s ease',
                userSelect: 'none',
              }}
            >
              <AddAPhotoIcon sx={{ fontSize: 56, opacity: 0.85 }} />
              <Typography variant="h6" fontWeight={600} sx={{ opacity: 0.9 }}>
                Add a drawing or photo
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.65, textAlign: 'center', maxWidth: 240 }}>
                Choose from the applicator drawing, a satellite image, or upload your own
              </Typography>
            </Box>
          </Box>
        )}

        {/* Empty canvas hint (only when photo is loaded and no markups yet) */}
        {photoUrl && markups.length === 0 && (
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
              zIndex: 2,
              whiteSpace: 'nowrap',
            }}
          >
            <Typography variant="caption">
              Select a tool and tap the photo to add a markup
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
              zIndex: 2,
              bgcolor: 'rgba(0,0,0,0.55)',
              color: 'white',
              px: 1.5,
              py: 0.5,
              borderRadius: 4,
              backdropFilter: 'blur(4px)',
              pointerEvents: 'none',
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

        {/* Floating zoom controls — bottom-left corner */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 14,
            left: 14,
            zIndex: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 0.5,
          }}
        >
          <Tooltip title="Zoom in (scroll wheel)" placement="right">
            <IconButton
              size="small"
              onClick={handleZoomIn}
              sx={{
                width: 32, height: 32, borderRadius: 1,
                bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
            >
              <ZoomInIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom out" placement="right">
            <IconButton
              size="small"
              onClick={handleZoomOut}
              sx={{
                width: 32, height: 32, borderRadius: 1,
                bgcolor: 'rgba(0,0,0,0.6)', color: 'white', backdropFilter: 'blur(4px)',
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
            >
              <ZoomOutIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
          {zoomLevel !== 1 && (
            <Tooltip title={`${Math.round(zoomLevel * 100)}% — click to reset`} placement="right">
              <IconButton
                size="small"
                onClick={handleZoomReset}
                sx={{
                  width: 32, height: 32, borderRadius: 1,
                  bgcolor: 'primary.main', color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                <ZoomOutMapIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* ── Horizontal toolbar (mobile) ─────────────────────────── */}
      {isMobile && (
        <Box
          sx={{
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#2a2a2a',
            borderTop: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          {/* Tools row */}
          <Box sx={{
            display: 'flex', alignItems: 'center', px: 1, py: 1, overflowX: 'auto', gap: 0.5,
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
          }}>
            {TOOLS.map((tool) => (
              <Tooltip key={tool.type} title={tool.label} placement="top">
                <IconButton
                  size="medium"
                  onClick={() => setActiveTool(tool.type)}
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    flexShrink: 0,
                    bgcolor: activeTool === tool.type ? 'primary.main' : 'rgba(255,255,255,0.08)',
                    color: activeTool === tool.type ? 'white' : 'rgba(255,255,255,0.7)',
                    '&:hover': { bgcolor: activeTool === tool.type ? 'primary.dark' : 'rgba(255,255,255,0.15)' },
                    '& svg': { fontSize: '1.4rem' },
                  }}
                >
                  {tool.icon}
                </IconButton>
              </Tooltip>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(255,255,255,0.15)' }} />
            {/* Color swatches — larger for touch */}
            {DRAW_COLORS.map((c) => (
              <Tooltip key={c.hex} title={c.label} placement="top">
                <Box
                  onClick={() => setDrawColor(c.hex)}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    flexShrink: 0,
                    bgcolor: c.hex,
                    border: drawColor === c.hex ? '3px solid' : '2.5px solid',
                    borderColor: drawColor === c.hex ? '#90CAF9' : 'rgba(255,255,255,0.3)',
                    cursor: 'pointer',
                    transform: drawColor === c.hex ? 'scale(1.2)' : 'scale(1)',
                    transition: 'transform 0.15s ease',
                    boxShadow: c.hex === '#FFFFFF' ? 'inset 0 0 0 1px rgba(0,0,0,0.3)' : 'none',
                  }}
                />
              </Tooltip>
            ))}
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(255,255,255,0.15)' }} />
            {/* Photo capture */}
            <Tooltip title={photoUrl ? 'Replace photo' : 'Add photo'} placement="top">
              <IconButton
                size="medium"
                onClick={handleAddPhoto}
                sx={{
                  flexShrink: 0,
                  width: 52,
                  height: 52,
                  bgcolor: photoUrl ? 'rgba(56,142,60,0.25)' : 'rgba(25,118,210,0.25)',
                  color: photoUrl ? '#81C784' : '#90CAF9',
                  '& svg': { fontSize: '1.4rem' },
                }}
              >
                <AddAPhotoIcon />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, borderColor: 'rgba(255,255,255,0.15)' }} />
            {/* Action buttons */}
            <Tooltip title="Undo" placement="top">
              <span>
                <IconButton
                  size="medium"
                  onClick={handleUndo}
                  disabled={markups.length === 0}
                  sx={{ flexShrink: 0, width: 52, height: 52, color: 'rgba(255,255,255,0.7)', '&.Mui-disabled': { color: 'rgba(255,255,255,0.25)' } }}
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Clear all" placement="top">
              <span>
                <IconButton
                  size="medium"
                  onClick={handleClearAll}
                  disabled={markups.length === 0}
                  sx={{ flexShrink: 0, width: 52, height: 52, color: 'rgba(255,255,255,0.7)', '&.Mui-disabled': { color: 'rgba(255,255,255,0.25)' } }}
                >
                  <ClearAllIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Save image" placement="top">
              <IconButton
                size="medium"
                onClick={handleSave}
                sx={{ flexShrink: 0, width: 52, height: 52, color: '#90CAF9' }}
              >
                <SaveAltIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* ── Right panel: selected markup actions (desktop) ──────── */}
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
                <Chip
                  label={m.annotationType.replace('_', ' ')}
                  size="small"
                  variant="outlined"
                  sx={{ textTransform: 'capitalize', alignSelf: 'flex-start' }}
                />
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
      {/* Hidden file input for photo capture / gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Photo source picker dialog */}
      <PhotoSourcePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        applicatorAsset={applicatorAsset}
        fileInputRef={fileInputRef}
        onSelect={(_source, dataUrl) => {
          if (dataUrl && onPhotoCapture) onPhotoCapture(dataUrl)
        }}
      />
    </Box>
  )
}

