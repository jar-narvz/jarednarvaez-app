# Design doc

> Exported from Notion ("personal website planning doc") on 2026-10-16, trimmed for building: design-chat steering notes and the design-process principles stay in Notion. Notion is the source of truth while design is in progress; re-export when it changes. How to work in this repo is in `CLAUDE.md`.

The main design doc: principles and current state, one line per decision. Full specs are in `visual-system.md`; reasoning and rejected options are in `decisions-log.md`.

## What the site is

- **Impression to leave:** a well-rounded person beyond code.
- **Audience:** equal weight — recruiters and everyone else.
- **Central metaphor: golden hour.** The site is one evening, from golden hour to night. Every decision follows from it.
- **Clean layout + rich atmosphere.** An artful, textured backdrop under a simple, readable layout. No literal props.
- **Avoid the "AI gradient" look.** Limited palette, texture, and blur instead of smooth gradients.
- **Animation responds to the visitor.** Calm by default, with a couple of signature moments.
- **Animations are part of every design.** Every animation is listed in `visual-system.md` → Motion inventory. Never drop or simplify one.

## Decided

- **Structure:** hybrid — home page hub + a /projects index of every project; written write-ups only for a few class projects (decided 2026-10-30), plus detail pages for the featured home projects (decided 2026-10-30, design first).
- **Home order:** hero → intro (about me) → tech stack → experience (PhysaFlow, VSPA, PASAE, KOSMOS) → projects → beyond code (scrapbook preview) → connect. No GitHub activity section. No fun / experimental section (cut 2026-10-12; playful ideas become easter eggs after launch).
- **Signature ideas:** draggable photo scrapbook (beyond code), leave a star (connect: visitors add a gold pixel star to the night sky), live widgets like now playing and location (hero "currently" line).
- **Sky:** fixed background shifting golden hour → sunset → dusk → night with stars as you scroll.
- **Scroll sky timing:** follows overall page scroll progress, not sections. Hero is always golden hour, connect is always full night, everything between stretches to fit.
- **Background:** open coast sunset, heavily blurred then pixelated into 4px squares on every screen, with film grain (only) that builds as the sky darkens. Phones get a recomposed tall coast (option C).
- **Text:** warm cream with a soft plum shadow and a left-side vignette, widened ~25% site-wide (fades out ~72% across in the evening, ~88% in the day).
- **Accent:** Starlight → Sun gold text as the sky darkens, with a Sun gold four-point sparkle and link underlines.
- **Type:** Newsreader headings + Schibsted Grotesk body; IBM Plex Mono in the tech stack pills only (decided 2026-10-19). Hero name stacked with italic surname, tight spacing.
- **Motion:** slow cloud drift, stars twinkle in at dusk. Reduce Motion freezes grain, stars and clouds; scroll blending stays on.
- **Hero:** one focal point, the name. Editorial left: small round portrait above the stacked name, hero line and "currently" line below, on the left vignette. Right side open to the sun. No medium or large images.
- **Page layout:** every section's content sits in a centered 1000px column, left-aligned inside (like Drew's site); the nav stays at the screen edges. Narrower screens fall back to the side margin (decided 2026-10-19).
- **Nav:** about · experience · projects · résumé · contact (lowercase), top-right; "projects" goes to /projects, the others to home page sections (decided 2026-10-30). Hides while scrolling down and returns on scroll up; on phones a "menu" button opens the links full screen. Sky controls sit beside the links (not shown until the sky modes are built).
- **Intro:** lead + paragraph on the left, quick facts (studying, leading, currently @, based in) as a row of four short columns underneath, left of the sun.
- **Tech stack:** label + heading + one line on the left; two looping rows (languages; frameworks & tools; three rows from 2026-10-16 to 2026-10-19) of logo + name pills, running edge to edge of the content column, edges fading out. Pause on hover.
- **Experience:** collapsed by default; "+" opens a vertical timeline with four-point star markers (current role twinkles), animated as the line draws down and stars pop in one by one. Each role opens with its own "+", several at once. An open role shows its bullets plus tech tags (decided 2026-10-16).
- **Projects (home):** 2 featured projects (Posting Triage, OpenStreetMap Route-Impact Pipeline; updated 2026-10-30) as an editorial numbered index, collapsible like experience; when the section opens, each project shows open (no per-project "+") in a soft cell with a screenshot, summary, tags, a GitHub icon when the repo is public, "visit →" when the project has its own external page (one label everywhere, settled 2026-11-06), and "view project →" only where a write-up exists. The whole cell links to the project's detail page once it exists; its links and the screenshot (opens large) keep their own actions. "all projects →" leads to /projects.
- **Projects page (/projects):** 9 projects (Neural Net Classifier in Assembly removed 2026-11-06) as small screenshot cards in two plain groups, "personal" and "coursework & clubs", strongest first, with a total count; each card links to its proof (GitHub, project page, write-up). Cards are a grid with the screenshot on top (3 columns on desktop, 2 on tablets, 1 on phones) and fade up with a focus pull as they scroll into view; full spec in `visual-system.md` → Subpages (decided 2026-10-30).
- **Subpages:** one fixed look each: their own palette drawn as an abstract version of the sky (no coast), in a dark and a light version. Light/dark comes from the visitor's home page choice, else the device setting, with a small light/dark toggle. No dial, "my time" or visitor stars (visitor stars are home page only). Projects and write-ups: teal sea; scrapbook: blue hour (tentative). Full spec in `visual-system.md` → Subpages (decided 2026-10-30).
- **Light/dark button:** on the home page it does both jobs: it jumps the sky to midday or midnight, and that sets the light/dark a subpage opens in. On subpages the toggle is a plain light/dark switch. Any picked hour on the home page (the button or the dial) counts as a choice; scroll mode and "my time" leave subpages on the device setting (keeps the behavior already built; decided 2026-11-07).
- **Mark:** a small "jn" monogram (Newsreader, italic n, 20px, nav-strength ink) at top left on every page, linking home; on the home page it scrolls to the top. The favicon is the mark with both letters upright, navy in light browsers and cream in dark ones, replacing the placeholder sparkle (decided 2026-11-07). Full spec in `visual-system.md` → Subpages (decided 2026-10-30).
- **Subpage header and ending:** the mark at top left; home · résumé · contact · the light/dark toggle at top right. Every subpage ends with the home page's contact block (no leave a star, not a full screen tall) and the footer line, and the header's "contact" scrolls to it (decided 2026-10-30). A full-width rule sits above the contact block (decided 2026-10-30).
- **Beyond code (home):** a small scrapbook preview: left text block with one intro line and "open the scrapbook →"; 6 draggable prints clustered around it (larger on the right) inside a framed area with crop marks, plus a drag hint and reset. Not collapsible.
- **Footer:** one plain, quiet line, "designed and built by Jared Narvaez", left-aligned on the margin under connect (decided 2026-10-16).
- **Connect:** contact block on the left (email with copy, LinkedIn · GitHub · Résumé) + leave a star: click open night sky to leave one gold "pixel cross" star; hover shows city + time; yours says "you". Needs a small database + one API route; stores city only, never IP.
- **Sky modes (visitor's choice):** (1) scroll, the default; (2) pick the time, with a mini dial in the nav that grows into a full 24-hour dial, plus a light/dark button; (3) "my time" inside the dial, the visitor's local clock. A "sunset" pill returns to scroll mode. Navy day text theme. Full spec in `visual-system.md` → 24-hour sky.
- **Build stack:** Next.js (App Router) + TypeScript, Tailwind + CSS variables, Canvas 2D sky, Motion, content as TS data files + MDX, on Vercel.

## Launch plan (decided 2026-10-16)

- **MVP = the whole home page in scroll mode, with real content, deployed.** Sky, nav, hero, intro, tech stack, experience, projects, beyond code, and connect's contact block. Launch as soon as possible.
- **Not in the MVP:** sky modes 2 and 3 (nav shows no sky controls yet), leave a star, live widgets, and the /projects, project detail and /scrapbook pages. Until those pages exist, hide the "view project →", "all projects →" and "open the scrapbook →" links (don't link to empty pages).
- **After launch, in order:** sky modes → leave a star → design and build /projects, project detail and /scrapbook → live widgets → easter eggs.
- Phases and steps are in `build-plan.md`.

## Not designed yet

- Write-up page for Secure File Sharing System and Character-Level GPT (~300 words each, Jared writes them).
- Detail pages for the featured home projects (Posting Triage, route-impact): layout, and what they hold beyond the repo and the project page.
- /scrapbook page (full scrapbook + interests in depth).
- Live widgets in the hero "currently" line (now playing, location): which services, how they fetch.

If a step needs one of these, stop and say it needs design.

## Still open

- Where else italic appears: now the name and scrapbook photo captions; anywhere else?
- Easter eggs: collect small hidden surprises to add after launch.
- Which 6 photos go on the home page scrapbook (the large print needs a sharp one).
- Body text sizes and spacing (tune once real content exists).
- One-sentence purpose of the site.
- "Load into focus" idea: page opens at max blur and settles. Don't build it unless decided.

## Copy

The content pass (build step 14) is under way. Every piece of copy, link, file name, the tech stack list, roles and projects is in `docs/content.md` (exported from Jared's **Website content pass** doc, https://claude.ai/code/artifact/c788bec9-eefe-4963-a453-49bb3b2b6750); files it names are in `~/website-content`. Fill the data files from it, and keep `[placeholders]` for any field still marked `?` there.
