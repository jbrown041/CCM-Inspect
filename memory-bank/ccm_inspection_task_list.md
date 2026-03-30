# CCM Inspection App — Granular Task List Mapped to User Stories / Acceptance Criteria

## User Story Reference

### Epic 1 — Job Management and Planning
- **US1.1** View all upcoming jobs
- **US1.2** Filter jobs
- **US1.3** Search other reps’ jobs
- **US1.4** Schedule unscheduled jobs
- **US1.5** Sort jobs table
- **US1.6** View early bird jobs
- **US1.7** View jobs in table and map

### Epic 2 — Job Details
- **US2.1** View job details
- **US2.2** View inspection status
- **US2.3** Begin / resume inspection
- **US2.4** View inspection versions/history

### Epic 3 — Inspection Workflow
- **US3.1** Complete guided inspection wizard
- **US3.2** Mark up roof asset
- **US3.3** Generate, view, and download PDF report
- **US3.4** Create a new inspection version from a prior version

## 1. Foundations / Setup

### 1.1 Define prototype structure
**Maps to:** All user stories

- 1.1.1 Confirm screen inventory for the prototype
- 1.1.2 Define main navigation model across mobile, tablet, and desktop
- 1.1.3 Establish tablet-first responsive layout strategy
- 1.1.4 Confirm object model for jobs, reps, inspections, versions, reports, primary asset, comments, and documents
- 1.1.5 Create shared naming conventions for statuses, filters, and actions
- 1.1.6 Define which states must be represented visually in prototype vs noted as annotations

### 1.2 Establish UI framework / component direction
**Maps to:** All user stories

- 1.2.1 Define base MUI usage approach for prototype
- 1.2.2 Select core components for jobs table, filters, drawers/dialogs, stepper, chips/badges, version history, and date picker
- 1.2.3 Define reusable status chip patterns for Early Bird, Scheduled / Unscheduled, and Inspection Status
- 1.2.4 Define reusable responsive patterns for tablet split view, desktop expanded layout, and mobile stacked layout

## 2. Jobs Home / Table View

### 2.1 Define jobs landing experience
**Maps to:** US1.1

- 2.1.1 Design default landing page as **My Jobs**
- 2.1.2 Define page header content and actions
- 2.1.3 Define top control bar layout for search, filters, and view switch
- 2.1.4 Define default sort / default table state
- 2.1.5 Define empty state for no assigned jobs

### 2.2 Define jobs table structure
**Maps to:** US1.1, US1.5

- 2.2.1 Finalize required columns: Job Name, Assigned Date, Type of Inspection, Membrane Type, Total Square Ft, City, State, Roofer
- 2.2.2 Add supporting visible indicators for Brand, Early Bird, Inspection Status, and Scheduled / Unscheduled
- 2.2.3 Define row click behavior
- 2.2.4 Define hover / selected row state for tablet and desktop
- 2.2.5 Define tap behavior for mobile
- 2.2.6 Define overflow handling for long values
- 2.2.7 Define table pagination or scrolling behavior for prototype

### 2.3 Define table sorting
**Maps to:** US1.5

- 2.3.1 Identify which columns are sortable
- 2.3.2 Define sort affordance in header cells
- 2.3.3 Define ascending / descending state behavior
- 2.3.4 Define visual treatment for active sort
- 2.3.5 Confirm only one active sort is supported in prototype

## 3. Filters and Search

### 3.1 Define jobs filtering
**Maps to:** US1.2

- 3.1.1 Define filter set: Location, Type of Inspection, Brand, Early Bird
- 3.1.2 Define filter control type for each field
- 3.1.3 Define applied filter chip behavior
- 3.1.4 Define clear-one and clear-all behavior
- 3.1.5 Define filtered empty state
- 3.1.6 Define tablet/desktop filter panel layout
- 3.1.7 Define mobile filter bottom sheet layout

### 3.2 Define brand filtering
**Maps to:** US1.2

- 3.2.1 Configure brand as a single field
- 3.2.2 Define filter values: Bluey, Yellowy
- 3.2.3 Define whether brand is single-select or multi-select in prototype

