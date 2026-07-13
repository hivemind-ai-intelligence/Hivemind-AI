---
name: Vercel import port cleanup
description: What to check when porting an imported "Vercel project" into the Replit multi-artifact structure.
---

An imported project labeled "Vercel" is not necessarily Next.js — it can already be a Vite + React app
shaped almost exactly like a Replit artifact scaffold (own vite.config.ts, index.html, .replit-artifact/artifact.toml),
just sitting inside a `.migration-backup/` directory instead of `artifacts/`.

**Why:** The platform's automatic scaffold-detection step can register duplicate/misplaced artifacts —
e.g. registering the same logical artifact twice (once correctly under `artifacts/`, once erroneously
under `.migration-backup/artifacts/...`), or pointing the real product's artifact at the backup path
instead of a real `artifacts/<slug>` directory. This produces failing workflows referencing paths with
no installed node_modules/build tools.

**How to apply:** Before doing a heavy Next.js→Vite conversion, inspect whether the "Vercel" export is
already Vite-shaped. If duplicate/misplaced artifacts show up: `git mv` the real files from
`.migration-backup/artifacts/<slug>` into `artifacts/<slug>`, then delete the `.replit-artifact` folder
inside the backup copy so it stops being picked up as a phantom duplicate. Also check for Vercel-specific
SDK usage (e.g. `@vercel/speed-insights`) to strip if the user doesn't need strict Vercel parity.
