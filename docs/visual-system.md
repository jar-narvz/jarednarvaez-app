# Visual system

> Exported from Notion ("visual system", under the personal website planning doc) on 2026-10-16. Full specs for how the site looks and moves. `design.md` only keeps one-line summaries.

## Central metaphor: golden hour

The site is one evening. The background is fixed and shifts as you scroll: golden hour (hero) → sunset (work) → dusk (personal) → night with stars (contact). Came from personal reflection: sunsets over the ocean, warm light meeting the incoming night, and nostalgia for old photos. Content appears as warm, captured moments (film photos, photobooth strips).

## Background

- **Visual style:** open coast sunset (no trees), blurred then pixelated into ~4px squares, at very heavy blur for a dreamy, abstract mood in the spirit of Drew's background. Limited sunset palette; avoid smooth "AI gradient" looks.
- **Texture:** animated film grain that starts very faint at golden hour and builds as the sky darkens (lighter when bright), opacity 0.07 → 0.22. Grain only: the hybrid (dither → grain) was compared in the build and retired; shimmer dropped (reads as low resolution).
- **Pixel size:** squares stay 4px on every screen (the low-res canvas is sized from the screen), not a fixed 170×95 canvas.
- **Phones:** option C, the coast recomposed for a tall portrait screen. The sun sets the same way as on desktop. A 380×760 design space: horizon at 600, x narrowed ×380/680, vignette centered at (56, 300) with radius 300.
- **Vignette:** part of each sky keyframe (color, strength, reach) and blends with it. All evening keyframes: plum at 0.45. The day theme adds its own keyframes.
- **Scroll blending:** golden hour → dusk over the first half of the page, dusk → night over the second; the sun sinks as you go: about half set at dusk (halfway, where its color nearly matches the horizon glow) and fully below the horizon at night. Colors mix channel by channel (straight RGB), as in the prototype.
- **Keyframes (sky top → horizon / water):**

| Moment | Sky (top → horizon) | Water | Sun |
|---|---|---|---|
| Golden hour | `#3A2E62` `#A4527A` `#E8846A` `#F7C27E` `#FBD9A0` | `#A85A78` `#5E3A66` `#36284F` | `#FFE9B8` |
| Dusk | `#1E1C44` `#4E3270` `#A24E78` `#E2846E` `#F0A070` | `#5E3A66` `#2E2448` `#1E1A38` | see prototype |
| Night | `#0B0C20` `#141634` `#1C1D44` `#2E2A56` `#3A2C5E` | `#1E1A3A` `#120F28` `#0B0B1C` | see prototype |

The full keyframe values (clouds, sun color and height, headlands, near ridge, reflection) come from `docs/reference/sky-prototype.html`, the source of truth for the sky's geometry and colors. The sun sinks y=268 → 300 → 330 and is fully set at night; the reflection fades 1 → 0.3 → 0.

The full 24-hour cycle (dawn, sunrise, midday, afternoon, deep midnight) is under "24-hour sky" below. Scroll mode is the 18.5 → 19.6 → 21 stretch of that cycle.

## Sky timing and modes

- **Scroll timing (default mode):** the sky follows overall page scroll progress, not individual sections. Hero is always golden hour, connect is always full night, and everything between stretches to fit the page length.
- **Three modes, the visitor's choice:**
  1. **Scroll** (default): golden hour to night as you scroll.
  2. **Pick the time:** a mini dial in the nav that grows into a full 24-hour dial, plus a light/dark button.
  3. **My time:** a toggle inside the dial that sets the sky to the visitor's clock.
- **Fixed modes:** modes 2 and 3 keep the sky fixed while scrolling, with no forced stars at connect.
- Golden hour stays the default and the heart of the metaphor; the rest of the day is something visitors can visit.
- **Not in the MVP.** Sky modes 2 and 3 are built after launch (see `design.md` → Launch plan). Until then the nav shows no sky controls.

## 24-hour sky (sky modes 2 and 3) — approved 2026-10-12

> **Build spec.** The full day cycle used by "pick the time" (light/dark button, dial) and "my time". Approved after seeing it in the full home page mockup (`docs/reference/home-mockup.html`). Scroll mode is the 18.5 → 19.6 → 21 stretch of this same cycle.

### Keyframes (hour: sky top → horizon / water / cloud / headland)

| Hour | Name | Sky (top → horizon) | Water | Cloud | Headland |
|---|---|---|---|---|---|
| 0 and 24 | Deep midnight | `#07081A` `#0E1030` `#161840` `#22244C` `#2C2650` | `#16142E` `#0E0C22` `#08081A` | `#1E1E40` | `#06061A` |
| 5.3 | Dawn | `#1C2550` `#3A4A7A` `#7A6A94` `#C08A9A` `#E8B0A0` | `#4A4870` `#2C2E50` `#1A1C38` | `#6A6088` | `#1E1E36` |
| 6.8 | Sunrise | `#4A6A9E` `#8A9AC4` `#E8B4B0` `#FAD0A8` `#FFE6C0` | `#C49AA8` `#7A7098` `#3E4470` | `#F4C8C0` | `#3A3050` |
| 12 | Midday | `#4F86C6` `#74A4D8` `#9CC2E6` `#C4DDF0` `#E2EEF6` | `#6E9CC4` `#3F6E9C` `#2A4E78` | `#F6F4F0` | `#4A5A6E` |
| 16 | Afternoon | `#5A7FB8` `#86A2CC` `#B8C4D8` `#E6D8C4` `#F4E2C4` | `#8AA0BC` `#566E92` `#344868` | `#F4E6D8` | `#4A4458` |
| 18.5 | Golden hour | `#3A2E62` `#A4527A` `#E8846A` `#F7C27E` `#FBD9A0` | `#A85A78` `#5E3A66` `#36284F` | `#F2A88A` | `#4A2A52` |
| 19.6 | Dusk | `#1E1C44` `#4E3270` `#A24E78` `#E2846E` `#F0A070` | `#5E3A66` `#2E2448` `#1E1A38` | `#8A4E7A` | `#241838` |
| 21 | Night | `#0B0C20` `#141634` `#1C1D44` `#2E2A56` `#3A2C5E` | `#1E1A3A` `#120F28` `#0B0B1C` | `#2A2850` | `#08081A` |

Blend channel by channel (straight RGB) between neighboring keyframes. Golden hour, dusk and night match the evening keyframes above; where `docs/reference/sky-prototype.html` has richer geometry for those three, it still wins.

