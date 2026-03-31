import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Radio,
  RadioGroup,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import PolicyOutlinedIcon from '@mui/icons-material/PolicyOutlined'
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined'
import TourOutlinedIcon from '@mui/icons-material/TourOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'

type Section = 'menu' | 'profile' | 'language' | 'find-rep' | 'privacy' | 'terms' | 'app-tour'

const MENU_ITEMS: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'profile', label: 'Profile settings', icon: <PersonOutlinedIcon fontSize="small" /> },
  { id: 'language', label: 'Language', icon: <LanguageIcon fontSize="small" /> },
  { id: 'find-rep', label: 'Find a Representative', icon: <PeopleOutlineIcon fontSize="small" /> },
  { id: 'privacy', label: 'Privacy Policy', icon: <PolicyOutlinedIcon fontSize="small" /> },
  { id: 'terms', label: 'Terms & Conditions', icon: <GavelOutlinedIcon fontSize="small" /> },
  { id: 'app-tour', label: 'App Tour', icon: <TourOutlinedIcon fontSize="small" /> },
]

const MOCK_REPS = [
  { id: 1, name: 'Marcus Williams', initials: 'MW', status: 'Available', miles: '2.4 mi', color: '#1565C0' },
  { id: 2, name: 'Priya Patel', initials: 'PP', status: 'Available', miles: '5.1 mi', color: '#388E3C' },
  { id: 3, name: 'Jordan Lee', initials: 'JL', status: 'Away', miles: '8.7 mi', color: '#F57C00' },
  { id: 4, name: 'Taylor Brooks', initials: 'TB', status: 'Available', miles: '12.3 mi', color: '#7B1FA2' },
  { id: 5, name: 'Alex Rivera', initials: 'AR', status: 'Away', miles: '15.0 mi', color: '#C62828' },
]

const PRIVACY_POLICY = `Privacy Policy & Cookie Notice Summary

Effective Date: January 1, 2026

We are committed to protecting your personal information and your right to privacy. This summary explains how we collect, use, and protect your data when you use the Radius Inspection platform.

What we collect
We collect information you provide directly, such as account registration details, transaction history, and communication preferences. We also collect usage data automatically, including device information and log data.

How we use it
Your information is used to provide and improve our services, process inspections and reports, communicate with you about your account, and comply with legal obligations.

Cookies & Tracking
We use essential cookies to keep you signed in and remember your preferences. Depending on your settings, we may also use analytics cookies to understand usage patterns. You can manage cookie settings at any time.

Your choices & rights
You can access, update, or delete your personal data at any time through your account settings. You may also opt out of non-essential communications by updating your notification preferences.

Security & Retention
We use industry-standard safeguards to protect personal data from unauthorized access or disclosure. We retain your data only as long as necessary for the purposes described above or as required by law.

Contact
For questions about this policy, contact us at privacy@radius-inspect.com`

const TERMS = `Terms & Conditions

Last Updated: January 1, 2026

By accessing or using the Radius Inspection platform, you agree to be bound by these Terms. Please read them carefully.

1. Use of Service
You may use the platform only for lawful purposes and in accordance with these Terms. You agree not to misuse the service or attempt to access it using a method other than the interface we provide.

2. Accounts
You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.

3. Inspections & Reports
Inspection reports generated through the platform are intended for professional use. Radius is not liable for decisions made based on report content.

4. Intellectual Property
All content, features, and functionality of the platform are owned by Radius and protected by copyright, trademark, and other intellectual property laws.

5. Limitation of Liability
Radius shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.

6. Changes
We reserve the right to modify these Terms at any time. Your continued use of the platform after changes constitutes acceptance of the new Terms.

For questions contact legal@radius-inspect.com`

// ── Sections ─────────────────────────────────────────────────────────────────

