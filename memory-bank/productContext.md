# CCM Inspection App — Product Context

## Why This Project Exists
Field service reps conduct roof inspections on behalf of clients. Their current workflow is fragmented:
- Job visibility is scattered
- Prioritization (e.g., Early Bird jobs) is manual
- Inspection documentation is not standardized
- Reports are time-consuming to produce and inconsistent in quality

The CCM Inspection App consolidates job management, inspection execution, and report delivery into a single experience optimized for field use.

## Problems Being Solved

| Problem | Solution |
|---|---|
| Hard to see and prioritize upcoming work | Jobs list with filters, sorting, Early Bird highlighting |
| No easy way to plan routes or schedule | Map view + scheduling modal |
| No guided inspection process | Wizard-based inspection flow |
| Reports are manual and inconsistent | Auto-generated, polished PDF from inspection data |
| Multiple inspections per job are hard to track | Versioned inspection history with status tracking |

## User Experience Goals

### Tablet-First
- The primary device is a tablet used in the field
- Touch targets, layouts, and interactions must be optimized for tablet
- Desktop and mobile are secondary but still supported

### Field-Friendly
- Quick scanning of job data in the field
- Minimal typing where possible
- Clear feedback on current status
- Fast entry into inspection workflows

### Confidence in Data
- Inspection status should always be visible and unambiguous
- Version history gives reps and managers a clear audit trail
- Report output should be polished enough to give directly to a client

## User Flows

### Plan Jobs
1. Land on My Jobs (table view)
2. Filter / sort / search
3. Switch to map view to assess geography
4. Schedule any unscheduled jobs

### Review a Job
1. Open job from table or map
2. Review job summary, status, documents, comments
3. Check inspection history

### Start Inspection
1. From job details, tap Start Inspection
2. Complete wizard: Setup → Markup → Issue Details → Review → Generate Report
3. Download PDF

### Create New Version from Prior
1. From inspection history, tap "Create New Version from Version X"
2. Wizard pre-populates with prior findings
3. Rep edits, reviews, and generates updated report

### Generate Report
1. Complete Review step in wizard
2. Tap Generate Report
3. Preview PDF in app
4. Download

## Key UX Principles
- **Clarity over density** — field reps need to scan and act quickly
- **Progressive disclosure** — details are accessible but not overwhelming
- **Status is always visible** — jobs and inspections always show their current state
- **No lost work** — inspections are saved across steps; prior versions are preserved
