# Handoff — personal site rebuild

Last updated 2026-10-11. Branch `rebuild` (pushed, in sync with `origin/rebuild`). `main` still holds the old site and hasn't been touched.

Start every session by reading `CLAUDE.md`, then `docs/design.md` and `docs/build-plan.md`. This file is a snapshot of where things stand; the build plan is the live tracker.

## How we work (on top of CLAUDE.md)

- **Jared commits, pushes and does anything on GitHub himself.** Claude never runs `git commit`, `git push`, pull, or merge; at the end of a step it gives him the exact commands and a commit message. (This overrides CLAUDE.md's "one commit per finished step" wording.)
- **Explain before coding.** Before writing any code, list every file and change and wait for a yes, even for small steps.
- **Notion is the source of truth** for design. Decisions go into Notion first (visual system, decisions log, hub), then `docs/` is re-exported from it. Claude can edit Notion through the Notion connection, but shows the exact wording first.
- Commit commands leave out `.vscode/` (Jared's editor settings): `git add -A -- . ':!.vscode'`.

## What's done

| Step | Commit | What it added |
|---|---|---|
| 1. Scaffold | `f75af22` | Fresh Next.js 16.4 (App Router, TypeScript, Tailwind 4, ESLint), React 19.3, Motion 14, MDX (`@next/mdx` + `src/mdx-components.tsx`). Old scaffold removed. |
| 2. Foundations | `404038f` | Newsreader (normal + italic) and Schibsted Grotesk via `next/font`; palette and live color variables in `globals.css`; title "Jared Narvaez"; placeholder sparkle favicon (`src/app/icon.svg`). |
| 3. Static golden hour | `7b7b540` | The sky: tiny canvas → smoothed upscale (blur) → 4px pixelated squares. Landscape coast from the prototype; tall coast (option C) on portrait screens. Film grain (moved here from step 5). `npm run dev:phone`. Prototype filed at `docs/reference/sky-prototype.html`. |
| Docs sync | `7b13d30` | `docs/` re-exported from Notion with the 2026-10-11 decisions. |
| 4. Scroll blending | `72037be` | Golden hour → dusk → night driven by page scroll progress; live `--accent` and `--grain`; vignette blended through the keyframes; Vitest with 10 tests on the color math. |

## Current state

**Running it**
- `npm run dev` → http://localhost:3000
- `npm run dev:phone` → for testing on a phone on the same Wi-Fi; open the "Network:" URL it prints. Plain `npm run dev` doesn't work from a phone: Next 16 blocks dev connections from other addresses, so the page never loads its JavaScript.
- `npm run build`, `npm run lint`, `npm test` all pass.

**What's on the page:** the full sky behind temporary test content (`src/app/page.tsx`): a `[test heading]` block plus four screens of `[scroll test]` sections so there's something to scroll. All of it gets replaced, starting with the hero in step 7.

**Code map**
- `src/components/Sky.tsx` — the only React piece of the sky. Fixed full-screen container with two canvases (sky + grain). Repaints on scroll (max once per frame) and on resize; writes `--accent` and `--grain` to the page root; runs the grain loop.
- `src/lib/sky/palette.ts` — keyframes (golden hour, dusk, night) copied from the prototype, plus Starlight / Sun gold.
- `src/lib/sky/blend.ts` — pure color math: `keyframeAt(t)`, `accentAt(t)`, `grainAt(t)`, `mixColor`. Tested in `blend.test.ts`.
- `src/lib/sky/scene.ts` — draws the landscape coast (680×380) and the tall phone coast (380×760).
- `src/lib/sky/render.ts` — the blur/pixelate pipeline; low-res canvas = screen ÷ 4.
- `src/lib/sky/texture.ts` — grain frames.
- `src/app/globals.css` — fixed palette, live variables (`--ink`, `--accent`, `--underline`, `--grain`), Tailwind mapping (`text-ink`, `text-accent`, `font-serif`, `font-sans`).

## Decisions made this session (2026-10-09 → 10-11)

All are logged in Notion and `docs/decisions-log.md`; this is the short version.

- Fresh scaffold instead of upgrading the old one; the rebuild happens on `rebuild`, `main` untouched until launch.
- **Phone sky = option C**, the coast recomposed in a tall 380×760 space (chosen on a temporary `/lab` page over two crops).
- **Squares are 4px on every screen** (screen ÷ 4), not the prototype's fixed 170×95, which gave ~8.5px squares on desktop.
- **Texture = grain only.** The hybrid dither backup was compared in the build and retired.
- **Reduce Motion:** grain freezes on one frame; stars and cloud drift will follow the same rule. Scroll blending stays on (the visitor drives it).
- **Vignette lives in the sky keyframes** (color, strength, reach), painted into the canvas so it's blurred and pixelated with the sky; plum `#2A1630` at 0.45. The day theme will just add keyframes.
- **Accent** eases Starlight → Sun gold over the first third of the scroll; sky colors mix as straight RGB like the prototype.
- **Grain moved into step 3**; step 5 is now stars + cloud drift.
- **Placeholders:** 24px phone side margin until the hero step; page background `#3A2E62` shows only before the sky draws.
- **Deferred to step 7:** the plum text shadow. Prototype reference value: `rgba(42,18,40,.6)`, 18px blur.
- **Tooling:** Vitest for the color math; `dev:phone` script.

## Open bugs and loose ends

**Needs checking**
- **Reduce Motion on a real phone:** Jared confirmed grain still *appears* with Reduce Motion on, but not yet that it's *frozen*. If it still moves, that's a bug in `Sky.tsx` (`updateMotion`).
- **Step 4 on a real phone:** scroll smoothness and mid-dusk colors haven't been checked on Jared's phone yet.

**Known issues**
- **Accent readability at dusk:** the small accent line on the salmon band is the weakest text on the page. Planned fix: the text shadow in step 7.
- **Sun at dusk is only about half set** (y=300), but its color nearly matches the horizon so it looks gone. Notion now says so accurately. If it should be fully gone by halfway, that's a keyframe change for Jared to decide.
- **Load hitch from browser extensions:** a ~100ms stutter about 2s after load on Jared's laptop Chrome. Traced on 2026-10-11 with a Performance recording to extensions injecting scripts (BetterCampus's "AssignmentCache", Grammarly, Honey, etc.). It also happens on step 4, is smooth in Incognito and on iPhone, and isn't our code. Page scrolling stays smooth; only the sky pauses briefly. Re-test in the Phase 4 performance check. If the sky still feels janky there, the fix is moving sky drawing to a Web Worker (`OffscreenCanvas`); scroll-driven colors would still pause. The open "load into focus" idea could also hide it.
- **`npm audit`: 13 vulnerabilities** (9 high), all in dev/build tooling (linter dependencies etc.), none shipped to visitors. Don't run `npm audit fix --force`; a plain `npm audit fix` can be its own small change later.
- **`dev:phone` assumes Wi-Fi is `en0`.** On a Mac where it isn't, the IP lookup comes back empty. Fix if it ever fails: check `ipconfig getifaddr en1`.
- **Deleting a route can break `npm run build`** with a missing-module error from `.next/dev/types/`. Fix: delete `.next/dev/types` (generated, safe to remove).
- **VS Code can overwrite files with a stale copy.** `layout.tsx` once reverted right after an edit, likely an open tab saving its old version. If a file "un-changes", check open editor tabs.

**Not done yet / housekeeping**
- **Vercel** is unchecked (parked by Jared). Before relying on preview deploys: confirm the project is linked to `jar-narvz/jarednarvaez-app`, production branch = `main`, Node 22.x (Next 16 needs ≥ 20).
- **Notion hub status line** still reads "2026-10-08: discovery" (left for Jared).
- **Notion visual system page** lacks the "Sky timing and modes" section and day-theme color line that `docs/visual-system.md` keeps; worth copying into Notion so the next export doesn't drop them.
- **`CLAUDE.md`** still says Claude commits after each step; worth updating to match how we actually work.
- **Testing limitation:** Claude's Chrome automation tab counts as hidden, so browsers pause animation there. Animated things (grain, later stars and clouds) can only be checked as snapshots; Jared's eyes are the real test.

## Next steps

1. **Step 5 — stars and cloud drift.** Port from the prototype: 46 stars as single crisp pixels on the low-res canvas, fading in with the keyframes' star value (`st`: 0 → 0.3 → 1) and twinkling; cloud drift `sin(time × 0.15 + i) × 14`. Both need an animation loop for the sky (today it only repaints on scroll), and both freeze under Reduce Motion. Plan first; check where stars should appear in the tall phone scene (not specified).
2. **Step 6 — nav.** Confirm with Jared which links it holds before building.
3. **Steps 7–9 — hero, intro, tech stack** (the only designed sections). Hero brings the text shadow, phone type sizes and the real phone margin. Placeholder copy only.
4. **Phase 3 sections need design first** (experience, projects, beyond code, fun, connect, sky modes 2–3, live widgets). If a session reaches one, stop and say it needs design.
5. Before launch (Phase 4): content pass, real-phone and friends test, performance and accessibility, then Jared merges `rebuild` into `main`.