function ProfileSection() {
  const [firstName, setFirstName] = useState('Chris')
  const [lastName, setLastName] = useState('Longacre')
  const [email, setEmail] = useState('chris.longacre@ccm.com')
  const [phone, setPhone] = useState('132-131-1255')
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Box sx={{ maxWidth: 520 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Personal Information</Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
        <TextField
          label="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          size="small"
          fullWidth
        />
        <TextField
          label="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          size="small"
          fullWidth
        />
      </Box>
      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        size="small"
        fullWidth
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{ mr: 1.5, fontWeight: 600 }}
      >
        {saved ? 'Saved!' : 'Save changes'}
      </Button>

      <Divider sx={{ my: 4 }} />

      <Typography variant="subtitle2" fontWeight={700} mb={1}>Coverage</Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Protect your projects with comprehensive roofing inspection insurance.
      </Typography>
      <Button variant="outlined" color="primary" sx={{ fontWeight: 600 }}>
        Buy Insurance
      </Button>
    </Box>
  )
}

function LanguageSection() {
  const [lang, setLang] = useState('en')
  return (
    <Box sx={{ maxWidth: 380 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Language</Typography>
      <RadioGroup value={lang} onChange={(e) => setLang(e.target.value)}>
        {[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Español' },
          { value: 'fil', label: 'Filipino' },
        ].map((option) => (
          <Box
            key={option.value}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
              borderRadius: 2,
              mb: 1,
              border: '1px solid',
              borderColor: lang === option.value ? 'primary.main' : 'divider',
              bgcolor: lang === option.value ? 'primary.50' : 'transparent',
              cursor: 'pointer',
            }}
            onClick={() => setLang(option.value)}
          >
            <Typography fontWeight={lang === option.value ? 600 : 400}>
              {option.label}
            </Typography>
            <Radio value={option.value} size="small" />
          </Box>
        ))}
      </RadioGroup>
    </Box>
  )
}

