---
name: Hivemind Globe Implementation
description: InteractiveGlobe component uses Three.js (WebGL) in production with Canvas 2D fallback for sandboxed environments
---

The `InteractiveGlobe.tsx` component has two rendering paths:

**Three.js path** (WebGL available — real browsers, deployed app):
- `ThreeGlobe` component using vanilla `import * as THREE from 'three'` (installed at ^0.184.0)
- Single `globeGroup` contains all rotating elements (globe, grid, markers, arcs, travelers)
- Atmosphere and stars at scene level (don't rotate)
- Controls: pointerdown/move/up for drag, wheel for zoom, touchstart/move for pinch
- Auto-rotates when idle for 2+ seconds

**Canvas 2D path** (no WebGL — Replit sandbox):
- `CanvasGlobe` component with 300+ hardcoded lat/lng land seeds
- Canvas uses `position: absolute; inset: 0` — required for correct sizing
- Verified working via direct screenshot of `/globe-preview` route

**Detection:** `hasWebGL()` checks `window.WebGLRenderingContext` + canvas context creation.

**WorldCountry** interface has `lat?` and `lng?` optional fields. Fallback lookup via `COUNTRY_COORDS` record by country name. Both the Three.js and Canvas 2D paths use these fallbacks.

**Why:** WebGL is unavailable in Replit's sandboxed iframe. Canvas 2D confirmed visible via screenshot. Three.js renders in all real browsers and deployed environments.

**How to apply:** Never remove the Canvas 2D fallback. The `hasWebGL()` call must happen at render time (inside the component function or useEffect), not at module load time.
