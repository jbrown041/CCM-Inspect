# CCM Inspection App — Project Brief

## Product Name
CCM Inspection App

## Project Goal
Build a **tablet-first responsive prototype** that allows field service reps to manage jobs, plan schedules, conduct roof inspections via a guided wizard, and generate polished client-facing PDF reports.

## Primary Users
- **Field Service Rep** — views/manages assigned jobs, plans work, conducts inspections, generates reports
- **Field Service Manager / Other Rep** — read-only visibility into other reps' jobs and inspection outputs

## Core Problem
Field service reps' job visibility, prioritization, and inspection reporting are fragmented and manual. This app unifies job management and inspection execution in a single, field-friendly interface.

## Scope

### In-Scope (MVP)
- Jobs table with filters, sorting, and search by rep
- Map view for geographic planning
- Scheduling of unscheduled jobs
- Job details page (summary, status, documents, comments)
- Inspection status display and version history
- Wizard-based inspection flow (Setup → Markup → Issue Details → Review → Generate Report)
- Asset markup with annotation tools
- PDF report generation, in-app viewing, and download

### Out of Scope (Phase 2+)
- Advanced scheduling logic / weekly planner
- Collaboration workflows on comments
- Report sharing via email from within the app
- Inspection templates by roof/job type
- Offline mode
- Inspection version comparison

## Epics
1. **Job Management and Planning** — US1.1–US1.7
2. **Job Details** — US2.1–US2.4
3. **Inspection Workflow** — US3.1–US3.4

## Locked Product Decisions
- **Early Bird** designation is upstream read-only data; display and filter only
- **Brand** has exactly two values: Bluey and Yellowy
- **Asset model**: one primary asset per job
- **Versioning**: a job can have multiple inspection versions; new versions can be branched from prior ones
- **Report**: polished, client-facing PDF with severity-grouped findings and a cover page

## Delivery Order (Phased)
1. Core planning experience (foundations, jobs table, filters, map, scheduling)
2. Job review experience (details, status, documents, inspection entry points)
3. Inspection flow (wizard, markup, issue details, review)
4. Output (report generation, preview, download)
5. Polish (responsive refinements, edge states, handoff)

## Open Questions
- Allow only one in-progress inspection version per job at a time?
- When creating a new version from a prior version, auto-copy all findings or let rep choose?
- Should Early Bird have a stronger visual treatment than a standard chip?
- Should the report cover page include imagery or stay text/brand-focused?
