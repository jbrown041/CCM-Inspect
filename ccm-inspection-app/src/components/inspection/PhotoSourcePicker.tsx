import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import MapIcon from '@mui/icons-material/Map'
import SatelliteAltIcon from '@mui/icons-material/SatelliteAlt'
import EditIcon from '@mui/icons-material/Edit'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import type { AssetType } from '../../types'

interface Props {
  open: boolean
  onClose: () => void
  /** The applicator-uploaded drawing/image already on the job, if any */
  applicatorAsset?: { type: AssetType; url: string; label: string } | null
  /** Called when the user selects a source. dataUrl is null for "draw from scratch". */
  onSelect: (source: PhotoSource, dataUrl: string | null) => void
  /** Ref forwarded to the hidden file input for upload option */
  fileInputRef: React.RefObject<HTMLInputElement | null>
}

export type PhotoSource = 'applicator_drawing' | 'satellite' | 'scratch' | 'upload'

// ArcGIS World Imagery export — Ronald Reagan Building rooftop, DC
// bbox sized to 300m×225m (4:3 real-world ratio) to match 1200×900 pixel output — no distortion
const SAMPLE_SATELLITE_URL =
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=-77.0322,38.8930,-77.0287,38.8950&bboxSR=4326&size=1200,900&imageSR=4326&format=jpg&f=image'

interface OptionCard {
  source: PhotoSource
  title: string
  subtitle: string
  previewUrl: string | null
  previewIcon: React.ReactNode
  previewBg: string
  disabled?: boolean
  disabledReason?: string
}

export default function PhotoSourcePicker({
  open,
  onClose,
  applicatorAsset,
  onSelect,
  fileInputRef,
}: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const hasApplicatorAsset = !!applicatorAsset?.url

  const cards: OptionCard[] = [
    {
      source: 'applicator_drawing',
      title: 'Applicator Drawing',
      subtitle: hasApplicatorAsset
        ? applicatorAsset!.label
        : 'No drawing uploaded to this job',
      previewUrl: hasApplicatorAsset ? applicatorAsset!.url : null,
      previewIcon: <MapIcon sx={{ fontSize: 48, opacity: 0.4 }} />,
      previewBg: '#e8eaf6',
      disabled: !hasApplicatorAsset,
      disabledReason: 'No drawing on file',
    },
    {
      source: 'satellite',
      title: 'Google Earth Image',
      subtitle: 'Use a satellite view of the roof',
      previewUrl: SAMPLE_SATELLITE_URL,
      previewIcon: <SatelliteAltIcon sx={{ fontSize: 48, opacity: 0.4 }} />,
      previewBg: '#1e2d3a',
    },
    {
      source: 'scratch',
      title: 'Draw from Scratch',
      subtitle: 'Start with a blank canvas',
      previewUrl: null,
      previewIcon: <EditIcon sx={{ fontSize: 48, opacity: 0.25 }} />,
      previewBg: '#f5f5f5',
    },
    {
      source: 'upload',
      title: 'Upload / Take Photo',
      subtitle: 'Use your camera or choose from gallery',
      previewUrl: null,
      previewIcon: <AddAPhotoIcon sx={{ fontSize: 48, opacity: 0.4 }} />,
      previewBg: '#e3f2fd',
    },
  ]

  const handleSelect = (card: OptionCard) => {
    if (card.disabled) return

    if (card.source === 'upload') {
      // Trigger the hidden file input — picker will close after user picks a file
      fileInputRef.current?.click()
      onClose()
      return
    }

    if (card.source === 'scratch') {
      onSelect('scratch', null)
      onClose()
      return
    }

    if (card.source === 'satellite') {
      onSelect('satellite', SAMPLE_SATELLITE_URL)
      onClose()
      return
    }

    if (card.source === 'applicator_drawing' && applicatorAsset?.url) {
      onSelect('applicator_drawing', applicatorAsset.url)
      onClose()
      return
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isMobile}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: isMobile ? 0 : 3, overflow: 'hidden' },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2,
        }}
      >
        <Box>
          <Typography variant="h6" fontWeight={700}>
            Select a drawing type
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Choose the image to use as your markup base
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
            gap: { xs: 1.5, sm: 2.5 },
            mt: 1,
          }}
        >
          {cards.map((card) => (
            <Box
              key={card.source}
              onClick={() => handleSelect(card)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                cursor: card.disabled ? 'not-allowed' : 'pointer',
                opacity: card.disabled ? 0.55 : 1,
                transition: 'all 0.18s ease',
                '&:hover': card.disabled
                  ? {}
                  : {
                      borderColor: 'primary.main',
                      boxShadow: `0 0 0 2px ${theme.palette.primary.main}`,
                      transform: 'translateY(-2px)',
                    },
              }}
            >
              {/* Preview thumbnail */}
              <Box
                sx={{
                  height: 140,
                  bgcolor: card.previewBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {card.previewUrl ? (
                  <Box
                    component="img"
                    src={card.previewUrl}
                    alt={card.title}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      // If image fails to load, hide it and show icon
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                ) : (
                  // Dotted grid for "Draw from Scratch"
                  card.source === 'scratch' ? (
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage:
                          'radial-gradient(circle, #bdbdbd 1.5px, transparent 1.5px)',
                        backgroundSize: '18px 18px',
                      }}
                    />
                  ) : (
                    <Box sx={{ color: card.previewBg === '#1e2d3a' ? '#ccc' : '#aaa' }}>
                      {card.previewIcon}
                    </Box>
                  )
                )}
              </Box>

              {/* Label + action button */}
              <Box sx={{ p: 1.5, bgcolor: 'background.paper' }}>
                <Button
                  variant="outlined"
                  size="small"
                  fullWidth
                  disabled={card.disabled}
                  tabIndex={-1}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 500,
                    fontSize: '0.78rem',
                    borderRadius: 5,
                    pointerEvents: 'none', // card click handles it
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {card.disabled ? card.disabledReason! : card.title}
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  )
}