function FindRepSection() {
  const [subscribed, setSubscribed] = useState<number[]>([])
  const toggle = (id: number) =>
    setSubscribed((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <Box sx={{ maxWidth: 640 }}>
      <Typography variant="h6" fontWeight={700} mb={1}>Find a Representative</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Connect with a CCM representative near you.
      </Typography>

      {/* Table header */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 120px', gap: 1, px: 2, pb: 1 }}>
        {['Name', 'Status', 'Miles', ''].map((h) => (
          <Typography key={h} variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {h}
          </Typography>
        ))}
      </Box>
      <Divider />

      {MOCK_REPS.map((rep) => (
        <Box key={rep.id} sx={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 120px', gap: 1, alignItems: 'center', px: 2, py: 1.5, '&:not(:last-child)': { borderBottom: '1px solid', borderColor: 'divider' } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: rep.color, fontSize: '0.75rem', fontWeight: 700 }}>
              {rep.initials}
            </Avatar>
            <Typography variant="body2" fontWeight={500}>{rep.name}</Typography>
          </Box>
          <Chip
            label={rep.status}
            size="small"
            sx={{
              bgcolor: rep.status === 'Available' ? '#DCFCE7' : '#FEF3C7',
              color: rep.status === 'Available' ? '#166534' : '#B45309',
              fontWeight: 600,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
          <Typography variant="body2" color="text.secondary">{rep.miles}</Typography>
          <Button
            size="small"
            variant={subscribed.includes(rep.id) ? 'contained' : 'outlined'}
            onClick={() => toggle(rep.id)}
            sx={{ fontWeight: 600, fontSize: '0.75rem', px: 1.5 }}
          >
            {subscribed.includes(rep.id) ? 'Subscribed' : 'Subscribe'}
          </Button>
        </Box>
      ))}
    </Box>
  )
}

function TextContentSection({ title, body }: { title: string; body: string }) {
  return (
    <Box sx={{ maxWidth: 640 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>{title}</Typography>
      <Box
        sx={{
          bgcolor: '#F8FAFF',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          p: 3,
          maxHeight: 'calc(100vh - 260px)',
          overflowY: 'auto',
        }}
      >
        {body.split('\n\n').map((para, i) => (
          para.trim() ? (
            <Typography
              key={i}
              variant={i === 0 ? 'subtitle1' : 'body2'}
              fontWeight={i === 0 ? 700 : 400}
              color={i === 0 ? 'text.primary' : 'text.secondary'}
              mb={1.5}
              sx={{ lineHeight: 1.7 }}
            >
              {para.trim()}
            </Typography>
          ) : null
        ))}
      </Box>
    </Box>
  )
}

function AppTourSection() {
  return (
    <Box sx={{ maxWidth: 420 }}>
      <Typography variant="h6" fontWeight={700} mb={2}>App Tour</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Get a guided walkthrough of the key features in the Radius Inspection app.
      </Typography>
      <Button variant="contained" sx={{ fontWeight: 600 }}>Start Tour</Button>
    </Box>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [section, setSection] = useState<Section>('menu')

  const showMenu = !isMobile || section === 'menu'
  const showContent = !isMobile || section !== 'menu'

  const activeItem = MENU_ITEMS.find((m) => m.id === section)

  function renderContent() {
    switch (section) {
      case 'profile': return <ProfileSection />
      case 'language': return <LanguageSection />
      case 'find-rep': return <FindRepSection />
      case 'privacy': return <TextContentSection title="Privacy Policy" body={PRIVACY_POLICY} />
      case 'terms': return <TextContentSection title="Terms & Conditions" body={TERMS} />
      case 'app-tour': return <AppTourSection />
      default: return null
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* ── Header ── */}
      <Box
        sx={{
          flexShrink: 0,
          bgcolor: '#1A3A6B',
          background: 'linear-gradient(135deg, #1A3A6B 0%, #1565C0 100%)',
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.2)', fontSize: '0.85rem', fontWeight: 700 }}>
            CL
          </Avatar>
          <Typography variant="subtitle1" fontWeight={700} color="white">
            Chris Longacre
          </Typography>
        </Box>
        <Button
          size="small"
          startIcon={<LogoutIcon fontSize="small" />}
          sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)', border: '1px solid', fontWeight: 600, '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          Log out
        </Button>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Left menu */}
        {showMenu && (
          <Box
            sx={{
              width: isMobile ? '100%' : 260,
              flexShrink: 0,
              borderRight: isMobile ? 'none' : '1px solid',
              borderColor: 'divider',
              overflowY: 'auto',
              py: 1,
            }}
          >
            <Typography variant="overline" color="text.secondary" sx={{ px: 2, pt: 1, pb: 0.5, display: 'block', letterSpacing: '0.1em' }}>
              Menu
            </Typography>
            <List disablePadding>
              {MENU_ITEMS.map((item) => (
                <ListItemButton
                  key={item.id}
                  selected={!isMobile && section === item.id}
                  onClick={() => setSection(item.id)}
                  sx={{
                    px: 2,
                    py: 1.25,
                    borderRadius: 1.5,
                    mx: 0.5,
                    '&.Mui-selected': { bgcolor: '#EBF2FF', '& .MuiListItemText-primary': { color: 'primary.main', fontWeight: 600 } },
                    '&.Mui-selected:hover': { bgcolor: '#DBEAFE' },
                  }}
                >
                  <Box sx={{ mr: 1.5, color: section === item.id ? 'primary.main' : 'text.secondary', display: 'flex' }}>
                    {item.icon}
                  </Box>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: section === item.id ? 600 : 400 }}
                  />
                  <ChevronRightIcon fontSize="small" sx={{ color: 'text.disabled' }} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}

        {/* Right content */}
        {showContent && section !== 'menu' && (
          <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 4 } }}>
            {/* Back button (mobile only) */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton size="small" onClick={() => setSection('menu')} sx={{ mr: 1 }}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Typography variant="subtitle1" fontWeight={600}>{activeItem?.label}</Typography>
              </Box>
            )}
            {renderContent()}
          </Box>
        )}
      </Box>
    </Box>
  )
}