### 3.3 Define Early Bird filtering
**Maps to:** US1.6

- 3.3.1 Define Early Bird as upstream read-only data
- 3.3.2 Define filter behavior for all jobs and early bird only
- 3.3.3 Define visual badge/chip treatment in list and details
- 3.3.4 Define visual emphasis for Early Bird in map pins

### 3.4 Define rep search
**Maps to:** US1.3

- 3.4.1 Design rep search field / autocomplete
- 3.4.2 Define results behavior when a rep is selected
- 3.4.3 Define read-only view state for another rep’s jobs
- 3.4.4 Add visible context label such as “Viewing John Smith’s Jobs”
- 3.4.5 Define “Return to My Jobs” interaction

## 4. Map and Planning Experience

### 4.1 Define table-to-map relationship
**Maps to:** US1.7

- 4.1.1 Define table/map toggle behavior
- 4.1.2 Define persistence of filters across both views
- 4.1.3 Define persistence of rep search across both views
- 4.1.4 Define selected job sync between table and map

### 4.2 Design tablet / desktop planning layout
**Maps to:** US1.7, US1.4

- 4.2.1 Design split layout with jobs list/table on left and map on right
- 4.2.2 Define row-to-pin highlight behavior
- 4.2.3 Define pin-to-row highlight behavior
- 4.2.4 Define selected job preview behavior
- 4.2.5 Define open job details from map interaction

### 4.3 Design mobile map flow
**Maps to:** US1.7

- 4.3.1 Define mobile map as separate full-screen view
- 4.3.2 Define selected pin bottom sheet preview
- 4.3.3 Define actions from selected pin: open details, schedule if unscheduled

## 5. Scheduling Unscheduled Jobs

### 5.1 Define unscheduled job treatment
**Maps to:** US1.4

- 5.1.1 Define visual treatment for unscheduled jobs in table
- 5.1.2 Define visual treatment for unscheduled jobs in map
- 5.1.3 Define scheduling CTA placement in row and/or details page

### 5.2 Design scheduling interaction
**Maps to:** US1.4

- 5.2.1 Design Schedule Job modal / drawer
- 5.2.2 Define included fields: job summary, assigned rep, date picker, quick picks
- 5.2.3 Define save interaction
- 5.2.4 Define cancel interaction
- 5.2.5 Define success state after save
- 5.2.6 Define error state if scheduling fails
- 5.2.7 Define immediate table refresh / status update after save

## 6. Job Details Page

### 6.1 Define information architecture for job details
**Maps to:** US2.1

- 6.1.1 Define page layout for tablet
- 6.1.2 Define mobile stacked layout
- 6.1.3 Group content into Job Summary, Status and Priority, Context, and Inspection Actions

### 6.2 Define job summary section
**Maps to:** US2.1

- 6.2.1 Add core job fields to summary section
- 6.2.2 Determine label/value hierarchy and scan pattern
- 6.2.3 Define location display pattern
- 6.2.4 Define brand display pattern

### 6.3 Define status and priority section
**Maps to:** US2.1, US2.2, US1.6

- 6.3.1 Add inspection status section
- 6.3.2 Add Early Bird badge
- 6.3.3 Add assembly letter status
- 6.3.4 Add warranty status
- 6.3.5 Define missing-data states for warranty or assembly info

### 6.4 Define context section
**Maps to:** US2.1

- 6.4.1 Design comments display area
- 6.4.2 Design empty comments state
- 6.4.3 Design related documents list
- 6.4.4 Define document open/view interaction
- 6.4.5 Design empty documents state

## 7. Inspection Status and Version History

### 7.1 Define inspection status model
**Maps to:** US2.2

- 7.1.1 Finalize statuses: Not Started, In Progress, Completed, Report Generated
- 7.1.2 Define status chip treatment
- 7.1.3 Define where status appears: jobs table, job details, versions list

### 7.2 Define inspection version history UI
**Maps to:** US2.4

