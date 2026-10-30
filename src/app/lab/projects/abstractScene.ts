// Lab-only (2026-10-30): the "abstract" subpage background. The coast's look without the coast:
// a sky gradient top to bottom, the same drifting clouds, a soft sun glow low on the right, and
// the plum (or day cream) vignette on the left, all through the same blur → pixel → grain
// pipeline (render.ts). No horizon, sea or land. Moves into src/lib/sky/ only if Jared picks it.

import { withAlpha } from "@/lib/sky/blend";
import { DAY_VIGNETTE } from "@/lib/sky/palette";
import type { DrawnSky, SkyScene } from "@/lib/sky/scene";

const FULL_TURN = Math.PI * 2;
const SKY_STOPS = [0, 0.35, 0.55, 0.85, 1];

// The coast's clouds and sway (scene.ts), so the abstract sky moves the same way.
const CLOUDS: [number, number, number, number][] = [
  [150, 80, 190, 22],
  [520, 108, 170, 20],
  [300, 150, 210, 22],
  [600, 190, 140, 16],
  [420, 210, 190, 16],
];
const cloudDrift = (time: number, i: number) => Math.sin(time * 0.15 + i) * 14;

function vignetteLayer(
  ctx: CanvasRenderingContext2D,
  color: string,
  strength: number,
  reach: number,
  x: number,
  y: number,
  radius: number,
  width: number,
  height: number,
) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, radius * reach);
  g.addColorStop(0, withAlpha(color, strength));
  g.addColorStop(1, withAlpha(color, 0));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, width, height);
}

/**
 * An abstract scene in a width × height design space. `narrow` squeezes the clouds' x (the tall
 * phone version, like tallCoastScene); the sun's height is a share of the coast's 272 horizon.
 */
function abstract(width: number, height: number, narrow: number, vignette: [number, number, number]): SkyScene {
  const draw = (ctx: CanvasRenderingContext2D, k: DrawnSky, time: number) => {
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    SKY_STOPS.forEach((stop, i) => sky.addColorStop(stop, k.sky[i]));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    const yScale = height / 380;
    CLOUDS.forEach(([x, y, rx, ry], i) => {
      ctx.fillStyle = k.clouds[i];
      ctx.beginPath();
      ctx.ellipse((x + cloudDrift(time, i)) * narrow, y * yScale, rx * narrow, ry, 0, 0, FULL_TURN);
      ctx.fill();
    });

    // A soft glow, not a disc: the blur spreads it into a warm patch with no edge to read as a sun.
    const sunX = (k.sunX ?? 500) * narrow;
    const sunY = (k.sunY / 272) * height * 0.8;
    const glow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 110 * Math.max(narrow, 0.7));
    glow.addColorStop(0, withAlpha(k.sun, 0.9));
    glow.addColorStop(1, withAlpha(k.sun, 0));
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    const [vx, vy, radius] = vignette;
    const day = k.day ?? 0;
    if (day < 1) {
      vignetteLayer(ctx, k.vignette, k.vignetteStrength * (1 - day), k.vignetteReach, vx, vy, radius, width, height);
    }
    if (day > 0) {
      const { color, strength, reach } = DAY_VIGNETTE;
      vignetteLayer(ctx, color, strength * day, reach, vx, vy, radius, width, height);
    }
  };
  return { width, height, starBand: height * 0.6, horizon: height, draw };
}

export const abstractScene = abstract(680, 380, 1, [100, 150, 380]);
export const tallAbstractScene = abstract(380, 760, 380 / 680, [56, 300, 300]);
