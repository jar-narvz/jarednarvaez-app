// The coast scene, ported from the prototype's `scene()` (docs/reference/sky-prototype.html).
// Everything is in the prototype's 680×380 design space; render.ts scales it down.

import { withAlpha } from "./blend";
import type { SkyKeyframe } from "./palette";

/** A scene the render pipeline can draw: its design-space size and how to paint it. */
export type SkyScene = {
  width: number;
  height: number;
  draw: (ctx: CanvasRenderingContext2D, k: SkyKeyframe) => void;
};

const W = 680;
const H = 380;
const HORIZON = 272;
const FULL_TURN = Math.PI * 2;
const SKY_STOPS = [0, 0.35, 0.55, 0.85, 1];

const SUN_X = 500;

// [x, y, radiusX, radiusY] at their base positions. The slow drift comes in step 5.
const CLOUDS: [number, number, number, number][] = [
  [150, 80, 190, 22],
  [520, 108, 170, 20],
  [300, 150, 210, 22],
  [600, 190, 140, 16],
  [420, 210, 190, 16],
];

/** Radial vignette fading out from (x, y). Its color, strength and reach come from the keyframe. */
function drawVignette(
  ctx: CanvasRenderingContext2D,
  k: SkyKeyframe,
  x: number,
  y: number,
  radius: number,
  width: number,
  height: number,
) {
  const vignette = ctx.createRadialGradient(x, y, 0, x, y, radius * k.vignetteReach);
  vignette.addColorStop(0, withAlpha(k.vignette, k.vignetteStrength));
  vignette.addColorStop(1, withAlpha(k.vignette, 0));
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, width, height);
}

function drawCoast(ctx: CanvasRenderingContext2D, k: SkyKeyframe) {
  const sky = ctx.createLinearGradient(0, 0, 0, HORIZON);
  SKY_STOPS.forEach((stop, i) => sky.addColorStop(stop, k.sky[i]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, HORIZON);

  CLOUDS.forEach(([x, y, rx, ry], i) => {
    ctx.fillStyle = k.clouds[i];
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, FULL_TURN);
    ctx.fill();
  });

  // A flat disc; the blur in the pipeline makes its glow.
  ctx.fillStyle = k.sun;
  ctx.beginPath();
  ctx.arc(SUN_X, k.sunY, 56, 0, FULL_TURN);
  ctx.fill();

  // Far headland along the left, meeting the horizon at x=420.
  ctx.fillStyle = k.land;
  ctx.beginPath();
  ctx.moveTo(0, 248);
  ctx.bezierCurveTo(60, 228, 110, 236, 160, 220);
  ctx.bezierCurveTo(210, 206, 250, 228, 300, 242);
  ctx.bezierCurveTo(340, 254, 380, 262, 420, 272);
  ctx.lineTo(0, HORIZON);
  ctx.fill();

  // Water in three flat bands. Drawn after the sun, so it hides the sun's lower half.
  ctx.fillStyle = k.water[0];
  ctx.fillRect(0, 272, W, 108);
  ctx.fillStyle = k.water[1];
  ctx.fillRect(0, 310, W, 70);
  ctx.fillStyle = k.water[2];
  ctx.fillRect(0, 345, W, 35);

  ctx.globalAlpha = k.reflection;
  ctx.fillStyle = "#FFD9A0";
  ctx.beginPath();
  ctx.ellipse(SUN_X, 320, 40, 60, 0, 0, FULL_TURN);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Dark near ridge in the bottom-left foreground, reaching x=290.
  ctx.fillStyle = k.near;
  ctx.beginPath();
  ctx.moveTo(0, 300);
  ctx.bezierCurveTo(40, 290, 70, 296, 110, 284);
  ctx.bezierCurveTo(150, 272, 180, 282, 220, 300);
  ctx.bezierCurveTo(250, 314, 270, 340, 290, 380);
  ctx.lineTo(0, H);
  ctx.fill();

  // Plum vignette behind the name, so text stays readable.
  drawVignette(ctx, k, 100, 150, 380, W, H);
}

export const coastScene: SkyScene = { width: W, height: H, draw: drawCoast };

// Portrait version for phones (option C, chosen 2026-10-11). The same coast re-laid in a tall
// 380×760 space: x narrowed (×380/680), the sky stretched (horizon at 600 instead of 272),
// and the vignette moved to where text sits on a phone.
const TW = 380;
const TH = 760;
const T_HORIZON = 600;
const NARROW = TW / W;
const DROP = T_HORIZON - HORIZON;

function drawTallCoast(ctx: CanvasRenderingContext2D, k: SkyKeyframe) {
  const sky = ctx.createLinearGradient(0, 0, 0, T_HORIZON);
  SKY_STOPS.forEach((stop, i) => sky.addColorStop(stop, k.sky[i]));
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, TW, T_HORIZON);

  CLOUDS.forEach(([x, y, rx, ry], i) => {
    ctx.fillStyle = k.clouds[i];
    ctx.beginPath();
    ctx.ellipse(x * NARROW, y * (T_HORIZON / HORIZON), rx * NARROW, ry, 0, 0, FULL_TURN);
    ctx.fill();
  });

  // Same height relative to the horizon as the landscape sun, so it sets the same way.
  ctx.fillStyle = k.sun;
  ctx.beginPath();
  ctx.arc(SUN_X * NARROW, k.sunY + DROP, 44, 0, FULL_TURN);
  ctx.fill();

  ctx.fillStyle = k.land;
  ctx.beginPath();
  ctx.moveTo(0, 248 + DROP);
  ctx.bezierCurveTo(60 * NARROW, 228 + DROP, 110 * NARROW, 236 + DROP, 160 * NARROW, 220 + DROP);
  ctx.bezierCurveTo(210 * NARROW, 206 + DROP, 250 * NARROW, 228 + DROP, 300 * NARROW, 242 + DROP);
  ctx.bezierCurveTo(340 * NARROW, 254 + DROP, 380 * NARROW, 262 + DROP, 420 * NARROW, T_HORIZON);
  ctx.lineTo(0, T_HORIZON);
  ctx.fill();

  ctx.fillStyle = k.water[0];
  ctx.fillRect(0, T_HORIZON, TW, TH - T_HORIZON);
  ctx.fillStyle = k.water[1];
  ctx.fillRect(0, T_HORIZON + 38, TW, TH - T_HORIZON - 38);
  ctx.fillStyle = k.water[2];
  ctx.fillRect(0, T_HORIZON + 73, TW, TH - T_HORIZON - 73);

  ctx.globalAlpha = k.reflection;
  ctx.fillStyle = "#FFD9A0";
  ctx.beginPath();
  ctx.ellipse(SUN_X * NARROW, T_HORIZON + 48, 40 * NARROW, 60, 0, 0, FULL_TURN);
  ctx.fill();
  ctx.globalAlpha = 1;

  ctx.fillStyle = k.near;
  ctx.beginPath();
  ctx.moveTo(0, 300 + DROP);
  ctx.bezierCurveTo(40 * NARROW, 290 + DROP, 70 * NARROW, 296 + DROP, 110 * NARROW, 284 + DROP);
  ctx.bezierCurveTo(150 * NARROW, 272 + DROP, 180 * NARROW, 282 + DROP, 220 * NARROW, 300 + DROP);
  ctx.bezierCurveTo(250 * NARROW, 314 + DROP, 270 * NARROW, 690, 290 * NARROW, TH);
  ctx.lineTo(0, TH);
  ctx.fill();

  drawVignette(ctx, k, 56, 300, 300, TW, TH);
}

export const tallCoastScene: SkyScene = { width: TW, height: TH, draw: drawTallCoast };
