// Sky keyframes, copied from the approved prototype (docs/reference/sky-prototype.html, `K`).
// Dusk and night are added in step 4, when the sky starts blending.

type Five = [string, string, string, string, string];

export type SkyKeyframe = {
  /** Sky gradient, top → horizon. */
  sky: Five;
  /** One color per cloud, in the same order as the clouds in scene.ts. */
  clouds: Five;
  sun: string;
  /** Sun center height in the 680×380 design space. */
  sunY: number;
  /** Water bands, horizon → bottom. */
  water: [string, string, string];
  /** Far headland. */
  land: string;
  /** Near ridge in the foreground. */
  near: string;
  /** Opacity of the sun's reflection on the water. */
  reflection: number;
};

export const goldenHour: SkyKeyframe = {
  sky: ["#3A2E62", "#A4527A", "#E8846A", "#F7C27E", "#FBD9A0"],
  clouds: ["#8C4A78", "#FFD7A0", "#F4A57A", "#FFE0B0", "#E8846A"],
  sun: "#FFE9B8",
  sunY: 268,
  water: ["#A85A78", "#5E3A66", "#36284F"],
  land: "#7E4A6E",
  near: "#241A30",
  reflection: 1,
};
