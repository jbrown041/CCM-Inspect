# CCM Inspection App — Tech Context

## Project Type
**Prototype** — This is a UI/UX prototype, not a production application. The goal is to validate workflows and structure, not to build a backend or production-grade system.

## UI Framework
**MUI (Material UI)** — Latest version
- Keep design system clean, touch-friendly, and lightly branded
- Use standard MUI components over heavy customization
- Focus on validating workflow and structure rather than custom visual engineering

## MUI Component Mapping

| UI Element | MUI Component |
|---|---|
| Jobs list | `DataGrid` |
| Scheduling / filter drawers | `Drawer` or `Dialog` |
| Rep search | `Autocomplete` |
| Filter controls | `Select` / `TextField` |
| Status indicators | `Chip` / `Badge` |
| Inspection wizard | `Stepper` |
| Job details sections | `Card`, `Accordion`, `List`, `Divider` |
| Table/map toggle | `Tabs` or `ToggleButtonGroup` |
| Date picker | `DatePicker` (MUI x date-pickers) |

## Responsive / Device Strategy
- **Tablet-first** — strongest and most complete interaction model
- **Mobile** — supported with adapted layouts (stacked, full-screen map, bottom sheets)
- **Desktop** — supported via expanded layouts from tablet baseline

## Platform Assumptions
- No offline mode in MVP
- No backend required for prototype — static/mocked data acceptable
- PDF generation for prototype can be illustrated via report preview mockup

## Prototype Scope Constraints
- States and edge cases can be annotated rather than fully interactive where impractical
- Map view can use a placeholder map component
- PDF download can be illustrated with a static asset or preview screen
- Authentication/login is out of scope for prototype

## Technical Rules
- Do not store API keys or secrets in the codebase
- Use `.env.example` with placeholder values only
- No production deployments without security review
