# CCM Inspection App — Product Requirements Document (PRD)

## Product Overview

**Product Name:** CCM Inspection App

**Product Goal:**  
Allow field service reps to efficiently manage their jobs, view and prioritize upcoming work, conduct roof inspections, and generate/share inspection reports.

## Problem Statement

Field service reps need a simple way to manage their workload and complete inspections from the field. Job visibility, prioritization, and inspection reporting are often fragmented or manual, making it harder to plan work, execute inspections, and deliver timely outputs.

## Primary Users

### Primary User
**Field Service Rep**
- Views assigned and unassigned jobs
- Plans weekly work
- Reviews job details
- Conducts inspections
- Generates and downloads reports

### Secondary User
**Field Service Manager / Other Rep**
- May need visibility into other reps’ jobs
- May review inspection progress and outputs

## Core Features / Epics

### Epic 1: Job Management and Planning

#### User Story 1.1
As a field service rep, I want to see all of my upcoming jobs so that I can plan and manage my work.

**Acceptance Criteria**
- The user can access a jobs list from the main app entry point.
- The jobs list includes both **scheduled** and **unscheduled** jobs.
- Each job row displays key summary information at minimum:
  - Job Name
  - Assigned Date
  - Type of Inspection
  - Membrane Type
  - Total Square Ft
  - City
  - State
  - Roofer
- Jobs are scoped to the logged-in rep by default.

#### User Story 1.2
As a field service rep, I want to filter jobs so that I can quickly find the work most relevant to me.

**Acceptance Criteria**
- The user can filter jobs by:
  - Location
  - Type of Inspection
  - Brand
  - Early Bird
- Filters can be applied individually or in combination.
- The job list updates to reflect applied filters.
- The user can clear one filter or clear all filters.
- The app preserves visible feedback showing which filters are currently applied.

#### User Story 1.3
As a field service rep, I want to search for another rep’s jobs so that I can view work assigned to others when needed.

**Acceptance Criteria**
- The user can search for another field service rep by name.
- Search results return jobs assigned to the selected rep.
- The app clearly indicates when the user is viewing another rep’s jobs rather than their own.
- The user can easily return to their own default job view.
- Viewing another rep’s jobs is read-only.

#### User Story 1.4
As a field service rep, I want to schedule unscheduled jobs so that I can organize my work week.

**Acceptance Criteria**
- Unscheduled jobs are visually distinguishable in the jobs list.
- The user can assign a date to an unscheduled job.
- Once scheduled, the job moves into the scheduled jobs list/state.
- The updated scheduled date is visible immediately after save.
- If scheduling fails, the user sees an error message and the job remains unchanged.

#### User Story 1.5
As a field service rep, I want to sort jobs by any table column so that I can organize my view in the way that is most useful to me.

**Acceptance Criteria**
- Every sortable column provides a sort interaction.
- The user can sort ascending and descending.
- Only one active sort is required for MVP.
- The current sort state is visually indicated.

#### User Story 1.6
As a field service rep, I want to identify early bird jobs so that I can prioritize urgent or important work.

**Acceptance Criteria**
- Early bird jobs are clearly labeled in the jobs list.
- The early bird indicator is visible in both table and map views.
- Early bird jobs can be filtered or otherwise easily located.
- The definition/rule for “early bird” is consistently applied by the system.
- Early bird designation is upstream data from another platform and is read-only in this app.

#### User Story 1.7
As a field service rep, I want to view jobs in both table and map formats so that I can plan work based on both data and geography.

**Acceptance Criteria**
- The user can toggle between **table view** and **map view**.
- Both views reflect the same applied filters/search criteria.
- Map markers represent jobs with location data.
- Selecting a job from either view allows the user to access job details.
- If a job has no valid map location, it still appears in the table view.

### Epic 2: Job Details

#### User Story 2.1
As a field service rep, I want to view job details so that I have all relevant information before starting work.

**Acceptance Criteria**
- The user can open a dedicated job details page from the jobs list or map.
- The job details page displays, at minimum:
  - Location
  - Assembly letter status
  - Warranty status
  - Comments associated to the job
  - Related documents
  - Brand
- Information is grouped in a way that is easy to scan in the field.
- If certain information is unavailable, the app displays an appropriate empty state.