### Sun, stars, grain

- **Sun path:** arc across the sky from 6:00 to 20:30. With `f = (hour − 6) / 14.5`, `hi = sin(π·clamp(f))`: x = 85 + 482·clamp(f), y = 330 − 148·hi (in the 680×380 design space, horizon at 300). This gives y ≈ 268 at golden hour, ≈ 300 at dusk, below the horizon at night. Sun color blends `#FFE0A8` (low) → `#FFFBEE` (high). Reflection on the water fades as the sun gets low; softer at midday.
- **Stars by hour (fixed modes):** full from 21:00 to 4:48; fade out 4:48 → 6:12; fade in 19:36 → 21:00; none in daytime. Scroll mode keeps its own rule (0 → 0.3 → 1). Visitor stars follow the same brightness.
- **Grain:** 0.07 + 0.15 × star brightness (lightest in daylight).

### Day text theme and blending

- **Dayness** ramps 0 → 1 from 6:12 to 7:12 and 1 → 0 from 16:36 to 17:36.
- Everything blends with dayness: ink cream `#FFF6EA` ↔ navy `#1F1A3A`; shadow plum glow ↔ soft cream glow; accent (evening accent) ↔ plum `#4E3270`; link underlines Sun gold ↔ plum; tinted fills (pills, cells, copy pill) plum tint ↔ cream tint; vignette plum 0.45 fading by ~72% ↔ cream "morning haze" 0.72 fading by ~88%.
- Drive it all from CSS variables written once per frame (ink, ink RGB for lines, accent, underline, tint, shadow, vignette opacities).

### Mode behavior

- **Light/dark button (nav):** shows a moon when the sky is light (or in scroll mode) and jumps to night (0:00); shows a sun at night and jumps to midday (12:00).
- **My time:** the "my time" button inside the dial sets the sky to the visitor's clock and refreshes every ~30s. Clicking it again returns to scroll mode. (No separate local-time button in the nav.)
- **Transitions:** when the mode or hour changes, the sky animates along the **shorter way around the 24-hour clock** over ~1.2s (smoothstep), so the sun visibly moves (e.g. golden hour → dusk → night, or night → sunrise → midday). Reduce Motion: jump instantly.
- **"sunset" pill** appears whenever the visitor is not in scroll mode and returns them to it (the sky animates back to golden hour / scroll position).
- **Connect in daytime:** visitor stars invisible, hint reads "stars come out at night", placing disabled.
- **Nav order (right side):** links → "sunset" pill (only when not in scroll mode) → light/dark button → **mini dial, last on the far right**. On phones: "menu" button, then the same sky controls, with the mini dial still rightmost (sky controls stay visible, not hidden in the menu).
- **Mini dial (nav button):** 22px ring with an inner ring and a gold dot that sits at the sky's current hour (noon at top, midnight at bottom, 6 am left, 6 pm right), so it previews the time before it's clicked. The dot moves live as the visitor scrolls or changes modes.
- **Dial (opens below the mini dial):** click the mini dial and the full dial grows down from it (scale 0 → 1 from its top-right, ~450ms, slight overshoot), floating on the sky with no panel or box. ~190px: a ring with 24 hour ticks (longer at 0, 6, 12, 18), labels noon / 6p / midnight / 6a, a center readout of the time (Newsreader ~22px) and its name (golden hour, dusk, night, midnight, dawn, sunrise, midday, afternoon), and a sun handle on the ring (accent circle, cream center by day, dark center at night). Drag the handle or click anywhere on the ring to set the hour (snaps to 15 min); the sky follows instantly. Arrow keys step 15 min. Below the dial: "my time" (local time toggle) and "close". Clicking outside closes it. The nav stays visible (doesn't hide on scroll) while the dial is open.
- **Accessibility:** the dial is a `role="slider"` (0–24) with `aria-valuetext` like "7:30 pm"; the mini dial is a button with `aria-expanded`. Reduce Motion: the dial appears without the grow animation.

## Color

- **Text:** crisp warm cream `#FFF6EA` with a soft plum shadow, over a gentle darker vignette on the left side of the sky.
- **Accent:** text in links and the hero "currently" line shifts from Starlight (`#E3E8FF`) at golden hour to Sun gold (`#FFD48A`) as the sky darkens (eased blend over the first third of the scroll). A warm four-point sparkle icon (slow twinkle) leads the "currently" line, and link underlines stay Sun gold the whole time.
- **Saved alternatives:** First star (`#BFD0FF`) as the starting blue; Honey (`#F2B45C`) or Apricot (`#FFB28C`) as the warm color.
- **Day theme:** navy ink `#1F1A3A` with a soft cream glow, a wide cream "morning haze" on the left (~0.72 strength, fading by ~88% across), plum accent `#4E3270`. Text fades navy ↔ cream at mid-tone sky moments.
- **Rule:** text must stay readable at every point of the scroll. Check golden hour (the brightest sky) first.

## Typography

- **Headings:** Newsreader.
- **Body, nav, labels:** Schibsted Grotesk (replaced Manrope 2026-10-08). Sizes and spacing to be tuned once real content exists.
- **Hero name:** Newsreader, stacked ("Jared" over "*Narvaez*" in italic), line-height about 0.95, 72px (desktop), weight 400, letter-spacing `-0.045em`. Word-spacing (`0.18em`) only matters if the name ever sits on one line, e.g. a navbar or footer. Needs a smaller size on phones (e.g. `clamp()`); spacing is in em so it scales with it.
- **Italic:** used in the surname and in photo captions on scrapbook prints (Newsreader italic, in place of handwriting). Whether it appears anywhere else is still open.

## Page layout

- **Content column (decided 2026-10-19):** every section's content sits in a centered column, max 1000px wide, left-aligned inside (option B, like Drew's site). Built as `max(side margin, (page width − 1000px) / 2)` on each side, so below ~1100px wide it falls back to the side margin (up to 96px on desktop, 24px on phones).
- **What "the 96px margin" means below:** on wide screens, the column's left and right edges. Tech stack rows run edge to edge of the column.
- **Block widths (decided 2026-10-19):** dividers, section headers (with the "+"), the projects list and the experience timeline (80px narrower) fill the 1000px column, so their right edges line up with the tech stack rows. The intro quick-facts row is 640px (see intro layout), and reading text (hero line, intro paragraph, section lines) keeps its own widths. The hero block stays 640px.
- **Nav** stays on the 96px screen margin, outside the column.
- **Vignette** unchanged (still fades out ~72% across); text toward the column's right edge sits closer to the sun, so check golden hour when widening blocks.

