# Visual system

> Exported from Notion ("visual system", under the personal website planning doc) on 2026-10-09. Full specs for how the site looks and moves. `design.md` only keeps one-line summaries.

## Central metaphor: golden hour

The site is one evening. The background is fixed and shifts as you scroll: golden hour (hero) → sunset (work) → dusk (personal) → night with stars (contact). Came from personal reflection: sunsets over the ocean, warm light meeting the incoming night, and nostalgia for old photos. Content appears as warm, captured moments (film photos, photobooth strips).

## Background

- **Visual style:** open coast sunset (no trees), blurred then pixelated into ~4px squares, at very heavy blur for a dreamy, abstract mood in the spirit of Drew's background. Limited sunset palette; avoid smooth "AI gradient" looks.
- **Texture:** animated film grain that starts very faint at golden hour and builds as the sky darkens (lighter when bright). **Backup:** hybrid — dither at golden hour handing off to grain toward night. Shimmer dropped (reads as low resolution).
- **Keyframes** (sky top → horizon / water):

| Moment | Sky (top → horizon) | Water | Sun |
|---|---|---|---|
| Golden hour | `#3A2E62` `#A4527A` `#E8846A` `#F7C27E` `#FBD9A0` | `#A85A78` `#5E3A66` `#36284F` | `#FFE9B8` |
| Dusk | `#1E1C44` `#4E3270` `#A24E78` `#E2846E` `#F0A070` | `#5E3A66` `#2E2448` `#1E1A38` | — |
| Night | `#0B0C20` `#141634` `#1C1D44` `#2E2A56` `#3A2C5E` | `#1E1A3A` `#120F28` `#0B0B1C` | — |

Daytime keyframes (dawn, sunrise, midday, afternoon, deeper midnight) are not approved yet; see "Still open" in `design.md`.

## Sky timing and modes

- **Scroll timing (default mode):** the sky follows overall page scroll progress, not individual sections. Hero is always golden hour, connect is always full night, and everything between stretches to fit the page length.
- **Three modes, the visitor's choice:**
  1. **Scroll** (default): golden hour to night as you scroll.
  2. **Pick the time:** a circular 24-hour dial plus light (midday) and dark (night) buttons.
  3. **Local time:** a toggle that sets the sky to the visitor's clock.
- **Nav controls:** a single light/dark button (sun and moon swap on click) with the local-time toggle next to it. Where the dial lives is still open.
- **Returning to default:** when the visitor leaves scroll mode, a small "sunset" pill slides in beside those controls to return to it, and hides again once back. Leaving a fixed mode animates the sky back to golden hour.
- **Fixed modes:** modes 2 and 3 keep the sky fixed while scrolling, with no forced stars at connect.
- **Full 24-hour cycle** is needed for modes 2 and 3. Text fades navy ↔ cream at mid-tone sky moments (see Day theme under Color).
- Golden hour stays the default and the heart of the metaphor; the rest of the day is something visitors can visit.

## Color

- **Text:** crisp warm cream `#FFF6EA` with a soft plum shadow, over a gentle darker vignette on the left side of the sky.
- **Accent:** text in links and the hero "currently" line shifts from Starlight (`#E3E8FF`) at golden hour to Sun gold (`#FFD48A`) as the sky darkens (blend runs over roughly the first third of the scroll). A warm four-point sparkle icon (slow twinkle) leads the "currently" line, and link underlines stay Sun gold the whole time.
- **Saved alternatives:** First star (`#BFD0FF`) as the starting blue; Honey (`#F2B45C`) or Apricot (`#FFB28C`) as the warm color.
- **Day theme:** navy ink `#1F1A3A` with a soft cream glow, a wide cream "morning haze" on the left (~0.72 strength, fading by ~70% across), plum accent `#4E3270`. Text fades navy ↔ cream at mid-tone sky moments.
- **Rule:** text must stay readable at every point of the scroll. Check golden hour (the brightest sky) first.

## Typography

- **Headings:** Newsreader.
- **Body, nav, labels:** Schibsted Grotesk (replaced Manrope 2026-10-08). Sizes and spacing to be tuned once real content exists.
- **Hero name:** Newsreader, stacked ("Jared" over "*Narvaez*" in italic), line-height about 0.95, 72px (desktop), weight 400, letter-spacing `-0.045em`. Word-spacing (`0.18em`) only matters if the name ever sits on one line, e.g. a navbar or footer. Needs a smaller size on phones (e.g. `clamp()`); spacing is in em so it scales with it.
- **Italic:** used in the surname. Whether it appears anywhere else is still open.

## Hero layout

- **Placement:** editorial left, text block starts at the 96px left margin, vertically centered (slightly above middle). Sits on the left-side vignette. Right side left open to the sun and horizon.
- **Order (top to bottom):** small round portrait (~84px, 2px cream border) → stacked name → hero line → "currently" line with sparkle.
- **Supporting text (prototype values, tune later):** hero line Schibsted Grotesk 18px, cream at ~78%; "currently" line 14px in the accent color; nav top-right, 14px weight 500, cream at ~82%, no monogram.
- **Rule:** the name is the only focal point. Nothing in the hero should be bigger or brighter than it.

## Intro layout

- **Placement:** left column at the 96px margin. Small "about" label with the sparkle (13px, accent color) → Newsreader lead (~32px, one phrase with the warm underline) → Schibsted paragraph (17px, line-height 1.65).
- **Quick facts:** one row of four equal columns (~760px wide total, 20px gaps) under the paragraph. Each column: small label (13px, ~72% ink) over the value (15px), with a thin ink rule on top. Stays left of the sun.
- **Vignette:** uses the site-wide widened vignette (evening: plum at ~0.42 fading out ~72% across; day: cream at ~0.72 fading out ~88% across), which covers the row's right end.
- **Mobile:** the row wraps to a 2×2 grid.

## Tech stack section

- **Header (left, 96px margin):** "tech stack" label with sparkle (13px, accent) → Newsreader heading (~40px) → one Schibsted line (17px).
- **Rows:** two rows, 96px from each side (centered, ~1088px wide at 1280). Row 1 languages, row 2 frameworks/tools. Opposite directions, ~42s and ~48s per loop, edges fade over the outer 7%. 22px between rows.
- **Items:** logo (~24px) + name (Schibsted 500, 18px) in a pill: 10px × 18px padding, full radius, 1px ink border at ~38%, fill tinted ~34% (dark plum in the evening, cream in the day). 14px gap.
- **Behavior:** loops on its own (accepted exception, like the cloud drift); pauses on hover.

## Motion

- Animation responds to the visitor; slow cloud drift; stars twinkle in at dusk; the accent sparkle twinkles slowly.

## Prototype reference (for building)

- **Render:** draw the scene on a tiny canvas (~48×27), upscale with smoothing to ~96×54 then to 170×95 (this is the blur), apply texture per pixel, then upscale to full size with smoothing off (this makes the ~4px pixels). Text is drawn crisp on top.
- **Grain:** a few pre-made noise frames cycled every ~70ms, blended with overlay; opacity about 0.07 at golden hour rising to about 0.22 at night.