- 7.2.1 Add Inspection Versions section to job details
- 7.2.2 Define row/card structure for each version: version number, created date, created by, status, actions
- 7.2.3 Define version list sorting, with most recent first recommended
- 7.2.4 Define empty state when no versions exist

### 7.3 Define version actions
**Maps to:** US2.3, US2.4, US3.4

- 7.3.1 Add action to start brand-new inspection
- 7.3.2 Add action to resume in-progress inspection
- 7.3.3 Add action to view completed version
- 7.3.4 Add action to view report
- 7.3.5 Add action to create new version from prior version

## 8. Start / Resume Inspection Entry Points

### 8.1 Define inspection launch logic
**Maps to:** US2.3

- 8.1.1 Define primary CTA when no inspections exist
- 8.1.2 Define primary CTA when one in-progress inspection exists
- 8.1.3 Define CTA behavior when multiple prior completed versions exist
- 8.1.4 Define CTA copy for Start Inspection, Resume Inspection, and Create New Version

### 8.2 Define “new version from prior version” flow
**Maps to:** US3.4

- 8.2.1 Define entry point from version history
- 8.2.2 Define whether user confirms carry-forward behavior
- 8.2.3 Define banner/message indicating “based on Version X”
- 8.2.4 Define new version numbering behavior in UI
- 8.2.5 Define read-only treatment for prior version source

## 9. Inspection Wizard

### 9.1 Define wizard structure
**Maps to:** US3.1

- 9.1.1 Finalize wizard steps: Setup, Markup, Issue Details, Review, Generate Report
- 9.1.2 Design stepper / progress component
- 9.1.3 Define next/back button placement
- 9.1.4 Define exit / cancel behavior
- 9.1.5 Define required-field logic by step
- 9.1.6 Define review-before-submit rule

### 9.2 Design Setup step
**Maps to:** US3.1

- 9.2.1 Display job context at top of step
- 9.2.2 Display inspection version context
- 9.2.3 Display primary asset information
- 9.2.4 Define confirm-and-continue behavior

### 9.3 Design Review step
**Maps to:** US3.1, US3.3

- 9.3.1 Aggregate all findings and metadata for review
- 9.3.2 Show markup summary
- 9.3.3 Show issue category + severity + notes summary
- 9.3.4 Provide edit entry points back to previous steps
- 9.3.5 Define Generate Report CTA

## 10. Markup Experience

### 10.1 Define markup canvas structure
**Maps to:** US3.2

- 10.1.1 Define tablet canvas layout
- 10.1.2 Define desktop canvas layout
- 10.1.3 Define mobile full-screen canvas layout
- 10.1.4 Define zoom/pan controls
- 10.1.5 Define active-tool state behavior

### 10.2 Define markup toolset
**Maps to:** US3.2

- 10.2.1 Add pin tool
- 10.2.2 Add free draw tool
- 10.2.3 Add line tool
- 10.2.4 Add rectangle tool
- 10.2.5 Add text/note tool
- 10.2.6 Add numbered callout tool

### 10.3 Define annotation data model in the UI
**Maps to:** US3.1, US3.2

- 10.3.1 Define fields attached to each markup: annotation type, location on asset, issue category, severity, note
- 10.3.2 Define annotation selected state
- 10.3.3 Define edit annotation behavior
- 10.3.4 Define delete annotation behavior
- 10.3.5 Define behavior when user creates markup but leaves issue details incomplete

## 11. Issue Details and Taxonomy

### 11.1 Define issue category choices
**Maps to:** US3.1, US3.2

- 11.1.1 Add issue category list: Membrane Damage, Seam / Joint Issue, Flashing Issue, Drainage / Ponding, Penetration Issue, Edge / Perimeter Issue, Fastener / Attachment Issue, Surface Wear / Deterioration, Installation / Workmanship Concern, Debris / Obstruction, Safety Concern, Other
- 11.1.2 Define selection control pattern
- 11.1.3 Define “Other” behavior

### 11.2 Define severity choices
**Maps to:** US3.1, US3.3

- 11.2.1 Add severity levels: Low, Medium, High, Critical
- 11.2.2 Define severity control pattern
- 11.2.3 Define visual treatment for each severity level in wizard and report preview

