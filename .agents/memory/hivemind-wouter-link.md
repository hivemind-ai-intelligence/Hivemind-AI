---
name: Hivemind wouter Link rule
description: wouter Link renders its own <a> tag — never nest <a> inside Link
---

**Rule:** In wouter v3, `<Link href="...">` renders as an `<a>` element. Never wrap the children with another `<a>` tag.

**Wrong:**
```tsx
<Link href="/page">
  <a className="some-styles">text</a>
</Link>
```

**Correct:**
```tsx
<Link href="/page" className="some-styles">text</Link>
```

**Why:** Nesting `<a>` inside `<a>` is invalid HTML and causes a React hydration warning: "In HTML, <a> cannot be a descendant of <a>." The page still renders but throws console errors.

**How to apply:** Whenever adding a Link in this codebase, put className and other props directly on `<Link>`, not on a child `<a>`. This applies to all pages including the legal pages (Terms, Privacy, Disclaimer, ContactPage).
