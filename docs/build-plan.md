# Build plan

> The build's progress tracker. Read it at the start of every session alongside `design.md`. This is the one file in `docs/` Claude Code updates: tick a step only after Jared has reviewed and approved it, and keep the "Now" line current. Don't add, remove, or reorder steps without asking him.

## Now

- **In progress:** none. Sky modes 2 and 3 done 2026-10-20 (all five parts); going live with a `rebuild` → `main` pull request. Still to check on Jared's phone: Reduce Motion. Launched 2026-10-17 at jarednarvaez.vercel.app (old site on `legacy`); a custom domain can come later.
- **Next:** leave a star (Phase 4; pick the storage service with Jared first)
- **Content:** all copy for step 14 is in `docs/content.md` (exported from Jared's Website content pass doc); files are in `~/website-content`.
- **Notes:** Plan re-aimed at the MVP on 2026-10-16 (see `design.md` → Launch plan). Post-launch design fixes shipped 2026-10-19, outside the numbered steps: new hero line at 20px, centered 1000px content column, two-row tech stack in IBM Plex Mono pills, tighter experience/projects spacing, grey bullet text with gaps, clickable section headers, new sunset portrait. Each is in `decisions-log.md`.

## MVP (decided 2026-10-16)

The whole home page in scroll mode, with real content, deployed. Everything after Phase 3 waits until the site is live. Links to pages that don't exist yet ("view project →", "all projects →", "open the scrapbook →") stay hidden until those pages are built.

## Phase 0 — Setup

- [x] **1. Scaffold.** `rebuild` branch; fresh Next.js (App Router, TypeScript, Tailwind, ESLint) replacing the old scaffold, keeping `CLAUDE.md` and `docs/`; Motion and MDX installed. Done when `npm run dev` shows a blank page and `npm run build` passes.
- [x] **2. Foundations.** Newsreader + Schibsted Grotesk via `next/font`; golden-hour color values as CSS variables; root layout, page title, placeholder favicon. Done when a test heading and paragraph render in the right fonts and colors.

## Phase 1 — Sky

- [x] **3. Static golden hour.** The scene drawn with the tiny-canvas → blur → pixelate pipeline, golden hour only, no scrolling yet. Film grain moved here from step 5 at Jared's request (2026-10-11); the hybrid dither backup was compared and not chosen.
- [x] **4. Scroll blending.** Golden hour → dusk → night driven by overall scroll progress, writing live values (ink, accent, grain level) to CSS variables. The vignette blends through the sky keyframes instead, so it stays blurred and pixelated with the sky (decided 2026-10-11).
- [x] **5. Texture and motion.** Stars twinkling in at dusk, slow cloud drift. (Grain itself moved to step 3; its build toward night comes with step 4's grain level.)

## Phase 2 — Home page sections (MVP)

Every section uses placeholder copy (`[like this]`) and its own data file, and ships with every animation listed for it in `visual-system.md` → Motion inventory. Specs: the matching section in `visual-system.md`; working reference: `docs/reference/home-mockup.html`.

- [x] **6. Nav.** Quiet, top-right, per the hero spec. Links: about · experience · projects · résumé · contact. Hides on scroll down, returns on scroll up; full-screen menu on phones; sky controls are inert placeholders.
- [x] **7. Hero.** Portrait, stacked name, hero line, "currently" line with sparkle (twinkle), left vignette, plum text shadow, phone type sizes and the real phone margin. Replaces the temporary test content in `src/app/page.tsx`.
- [x] **8. Intro.** Label, lead, paragraph, quick-facts row (2×2 on phones).
- [x] **9. Tech stack.** Header plus two looping pill rows, edge fade, pause on hover. Placeholder list.
- [x] **10. Experience.** Build the shared collapsible pieces here (round "+" toggle, section open/close with stagger, independent row expand, `inert` when closed, Reduce Motion) so projects can reuse them. Timeline with star markers, three placeholder roles.
- [x] **11. Projects.** Reuses step 10's collapsible. Numbered index, cells with screenshot focus pull, three placeholder projects from one data list (`featured`). "view project →" and "all projects →" hidden for the MVP.
- [ ] ~~**12. Beyond code.**~~ *Moved after launch on 2026-10-16: the layout felt awkward and needs more design. The build is parked in the repo (see Phase 4).* Framed drag zone with crop marks, 6 placeholder prints, drag + drop tilt, drop-in on first view and reset, hint line; fixed scatter with no drag on phones. "open the scrapbook →" hidden for the MVP.
- [x] **13. Connect (contact block).** Label, heading, one line, email with copy pill ("copied" for 1.4s), LinkedIn · GitHub · Résumé links. Connect pinned to full night. No leave a star yet.

## Phase 3 — Launch

- [x] **14. Content pass.** Real copy, portrait, photos and captions, the 2 featured projects with screenshots, real tech stack list (three rows), roles and bullets, links, résumé PDF. Copy is written with Jared in the design chat, then dropped into the data files here.
- [x] **15. Pre-launch checks.** Hide the nav's placeholder sky controls (they come back with sky modes). Page metadata (title, description, social preview image). Accessibility pass (keyboard, focus, `alt` text, Reduce Motion). Performance on a real phone (re-test the extension load hitch). Jared tests on his phone and sends it to friends.
- [x] **16. Go live.** Confirm Vercel is linked to `jar-narvz/jarednarvaez-app` (production branch `main`, Node 22.x) and a preview deploy of `rebuild` works. Jared moves the old site to a `legacy` branch, merges `rebuild` into `main`, and connects the domain. Done when the live URL shows the new site.

## Phase 4 — After launch (in this order)

- [x] **Sky modes 2 and 3.** Mini dial + full 24-hour dial, light/dark button, "my time", "sunset" pill, day text theme, transitions around the clock. Spec: `visual-system.md` → 24-hour sky. Split into five parts, each reviewed on its own (Jared, 2026-10-19):
  - [x] **1. 24-hour color math.** All 8 keyframes, sun path, stars by hour, grain and dayness as plain tested functions in `src/lib/sky/`. Nothing visible changes.
  - [x] **2. Sky renders any hour.** The canvas draws any hour; a temporary `/lab` slider scrubs through the day.
  - [x] **3. Day text theme.** CSS variables (ink, accent, underline, tints, shadow, vignette) blend with dayness; readable at every hour.
  - [x] **4. Nav controls.** Mini dial, full dial, light/dark button, "my time", "sunset" pill, with their Motion inventory animations.
  - [x] **5. Mode transitions and checks.** Shorter-way-around transitions (~1.2s), fixed modes, Reduce Motion, connect in daytime, phone checks.
- [ ] **Leave a star.** Storage, `/api/stars`, pixel-cross stars in the sky canvas, placing and hover in connect, privacy rules. Spec: `visual-system.md` → Connect. Pick the storage service with Jared first. Includes the sky modes' "connect in daytime" rules (visitor stars hidden, "stars come out at night" hint, placing disabled), left out of sky modes part 5 since there are no visitor stars yet.
- [ ] **/projects page + project detail pages (MDX).** Needs design first. Then turn on "view project →" and "all projects →".
- [ ] **Beyond code (home scrapbook preview).** Needs design first. A working build is parked in the repo (`src/components/BeyondCode.tsx`, `src/data/scrapbook.ts`) with a dev-only tuning page at `/lab` (height, print size, frame width, frame). Re-add it to `src/app/page.tsx` after projects once designed.
- [ ] **/scrapbook page.** Needs design first. Then turn on "open the scrapbook →".
- [ ] **Live widgets** (now playing, location) in the hero "currently" line. Needs design first.
- [ ] **Easter eggs.** Needs design first.

If a session reaches anything marked "needs design first", stop and tell Jared it needs design.
