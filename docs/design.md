# Personal website planning doc

> Exported from Notion ("personal website planning doc") on 2026-10-09. Notion is the source of truth while design is in progress; re-export when it changes.

> **Status (2026-10-08):** discovery. Structure, metaphor, background, accent, type, and hero layout are decided. Now focused on design; all written copy (hero line, bios, captions) is deferred to a later content pass. This page is the main design doc: principles and current state only. Details live in the other files in `docs/`.

## Steering notes (for Claude — read first)

- **Start here every time.** This page is the source of truth for principles and current state. Open another doc only when the task needs it:
  - **`visual-system.md`** → any work on color, type, texture, motion, or building a prototype
  - **`decisions-log.md`** → before proposing anything (check it wasn't already rejected), and after every decision
  - **`discovery.md`** → revisiting why a direction was chosen, the reference sites, or past explorations
  - **`formal-design-doc.md`** → writing or reviewing sections 1–7
- **One thing at a time.** Work on a single element until it's decided, then update the doc and propose the next step.
- **Options, then react.** Show a few options as visual previews over the animated sky (auto-playing golden hour → night with a slider; scroll-driven previews don't work in chat). Give a short lean with reasons, then let me choose. Don't decide for me.
- **Never write copy in my voice.** For hero lines, taglines, and bios, ask guiding questions and build from my answers.
- **Everything traces back to golden hour.** Justify choices with the metaphor or a principle below. Flag inherited choices that were never actually decided (like the italic surname was).
- **Readability first.** Text must stay readable at every point of the sky's scroll. Check golden hour, the brightest sky, first.
- **Log as we go.** After each decision: update "decided" on this page, add a row to the decisions log with why and what was rejected, and put full specs in visual system.
- **Keep this page short.** One line per decision here; details go in the other docs.

## Design principles

### What the site is

- **Impression to leave:** a well-rounded person beyond code.
- **Audience:** equal weight — recruiters and everyone else.
- **Central metaphor: golden hour.** The site is one evening, from golden hour to night. Every decision follows from it.
- **Clean layout + rich atmosphere.** An artful, textured backdrop under a simple, readable layout. No literal props.
- **Avoid the "AI gradient" look.** Limited palette, texture, and blur instead of smooth gradients.
- **Animation responds to the visitor.** Calm by default, with a couple of signature moments.

### How it gets designed

*From [How this site was built](https://www.samuelrizzon.dev/log/how-this-site-was-built) (Samuel Rizzon):*

- **One central metaphor.** Use references to set the bar, then name an idea that's mine. Every later decision follows from it.
- **Decide what the site is for in one sentence.** That sentence decides which sections stay.
- **Shrink scope to one thing at a time** (e.g. just the hero) and get it right before moving on.
- **Ask for options, then react.** Pick from a few, add something, say no fast.
- **Name the content before the layout.** Decide what a section must say, then design it.
- **Copy in my own voice.** Taglines that sound generic or AI-written get cut.
- **Keep what I reject.** Log rejected options and why.
- **Test like a stranger on a real phone**, and send it to friends before calling anything done.
- **Let jokes become features.** Small playful ideas can become secrets and easter eggs.

## Decided

*One line each. Full specs in `visual-system.md`; reasoning in `decisions-log.md`.*

- **Structure:** hybrid — home page hub + detail pages per project.
- **Home order:** hero → intro (about me) → tech stack (simple looping rows like [drewmanley.vercel.app](https://drewmanley.vercel.app)) → experience (internship, VSPA, PASAE) → projects → beyond code (dance, PASAE, scrapbook) → fun / experimental / interactive → connect + visitor globe/ticket. No GitHub activity section.
- **Signature ideas:** draggable photo scrapbook (beyond code), visitor globe / visitor ticket (contact), live widgets like now playing and location (hero "currently" line).
- **Sky:** fixed background shifting golden hour → sunset → dusk → night with stars as you scroll (timing below).
- **Background:** open coast sunset, heavily blurred then pixelated into ~4px squares, with film grain that builds as the sky darkens.
- **Text:** warm cream with a soft plum shadow and a left-side vignette, widened ~25% site-wide (fades out ~72% across in the evening, ~88% in the day).
- **Accent:** Starlight → Sun gold text as the sky darkens, with a Sun gold four-point sparkle and link underlines.
- **Type:** Newsreader headings + Schibsted Grotesk body. Hero name stacked with italic surname, tight spacing.
- **Motion:** slow cloud drift, stars twinkle in at dusk.
- **Tech stack layout:** label + heading + one line on the left; two looping rows (languages, then frameworks/tools) of logo + name pills, running margin to margin and centered, edges fading out. Pause on hover.
- **Scroll sky timing:** tied to overall page scroll progress, not to sections. Hero is always golden hour, connect is always full night, and everything between stretches to fit the page length.
- **Sky modes (visitor's choice):** (1) scroll, the default, golden hour to night as you scroll; (2) pick the time yourself, with a circular 24-hour dial plus light (midday) and dark (night) buttons; (3) your local time, a toggle that sets the sky to the visitor's clock. Nav holds a single light/dark button (sun and moon swap on click) with the local time toggle next to it. When the visitor leaves the default, a small "sunset" pill slides in beside them to return to scroll mode, and hides again once back. Modes 2 and 3 keep the sky fixed while scrolling, with no forced stars at connect. Needs a full 24-hour sky cycle. Day theme: navy ink (#1F1A3A) with a soft cream glow, a wide cream "morning haze" on the left, and a plum accent (#4E3270). Text fades navy ↔ cream at mid-tone sky moments; leaving a fixed mode animates the sky back to golden hour. Golden hour stays the default and the heart of the metaphor; the rest of the day is something visitors can visit. Replaces the plain light mode toggle idea.
- **Hero focus:** one thing only, the name section. No medium or large images on the landing view.
- **Intro layout:** lead + paragraph on the left, with quick facts (studying, leading, outside code, based in) as a single row of four short columns underneath, kept left of the sun.
- **Hero layout:** editorial left. Small round portrait above the stacked name, hero line and "currently" line below, all on the left vignette. Right side left open to the sun and horizon. Supporting text and nav kept quiet so the name is the only focal point.
- **Tech stack (build):** Next.js (App Router) + TypeScript, Tailwind CSS, Canvas 2D sky, Motion, content as TypeScript data files + MDX, hosted on Vercel. *(Decided 2026-10-09; see `decisions-log.md`.)*

## Currently working on

- Design only, using placeholder text. Copy (hero line, bios, captions, one-sentence purpose) comes in a later content pass.

## Still open

- Full-cycle sky: approve keyframes (dawn, sunrise, midday, afternoon, deeper midnight). Where the dial lives. Wherever it goes, it should also include the sunset/reset option.
- Where else italic appears: only in the name (a signature), or one consistent use elsewhere (photo captions, one word in the hero line, section headings).
- Body text sizes and spacing (tune once real content exists).
- One-sentence purpose of the site.
- "Load into focus" idea: page opens at max blur and settles, like a memory coming back.
- Tech stack: real list of languages and tools (mockups use placeholders).
- Where each signature moment lives, and motion rules so animation stays calm.
- Home page depth: full content on the hub, or summaries that link out to deeper pages?

## Next steps

1. Design the remaining sections one at a time with placeholder text.
2. Content pass: hero line, bios, captions, one-sentence purpose.
3. Write formal sections 3–5 (Problem Statement, Solution Statement, Solution Design: structure, home page, theme) with justifications.
