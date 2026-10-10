# Build plan

> The build's progress tracker. Read it at the start of every session alongside `design.md`. This is the one file in `docs/` Claude Code updates: tick a step only after Jared has reviewed and approved it, and keep the "Now" line current. Don't add, remove, or reorder steps without asking him.

## Now

- **In progress:** step 1, scaffold (built; waiting for Jared's review)
- **Next:** step 2, foundations
- **Notes:** —

## Phase 0 — Setup

- [ ] **1. Scaffold.** `rebuild` branch; fresh Next.js (App Router, TypeScript, Tailwind, ESLint) replacing the old scaffold, keeping `CLAUDE.md` and `docs/`; Motion and MDX installed. Done when `npm run dev` shows a blank page and `npm run build` passes.
- [ ] **2. Foundations.** Newsreader + Schibsted Grotesk via `next/font`; golden-hour color values as CSS variables; root layout, page title, placeholder favicon. Done when a test heading and paragraph render in the right fonts and colors.

## Phase 1 — Sky

- [ ] **3. Static golden hour.** The scene drawn with the tiny-canvas → blur → pixelate pipeline, golden hour only, no scrolling yet.
- [ ] **4. Scroll blending.** Golden hour → dusk → night driven by overall scroll progress, writing live values (ink, accent, vignette, grain level) to CSS variables.
- [ ] **5. Texture and motion.** Film grain building toward night, stars twinkling in at dusk, slow cloud drift.

## Phase 2 — Designed sections

- [ ] **6. Nav.** Quiet, top-right, per the hero spec. Confirm which links it holds before building.
- [ ] **7. Hero.** Portrait, stacked name, hero line, "currently" line with sparkle, left vignette. Placeholder copy.
- [ ] **8. Intro.** Label, lead, paragraph, quick-facts row (2×2 on phones). Placeholder copy.
- [ ] **9. Tech stack.** Header plus two looping pill rows, edge fade, pause on hover. Placeholder list.

## Phase 3 — Needs design first

Each of these gets designed (in the design chat, logged in Notion, re-exported to `docs/`) before it's built. If a session reaches one, stop and tell Jared it needs design.

- [ ] Experience
- [ ] Projects + project detail pages (MDX)
- [ ] Beyond code (draggable scrapbook)
- [ ] Fun / experimental / interactive
- [ ] Connect (visitor globe / ticket)
- [ ] Sky modes 2 and 3 (needs the full 24-hour keyframes approved)
- [ ] Live widgets (now playing, location)

## Phase 4 — Launch

- [ ] Content pass: real copy, photos, tech stack list
- [ ] Test on a real phone and send to friends
- [ ] Performance check (sky smoothness on phones), accessibility, page metadata
- [ ] Merge `rebuild` into `main` and deploy on Vercel
