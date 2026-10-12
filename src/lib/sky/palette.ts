// Sky keyframes, copied from the approved prototype (docs/reference/sky-prototype.html, `K`).
// blend.ts mixes between them as the page scrolls: golden hour → dusk → night.

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

/** Accent text color at golden hour and at dark (docs/visual-system.md → Color). */
export const STARLIGHT = "#E3E8FF";
export const SUN_GOLD = "#FFD48A";
