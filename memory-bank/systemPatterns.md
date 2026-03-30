# CCM Inspection App — System Patterns

## Application Structure

### Screen Hierarchy
```
App
├── Jobs Home (My Jobs)
│   ├── Table View
│   └── Map View (split layout on tablet/desktop)
├── Job Details
│   ├── Job Summary
│   ├── Status & Priority
│   ├── Context (comments, documents)
│   └── Inspection Actions / Version History
└── Inspection Wizard
    ├── Step 1: Setup
    ├── Step 2: Markup
    ├── Step 3: Issue Details
    ├── Step 4: Review
    └── Step 5: Generate Report
        └── Report Preview / Download
```

## Data / Object Model

### Job
- Job Name
- Assigned Date
- Type of Inspection
- Membrane Type
- Total Square Ft
- City / State
- Roofer
- Brand (Bluey | Yellowy)
- Early Bird (boolean, read-only upstream)
- Scheduled / Unscheduled status
- Location (coordinates for map)
- Assembly Letter Status
- Warranty Status
- Comments []
- Related Documents []
- Primary Asset (one per job)
- Inspection Versions []

### Inspection Version
- Version Number (v1, v2, v3…)
- Created Date
- Created By (rep)
- Status: Not Started | In Progress | Completed | Report Generated
- Based On Version (optional, if branched from prior)
- Markups []
- Generated Report (optional PDF reference)

### Markup / Annotation
- Annotation Type (pin | free draw | line | rectangle | text | numbered callout)
- Position on Asset
- Issue Category (see taxonomy)
- Severity (Low | Medium | High | Critical)
- Note / Description

### Primary Asset
- One per job
- Types: roof photo | satellite image | roof drawing/plan

## Key Design Patterns

### Jobs Table
- MUI `DataGrid`
- Sortable columns
- Status chips and Early Bird badges inline
- Row click → Job Details

### Jobs Map (Tablet/Desktop)
- Split layout: table/list on left, map on right
- Row ↔ pin highlight sync
- Filters persist across both views

### Jobs Map (Mobile)
- Full-screen separate view
- Selected pin → bottom sheet preview

### Scheduling
- MUI `Drawer` or `Dialog`
- Contains: job summary, assigned rep, date picker, quick-pick shortcuts
- On save: job moves to scheduled state

### Filters
- Tablet/desktop: side panel
- Mobile: bottom sheet
- Applied filters shown as dismissible chips
- Clear-one and clear-all supported
- Filter set: Location, Type of Inspection, Brand, Early Bird

### Rep Search
- MUI `Autocomplete`
- Selecting a rep → read-only view of their jobs
- Visible banner: "Viewing [Rep Name]'s Jobs"
- One-tap return to My Jobs

### Job Details Page Layout
- **Tablet**: two-column or card-based layout
- **Mobile**: stacked sections
- Sections: Job Summary | Status & Priority | Context | Inspection Actions

### Inspection Version History
- List/card per version
- Shows: version number, created date, created by, status
- Actions per version: view, resume (if In Progress), create new version from this, view report

### Inspection Wizard
- MUI `Stepper` (linear)
- Steps: Setup → Markup → Issue Details → Review → Generate Report
- Forward/back navigation
- Progress always visible
- Required fields block forward progression
- If branched from prior version: banner indicates "New version based on Version X"

### Markup Canvas
- **Tablet/desktop**: large center canvas + side toolbar + issue details panel
- **Mobile**: full-screen canvas + compact toolbar + issue detail bottom sheet
- Tools: pin, free draw, line, rectangle, text/note, numbered callout
- Each markup opens issue details form (category, severity, note)
- Markups can be edited or deleted before finalization

### Report PDF Structure
1. Cover Page (title, job name/ID, location, date, version, rep, branding)
2. Job & Inspection Summary
3. Findings Summary (count by severity)
4. Findings Grouped by Severity: Critical → High → Medium → Low
5. Marked-Up Visuals (annotated asset images with numbered callouts)
6. Additional Notes / Observations

### Status Chips
Consistent status patterns across the app:
- **Inspection Status**: Not Started | In Progress | Completed | Report Generated
- **Job Scheduled Status**: Scheduled | Unscheduled
- **Early Bird**: badge/chip (read-only)

## Issue Taxonomy

### Categories
Membrane Damage, Seam / Joint Issue, Flashing Issue, Drainage / Ponding, Penetration Issue, Edge / Perimeter Issue, Fastener / Attachment Issue, Surface Wear / Deterioration, Installation / Workmanship Concern, Debris / Obstruction, Safety Concern, Other

### Severity
Low | Medium | High | Critical

## Responsive Strategy

| Breakpoint | Layout Approach |
|---|---|
| Mobile | Stacked layouts, full-screen map, bottom sheets for drawers/filters, compact toolbar |
| Tablet | Primary target: split planning layout, side panels, touch-optimized targets |
| Desktop | Expanded from tablet; more spacious side-by-side content |