## Hero layout

- **Placement:** editorial left, text block starts at the 96px left margin, vertically centered (slightly above middle). Sits on the left-side vignette. Right side left open to the sun and horizon.
- **Order (top to bottom):** small round portrait (~84px, 2px cream border) → stacked name → hero line → "currently" line with sparkle.
- **Supporting text (prototype values, tune later):** hero line Schibsted Grotesk 20px (was 18px; tuned 2026-10-19), cream at ~78%; "currently" line 14px in the accent color; nav top-right, 14px weight 500, cream at ~82%, no monogram.
- **Nav:** about · experience · projects · résumé · contact, lowercase, 28px apart; sky controls (16px line icons) after a wider gap; right edge on the 96px margin, 40px from the top (24px side margin on phones); hides on scroll down, returns on scroll up (250ms slide); phone menu full screen, Newsreader 36px links over plum `#2A1630` at 60% with blur.
- **Rule:** the name is the only focal point. Nothing in the hero should be bigger or brighter than it.
- **Phone margin:** 24px side margin, a placeholder until the hero step.

## Intro layout

- **Placement:** left column at the 96px margin. Small "about" label with the sparkle (13px, accent color) → Newsreader lead (~32px, one phrase with the warm underline) → Schibsted paragraph (17px, line-height 1.65).
- **Quick facts:** one row of four equal columns (640px wide total, 20px gaps; was ~760px until 2026-10-19, now lines up with the paragraph above and stays further from the sun) under the paragraph. Each column: small label (13px, ~72% ink) over the value (15px), with a thin ink rule on top. Stays left of the sun.
- **Vignette:** uses the site-wide widened vignette (evening: plum at 0.45 fading out ~72% across; day: cream at ~0.72 fading out ~88% across), which covers the row's right end.
- **Mobile:** the row wraps to a 2×2 grid.

## Tech stack section

