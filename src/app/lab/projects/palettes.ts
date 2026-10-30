// Lab-only (2026-10-30): custom palette proposals for subpage backgrounds, drawn with the
// abstract scene. Not approved: if Jared picks one, its values go into docs/visual-system.md
// first. Afterglow and blue hour reuse only hexes already in palette.ts (rebalanced); teal sea
// uses new hues on purpose, to show how far a palette can drift from golden hour.

import { dusk, type SkyKeyframe } from "@/lib/sky/palette";
import { TEAL_SEA } from "@/lib/sky/subpagePalettes";

export type LabPalette = {
  id: string;
  name: string;
  note: string;
  /** Hexes not in palette.ts. */
  newHexes: string[];
  sky: SkyKeyframe;
  grain: number;
  /** A pale version with the day text theme (navy ink, cream haze), for light mode. */
  light?: { sky: SkyKeyframe; grain: number; note: string; newHexes: string[] };
};

const base = (over: Partial<SkyKeyframe>): SkyKeyframe => ({ ...dusk, ...over });

export const PALETTES: LabPalette[] = [
  {
    id: "afterglow",
    name: "afterglow",
    note: "dusk's plums and pinks, no gold",
    newHexes: [],
    sky: base({
      sky: ["#1E1C44", "#4E3270", "#7A3E6E", "#A24E78", "#C46A7A"],
      clouds: ["#3E2A5E", "#7A3E6E", "#A24E78", "#C46A7A", "#B85A70"],
      sun: "#E2846E",
      sunY: 300,
      stars: 0.15,
    }),
    grain: 0.12,
  },
  {
    id: "blue-hour",
    name: "blue hour",
    note: "night and dawn blues, a faint mauve glow",
    newHexes: [],
    sky: base({
      sky: ["#07081A", "#141634", "#1C2550", "#3A4A7A", "#7A6A94"],
      clouds: ["#1E1E40", "#26244E", "#2A2856", "#3A4A7A", "#6A6088"],
      sun: "#C08A9A",
      sunY: 320,
      stars: 0.6,
    }),
    grain: 0.18,
    light: {
      note: "periwinkle into a peach glow, like just after sunrise",
      newHexes: [],
      sky: base({
        sky: ["#8A9AC4", "#9CC2E6", "#C4DDF0", "#E2EEF6", "#FAD0A8"],
        clouds: ["#F6F4F0", "#F6F4F0", "#F4C8C0", "#F6F4F0", "#F4C8C0"],
        sun: "#FFE6C0",
        sunY: 300,
        stars: 0,
      }),
      grain: 0.07,
    },
  },
  {
    // The approved palette, from src/lib/sky/subpagePalettes.ts.
    id: "teal-sea",
    name: "teal sea",
    note: "new hues: deep teal into a golden-hour band at the bottom",
    newHexes: ["#0E1E2A", "#123A44", "#1E5A5E", "#3E8A7E", "#E8B48A", "#163640", "#1E4C52", "#2A6A68", "#4E9A88", "#C49A7A", "#0A1A22"],
    ...TEAL_SEA.dark,
    light: {
      note: "pale seafoam into a warm sand band (afternoon's)",
      newHexes: ["#9CCBC4", "#B8DCD6", "#CFE6E2", "#E8F2EE"],
      ...TEAL_SEA.light,
    },
  },
];

/** The "plain" background: one flat color (dusk's top), no scene, no grain. */
export const PLAIN = "#1E1C44";
