// Sky keyframes, copied from the approved prototype (docs/reference/sky-prototype.html, `K`).
// blend.ts mixes between them as the page scrolls: golden hour → dusk → night. The rest of the
// day (midnight, dawn, sunrise, midday, afternoon) is at the bottom; hours.ts mixes all eight.

type Five = [string, string, string, string, string];

export type SkyKeyframe = {
  /** Sky gradient, top → horizon. */
  sky: Five;
  /** One color per cloud, in the same order as the clouds in scene.ts. */
  clouds: Five;
  sun: string;
  /** Sun center height in the 680×380 design space. The horizon is at 272, so higher = lower sun. */
  sunY: number;
  /** Water bands, horizon → bottom. */
  water: [string, string, string];
  /** Far headland. */
  land: string;
  /** Near ridge in the foreground. */
  near: string;
  /** Opacity of the sun's reflection on the water. */
  reflection: number;
  /** How bright the stars are, 0–1 (the prototype's `st`). Each star's own brightness and twinkle multiply this. */
  stars: number;
  /** Vignette behind the text, painted into the sky so it's blurred and pixelated with it. */
  vignette: string;
  vignetteStrength: number;
  /** Multiplier on the scene's base vignette radius. The day theme will use a wider reach. */
  vignetteReach: number;
};

// The evening vignette is the same plum at every keyframe, as in the prototype.
const EVENING_VIGNETTE = { vignette: "#2A1630", vignetteStrength: 0.45, vignetteReach: 1 };

export const goldenHour: SkyKeyframe = {
  sky: ["#3A2E62", "#A4527A", "#E8846A", "#F7C27E", "#FBD9A0"],
  clouds: ["#8C4A78", "#FFD7A0", "#F4A57A", "#FFE0B0", "#E8846A"],
  sun: "#FFE9B8",
  sunY: 268,
  water: ["#A85A78", "#5E3A66", "#36284F"],
  land: "#7E4A6E",
  near: "#241A30",
  reflection: 1,
  stars: 0,
  ...EVENING_VIGNETTE,
};

export const dusk: SkyKeyframe = {
  sky: ["#1E1C44", "#4E3270", "#A24E78", "#E2846E", "#F0A070"],
  clouds: ["#3E2A5E", "#7A3E6E", "#A24E78", "#C46A7A", "#B85A70"],
  sun: "#F2A070",
  sunY: 300,
  water: ["#5E3A66", "#2E2448", "#1E1A38"],
  land: "#4A2E5A",
  near: "#15111F",
  reflection: 0.3,
  stars: 0.3,
  ...EVENING_VIGNETTE,
};

export const night: SkyKeyframe = {
  sky: ["#0B0C20", "#141634", "#1C1D44", "#2E2A56", "#3A2C5E"],
  clouds: ["#1E1E40", "#26244E", "#2A2856", "#262450", "#2E2858"],
  sun: "#3A2C5E",
  sunY: 330,
  water: ["#1E1A3A", "#120F28", "#0B0B1C"],
  land: "#251D3E",
  near: "#08070F",
  reflection: 0,
  stars: 1,
  ...EVENING_VIGNETTE,
};

// The rest of the 24-hour day (docs/visual-system.md → 24-hour sky → Keyframes). Sky and water
// are exactly as specified. The spec gives less detail than the evening keyframes above, so:
// - clouds: its one cloud color, used for all five clouds;
// - land: its one headland color on both the far headland and the near ridge, so the coast reads
//   as one silhouette like the mockup (option C, Jared's pick in /lab/sky, 2026-10-20);
// - sun color and reflection strength: the approved mockup's formulas at that hour (the
//   reflection takes the sun's color, see scene.ts). Below the
//   horizon (midnight, dawn) the sun takes night's color and no reflection;
// - sunY: the sun path at that hour (hours.ts recomputes the full arc; this is for reference);
// - stars: the star rule at that hour (hours.ts recomputes it too);
// - vignette: the evening plum for now. The day theme's cream haze comes with dayness (part 3).

export const midnight: SkyKeyframe = {
  sky: ["#07081A", "#0E1030", "#161840", "#22244C", "#2C2650"],
  clouds: ["#1E1E40", "#1E1E40", "#1E1E40", "#1E1E40", "#1E1E40"],
  sun: "#3A2C5E",
  sunY: 330,
  water: ["#16142E", "#0E0C22", "#08081A"],
  land: "#06061A",
  near: "#06061A",
  reflection: 0,
  stars: 1,
  ...EVENING_VIGNETTE,
};

export const dawn: SkyKeyframe = {
  sky: ["#1C2550", "#3A4A7A", "#7A6A94", "#C08A9A", "#E8B0A0"],
  clouds: ["#6A6088", "#6A6088", "#6A6088", "#6A6088", "#6A6088"],
  sun: "#3A2C5E",
  sunY: 330,
  water: ["#4A4870", "#2C2E50", "#1A1C38"],
  land: "#1E1E36",
  near: "#1E1E36",
  reflection: 0,
  stars: 1 - 0.5 / 1.4,
  ...EVENING_VIGNETTE,
};

export const sunrise: SkyKeyframe = {
  sky: ["#4A6A9E", "#8A9AC4", "#E8B4B0", "#FAD0A8", "#FFE6C0"],
  clouds: ["#F4C8C0", "#F4C8C0", "#F4C8C0", "#F4C8C0", "#F4C8C0"],
  sun: "#FFE0A8",
  sunY: 304.5,
  water: ["#C49AA8", "#7A7098", "#3E4470"],
  land: "#3A3050",
  near: "#3A3050",
  reflection: 0.35,
  stars: 0,
  ...EVENING_VIGNETTE,
};

export const midday: SkyKeyframe = {
  sky: ["#4F86C6", "#74A4D8", "#9CC2E6", "#C4DDF0", "#E2EEF6"],
  clouds: ["#F6F4F0", "#F6F4F0", "#F6F4F0", "#F6F4F0", "#F6F4F0"],
  sun: "#FFFBEE",
  sunY: 187.4,
  water: ["#6E9CC4", "#3F6E9C", "#2A4E78"],
  land: "#4A5A6E",
  near: "#4A5A6E",
  reflection: 0.55,
  stars: 0,
  ...EVENING_VIGNETTE,
};

export const afternoon: SkyKeyframe = {
  sky: ["#5A7FB8", "#86A2CC", "#B8C4D8", "#E6D8C4", "#F4E2C4"],
  clouds: ["#F4E6D8", "#F4E6D8", "#F4E6D8", "#F4E6D8", "#F4E6D8"],
  sun: "#FFFBEE",
  sunY: 207.5,
  water: ["#8AA0BC", "#566E92", "#344868"],
  land: "#4A4458",
  near: "#4A4458",
  reflection: 0.55,
  stars: 0,
  ...EVENING_VIGNETTE,
};

/** Accent text color at golden hour and at dark (docs/visual-system.md → Color). */
export const STARLIGHT = "#E3E8FF";
export const SUN_GOLD = "#FFD48A";
