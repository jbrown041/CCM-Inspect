# CCM Inspection App — Design Doc v3

## 1. Purpose

The CCM Inspection App is a **tablet-first responsive prototype** for field service reps to:
- manage and prioritize jobs
- plan schedules using both table and map views
- review job details
- complete inspections through a guided wizard
- generate polished, client-facing PDF reports

The experience supports **mobile, tablet, and desktop**, with the strongest and most complete interaction model designed for **tablet**.

## 2. Locked Product / UX Decisions

### Early Bird jobs
- A job is labeled **Early Bird** when it was marked that way at creation in a different platform.
- This app does **not** need to support creating or editing the Early Bird designation.
- The app only needs to **display** and **filter by** that designation.

### Brand
- There is a single **Brand** field.
- The only values are:
  - **Bluey**
  - **Yellowy**

### Inspection versioning
- A job can have **multiple inspection versions**.
- A rep can create a **new inspection version from a prior version**.
- This means the design should support both:
  - starting a brand-new inspection
  - using a prior version as the starting point for a new one

### Asset model
- Each job has **one primary asset** to inspect and mark up.

### Report structure
- The PDF should be **polished and client-facing**.
- The report should include **everything the rep entered**.
- The report should begin with a **cover-style first section**.
- Findings in the report should be grouped by **severity**.

## 3. Jobs Experience

### 3.1 Default Landing
Users land on **My Jobs** in **table view**.

This is the operational home base of the app.

### 3.2 Jobs Table Columns
Required columns:
- Job Name
- Assigned Date
- Type of Inspection
- Membrane Type
- Total Square Ft
- City
- State
- Roofer

Recommended additional visible columns / indicators:
- Brand
- Inspection Status
- Early Bird
- Scheduled / Unscheduled

### 3.3 Filters
The jobs experience should support:
- Location
- Type of Inspection
- Brand
- Early Bird

#### Brand filter behavior
Brand should behave as a simple filter with:
- Bluey
- Yellowy

#### Early Bird filter behavior
Early Bird should behave as:
- All jobs
- Early Bird only

### 3.4 Rep search
- Users can search another rep’s name.
- Viewing another rep’s jobs is **read-only**.
- The UI should clearly indicate when the user is no longer in “My Jobs” and is instead viewing another rep’s workload.

## 4. Planning Experience

### 4.1 Role of Map View
Map view is primarily a **planning tool**.

Its core purpose is to help reps:
- see job proximity
- plan efficient scheduling
- understand geographic clustering

### 4.2 Recommended tablet / desktop pattern
For tablet and desktop, use a **split planning layout**:
- left side: jobs list/table
- right side: map

This should allow:
- selecting a row to highlight a pin
- selecting a pin to highlight a row
- keeping filters and search persistent across both views

### 4.3 Mobile pattern
For mobile:
- table and map should be separate views
- selected pins should open a bottom sheet or preview card

## 5. Scheduling Experience

### 5.1 Recommended pattern
Use a **Schedule Job drawer/modal** with a date picker.

This is the best fit for a prototype because it is:
- easy to understand
- fast to interact with
- responsive across breakpoints
- lighter weight than building a full weekly planner

### 5.2 Scheduling flow
1. User selects an unscheduled job.
2. User taps **Schedule Job**.
3. A drawer/modal opens with:
   - job summary
   - assigned rep
   - date picker
   - quick-pick date shortcuts
4. User saves.
5. Job changes from unscheduled to scheduled.

## 6. Job Details Experience

### 6.1 Purpose
The Job Details page should give reps everything they need before beginning the inspection.

### 6.2 Content structure

#### Section A — Job Summary
- Job Name
- Assigned Date
- Type of Inspection
- Membrane Type
- Total Square Ft
- City
- State
- Roofer
- Brand

#### Section B — Status and Priority
- Inspection Status
- Early Bird badge
- Assembly Letter Status
- Warranty Status

#### Section C — Context
- Comments
- Related Documents

#### Section D — Inspection Actions
- Start New Inspection
- Resume In-Progress Inspection
- View Prior Versions
- Create New Version from Prior Inspection
- View Generated Reports

## 7. Inspection Versioning Model

This is one of the most important parts of the design.

### 7.1 Version history pattern
Each job should have an **Inspection Versions** section showing:
- Version number
- Created date
- Created by
- Status
- View report
- Resume
- Create new version from this version

### 7.2 Recommended actions
For each prior version, the rep should be able to:
- open it
- review it
- generate a **new version based on it**

### 7.3 UX behavior for “new version from prior version”
When a rep creates a new version from a prior version:
- the prior inspection acts as the starting point
- markups, notes, and findings may be preloaded into the new draft version
- the new version is clearly assigned a new version number
- the old version remains unchanged and viewable

### 7.4 Status treatment
Use a clear status treatment:
- Not Started
- In Progress
- Completed
- Report Generated

