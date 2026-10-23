// The render pipeline (docs/visual-system.md → Prototype reference):
//   1. draw the scene on a tiny canvas (~48×27)
//   2. enlarge ×2 with smoothing on, then to the low-res canvas with smoothing on (this is the blur)
//   3. stars go straight onto the low-res canvas, unblurred, one pixel each (stars.ts), then the
//      visitors' gold pixel crosses (visitorStars.ts)
//   4. the browser enlarges the low-res canvas ×4 with smoothing off (`image-rendering: pixelated`
//      on the canvas), which makes the ~4px squares.
//
// The prototype's low-res canvas was a fixed 170×95, shown 680px wide (4px squares). Here it's
// sized from the screen instead (screen ÷ 4), so squares stay 4px on any screen size.

import type { DrawnSky, SkyScene } from "./scene";
import type { PixelBox } from "./starless";
import { drawStars } from "./stars";
import { drawVisitorStars, NO_VISITORS, type SkyFrame, type VisitorSky } from "./visitorStars";

/** Size of one visible sky pixel, in CSS pixels. */
export const PIXEL = 4;
/** Tiny-canvas pixels per design unit: the prototype draws 680 units into 48 pixels. */
const TINY_PER_UNIT = 48 / 680;

// Scratch canvases, reused between redraws: the sky redraws on every scroll frame.
let tiny: HTMLCanvasElement | undefined;
let mid: HTMLCanvasElement | undefined;

/** Resizes `c` only when needed: changing a canvas's size wipes and reallocates it. */
function sized(c: HTMLCanvasElement, width: number, height: number) {
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  if (c.width !== w) c.width = w;
  if (c.height !== h) c.height = h;
  return c;
}

/** The centered part of the scene that covers a width × height screen, in design units. */
function view(scene: SkyScene, width: number, height: number) {
  const scale = Math.max(width / scene.width, height / scene.height);
  const w = width / scale;
  const h = height / scale;
  return { x: (scene.width - w) / 2, y: (scene.height - h) / 2, w, h };
}

/**
 * Draws keyframe `k` of `scene` onto `target`, sized to cover a width × height area (CSS pixels).
 * `time` (seconds) moves the clouds and the star twinkle. `visitors` are the left stars (and your
 * own) to draw. No white stars are drawn inside `textBoxes` (starless.ts). Returns the low-res
 * frame it drew, so connect can find the visitor stars on screen.
 */
export function renderSky(
  target: HTMLCanvasElement,
  width: number,
  height: number,
  scene: SkyScene,
  k: DrawnSky,
  time: number,
  visitors: VisitorSky = NO_VISITORS,
  textBoxes: readonly PixelBox[] = [],
): SkyFrame | null {
  if (width <= 0 || height <= 0) return null;
  const v = view(scene, width, height);

  // 1. Tiny canvas: the visible part of the scene at ~48×27.
  tiny = sized(tiny ?? document.createElement("canvas"), v.w * TINY_PER_UNIT, v.h * TINY_PER_UNIT);
  const tc = tiny.getContext("2d")!;
  const sx = tiny.width / v.w;
  const sy = tiny.height / v.h;
  tc.setTransform(sx, 0, 0, sy, -v.x * sx, -v.y * sy);
  scene.draw(tc, k, time);

  // 2. Blur: ×2 with smoothing, then up to the low-res canvas with smoothing.
  mid = sized(mid ?? document.createElement("canvas"), tiny.width * 2, tiny.height * 2);
  const mc = mid.getContext("2d")!;
  mc.imageSmoothingEnabled = true;
  mc.drawImage(tiny, 0, 0, mid.width, mid.height);

  sized(target, Math.ceil(width / PIXEL), Math.ceil(height / PIXEL));
  target.style.width = `${target.width * PIXEL}px`;
  target.style.height = `${target.height * PIXEL}px`;
  const lc = target.getContext("2d")!;
  lc.imageSmoothingEnabled = true;
  lc.drawImage(mid, 0, 0, target.width, target.height);

  // 3. Stars, in the rows of the low-res canvas that show the scene's star band.
  const starRows = Math.round(((scene.starBand - v.y) / v.h) * target.height);
  drawStars(lc, target.width, Math.max(0, starRows), k.stars, time, textBoxes);
  const frame = { width: target.width, horizonRow: ((scene.horizon - v.y) / v.h) * target.height };
  drawVisitorStars(lc, visitors, frame, k.stars, time);

  // 4. Pixelate: done by the browser via `image-rendering: pixelated` on the target canvas.
  return frame;
}