### 11.3 Define notes behavior
**Maps to:** US3.1, US3.2, US3.3

- 11.3.1 Define note input field
- 11.3.2 Define whether notes are required or optional in prototype
- 11.3.3 Define note display in review step
- 11.3.4 Define note display in report

## 12. Report Generation and Viewer

### 12.1 Define report generation step
**Maps to:** US3.3

- 12.1.1 Design Generate Report step / action
- 12.1.2 Define success state after generation
- 12.1.3 Define failure/error note for prototype annotations if needed
- 12.1.4 Update inspection status after report generation

### 12.2 Define in-app report viewer
**Maps to:** US3.3

- 12.2.1 Design report preview screen/modal
- 12.2.2 Define page navigation within report preview
- 12.2.3 Add Download PDF CTA
- 12.2.4 Add Back to Job Details CTA
- 12.2.5 Define version metadata displayed in viewer

### 12.3 Define report layout and content
**Maps to:** US3.3

- 12.3.1 Design cover page with report title, job name / ID, location, generated date, version number, rep name, and branding
- 12.3.2 Design job and inspection summary page/section
- 12.3.3 Design findings summary section
- 12.3.4 Design findings grouped by severity: Critical, High, Medium, Low
- 12.3.5 Design marked-up visuals section
- 12.3.6 Design additional notes / observations section
- 12.3.7 Confirm all user-entered inspection content appears somewhere in report

## 13. Responsive and Cross-Screen QA Tasks

### 13.1 Mobile responsiveness
**Maps to:** All relevant stories

- 13.1.1 Adapt jobs table to mobile
- 13.1.2 Adapt filters to bottom sheet
- 13.1.3 Adapt map to full-screen mobile view
- 13.1.4 Adapt job details to stacked layout
- 13.1.5 Adapt wizard to smaller viewport
- 13.1.6 Adapt markup toolbar for mobile

### 13.2 Tablet optimization
**Maps to:** All relevant stories

- 13.2.1 Optimize touch target sizes
- 13.2.2 Optimize split planning layout
- 13.2.3 Optimize markup canvas for tablet
- 13.2.4 Validate drawer/modal sizing for tablet

### 13.3 Desktop adaptation
**Maps to:** All relevant stories

- 13.3.1 Expand layouts appropriately
- 13.3.2 Preserve tablet interaction model where helpful
- 13.3.3 Add more spacious side-by-side content where useful

## 14. States and Edge Cases

### 14.1 Jobs states
**Maps to:** US1.1–US1.7

- 14.1.1 No jobs assigned
- 14.1.2 No results after filters
- 14.1.3 Viewing another rep’s jobs
- 14.1.4 Scheduled vs unscheduled visual states
- 14.1.5 Early Bird highlighted state

### 14.2 Job details states
**Maps to:** US2.1–US2.4

- 14.2.1 Missing warranty data
- 14.2.2 No comments
- 14.2.3 No related documents
- 14.2.4 No inspections started
- 14.2.5 Multiple completed versions
- 14.2.6 In-progress version exists

### 14.3 Inspection states
**Maps to:** US3.1–US3.4

- 14.3.1 No markups yet
- 14.3.2 Markup created but missing issue details
- 14.3.3 Review step with incomplete required info
- 14.3.4 Report successfully generated
- 14.3.5 New version created from prior version

## 15. Suggested Delivery Order

### Phase 1 — Core planning experience
- Foundations
- Jobs table
- Sorting
- Filters
- Rep search
- Early Bird treatment
- Map/table relationship
- Scheduling

### Phase 2 — Job review experience
- Job details
- Status section
- Documents/comments
- Inspection entry points
- Version history

### Phase 3 — Inspection flow
- Wizard structure
- Setup step
- Markup canvas
- Issue details
- Review step

### Phase 4 — Output
- Report generation
- Report preview
- Download flow
- Severity-grouped report layout

### Phase 5 — Polish
- Responsive refinements
- Edge states
- Prototype annotations
- Handoff notes
