---
name: Hivemind page sections and routes
description: Home.tsx section order and all registered routes in App.tsx
---

**Home.tsx section order (top to bottom):**
1. Hero
2. Marquee
3. WhyHiveMind (id="why-hivemind") — "Most companies build websites..."
4. AIChat (lazy, id="ai-chat") — AI chat assistant
5. Services (id="services") — service cards
6. Projects — portfolio
7. WorldMap (id="global") — globe/map
8. Owner — founder section
9. Testimonials
10. Pricing (id="pricing")
11. Roadmap (id="roadmap") — 2026–2035 interactive timeline
12. EnquiryForm
13. Contact (id="contact")
14. TrustBadgesBar
15. Footer

**Routes in App.tsx:**
- `/` → Home
- `/admin` → AdminDashboard (password: hivemind2024)
- `/hivemind-ai` → HivemindAI
- `/terms` → Terms
- `/privacy` → Privacy
- `/disclaimer` → Disclaimer
- `/contact` → ContactPage

**Scroll button targets in WhyHiveMind:**
- "Explore AI Systems" → scrollToSection("services")
- "View Roadmap" → scrollToSection("roadmap")
- "Launch HiveMind AI" → scrollToSection("ai-chat")

**Why:** Knowing the section order prevents accidentally removing or reordering components; knowing routes prevents duplicate route creation.
