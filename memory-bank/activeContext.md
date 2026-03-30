# CCM Inspection App — Active Context

*Last updated: 2026-03-23*

## Current Phase
**Design / Prototyping — Phase 3: Inspection Flow**

The project has completed its planning and documentation phase. Core product, UX, and design decisions are locked. The team is ready to begin building the prototype.

## Current Focus
Beginning **Phase 3 — Inspection Flow**:
- Inspection wizard (Stepper: Setup → Markup → Issue Details → Review → Generate Report)
- Markup canvas with annotation tools
- Issue details form (category, severity, notes)
- Review step

## Recently Completed
- PRD finalized (`ccm_inspection_prd.md`)
- Design doc finalized (`ccm_inspection_design_doc.md`)
- Granular task list created and mapped to user stories (`ccm_inspection_task_list.md`)
- Memory bank initialized

## Active Decisions

### Locked
- Tablet-first responsive layout
- MUI as the component framework
- Wizard steps: Setup → Markup → Issue Details → Review → Generate Report
- Split planning layout (table left, map right) for tablet/desktop
- Inspection versioning with branch-from-prior capability
- Report structure: cover page + job summary + findings by severity + marked-up visuals

### Open / Unresolved
- Allow only one in-progress inspection version per job at a time?
- Auto-copy all findings when branching from a prior version, or let rep choose?
- Early Bird: standard chip or stronger visual treatment?
- Report cover page: imagery or text/branding only?

## Next Steps
1. Confirm screen inventory (task 1.1.1)
2. Define main navigation model across breakpoints (task 1.1.2)
3. Confirm object model alignment with development team (task 1.1.4)
4. Select and configure MUI components for Phase 1 (task 1.2.2)
5. Begin designing jobs landing experience (tasks 2.1.x)

## Risks / Watchouts
- Map view complexity — keep it simple for prototype (placeholder acceptable)
- Markup canvas is the most technically complex screen — design the data model carefully before building
- PDF generation may need to be a static preview for prototype phase
- Inspection versioning UI needs clear labeling to avoid rep confusion
