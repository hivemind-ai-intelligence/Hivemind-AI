---
name: Hivemind Admin Data Pattern
description: How AdminDataContext and the admin dashboard are structured in the HiveMind AI site.
---

## Rule
Always import `useAdminData` from `@/hooks/useAdminData`, never directly from `@/context/AdminDataContext`.

**Why:** The context file exports the raw context but the hook file wraps it with the required assertion. Direct imports from the context file caused runtime errors in previous sessions.

**How to apply:** Any new component that needs admin data: `import { useAdminData } from "@/hooks/useAdminData"`.

## Admin Dashboard Pattern
- CRUD editors follow a consistent pattern: `editingXId` + `isAddingX` state pair per entity type.
- Inline editors use `document.getElementById` DOM reads for form values (avoids controlled state re-renders in complex list editors).
- `Switch` component state read via `el.getAttribute('aria-checked') === 'true'` since it's a custom component.
- All data persists to `localStorage` key `hivemind-admin-data` via AdminDataProvider effect.

## Data Shape (as of June 2026)
AdminData includes: branding, hero, founder, services[], projects[], testimonials[], pricing[], contact, SEO, worldCountries[], world stats (worldActiveRegions/Projects/Languages/AICoverage), and all hivemindAI* flat fields + arrays (traits, features, timeline, languages, team, activity).
