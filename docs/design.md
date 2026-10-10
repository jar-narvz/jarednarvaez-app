# Design doc

> Exported from Notion ("personal website planning doc") on 2026-10-09, trimmed for building: design-chat steering notes and the design-process principles stay in Notion. Notion is the source of truth while design is in progress; re-export when it changes. How to work in this repo is in `CLAUDE.md`.

The main design doc: principles and current state, one line per decision. Full specs are in `visual-system.md`; reasoning and rejected options are in `decisions-log.md`.

## What the site is

- **Impression to leave:** a well-rounded person beyond code.
- **Audience:** equal weight — recruiters and everyone else.
- **Central metaphor: golden hour.** The site is one evening, from golden hour to night. Every decision follows from it.
- **Clean layout + rich atmosphere.** An artful, textured backdrop under a simple, readable layout. No literal props.
- **Avoid the "AI gradient" look.** Limited palette, texture, and blur instead of smooth gradients.
- **Animation responds to the visitor.** Calm by default, with a couple of signature moments.

## Decided

- **Structure:** hybrid — home page hub + detail pages per project.
- **Home order:** hero → intro (about me) → tech stack → experience (internship, VSPA, PASAE) → projects → beyond code (dance, PASAE, scrapbook) → fun / experimental / interactive → connect + visitor globe/ticket. No GitHub activity section.
- **Signature ideas:** draggable photo scrapbook (beyond code), visitor globe / visitor ticket (connect), live widgets like now playing and location (hero "currently" line).
- **Sky:** fixed background shifting golden hour → sunset → dusk → night with stars.
- **Scroll sky timing:** follows overall page scroll progress, not sections. Hero is always golden hour, connect is always full night, everything between stretches to fit.
- **Sky modes:** scroll (default), pick the time (24-hour dial + light/dark buttons), or the visitor's local time; a "sunset" pill returns to the default. Full spec in `visual-system.md`.
- **Background:** open coast sunset, heavily blurred then pixelated into ~4px squares, with film grain that builds as the sky darkens.
- **Text:** warm cream with a soft plum shadow and a left-side vignette, widened ~25% site-wide.
- **Accent:** Starlight → Sun gold text as the sky darkens, with a Sun gold four-point sparkle and link underlines.
- **Type:** Newsreader headings + Schibsted Grotesk body. Hero name stacked with italic surname, tight spacing.
- **Motion:** slow cloud drift, stars twinkle in at dusk.
- **Hero:** one focal point, the name. Editorial left: small round portrait above the stacked name, hero line and "currently" line below, on the left vignette. Right side open to the sun. No medium or large images.
- **Intro:** lead + paragraph on the left, quick facts (studying, leading, outside code, based in) as a row of four short columns underneath, left of the sun.
- **Tech stack section:** label + heading + one line on the left; two looping rows (languages, then frameworks/tools) of logo + name pills, centered margin to margin, edges fading out. Pause on hover.
- **Build stack:** Next.js (App Router) + TypeScript, Tailwind + CSS variables, Canvas 2D sky, Motion, content as TS data files + MDX, on Vercel.

## Not designed yet

Only the hero, intro, and tech stack sections have layouts. Experience, projects (and project detail pages), beyond code, fun / experimental, and connect still need to be designed before they're built.

## Still open

- Full-cycle sky: approve keyframes (dawn, sunrise, midday, afternoon, deeper midnight). Where the dial lives; it should also include the sunset/reset option.
- Where else italic appears: only in the name, or one consistent use elsewhere.
- Body text sizes and spacing (tune once real content exists).
- One-sentence purpose of the site.
- "Load into focus" idea: page opens at max blur and settles, like a memory coming back.
- Tech stack: real list of languages and tools (placeholders for now).
- Where each signature moment lives, and motion rules so animation stays calm.
- Home page depth: full content on the hub, or summaries that link out to deeper pages?

## Copy

All written copy (hero line, bios, captions, one-sentence purpose) is deferred to a later content pass. Use placeholders until then.
