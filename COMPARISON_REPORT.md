# COMPARISON REPORT

## Reference Bundle

- `src/` entry-based layout
- sidebar + top header + shell navigation
- screen-level feature panels
- shared style tokens in one theme file

## Current Repository

- Vite entry is now aligned with the bundle-style root structure
- screen composition uses `src/app/App.tsx`
- feature panels remain reusable from existing modules

## Remaining Differences

- Extra internal documentation exists at the repository root
- Legacy feature files remain under `features/` for reuse
- Mock data modules are still split across `api/` and `types/`


