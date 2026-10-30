// Subpage palettes (docs/visual-system.md → Subpages → Palettes, decided 2026-10-30), each in a
// dark and a light version, drawn with the abstract scene (abstractScene.ts). Dark takes the
// evening text theme, light the day theme. /projects and the write-ups use teal sea; blue hour
// (the scrapbook, tentative) joins when /scrapbook is designed.

import { dusk, type SkyKeyframe } from "./palette";

export type SubpageLook = { sky: SkyKeyframe; grain: number };
export type SubpagePalette = { dark: SubpageLook; light: SubpageLook };

// Unlisted keyframe values (sun disc, water, land, reflection, vignette reach) are dusk's; the
// abstract scene doesn't draw most of them.
const base = (over: Partial<SkyKeyframe>): SkyKeyframe => ({ ...dusk, ...over });

/** Teal sea: deep teal into a golden-hour band (dark); pale seafoam into warm sand (light). */
export const TEAL_SEA: SubpagePalette = {
  dark: {
    sky: base({
      sky: ["#0E1E2A", "#123A44", "#1E5A5E", "#3E8A7E", "#E8B48A"],
      clouds: ["#163640", "#1E4C52", "#2A6A68", "#4E9A88", "#C49A7A"],
      sun: "#F7C27E",
      sunY: 300,
      stars: 0.2,
      vignette: "#0A1A22",
      vignetteStrength: 0.5,
    }),
    grain: 0.12,
  },
  light: {
    sky: base({
      sky: ["#9CCBC4", "#B8DCD6", "#CFE6E2", "#E8F2EE", "#F4E2C4"],
      clouds: ["#F6F4F0", "#F6F4F0", "#F6F4F0", "#F6F4F0", "#F4E6D8"],
      sun: "#FFFBEE",
      sunY: 300,
      stars: 0,
    }),
    grain: 0.07,
  },
};