Use version labels such as:
- v1
- v2
- v3

## 8. Inspection Wizard

### 8.1 Recommended steps

#### Step 1 — Setup
- confirm job
- confirm inspection version context
- confirm asset

#### Step 2 — Markup
- interact with the primary roof asset
- add visual annotations

#### Step 3 — Issue Details
- assign issue category
- assign severity
- add notes

#### Step 4 — Review
- review all markups and associated issue details

#### Step 5 — Generate Report
- create client-facing PDF
- preview in app
- download

### 8.2 Important version-aware behavior
When the inspection was started from a prior version:
- the wizard should indicate that this is a **new version based on Version X**
- the rep should understand what content has been carried forward

A small banner or metadata row at the top would help.

## 9. Markup Experience

### 9.1 Required tools
The markup canvas should support:
- pin
- free draw
- line
- rectangle
- text/note
- numbered callout

### 9.2 Recommended layout

#### Tablet / desktop
- large center canvas
- side toolbar
- issue details panel

#### Mobile
- full-screen canvas
- compact toolbar
- issue detail bottom sheet

### 9.3 Markup object model
Each markup should be able to store:
- annotation type
- position on asset
- issue category
- severity
- note / description

That structure will make the report output much cleaner.

## 10. Proposed Issue Taxonomy

### 10.1 Categories
Recommended categories:
- Membrane Damage
- Seam / Joint Issue
- Flashing Issue
- Drainage / Ponding
- Penetration Issue
- Edge / Perimeter Issue
- Fastener / Attachment Issue
- Surface Wear / Deterioration
- Installation / Workmanship Concern
- Debris / Obstruction
- Safety Concern
- Other

### 10.2 Severity
Recommended severity scale:
- Low
- Medium
- High
- Critical

### 10.3 Why this works
This taxonomy is broad enough for a prototype, easy for reps to understand, and works well in a client-facing report grouped by severity.

## 11. Report Design

### 11.1 Report goal
The PDF should feel polished enough to hand to a client.

### 11.2 Report structure

#### Section 1 — Cover Page
This should act as a polished cover-style entry page and include:
- report title
- job name / ID
- client or site name if applicable
- location
- date generated
- inspection version number
- rep name
- branding

#### Section 2 — Job and Inspection Summary
- job details
- inspection metadata
- brand
- membrane type
- square footage
- status indicators as needed

#### Section 3 — Findings Summary
- high-level summary of findings
- count of findings by severity

#### Section 4 — Findings Grouped by Severity
Recommended order:
1. Critical
2. High
3. Medium
4. Low

Under each severity group:
- issue title or label
- category
- note
- associated markup image/callout

#### Section 5 — Marked-Up Visuals
- primary asset image(s)
- annotations visible
- numbered callouts tied back to findings

#### Section 6 — Additional Notes / Observations
- any general notes entered during inspection

### 11.3 Version visibility
The report should always clearly show:
- inspection version number
- date generated
- job name / ID

Because multiple versions exist, this is important to avoid confusion.

## 12. MUI Component Direction

Use the latest MUI for component guidance.

### Recommended component mapping
- `DataGrid` for jobs list
- `Drawer` or `Dialog` for scheduling and filters
- `Autocomplete` for rep search
- `Select` / `TextField` for filters
- `Chip` / `Badge` for Early Bird and status
- `Stepper` for inspection wizard
- `Card`, `Accordion`, `List`, `Divider` for job details and version history
- `Tabs` or `ToggleButtonGroup` for table/map switching

### Practical MUI recommendation
For this prototype, keep the design system:
- clean
- touch-friendly
- fairly standard MUI
- lightly branded rather than heavily customized

That keeps the focus on validating workflow and structure instead of custom visual engineering.

## 13. States to Represent in Design

### Jobs
- no jobs
- filtered empty state
- unscheduled job
- scheduled job
- early bird job
- another rep’s jobs in read-only mode

### Job Details
- no comments
- no related documents
- no inspection yet
- multiple versions available
- one in-progress version
- report generated

### Inspection
- brand-new version
- new version created from prior version
- no markups yet
- markups with missing details
- completed review
- report generated

## 14. Recommended Next Design Deliverables

1. **Screen inventory**  
   A list of every screen / modal / drawer needed.

2. **Primary user flows**  
   A clean flow for:
   - plan jobs
   - review job
   - start inspection
   - create new version from prior version
   - generate report

3. **Wireframe requirements**  
   Per screen:
   - components
   - interactions
   - states
   - responsive notes

4. **Report template concept**  
   A low-fidelity structure of the PDF pages.

## 15. Open Questions Remaining

- Should the app allow only one **in-progress** inspection version at a time per job?
- When creating a new version from a prior version, should all old findings be copied by default, or should the rep choose what to carry over?
- Should Early Bird have a stronger visual treatment than a standard chip?
- Should the report cover page include photos / imagery or stay mostly text-and-branding?