#### User Story 2.2
As a field service rep, I want to see inspection status on the job details page so that I understand whether work has started, is in progress, or is complete.

**Acceptance Criteria**
- A dedicated inspection status section appears on the job details page.
- Inspection status is visible without requiring the user to enter the inspection flow.
- Status values are clearly defined and consistently used.

**Suggested statuses**
- Not Started
- In Progress
- Completed
- Report Generated

#### User Story 2.3
As a field service rep, I want to begin an inspection from the job details page so that I can move directly into the inspection workflow.

**Acceptance Criteria**
- The job details page contains a clear primary action to begin or resume an inspection.
- If no inspection exists, the CTA starts a new inspection.
- If an inspection is already in progress, the CTA resumes the existing inspection.
- If an inspection is completed, the CTA allows viewing the completed output and/or starting a new version if business rules allow it.

#### User Story 2.4
As a field service rep, I want to view inspection history and prior versions so that I can understand the job’s inspection record over time.

**Acceptance Criteria**
- The job details page includes an inspection versions/history section.
- Each version displays version number, created date, creator, and status.
- The user can open a prior version.
- The user can access a prior version’s generated report if available.

### Epic 3: Inspection Workflow

#### User Story 3.1
As a field service rep, I want an inspection flow that guides me step by step so that I can complete inspections consistently.

**Acceptance Criteria**
- Starting an inspection launches a wizard-style experience.
- The wizard breaks the inspection into clearly labeled steps.
- The user can move forward and backward between steps.
- Progress is visible throughout the wizard.
- Required information must be completed before final submission.

#### User Story 3.2
As a field service rep, I want to mark up the roof asset associated with the job so that I can document findings visually.

**Acceptance Criteria**
- The inspection supports markup on the asset associated with the job.
- Supported asset types may include:
  - Roof photo
  - Satellite image
  - Roof drawing / plan
- Each job has one primary asset for inspection.
- The user can open the asset in a markup interface.
- The user can place visual markings/annotations on the asset.
- Markups remain associated with the correct job and inspection record.
- The user can edit or remove added markups before finalizing the inspection.

#### User Story 3.3
As a field service rep, I want the inspection output to generate a PDF so that I can review, download, and share the final report.

**Acceptance Criteria**
- Completing an inspection generates a PDF report.
- The PDF is viewable within the app.
- The PDF can be downloaded by the user.
- The PDF includes the relevant inspection content, including marked-up visuals.
- The PDF is associated to the correct job record.
- The PDF is polished and client-facing.
- The report begins with a cover-style first section.
- Findings in the report are grouped by severity.

#### User Story 3.4
As a field service rep, I want to create a new inspection version from a prior version so that I can reuse previous work while preserving history.

**Acceptance Criteria**
- The user can create a new inspection version from a completed or prior version.
- The new version receives a new version number.
- Prior versions remain unchanged and viewable.
- The new version clearly indicates which prior version it was based on.

## Functional Requirements Summary

### Jobs List
- Table view
- Map view
- Filters
- Search by rep name
- Sort by column
- Scheduled + unscheduled jobs
- Early Bird highlighting
- Job scheduling action

### Job Details
- Location
- Assembly letter status
- Warranty status
- Comments
- Related documents
- Inspection status section
- Inspection versions/history
- Begin/resume inspection CTA

### Inspection
- Wizard-based flow
- Asset markup capability
- Support for multiple asset types
- Single primary asset per job
- Save inspection state/status
- Support multiple versions
- Generate in-app viewable PDF
- Downloadable PDF output

## Suggested MVP Scope

### In Scope
- Jobs table
- Map view
- Filtering, sorting, search by rep
- View job details
- Inspection status display
- Inspection history / versioning
- Wizard-based inspection flow
- Asset markup
- PDF generation and download

### Potential Phase 2 / Nice-to-Haves
- Advanced scheduling logic
- Collaboration workflows on comments
- Report sharing via email from within app
- Inspection templates by roof/job type
- Offline mode
- Deeper version comparison between inspections

## Open Product Questions

- Should the app allow only one **in-progress** inspection version at a time per job?
- When creating a new version from a prior version, should all previous findings be copied by default or should the rep choose what to carry over?
- Should Early Bird have a stronger visual treatment than a standard chip?
- Should the report cover page include imagery or remain text/brand focused?
