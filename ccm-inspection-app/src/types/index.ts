export type InspectionStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Report Generated' | 'Requested' | 'Needs Follow-Up'
export type Brand = 'Bluey' | 'Yellowy'
export type Severity = 'Low' | 'Medium' | 'High' | 'Critical'
export type AnnotationType = 'pin' | 'free_draw' | 'line' | 'rectangle' | 'text' | 'numbered_callout'
export type AssetType = 'roof_photo' | 'satellite_image' | 'roof_drawing'
export type AwardStatus = 'Awarded' | 'Pending' | 'Not Awarded'

export interface Rep {
  id: string
  name: string
  email: string
}

export interface Contact {
  company: string
  city: string
  state: string
  phone: string
  email: string
  brand?: Brand
  role: 'owner' | 'roofer' | 'field_service_rep'
  outOfOffice?: boolean
  notes?: string
}

export interface AssemblyRequest {
  requestId: string
  letterStatus: 'Complete' | 'Pending' | 'In Review' | 'Not Required'
  reviewer: string
  requester: string
  letterUrl?: string
}

export interface Comment {
  id: string
  author: string
  date: string
  text: string
}

export interface RelatedDocument {
  id: string
  name: string
  type: string
  url: string
}

export interface Asset {
  id: string
  type: AssetType
  url: string
  label: string
}

export interface Markup {
  id: string
  annotationType: AnnotationType
  position: { x: number; y: number }
  endPosition?: { x: number; y: number }
  path?: { x: number; y: number }[]
  issueCategory: string
  severity: Severity | ''
  note: string
  label?: string
}

export interface InspectionVersion {
  id: string
  versionNumber: number
  createdDate: string
  createdBy: string
  status: InspectionStatus
  basedOnVersionId?: string
  markups: Markup[]
  reportUrl?: string
  assignedTo?: string
  inspectionDate?: string
  requester?: string
}

export interface Job {
  id: string
  jobNumber: string
  jobName: string
  assignedDate: string | null
  isScheduled: boolean
  scheduledTimeFrom?: string
  scheduledTimeTo?: string
  typeOfInspection: string
  membraneType: string
  totalSqFt: number
  city: string
  state: string
  roofer: string
  brand: Brand
  isEarlyBird: boolean
  inspectionStatus: InspectionStatus
  assemblyLetterStatus: string
  warrantyStatus: string
  awardStatus?: AwardStatus
  lastModified?: string
  jobStartDate?: string
  jobCompletionDate?: string
  contacts: Contact[]
  assemblyRequest?: AssemblyRequest
  comments: Comment[]
  relatedDocuments: RelatedDocument[]
  primaryAsset: Asset
  inspectionVersions: InspectionVersion[]
  coordinates: { lat: number; lng: number }
  repId: string | null
}

export interface FilterState {
  location: string
  typeOfInspection: string[]
  brand: Brand | ''
  earlyBird: 'all' | 'early_bird_only'
}

