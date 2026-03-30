export const ISSUE_CATEGORIES = [
  'Membrane Damage',
  'Seam / Joint Issue',
  'Flashing Issue',
  'Drainage / Ponding',
  'Penetration Issue',
  'Edge / Perimeter Issue',
  'Fastener / Attachment Issue',
  'Surface Wear / Deterioration',
  'Installation / Workmanship Concern',
  'Debris / Obstruction',
  'Safety Concern',
  'Other',
] as const

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number]

export const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'] as const
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number]

export const SEVERITY_CONFIG: Record<
  SeverityLevel,
  { color: string; bg: string; border: string; muiColor: 'success' | 'warning' | 'error' | 'default' }
> = {
  Low: { color: '#2E7D32', bg: '#E8F5E9', border: '#A5D6A7', muiColor: 'success' },
  Medium: { color: '#E65100', bg: '#FFF3E0', border: '#FFCC80', muiColor: 'warning' },
  High: { color: '#C62828', bg: '#FFEBEE', border: '#EF9A9A', muiColor: 'error' },
  Critical: { color: '#4A148C', bg: '#F3E5F5', border: '#CE93D8', muiColor: 'default' },
}

export const WIZARD_STEPS = ['Setup', 'Markup', 'Issue Details', 'Review', 'Generate Report'] as const
export type WizardStep = (typeof WIZARD_STEPS)[number]
