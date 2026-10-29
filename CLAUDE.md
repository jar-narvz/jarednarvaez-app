# Jared Narvaez — personal website

Jared's personal portfolio site, being rebuilt from scratch. The design is decided in detail in `docs/`; your job is to build it faithfully, one small piece at a time, with Jared reviewing each step.

## Context

- Owner: Jared Narvaez, UC Berkeley CS + DS minor, graduating December 2027.
- This repo is jarnarvz.com (Next.js + TypeScript, deployed on Vercel). Recruiters open it from my resume.
- Source of truth for wording: my v3.5 resumes (Oct 29, 2026). The site can include more than the resumes, but must never contradict them or claim anything I can't defend in an interview.

## Rules

- Plan first; wait for my OK before editing files.
- Change only what the task names. Keep the existing design, colors, and layout.
- Never add a skill, tool, or claim I haven't confirmed I can defend in an interview.
- Show me a diff summary and run the build (`npm run build`) before I deploy.

## Read first

This file is the only steering doc for building; follow it over anything that conflicts.

Read these two at the start of every session:

- `docs/design.md` — the main design doc: principles and current state, one line per decision.
- `docs/build-plan.md` — what's done, what's in progress, and what's next.

Open the others only when the task needs them:

| File | Open when |
|---|---|
| `docs/visual-system.md` | Any work on color, type, texture, motion, layout, or the sky. All exact values (hex codes, sizes, spacing, timings) live here. |
| `docs/decisions-log.md` | Before proposing anything, to check it wasn't already rejected. |
| `docs/discovery.md` | Revisiting why a direction was chosen, or looking at reference sites. Early answers there (Fern palette, Manrope) are superseded. |
| `docs/formal-design-doc.md` | Writing or reviewing the formal design doc sections 1–7. |
| `docs/reference/home-mockup.html` | Building any home page section: the approved full mockup, with working code for every animation. Its sky is approximate; `docs/reference/sky-prototype.html` and `src/lib/sky/` win for the sky. |

The design docs are a snapshot exported from Jared's Notion "personal website planning doc". Notion stays the source of truth while design is still happening. Don't edit them unless Jared asks; if code reveals a design question or a needed decision, raise it with him instead.

**The exception is `docs/build-plan.md`.** Keep its "Now" line current, and tick a step only after Jared has reviewed and approved it. Don't add, remove, or reorder steps without asking.

## How we work

- **One step at a time.** Do only the step Jared asked for (usually the next one in `docs/build-plan.md`), then stop and tell him what changed and how to see it (which URL, what to scroll to). Never build ahead into the next step.
- **Build only what's designed.** If a step needs a section or detail that isn't designed yet (see "Not designed yet" in `docs/design.md`), stop and say so. Don't invent a layout to fill the gap; design happens with Jared first.
- **Show it running before asking.** Before asking Jared to approve a step or giving him commit commands, make sure he can see the result himself: the dev server running and the exact URL (the page, or a `/lab` page) with what to look at. If a step has nothing visible (pure logic), show something he can run instead, like the tests by name.
- **Plan before coding** anything bigger than a small fix: say which files you'll touch and what you'll add, and wait for a yes.
- **Options, then react.** When a design question isn't answered by the docs, don't pick for him. Build 2–3 options he can see in the browser (for example on a temporary `/lab` page), give a short lean with reasons, and let him choose.
- **Never write copy in Jared's voice.** Hero line, bios, captions, taglines, project descriptions: use obvious placeholders like `[hero line]` or `[about paragraph]`. Real copy now exists: for the content pass (build step 14) take it from `docs/content.md` exactly as written, and take files (portrait, résumé PDF, project images) from `~/website-content`, copying them into `public/`. Keep a placeholder for any field still marked `?` there.
- **Use the specs exactly.** Colors, fonts, sizes and timings come from `docs/visual-system.md`. Don't invent new colors or "improve" values. If a needed value isn't specified, say so and propose one.
- **Animations are part of the spec.** Build every animation listed for a section in `docs/visual-system.md` → Motion inventory, with its exact timing, easing and Reduce Motion behavior, and check it in the browser before calling the step done. Never drop, simplify or add one.
- **Readability first.** Text must stay readable at every point of the sky. Check golden hour (the brightest sky) first, then dusk and night, on desktop and a phone-width viewport. Remind Jared to check visual steps on his real phone too.
- **Everything traces back to golden hour.** Justify choices with the metaphor or a principle in `docs/design.md`. Flag choices that look inherited rather than decided.
- **Keep what's rejected rejected.** Don't re-propose anything the decisions log rules out.

## Stack (decided 2026-10-09)

- **Next.js (App Router) + TypeScript**, deployed on **Vercel**
- **Tailwind CSS** for layout and styling
- **Canvas 2D** for the sky, following the render pipeline in `docs/visual-system.md` (tiny canvas → smooth upscale for blur → grain → pixelated upscale). No WebGL or three.js unless Jared decides to switch after testing on a real phone.
- **Motion** (formerly Framer Motion) for the scrapbook drag and small UI transitions; plain CSS animation for simple loops (tech-stack rows, sparkle twinkle)
- **Content in the repo:** TypeScript data files for structured content (tech stack, experience, quick facts) and **MDX** for project detail pages. No CMS.
- **Fonts:** Newsreader (headings), Schibsted Grotesk (body) and IBM Plex Mono (tech stack pills only, decided 2026-10-19), loaded with `next/font/google`
- **No backend in the MVP.** Leave a star (a small store + `/api/stars`) and live widgets come after launch; don't add them, or any service account, until Jared reaches those steps.

## Architecture rules

- **Sky state drives the whole page.** The sky computes the current moment (from scroll progress, the time dial, or local time) and writes live values to CSS variables on the root element (for example ink color, accent color, vignette, grain strength). Components read the variables. Don't put per-frame values in React state; that re-renders the app every frame.
- **Scroll timing** follows overall page scroll progress, not sections. Hero is always golden hour; connect is always full night.
- Keep the sky in its own component and its color math in plain, testable functions (keyframes in, colors out), separate from drawing code.
- Placeholder images and logos are fine; label them clearly so they're easy to find and replace.

## Git

- Work on the `rebuild` branch. `main` holds the old site until launch (step 16), when Jared moves it to a `legacy` branch and merges `rebuild` into `main`.
- **Jared commits, pushes, and does everything on GitHub himself.** Never run `git commit`, `push`, `pull`, `merge` or `rebase`. At the end of a step, give him the exact commands and a commit message (one commit per finished step), with the build-plan tick included in the same commit. Commits are authored by Jared, with no `Co-Authored-By` line.
- Stage with `git add -A -- . ':!.vscode'` (his editor settings stay out of the repo).
- Never commit secrets. API keys go in `.env.local`, which stays git-ignored.

## Commands

- `npm run dev` — local dev server at http://localhost:3000
- `npm run build` — production build (run before saying a step is done)
- `npm run lint` — lint
- `npm test` — Vitest (sky color math and stars)
- `npm run dev:phone` — dev server reachable from a phone on the same Wi-Fi; open the "Network:" URL it prints

## Open questions to raise, not decide

These aren't settled in the design docs. Ask Jared when the work touches them:

- Everything listed under "still open" in `docs/design.md`
