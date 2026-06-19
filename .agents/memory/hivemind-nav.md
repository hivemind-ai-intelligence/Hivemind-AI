---
name: HiveMind Navbar Link Pattern
description: How to add links to the Navbar that route to internal pages vs hash anchors.
---

## Rule
The `navLinks` array in `Navbar.tsx` supports an optional `isRoute: true` flag. When set, the link renders as a wouter `<Link>` component (full SPA routing). Without it, renders as a plain `<a>` tag (hash anchors, external links).

**Why:** The site uses wouter for routing. Hash links (#services, #contact) work with plain anchors, but internal page routes (/hivemind-ai, /admin) must use wouter Link or the page won't render correctly under the base path proxy.

**How to apply:** Add `isRoute: true` to any navLink that points to a `/path` route. Leave it off for `#anchor` links.

```typescript
const navLinks = [
  { name: "Services", href: "#services" },               // anchor — no isRoute
  { name: "HiveMind AI", href: "/hivemind-ai", isRoute: true }, // route — isRoute: true
];
```
