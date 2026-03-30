## 🚨 Never Upload Secrets

- Do not store API keys or `.env` in repo.
- Use `.env.example` with placeholders.
- If a secret is leaked: rotate credentials, purge history, notify team.

---

## CCM Inspection App — Project Rules

### Read Before Any Work
Always read all memory bank files before beginning a task:
- `projectbrief.md` → scope, epics, locked decisions, open questions
- `productContext.md` → user flows, UX principles, problems being solved
- `systemPatterns.md` → screen hierarchy, object model, component patterns
- `techContext.md` → MUI components, prototype constraints, responsive strategy
- `activeContext.md` → current phase, open decisions, next steps
- `progress.md` → what is built, what remains, user story status

### Prototype vs. Production
This is a **prototype**, not a production app. Design for workflow validation:
- Static/mocked data is acceptable
- Complex interactions (map, PDF generation) can be illustrated via placeholder or annotation
- Do not over-engineer — validate structure and UX, not implementation details

### Component Conventions
- Use **MUI (latest)** throughout — no custom component libraries
- `DataGrid` for jobs table — do not use a basic HTML table
- `Stepper` for inspection wizard — linear, step-by-step
- `Drawer` or `Dialog` for scheduling and filter overlays — not inline forms
- `Autocomplete` for rep search
- `Chip` / `Badge` for all status and label indicators (Early Bird, inspection status, scheduled/unscheduled)

### Data Model Rules
- A job has **one primary asset** — do not design for multiple
- **Brand** has exactly two values: `Bluey` and `Yellowy` — no others
- **Early Bird** is read-only upstream data — never allow editing in this app
- Inspection versions use labels: `v1`, `v2`, `v3`…
- Inspection status values (exact): `Not Started`, `In Progress`, `Completed`, `Report Generated`

### Responsive Rules
- Design **tablet-first** — tablet is the primary device
- Mobile adaptations: stacked layouts, bottom sheets for drawers/filters, full-screen map
- Desktop: expand from tablet baseline with more spacious layouts

### Inspection Wizard Rules
- Wizard steps (in order): Setup → Markup → Issue Details → Review → Generate Report
- Required fields must block forward progression
- When branching from a prior version, show a banner: "New version based on Version X"
- Prior versions are always read-only

### Issue Taxonomy
- Categories: Membrane Damage, Seam / Joint Issue, Flashing Issue, Drainage / Ponding, Penetration Issue, Edge / Perimeter Issue, Fastener / Attachment Issue, Surface Wear / Deterioration, Installation / Workmanship Concern, Debris / Obstruction, Safety Concern, Other
- Severity: `Low`, `Medium`, `High`, `Critical` — always in this order

### Report Rules
- Report always begins with a cover page
- Findings grouped by severity: Critical → High → Medium → Low
- Report must include: version number, job name/ID, date generated
- Report must be polished enough to give directly to a client

### Open Questions (Do Not Resolve Without Team Input)
- One in-progress inspection version per job at a time?
- Auto-copy findings when branching from prior version, or let rep choose?
- Early Bird chip vs. stronger visual treatment?
- Report cover page: imagery or text/branding only?
