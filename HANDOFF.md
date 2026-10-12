# Handoff — personal site rebuild

Last updated 2026-10-11 (end of the step 5 session). Branch `rebuild` (pushed, in sync with `origin/rebuild`). `main` still holds the old site and hasn't been touched.

Start every session by reading `CLAUDE.md`, then `docs/design.md` and `docs/build-plan.md`. This file is a snapshot of where things stand; the build plan is the live tracker.

## How we work (on top of CLAUDE.md)

- **Jared commits, pushes and does anything on GitHub himself.** Claude never runs `git commit`, `git push`, pull, or merge; at the end of a step it gives him the exact commands and a commit message. (This overrides CLAUDE.md's "one commit per finished step" wording.)
- **Explain before coding.** Before writing any code, list every file and change and wait for a yes, even for small steps.
- **Notion is the source of truth** for design. Decisions go into Notion first (visual system, decisions log, hub), then `docs/` is re-exported from it. Claude can edit Notion through the Notion connection, but shows the exact wording first.
- **Tick a build-plan step only after Jared approves it**, ideally before he commits, so the tick lands in the same commit (step 5 needed a separate "tick 5" commit).
- Commit commands leave out `.vscode/` (Jared's editor settings): `git add -A -- . ':!.vscode'`.
- Jared is learning: explain the why behind fixes and tools (e.g. this session walked through Chrome DevTools' Performance panel).

## What's done

| Step | Commit | What it added |
|---|---|---|
| 1. Scaffold | `f75af22` | Fresh Next.js 16.4 (App Router, TypeScript, Tailwind 4, ESLint), React 19.3, Motion 14, MDX (`@next/mdx` + `src/mdx-components.tsx`). Old scaffold removed. |
| 2. Foundations | `404038f` | Newsreader (normal + italic) and Schibsted Grotesk via `next/font`; palette and live color variables in `globals.css`; title "Jared Narvaez"; placeholder sparkle favicon (`src/app/icon.svg`). |
| 3. Static golden hour | `7b7b540` | The sky: tiny canvas → smoothed upscale (blur) → 4px pixelated squares. Landscape coast from the prototype; tall coast (option C) on portrait screens. Film grain (moved here from step 5). `npm run dev:phone`. Prototype filed at `docs/reference/sky-prototype.html`. |
| Docs sync | `7b13d30` | `docs/` re-exported from Notion with the 2026-10-11 decisions. |
| 4. Scroll blending | `72037be` | Golden hour → dusk → night driven by page scroll progress; live `--accent` and `--grain`; vignette blended through the keyframes; Vitest with 10 tests on the color math. |
| 5. Stars and cloud drift | `e707b66` + `c6cd31c` (tick) | Clouds sway sideways (prototype formula); stars as crisp single pixels fading in from dusk and twinkling; the sky now repaints every frame; Reduce Motion freezes grain, stars and clouds. 18 tests. |

Phase 1 (the sky) is complete.

## Current state

**Running it**
- `npm run dev` → http://localhost:3000
- `npm run dev:phone` → for testing on a phone on the same Wi-Fi; open the "Network:" URL it prints. Plain `npm run dev` doesn't work from a phone: Next 16 blocks dev connections from other addresses, so the page never loads its JavaScript. While `dev:phone` runs, `localhost:3000` doesn't load on the laptop either (it's bound to the Wi-Fi address); use the Network URL there too.
- `npm run build` → `npm run start` for a production check. Rebuilding while `npm run start` is running breaks that server; restart it.
- `npm run build`, `npm run lint`, `npm test` all pass.

**What's on the page:** the full sky (golden hour → night, clouds, stars, grain) behind temporary test content (`src/app/page.tsx`): a `[test heading]` block plus four screens of `[scroll test]` sections. All of it gets replaced, starting with the hero in step 7.

**Code map**
- `src/components/Sky.tsx` — the only React piece of the sky. Fixed full-screen container with two canvases (sky + grain). One animation loop repaints the sky every frame (cloud drift, twinkle) and swaps grain frames every 70ms. Writes `--accent` and `--grain` to the page root, only when scroll progress changes. Under Reduce Motion there's no loop: time freezes and the sky repaints only on scroll.
- `src/lib/sky/palette.ts` — keyframes (golden hour, dusk, night) copied from the prototype, including `stars` (0 / 0.3 / 1), plus Starlight / Sun gold.
- `src/lib/sky/blend.ts` — pure color math: `keyframeAt(t)`, `accentAt(t)`, `grainAt(t)`, `mixColor`. Tested in `blend.test.ts`.
- `src/lib/sky/scene.ts` — draws the landscape coast (680×380) and the tall phone coast (380×760), with cloud drift `sin(time × 0.15 + i) × 14` (narrowed on the phone). Each scene has a `starBand`: the bottom of the star area, the top ~two-thirds of the sky above the horizon (y=184 landscape, ~406 tall).
- `src/lib/sky/stars.ts` — stars: each low-res pixel in the band gets a repeatable hash "dice roll" (`STAR_ODDS` = 1 in 240), which also sets its brightness (0.5–1) and twinkle phase. Stable across reloads; density the same on every screen. The star list is cached per band size. Tested in `stars.test.ts`.
- `src/lib/sky/render.ts` — the pipeline: tiny canvas → blur → low-res canvas (screen ÷ 4) → stars drawn unblurred → browser pixelates.
- `src/lib/sky/texture.ts` — grain frames.
- `src/app/globals.css` — fixed palette, live variables (`--ink`, `--accent`, `--underline`, `--grain`), Tailwind mapping (`text-ink`, `text-accent`, `font-serif`, `font-sans`).

## Decisions made

All are logged in Notion (decisions log + visual system) and, except for the step 5 ones, in `docs/decisions-log.md`. Short version:

**This session (step 5)**
- **Stars are density-matched, not a fixed count.** The prototype's 46 stars would look ~5× sparser on a big screen, so each low-res pixel has a fixed chance of being a star.
- **Density thinned to 1 in 240** (from the prototype's 1 in 170) after Jared found the full sky too crowded: ~165 stars on a 1440px screen. Chose fewer stars over a smaller star area.
- **Star area = top ~two-thirds of the sky above the horizon**, measured per scene, so the tall phone sky gets the same share (answers the earlier "where do stars go on phones" question).
- **Star positions are fixed** (hash of pixel position, not `Math.random()`), so they don't jump on reload; most stay put on resize.
- **Cloud drift** follows the prototype exactly; on phones the sway narrows with the x-axis.
- **Reduce Motion** freezes grain, stars and clouds together (confirmed on Jared's iPhone).

**Earlier (2026-10-09 → 10-11)**
- Fresh scaffold instead of upgrading the old one; the rebuild happens on `rebuild`, `main` untouched until launch.
- **Phone sky = option C**, the coast recomposed in a tall 380×760 space.
- **Squares are 4px on every screen** (screen ÷ 4), not the prototype's fixed 170×95.
- **Texture = grain only.** Hybrid dither backup retired.
- **Vignette lives in the sky keyframes** (color, strength, reach); plum `#2A1630` at 0.45.
- **Accent** eases Starlight → Sun gold over the first third of the scroll; sky colors mix as straight RGB.
- **Placeholders:** 24px phone side margin until the hero step; page background `#3A2E62` shows only before the sky draws.
- **Deferred to step 7:** the plum text shadow. Prototype reference value: `rgba(42,18,40,.6)`, 18px blur.
- **Tooling:** Vitest for the sky math; `dev:phone` script.

## Open bugs and loose ends

**Known issues**
- **Load hitch from browser extensions:** a ~100ms stutter about 2s after load on Jared's laptop Chrome. Traced on 2026-10-11 with a Performance recording to extensions injecting scripts (BetterCampus's "AssignmentCache", Grammarly, Honey, etc.). It also happens on step 4, is smooth in Incognito and on iPhone, and isn't our code. Page scrolling stays smooth; only the sky pauses briefly. Re-test in the Phase 4 performance check. If the sky still feels janky there, the fix is moving sky drawing to a Web Worker (`OffscreenCanvas`); scroll-driven colors would still pause. The open "load into focus" idea could also hide it.
- **Accent readability at dusk:** the small accent line on the salmon band is the weakest text on the page. Planned fix: the text shadow in step 7.
- **Sun at dusk is only about half set** (y=300), but its color nearly matches the horizon so it looks gone. If it should be fully gone by halfway, that's a keyframe change for Jared to decide.
- **`npm audit`: 13 vulnerabilities** (9 high), all in dev/build tooling, none shipped to visitors. Don't run `npm audit fix --force`; a plain `npm audit fix` can be its own small change later.
- **`dev:phone` assumes Wi-Fi is `en0`.** If the IP lookup comes back empty, check `ipconfig getifaddr en1`.
- **Deleting a route can break `npm run build`** with a missing-module error from `.next/dev/types/`. Fix: delete `.next/dev/types`.
- **VS Code can overwrite files with a stale copy.** If a file "un-changes", check open editor tabs.

**Not done yet / housekeeping**
- **`docs/` is behind Notion:** the step 5 decisions (decisions log row + visual system "Stars" and "Cloud drift" bullets) were added to Notion on 2026-10-11 but `docs/` hasn't been re-exported yet.
- **Step 4 scroll smoothness on a real phone:** Jared tested step 5 on his iPhone and found it smooth, which covers this; no separate step 4 check needed.
- **Vercel** is unchecked (parked by Jared). Before relying on preview deploys: confirm the project is linked to `jar-narvz/jarednarvaez-app`, production branch = `main`, Node 22.x.
- **Notion hub status line** still reads "2026-10-08: discovery" (left for Jared).
- **Notion visual system page** lacks the "Sky timing and modes" section and day-theme color line that `docs/visual-system.md` keeps; copy them into Notion so the next export doesn't drop them.
- **`CLAUDE.md`** still says Claude commits after each step; worth updating to match how we actually work.
- **GitHub MCP connection** failed this session ("Authorization header is badly formatted"). Doesn't affect anything (Jared pushes with `git`), but fix it if GitHub tools are ever needed.
- **Testing limitation:** Claude's Chrome automation tab counts as hidden, so animation and timers are paused there. It can only check snapshots and can't record performance; Jared's browser (DevTools → Performance, "reload and record") is the real test.

## Next steps

1. **Step 6 — nav.** First confirm with Jared which links it holds. The prototype's "Work · About · Résumé · Contact" was never decided, and the sky controls (light/dark button, local-time toggle, "sunset" pill) are meant to live in the nav, though the sky modes themselves are Phase 3. Plan before building.
2. **Steps 7–9 — hero, intro, tech stack** (the only designed sections). Hero brings the text shadow, phone type sizes and the real phone margin. Placeholder copy only.
3. **Phase 3 sections need design first** (experience, projects, beyond code, fun, connect, sky modes 2–3, live widgets). If a session reaches one, stop and say it needs design.
4. Before launch (Phase 4): content pass, real-phone and friends test, performance check (re-test the extension load hitch), accessibility, then Jared merges `rebuild` into `main`.
