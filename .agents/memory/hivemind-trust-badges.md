---
name: Hivemind Trust Badges
description: TrustBadge system in AdminData — editable badges shown in footer and TrustBadgesBar
---

**Data shape** (in `AdminDataContext.tsx`):
```typescript
interface TrustBadge { id: string; label: string; icon: string; enabled: boolean; }
AdminData.trustBadges: TrustBadge[]
```

Default badges: Verified AI Company (Shield), Enterprise Ready (Building2), Security Verified (Lock), AI Powered (Brain), Global Network Active (Globe2), Future Ready (Rocket).

**Display locations:**
- `TrustBadgesBar.tsx` — horizontal strip rendered just above `<Footer />` in `Home.tsx`
- `Footer.tsx` — inline chip badges in the brand column (only enabled ones)

**Admin management:** Admin Dashboard has a "Trust Badges" tab (added to `TABS` constant). Supports add, edit label/icon, toggle enabled, delete.

**Icon map:** `Shield, Building2, Lock, Brain, Globe2, Rocket, CheckCircle` from lucide-react. Dropdown in admin selects these by name string.

**Why:** Editable trust signals for social proof without touching code. All state flows through AdminDataContext → localStorage.
