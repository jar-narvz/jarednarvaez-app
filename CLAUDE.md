# Jared Narvaez — personal website

Jared's personal portfolio site, being rebuilt from scratch. The design is decided in detail in `docs/`; your job is to build it faithfully, one small piece at a time, with Jared reviewing each step.

## Read first

`docs/design.md` is the source of truth for principles and current state. Read it at the start of every session. Open the others only when the task needs them:

| File | Open when |
|---|---|
| `docs/visual-system.md` | Any work on color, type, texture, motion, layout, or the sky. All exact values (hex codes, sizes, spacing, timings) live here. |
| `docs/decisions-log.md` | Before proposing anything, to check it wasn't already rejected. |
| `docs/discovery.md` | Revisiting why a direction was chosen, or looking at reference sites. Early answers there (Fern palette, Manrope) are superseded. |
| `docs/formal-design-doc.md` | Writing or reviewing the formal design doc sections 1–7. |

The docs are a snapshot exported from Jared's Notion "personal website planning doc". Notion stays the source of truth while design is still happening. Don't edit `docs/` unless Jared asks; if code reveals a design question or a needed decision, raise it with him instead.

## How we work

- **One step at a time.** Do only the step Jared asked for, then stop and tell him what changed and how to see it (which URL, what to scroll to). Never build ahead into the next section.
- **Plan before coding** anything bigger than a small fix: say which files you'll touch and what you'll add, and wait for a yes.
- **Options, then react.** When a design question isn't answered by the docs, don't pick for him. Build 2–3 options he can see in the browser (for example on a temporary `/lab` page), give a short lean with reasons, and let him choose.
- **Never write copy in Jared's voice.** Hero line, bios, captions, taglines, project descriptions: use obvious placeholders like `[hero line]` or `[about paragraph]`. Copy comes in a later content pass with him.
- **Use the specs exactly.** Colors, fonts, sizes and timings come from `docs/visual-system.md`. Don't invent new colors or "improve" values. If a needed value isn't specified, say so and propose one.
- **Readability first.** Text must stay readable at every point of the sky. Check golden hour (the brightest sky) first, then dusk and night, on desktop and a phone-width viewport.
- **Everything traces back to golden hour.** Justify choices with the metaphor or a principle in `docs/design.md`. Flag choices that look inherited rather than decided.
- **Keep what's rejected rejected.** Don't re-propose anything the decisions log rules out.

## Stack (decided 2026-10-09)

- **Next.js (App Router) + TypeScript**, deployed on **Vercel**
- **Tailwind CSS** for layout and styling
- **Canvas 2D** for the sky, following the render pipeline in `docs/visual-system.md` (tiny canvas → smooth upscale for blur → grain → pixelated upscale). No WebGL or three.js unless Jared decides to switch after testing on a real phone.
- **Motion** (formerly Framer Motion) for the scrapbook drag and small UI transitions; plain CSS animation for simple loops (tech-stack rows, sparkle twinkle)
- **Content in the repo:** TypeScript data files for structured content (tech stack, experience, quick facts) and **MDX** for project detail pages. No CMS.
- **Fonts:** Newsreader (headings) and Schibsted Grotesk (body), loaded with `next/font/google`
- Backend pieces (Spotify now-playing, visitor globe storage) are not decided yet. Don't add them until Jared reaches those sections.

## Architecture rules

- **Sky state drives the whole page.** The sky computes the current moment (from scroll progress, the time dial, or local time) and writes live values to CSS variables on the root element (for example ink color, accent color, vignette, grain strength). Components read the variables. Don't put per-frame values in React state; that re-renders the app every frame.
- **Scroll timing** follows overall page scroll progress, not sections. Hero is always golden hour; connect is always full night.
- Keep the sky in its own component and its color math in plain, testable functions (keyframes in, colors out), separate from drawing code.
- Placeholder images and logos are fine; label them clearly so they're easy to find and replace.

## Git

- Work on the `rebuild` branch. `main` holds the old site until the new one is ready.
- Small commits, one per finished step, with a clear message.
- Never push, merge into `main`, or force-push without asking Jared first.
- Never commit secrets. API keys go in `.env.local`, which stays git-ignored.

## Commands

<!-- Fill in once the project is scaffolded -->
- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — production build (run before saying a step is done)
- `npm run lint` — lint

## Open questions to raise, not decide

These aren't settled in the design docs. Ask Jared when the work touches them:

- Reduced motion: how the sky, grain, and loops should behave when a visitor has "reduce motion" turned on
- Everything listed under "still open" in `docs/design.md`