- **Header (left, 96px margin):** "tech stack" label with sparkle (13px, accent) → Newsreader heading (~40px) → one Schibsted line (17px).
- **Rows:** three rows (two until 2026-10-16), 96px from each side (centered, ~1088px wide at 1280). Row 1 languages, row 2 web & tools, row 3 ML & data. Directions alternate row to row. Speed is set per row in pixels per second (about 26, 23 and 25 px/s), so the loop time follows the row's length and long rows don't race; slightly different speeds keep rows from lining up, edges fade over the outer 7%. 22px between rows.
- **Items:** logo (~24px) + name (Schibsted 500, 18px) in a pill: 10px × 18px padding, full radius, 1px ink border at ~38%, fill tinted ~34% (dark plum in the evening, cream in the day). 14px gap.
- **Logos (decided 2026-10-16):** single-color, filled with the current text color (`currentColor`, i.e. `--ink`) so they shift with the sky like the words. Source: the `simple-icons` npm package; import each icon by name (e.g. `siPytorch`) so only the used ones ship. Java, VS Code and Matplotlib aren't in Simple Icons: use Devicon's "plain" SVGs recolored to `currentColor`, saved in `src/icons/`. SQL uses a generic database-cylinder icon. Tableau has no free logo: keep the initials badge until Jared supplies one. Draw at 22px inside the 24px logo slot. Reference: tech stack logos mockup (https://claude.ai/artifact/3kfcoECvyiYWhBYeyG15iW).
- **Behavior:** loops on its own (accepted exception, like the cloud drift); pauses on hover.

## Experience

> **Build spec.** Self-contained: everything needed to build the experience section is here. Use the site's existing tokens (cream text, plum shadow, accent variable, sparkle icon, vignette) rather than the prototype's hard-coded values. Placeholder copy until the content pass. Decided 2026-10-11.

### What it is

Drew's work-section pattern, made ours with star markers: the section starts **collapsed**. A "+" opens a vertical **timeline** whose markers are the four-point **sparkle stars**. Each role has its own "+" to open its details. **Several roles can be open at once.** Sits around sunset on the scroll.

### Layout

- **Header (left, 96px margin):** same pattern as tech stack. "experience" label with sparkle (13px, accent) → Newsreader heading (~40px). A round toggle button (30px circle, 1px cream border at ~45%, 12px "+" drawn as two 1.3px strokes) sits at the right end of the header row.
- **Content column:** ~560px wide (placeholder, tune with real content), left of the sun, on the site-wide vignette.
- **Timeline rail:** 1px cream line at ~30%, 24px left padding for the markers. Starts 10px below the top of the first row and ends 10px above the bottom of the last.
- **Role row (10px top/bottom padding):**
  - Line 1: title (Schibsted 500, ~17px) + "@ Org" in the accent color.
  - Line 2: dates · location (Schibsted 14px, ~75% cream, tabular numerals, letter-spacing 0.02em). No mono font.
  - Right: the same 30px round "+" toggle as the header.
  - Marker: 12px sparkle centered on the rail, aligned with line 1.
- **Details (when open):** 2–3 bullets, Schibsted ~15px, line-height 1.6, ~92% cream. Under the bullets, the role's tech tags in the same small pills as projects (decided 2026-10-16). No project link.
- **Star states:** current role = full opacity + slow twinkle (opacity 1 ↔ 0.5, 2.4s ease-in-out, infinite; reuse the site's sparkle twinkle). Past roles = 55% opacity. Any open role = full opacity + soft glow (`drop-shadow(0 0 4px accent)`).
- **Order:** newest first.

### Behavior

- **Open section:** click the header "+".
- **Close section:** click it again. This closes every open role too.
- **Open a role:** click its "+" or anywhere on the row. Each role toggles independently; opening one never closes another.
- **Text color:** all colors follow the sky. Accent comes from the accent variable (Starlight → Sun gold); stars use the accent fill.

### Animation

| Moment | What moves | Duration | Delay | Easing |
|---|---|---|---|---|
| Section opens | Header toggle rotates 45° ("+" becomes "×"), border turns accent | 400ms | 0 | `cubic-bezier(.3,1.4,.5,1)` (slight overshoot) |
| Section opens | Rail line draws down (scaleY 0 → 1, origin top) | 700ms | 0 | `cubic-bezier(.4,0,.2,1)` |
| Section opens | Star *i* pops in (scale 0 → 1) | 500ms | 170 + 180·*i* ms | `cubic-bezier(.3,1.6,.5,1)` (pop) |
| Section opens | Row *i* fades up (opacity 0 → 1, translateY 8px → 0) | 450ms | 250 + 180·*i* ms | ease |
| Section closes | Everything above in reverse; rows and stars go bottom-up | same | 60ms stagger, last row first | same |
| Role opens / closes | Row toggle rotates 45°; details height 0 ↔ auto (CSS grid rows 0fr ↔ 1fr) | 400ms | 0 | `cubic-bezier(.4,0,.2,1)` |
| Role opens | Bullets fade in (opacity 0 → 0.92, translateY -4px → 0); star brightens + glow | 300ms | 100ms | ease |

The whole open sequence is about 1 second for 3 roles. Metaphor: opening the section is like stars coming out one by one.

### Accessibility

- Both toggles are real `<button>`s with `aria-expanded` and `aria-controls`. Labels: "Show experience" / "Hide experience" and "Show details for {title}" / "Hide details for {title}".
- Keyboard: Tab reaches the header toggle, then each role toggle; Enter/Space toggles. Clicking the row is a mouse convenience; the button is the real control.
- Collapsed content is hidden from screen readers and the tab order (`inert` or `hidden` once the close transition ends).
- Toggles get a 44px tap area on phones (the visible circle stays 30px).
- **Reduce Motion:** everything opens and closes instantly, all stars are already lit, no twinkle, no glow transition.

### Phones

Same structure on the 24px side margin. Title and "@ Org" may wrap; the toggle stays top-right of its row.

### Data shape

```typescript
export type Role = {
  title: string;      // "Multi-agent systems intern"
  org: string;        // shown as "@ Org"
  start: string;      // "2026" or "Jun 2026"
  end?: string;       // omit for "Present"
  location: string;
  current?: boolean;  // twinkling star
  bullets: string[];  // 2–3, filled in the content pass
  tags?: string[];    // tech tags under the bullets; omit for non-technical roles
};
// roles: internship, VSPA data assistant, PASAE external vice president (newest first)
```

### Reference implementation (prototype)

Plain CSS/JS from the approved chat prototype, to port into the React component (CSS transitions or Motion, either is fine). Class names are prototype-only. Working version: `docs/reference/home-mockup.html`.

```css
.line{transform:scaleY(0);transform-origin:top;transition:transform .7s cubic-bezier(.4,0,.2,1)}
.rail.on .line{transform:scaleY(1)}
.row{opacity:0;transform:translateY(8px);transition:opacity .45s ease,transform .45s ease}
.rail.on .row{opacity:1;transform:none}
.mk{transform:scale(0);transition:transform .5s cubic-bezier(.3,1.6,.5,1)}
.rail.on .mk{transform:scale(1)}
.row.cur .mk svg{animation:tw 2.4s ease-in-out infinite}
.row.op .mk svg{opacity:1;filter:drop-shadow(0 0 4px var(--accent))}
@keyframes tw{0%,100%{opacity:1}50%{opacity:.5}}
.tog{transition:transform .4s cubic-bezier(.3,1.4,.5,1),border-color .3s}
.tog.x{transform:rotate(45deg);border-color:var(--accent)}
.bw{display:grid;grid-template-rows:0fr;transition:grid-template-rows .4s cubic-bezier(.4,0,.2,1)}
.row.op .bw{grid-template-rows:1fr}
.bi{overflow:hidden}
.bi ul{opacity:0;transform:translateY(-4px);transition:opacity .3s ease .1s,transform .3s ease .1s}
.row.op .bi ul{opacity:.92;transform:none}
```

```javascript
// stagger: set per-row delays before toggling the section
function stagger(open){rows.forEach((r,i)=>{
  const d = open ? 250 + i*180 : (rows.length-1-i)*60;
  r.style.transitionDelay = d+'ms';
  r.querySelector('.mk').style.transitionDelay = (open ? d-80 : d)+'ms';
});}
// section toggle: closing also closes every role
// role toggle: r.classList.toggle('op') — independent, several can be open
```

Sparkle path (12px, `viewBox="-7 -7 14 14"`): `M0,-6.5C.9,-1 1,-1 6.5,0C1,1 .9,.9 0,6.5C-.9,1 -1,1 -6.5,0C-1,-1 -.9,-.9 0,-6.5Z`, fill = accent. Prefer the site's existing sparkle component if it already exists.

## Projects (home page section)

> **Build spec.** Self-contained. Shares its collapse/expand behavior with the experience section above, so build the shared parts once (toggle button, section open/close, independent row expand, Reduce Motion handling) and reuse them. Use the site's existing tokens rather than the prototype's hard-coded values. Placeholder copy and images until the content pass. Decided 2026-10-12.

### What it is

A short, curated overview of the most important projects (2: Secure File Sharing System and Character-Level GPT, decided 2026-10-16) on the home page, laid out as an **editorial numbered index** (01, 02, 03 with big serif titles). Like experience, the **whole section starts collapsed** behind a "+", and **each project expands** with its own "+" to show its details in a soft **cell**. **Several projects can be open at once.** Below the list, an "all projects →" link goes to the full projects page (`/projects`), and each open project has "view project →" linking to its own detail page (MDX). Sits around sunset → dusk on the scroll.

**MVP:** `/projects` and the detail pages aren't designed yet, so hide "all projects →" and "view project →" until they exist (keep the data fields and a flag to turn them on).

### Layout

- **Header (left, 96px margin):** "projects" label with sparkle (13px, accent) → Newsreader heading (~40px). The same 30px round "+" toggle as experience at the right end of the header row.
- **Content column:** ~640px wide (placeholder, tune with real content), left of the sun, on the site-wide vignette.
- **Project row header:** a grid of four columns: number (`01`, Schibsted 13px, ~60% cream, tabular numerals, ~36px column) · title (Newsreader ~30px, letter-spacing -0.015em) · type and year stacked, right-aligned (Schibsted 13px, ~70% cream) · "+" toggle (30px). 14px gaps, ~14px vertical padding. A 1px cream rule at ~22% sits above each row and one closes the list. Title turns accent color on hover and while its row is open.
- **Expanded details (the cell):** indented to start under the title (~50px). Cell = the same material as the tech stack pills: dark plum tint at ~34% (cream tint in the day theme), 1px cream border at ~30%, 14px radius, 14px padding. Inside, a row: **image** (plain screenshot, ~200×124 at 16:10, 8px radius, no frame or tilt) + text column: summary (Schibsted ~15px, line-height 1.55, 1–2 lines) → tech tags (same pills as elsewhere, small) → "view project →" link (accent, Sun gold underline).
- **Below the list:** "all projects →" link (accent, Sun gold underline), 18px under the last rule.
- **Phones:** the type/year column drops under the title; inside the cell the image stacks above the text at full cell width.

### Behavior

- **Open section:** header "+". **Close section:** click again; this also closes every open project.
- **Open a project:** its "+" or anywhere on its row header. Projects toggle independently; several can be open.
- **Links:** "view project →" → `/projects/[slug]`. "all projects →" → `/projects`. The nav's "projects" link scrolls to this section (open or not).

### Animation

| Moment | What moves | Duration | Delay | Easing |
|---|---|---|---|---|
| Section opens | Header toggle rotates 45°, border turns accent (same as experience) | 400ms | 0 | `cubic-bezier(.3,1.4,.5,1)` |
| Section opens | Rule above row *i* draws left → right (scaleX 0 → 1, origin left) | 600ms | 50 + 160·*i* ms | `cubic-bezier(.4,0,.2,1)` |
| Section opens | Row *i* fades up (opacity 0 → 1, translateY 8px → 0) | 450ms | 150 + 160·*i* ms | ease |
| Section opens | Closing rule draws, then "all projects →" fades in | 600ms / 400ms | after the last row (+100ms for the link) | same as above / ease |
| Section closes | Everything in reverse, last row first | same | 60ms stagger | same |
| Project opens / closes | Row toggle rotates 45°; details height 0 ↔ auto (CSS grid rows 0fr ↔ 1fr) | 450ms | 0 | `cubic-bezier(.4,0,.2,1)` |
| Project opens | Cell fades in (opacity 0 → 1, translateY -4px → 0) | 300ms | 120ms | ease |
| Project opens | Image focus pull: `blur(5px) brightness(1.15)` → none, like a memory coming into focus | 800ms | 200ms | ease |

Different from experience on purpose (rules draw sideways and images focus in, instead of a line drawing down with stars) so the two sections feel related, not copied.

### Accessibility

- Same as experience: real `<button>`s with `aria-expanded` / `aria-controls`; labels "Show projects" / "Hide projects" and "Show details for {title}" / "Hide details for {title}". Row header click is a mouse convenience.
- Collapsed content is `inert`/hidden once the close transition ends. 44px tap areas on phones.
- Images need real `alt` text (what the screenshot shows), set in the data.
- **Reduce Motion:** everything opens and closes instantly; images appear sharp (no focus pull).

### Data shape

```typescript
export type Project = {
  slug: string;          // detail page: /projects/[slug] (MDX)
  title: string;
  type: string;          // "Class project", "Game dev", "Web" ...
  year: string;
  summary: string;       // 1–2 lines
  tags: string[];        // tech used
  image: { src: string; alt: string }; // 16:10 screenshot
  featured?: boolean;    // shown on the home page (2)
  order?: number;        // home page order
};
// one list feeds both the home page (featured only) and /projects (all)
```

### Reference implementation (prototype)

Ports to React with CSS transitions or Motion. Class names are prototype-only; the toggle, grid-rows expand and stagger helper match experience.

```css
.rule{height:1px;background:rgba(255,246,234,.22);transform:scaleX(0);transform-origin:left;transition:transform .6s cubic-bezier(.4,0,.2,1)}
.list.on .rule{transform:scaleX(1)}
.row{opacity:0;transform:translateY(8px);transition:opacity .45s ease,transform .45s ease}
.list.on .row{opacity:1;transform:none}
.hd{display:grid;grid-template-columns:36px 1fr auto 30px;gap:14px;align-items:center;padding:14px 0}
.hd:hover .title,.row.op .title{color:var(--accent)}
.bw{display:grid;grid-template-rows:0fr;transition:grid-template-rows .45s cubic-bezier(.4,0,.2,1)}
.row.op .bw{grid-template-rows:1fr}
.bi{overflow:hidden}
.cell{display:flex;gap:18px;margin:2px 0 18px 50px;padding:14px;border-radius:14px;background:rgba(40,18,42,.34);border:1px solid rgba(255,246,234,.3);opacity:0;transform:translateY(-4px);transition:opacity .3s ease .12s,transform .3s ease .12s}
.row.op .cell{opacity:1;transform:none}
.img{border-radius:8px;filter:blur(5px) brightness(1.15);transition:filter .8s ease .2s}
.row.op .img{filter:none}
```

```javascript
function stagger(open){rows.forEach((r,i)=>{
  const d = open ? 150 + i*160 : (rows.length-1-i)*60;
  r.style.transitionDelay = d+'ms';
  r.querySelector('.rule').style.transitionDelay = (open ? d-100 : d)+'ms';
});}
// section toggle closes every project; project toggle is independent (several open)
```

## Beyond code (home page section)

> **Build spec.** Self-contained. A small preview of the scrapbook; the full scrapbook page (`/scrapbook`) and its in-depth interests come later and aren't designed yet. Use the site's existing tokens rather than the prototype's hard-coded values. Placeholder copy and photos until the content pass. Decided 2026-10-12.

### What it is

Inspired by the "off the clock" section on imdaryl.com (Daryl Patigas), scaled down. A short text block on the left, surrounded by a small pile of **6 photo prints** visitors can **drag around** inside a framed area, including over the text. A link leads to the full scrapbook page. **Not collapsible** (unlike experience and projects): hiding the pile would hide the thing meant to be played with. Sits around dusk on the scroll.

**MVP:** `/scrapbook` isn't designed yet, so hide "open the scrapbook →" until it exists, and on phones prints don't link anywhere yet.

### Layout

- **Framed area (the drag zone):** full content width (96px margins), ~480px tall on desktop (tune with real photos). Marked by a 1px cream rule at ~28% on the top and bottom edges, plus **crop marks** at the four corners: 14px L-shaped ticks, 1px cream at ~70%, set 6px outside the corners. No side rules and no fill. Prints can't leave this area.
- **Text block (left, vertically centered in the zone, ~28px in from the zone's left edge, ~270–320px wide):** "beyond code" label with sparkle (13px, accent) → Newsreader heading (~40px) → **one short intro line** (Schibsted ~17px, ~90% cream) → "open the scrapbook →" link (accent, Sun gold underline). No interests list on the home page. The text sits on the left vignette.
- **Prints:** cream paper `#FFF6EA`, 6px padding on top and sides, the caption below the photo in **Newsreader italic** (~14px, dark plum ink `#3A2840`), soft shadow `0 6px 16px` plum at ~35%. Photo crops are 5:4. Three sizes: small (base), medium 1.5×, large 2×.
- **Default arrangement (6 prints) = a tight cluster around the text with the larger prints on the right.** Positions from the prototype, in a 624×484 zone; scale them to the real zone (store as % of zone width/height). Each item is x, y, rotation, size:
  1. small at (20, 6), −6°, above the text, left
  2. small at (160, 0), +4°, above the text, right
  3. small at (40, H−128), +3°, below the text, left
  4. small at (190, H−124), −5°, below the text, right
  5. **large** at (330, 14), −3°, right of the text, top (use the strongest, sharpest photo here)
  6. **medium** at (450, H−200), +6°, right of the text, bottom, slightly overlapping the large one
- **Stacking:** in the default layout later prints sit on top (z-order 1–6). The text sits under all prints.
- **Hint line:** centered just under the bottom rule: grab icon + "drag the photos around · reset" (Schibsted 13px, ~75% cream), "reset" in the accent with a faint underline.

### Behavior

- **Drag:** pointer events (mouse and pen). On grab: the print comes to the front, scales to 1.05, shadow deepens (`0 18px 32px`), cursor "grabbing". While dragging it's clamped inside the zone. On drop: it settles at a new random tilt between −6° and +6°, so the pile always looks hand-placed.
- **Hover:** cursor "grab", shadow grows slightly.
- **Reset:** puts every print back in its default spot, replaying the entry animation.
- **Positions aren't saved;** a reload restores the default arrangement.
- **Link:** "open the scrapbook →" goes to `/scrapbook`.

### Animation

| Moment | What moves | Duration | Delay | Easing |
|---|---|---|---|---|
| Section enters view (once) and on reset | Print *i* drops into place (opacity 0 → 1, translateY −24px → 0, at its rotation) | 300ms | 120 + 90·*i* ms | `cubic-bezier(.3,1.4,.5,1)` |
| Grab | Scale 1 → 1.05, shadow deepens | 200ms | 0 | ease |
| Drop | Scale back to 1, rotate to the new random tilt | 300ms | 0 | `cubic-bezier(.3,1.4,.5,1)` |

### Phones and accessibility

- **Phones:** same layout (text, then a few prints around it), but **dragging is off** so it never fights page scrolling. The pile is a fixed scatter; tapping a print or the link opens `/scrapbook`. The hint line is hidden.
- **Keyboard:** prints aren't keyboard-draggable on the home page (decorative preview); the link is the keyboard path to the scrapbook. Prints are `aria-hidden` except their `alt`/caption, or the pile is one labeled group.
- Every photo needs real `alt` text in the data.
- **Reduce Motion:** prints appear in place with no drop-in; dragging still works, without the scale/tilt animation.

### Data shape

```typescript
export type ScrapbookPhoto = {
  id: string;
  src: string;
  alt: string;
  caption: string;          // short, lowercase, Newsreader italic
  home?: {                  // only for the 6 home page prints
    x: number; y: number;   // % of the zone's width / height
    rotate: number;         // degrees
    size: "sm" | "md" | "lg";
  };
};
// one list feeds the home preview (items with `home`) and the full /scrapbook page
```

### Reference implementation (prototype)

```javascript
function drag(el){let sx,sy,ox,oy;
  el.onpointerdown=e=>{e.preventDefault();el.setPointerCapture(e.pointerId);
    sx=e.clientX;sy=e.clientY;ox=el.offsetLeft;oy=el.offsetTop;
    el.style.zIndex=++z;el.classList.add('drag');
    el.style.transform=`rotate(${el.dataset.r}deg) scale(1.05)`};
  el.onpointermove=e=>{if(!el.classList.contains('drag'))return;
    let x=ox+e.clientX-sx,y=oy+e.clientY-sy;
    x=Math.max(0,Math.min(zone.clientWidth-el.offsetWidth,x));
    y=Math.max(0,Math.min(zone.clientHeight-el.offsetHeight,y));
    el.style.left=x+'px';el.style.top=y+'px'};
  el.onpointerup=()=>{el.classList.remove('drag');
    const r=(Math.random()*12-6).toFixed(1);el.dataset.r=r;
    el.style.transform=`rotate(${r}deg)`}}
```

```css
.print{position:absolute;background:#FFF6EA;padding:6px 6px 0;box-shadow:0 6px 16px rgba(30,10,30,.35);cursor:grab;touch-action:none;transition:box-shadow .2s,transform .3s cubic-bezier(.3,1.4,.5,1)}
.print.drag{cursor:grabbing;box-shadow:0 18px 32px rgba(30,10,30,.5);transition:box-shadow .2s}
.caption{font-family:Newsreader,serif;font-style:italic;color:#3A2840;padding:5px 2px 8px}
```

Motion's `drag` with `dragConstraints` set to the zone ref is a fine replacement for the hand-written pointer code.

## Connect (last home page section)

> **Build spec.** Self-contained. Two parts: a plain **contact block** (how people actually reach Jared) and **leave a star** (visitors add a gold pixel star to the night sky). Leave a star needs a small database and one API route. Use the site's existing tokens. Placeholder copy until the content pass. Decided 2026-10-12.
>
> **MVP:** build the contact block only. Leave a star comes after launch; until then there's no star hint and the open sky isn't clickable.

### What it is

The page ends at full night. On the left, a contact block. The open sky to the right is clickable: a visitor clicks anywhere there to leave **one gold pixel star** that stays in the sky for everyone after. Hovering a visitor star shows where and when it was left. Replaces the old visitor globe / ticket idea.

### Contact block

- **Placement:** left, at the 96px margin, vertically centered, on the vignette (~270–320px wide).
- **Content:** "connect" label with sparkle (13px, accent) → Newsreader heading (~40px) → one Schibsted line (~17px) → email address (Schibsted 500, ~17px) with a small "copy" pill (accent text, Sun gold border at ~50%, plum tint fill; turns to "copied" for ~1.4s) → a row of text links: LinkedIn · GitHub · Résumé (Sun gold underlines, 16px apart). No contact form.
- The contact block always wins: star hover and star placing are disabled over it.

### Leave a star (after launch)

- **Look (option B, "pixel cross"):** built on the sky's 4px pixel grid, drawn into the sky canvas after the blur like the white stars. A Sun gold `#FFD48A` center pixel at full strength plus the four touching pixels (up, down, left, right) at ~38%. Twinkles gently (each star 0.6–1.0 of its brightness, own phase). The visitor's own star adds four faint pixels two steps out (~25%) and pulses slightly, with a small "you" label in Sun gold (Schibsted 13px) just to its right.
- **Placing:** only inside the connect section, only when the sky is dark (see below), and only on open sky: not over the contact block, and not below ~90% of the way down to the horizon (clamped above the water). Click places the star at that spot. **One star per visitor.**
- **Hover (connect only):** within ~3 sky pixels of a visitor star, show a small label above it: `City, Region · Mon YYYY · h:mm am/pm` (the visitor's local time when it was left; e.g. "Manila, PH · Oct 2026 · 8:15 pm"). Your own reads "you · City · just now" (or the saved date on later visits). Cursor becomes a pointer over a star; crosshair over open sky while placing is possible.
- **Phones:** no hover, so tapping a star in connect shows its label for ~2s; tapping open sky places your star.
- **Hint:** bottom-right of the section, Schibsted 13px, ~85% cream. When the sky is dark and you have no star: "**click the sky** to leave a star" ("click the sky" in Sun gold). After placing: the hint hides. When the sky isn't dark (a daytime hour in dial or my-time mode): "stars come out at night" (just text, no link). Final wording in the content pass.
- **No counter.**

### How it behaves across the page and sky modes

- **Visitor stars are part of the sky,** the same fixed background behind the whole page. They're **visible everywhere** the sky is dark, exactly like the white stars, using the same brightness rule: 0 at golden hour → 0.3 at dusk → 1 at night. In scroll mode they fade in as you scroll toward connect; in dark (fixed night) mode they're visible behind every section.
- **Interaction is scoped to connect only.** Outside the connect section, in every mode, visitor stars are pure decoration: no hit-testing, no tooltips, no cursor change. Only while the pointer is inside the connect section (and not over the contact block) do hover and placing work.
- **"Dark enough" to place:** sky star brightness ≥ ~0.95 (scroll mode always reaches this at connect, which is pinned to full night). In fixed modes, placing works only when the chosen hour is night.
- **Positions** are stored relative to the sky, not pixels: `x` = % of sky width, `y` = % of the height from the top of the sky to the horizon. Map them onto the current canvas (desktop coast or the tall phone coast) so a star sits in the same place on any screen.
- **Reduce Motion:** no twinkle or pulse; stars still fade with the sky as you scroll.

### Data, API and privacy

```typescript
export type VisitorStar = {
  id: string;
  x: number;          // 0–1, share of sky width
  y: number;          // 0–1, share of sky height above the horizon
  city: string;       // "Manila"
  region: string;     // "PH" or "CA"
  leftAt: string;     // ISO timestamp (UTC)
  localTime: string;  // "8:15 pm", the visitor's local time when left (sent by the browser)
};
```

- **Storage:** a small key-value store or table (Vercel KV / Upstash Redis or Supabase). One list of stars.
- **API route** (Next.js route handler, e.g. `/api/stars`): `GET` returns all stars (cache briefly, e.g. 60s; cap at the latest ~500 if it ever grows). `POST { x, y, localTime }` adds one; the server reads the city and region from Vercel's request geo headers.
- **Privacy:** store only city, region, time and position. **Never store the IP address** or precise coordinates. Mention it in one line near the hint or in the footer later if needed.
- **One star per visitor:** remember the visitor's star id in `localStorage` (also used to mark "you" on return visits) and rate-limit `POST` per IP on the server (in memory or KV with a short TTL; the IP is used only for the limit, never saved with the star).
- **Failure:** if the API is down, the sky still renders with the white stars; placing quietly does nothing and the hint hides.

### Reference implementation (prototype)

```javascript
// draw a visitor star (style B) into the low-res sky image, a = brightness 0–1
const GOLD=[255,212,138];
function drawVisitorStar(img,x,y,a,isMine){
  px(img,x,y,GOLD,a);
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(o=>px(img,x+o[0],y+o[1],GOLD,a*.38));
  if(isMine)[[2,0],[-2,0],[0,2],[0,-2]].forEach(o=>px(img,x+o[0],y+o[1],GOLD,a*.25));
}
// same brightness rule as the white stars (t = 0 golden hour → 1 night)
const starBrightness=t=>t<.35?0:t<.65?.3*(t-.35)/.3:.3+.7*(t-.65)/.35;
```

## Footer (decided 2026-10-16)

- **What:** one plain line, "designed and built by Jared Narvaez", at the very bottom under connect (full night). No italic, no links, no "back to top".
- **Placement:** left-aligned on the site's side margin (96px on desktop, the phone margin on phones), lined up with the contact block; 28px from the bottom plus the phone's safe-area inset.
- **Type:** Schibsted Grotesk 12px, cream at ~60%, with the site's plum text shadow.
- **Behavior:** static, no animation. Keeps the bottom-right corner clear for the leave-a-star hint.
- **Reference:** footer options mockup, option A (https://claude.ai/artifact/MKUiG4qex5UYqGdSG4TYRg).

## Motion

### Motion inventory (every animation on the site)

> **Animations are part of the spec, not polish.** Build every row below with its section, using these exact durations and easings, and check it in the browser before calling a step done. Don't skip, simplify, or add animations. `docs/reference/home-mockup.html` has working code for all of them. Section specs above have the detailed timing tables; this is the checklist. The Reduce Motion column is what happens when the visitor has "reduce motion" on. Rows marked *(after launch)* belong to features outside the MVP.

| Where | Animation | Trigger | Timing / easing | Reduce Motion |
|---|---|---|---|---|
| Sky | Scroll blending golden hour → dusk → night (colors, vignette, accent Starlight → Sun gold) | Page scroll | Follows scroll progress; channel-by-channel RGB; accent eases (smoothstep) over the first third | Stays on (only moves when the visitor scrolls) |
| Sky | Sun sinks (y 268 → 300 → below horizon), reflection fades | Page scroll / hour | Follows scroll or the 24-hour sun arc | Stays on |
| Sky | Film grain | Always | 4 noise frames cycled every ~70ms, overlay, opacity 0.07 → 0.22 | Frozen on one frame |
| Sky | White pixel stars fade in and twinkle | Darkness | Brightness 0 → 0.3 → 1; each twinkles 20–100% of its brightness | Shown, no twinkle |
| Sky | Cloud drift | Always | Sideways sway up to 14 units, one sway ~42s | Still |
| Sky modes *(after launch)* | Hour change (light/dark button, "my time", sunset pill) animates the shorter way around the clock; sun moves along its arc | Mode or hour change | ~1.2s smoothstep | Instant |
| Sky modes *(after launch)* | Day text theme blend (ink cream ↔ navy, accent ↔ plum, vignette plum ↔ cream haze, tints) | Hour | Follows dayness ramp (6:12–7:12, 16:36–17:36) | Stays on |
| Nav | Hide on scroll down, return on scroll up | Scroll direction | translateY, 250ms; stays visible while the dial is open | Instant |
| Nav (phones) | Full-screen menu opens: backdrop fades in, links rise 10px and fade in one by one; closes with a fade | "menu" / "close" / link tap | Open 250ms fade; links 350ms ease, delay 60 + 40·*i* ms; close 200ms fade | Instant |
| Nav *(after launch)* | "sunset" pill slides in / out | Leaving / returning to scroll mode | translateX 8px → 0 + fade, 300ms | Instant |
| Nav *(after launch)* | Light/dark icon swap: the new icon (sun or moon) spins in | Sky turns dark / light | rotate −90° → 0, scale 0.6 → 1, fade; 350ms `cubic-bezier(.3,1.4,.5,1)` | Instant |
| Nav *(after launch)* | Mini dial's gold dot travels around its ring to the current hour | Every frame | Follows the sky | Stays (it shows state) |
| Nav *(after launch)* | Time dial grows down from the mini dial / shrinks back | Mini dial click / "close" / click outside | Open: scale 0 → 1 from top-right, 450ms `cubic-bezier(.3,1.3,.5,1)`. Close: scale → 0 + fade, 220ms ease-in | Instant |
| Hero (and labels) | Sparkle twinkle | Always | Opacity 1 ↔ 0.5, 2.4s ease-in-out, infinite | Still |
| Tech stack | Three pill rows loop, alternating directions; pause on hover | Always / hover | Linear, about 26, 23, 25 px/s (rows 1–3); loop time follows row length | Rows stay still |
| Experience + projects | Round "+" toggles rotate 45° into "×", border turns accent | Click | 400ms `cubic-bezier(.3,1.4,.5,1)` | Instant |
| Experience | Section opens: rail line draws down, stars pop in one by one, rows fade up; closes in reverse bottom-up | Header "+" | See Experience → Animation (line 700ms; star 500ms pop at 170 + 180·*i*; row 450ms at 250 + 180·*i*; close 60ms stagger) | Instant, all stars lit |
| Experience | Role opens: details slide open, bullets fade in, its star brightens with a glow; current role's star twinkles | Row "+" | Height 400ms; bullets 300ms after 100ms; twinkle 2.4s | Instant, no twinkle |
| Projects | Section opens: rules draw left → right, rows fade up, closing rule then "all projects →" fade in | Header "+" | See Projects → Animation (rule 600ms; row 450ms at 150 + 160·*i*) | Instant |
| Projects | Project opens: cell slides open and fades in; image focus pull (blur → sharp); title turns accent | Row "+" | Height 450ms; cell 300ms after 120ms; image 800ms after 200ms | Instant, image sharp |
| Beyond code | Prints drop into place one by one (also on "reset") | Section enters view (once) / reset | 300ms `cubic-bezier(.3,1.4,.5,1)`, delay 120 + 90·*i* ms | Appear in place |
| Beyond code | Print hover lift, grab (scale 1.05 + deeper shadow), drop (settles to a new random tilt ±6°) | Hover / drag | Hover shadow 200ms; drop 300ms overshoot | Drag works, no scale/tilt animation |
| Connect *(after launch)* | Visitor stars twinkle; your star pulses gently | Always (when dark) | Visitor 0.6–1.0 of brightness; yours 0.88–1.0 | Still |
| Connect *(after launch)* | Placing your star: it flares bright while an 8-pixel ring expands and fades around it, then the "you" label fades in | Click on open night sky | Flare + ring 900ms (ring radius 2 → 6 sky pixels); label fades in over 300ms after 350ms | Star and label appear instantly |
| Connect | "copy" pill swaps to "copied" | Click | "copied" for 1.4s | Instant |
| Connect *(after launch)* | Star hover label fades in; hint text fades between states | Hover / state | Label 200ms; hint 400ms | Instant |

- **Global Reduce Motion rule:** all transitions and loops above follow the Reduce Motion column; scroll-driven sky changes stay on.
- **Not yet decided:** "load into focus" (page opens at max blur and settles). Don't build it unless it's decided.

### Notes

- Animation responds to the visitor; slow cloud drift; stars twinkle in at dusk; the accent sparkle twinkles slowly.
- **Stars:** one crisp pixel each (a 4px square, drawn after the blur), warm white `#FFF1DE`, in the top ~two-thirds of the sky above the horizon on desktop and phones. About 1 in 240 low-res pixels holds a star (~165 on a 1440px-wide screen), in fixed positions. Brightness 0 → 0.3 → 1 from golden hour to night; each star twinkles between 20% and 100% of its own brightness (0.5–1).
- **Cloud drift:** each cloud sways sideways up to 14 units (in the 680-wide design space), one sway about every 42s; narrowed in proportion on the phone coast.
- **Reduce Motion:** grain freezes on a single frame; stars and cloud drift follow the same rule (shown, not moving). Scroll blending stays on, since it only moves when the visitor scrolls.

## Prototype reference (for building)

- **Render:** draw the scene on a tiny canvas (~48×27), upscale with smoothing to ~96×54 then to 170×95 (this is the blur), apply texture per pixel, then upscale to full size with smoothing off (this makes the ~4px pixels). Text is drawn crisp on top. In the build, the low-res canvas is sized from the screen (screen ÷ 4) instead of a fixed 170×95, so squares stay 4px.
- **Grain:** a few pre-made noise frames cycled every ~70ms, blended with overlay; opacity about 0.07 at golden hour rising to about 0.22 at night.
- **Home mockup:** `docs/reference/home-mockup.html` is the approved full home page mockup (every designed section, the scroll sky, day skies, sky controls, leave a star) with working code for every animation in the motion inventory. Placeholder copy and photos; its sky shapes are approximate, so `sky-prototype.html` and the code already in `src/lib/sky/` stay the source of truth for the sky.
