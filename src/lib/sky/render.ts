// The render pipeline (docs/visual-system.md → Prototype reference):
//   1. draw the scene on a tiny canvas (~48×27)
//   2. enlarge ×2 with smoothing on, then to the low-res canvas with smoothing on (this is the blur)
//   3. the browser enlarges the low-res canvas ×4 with smoothing off (`image-rendering: pixelated`
//      on the canvas), which makes the ~4px squares.
//
// The prototype's low-res canvas was a fixed 170×95, shown 680px wide (4px squares). Here it's
// sized from the screen instead (screen ÷ 4), so squares stay 4px on any screen size.

import type { SkyKeyframe } from "./palette";
import type { SkyScene } from "./scene";

/** Size of one visible sky pixel, in CSS pixels. */
const PIXEL = 4;
/** Tiny-canvas pixels per design unit: the prototype draws 680 units into 48 pixels. */
const TINY_PER_UNIT = 48 / 680;

function canvas(width: number, height: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(width));
  c.height = Math.max(1, Math.round(height));
  return c;
}

/** The centered part of the scene that covers a width × height screen, in design units. */
function view(scene: SkyScene, width: number, height: number) {
  const scale = Math.max(width / scene.width, height / scene.height);
  const w = width / scale;
  const h = height / scale;
  return { x: (scene.width - w) / 2, y: (scene.height - h) / 2, w, h };
}

/** Draws keyframe `k` of `scene` onto `target`, sized to cover a width × height area (CSS pixels). */
export function renderSky(
  target: HTMLCanvasElement,
  width: number,
  height: number,
  scene: SkyScene,
  k: SkyKeyframe,
) {
  if (width <= 0 || height <= 0) return;
  const v = view(scene, width, height);

  // 1. Tiny canvas: the visible part of the scene at ~48×27.
  const tiny = canvas(v.w * TINY_PER_UNIT, v.h * TINY_PER_UNIT);
  const tc = tiny.getContext("2d")!;
  const sx = tiny.width / v.w;
  const sy = tiny.height / v.h;
  tc.setTransform(sx, 0, 0, sy, -v.x * sx, -v.y * sy);
  scene.draw(tc, k);

  // 2. Blur: ×2 with smoothing, then up to the low-res canvas with smoothing.
  const mid = canvas(tiny.width * 2, tiny.height * 2);
  const mc = mid.getContext("2d")!;
  mc.imageSmoothingEnabled = true;
  mc.drawImage(tiny, 0, 0, mid.width, mid.height);

  target.width = Math.ceil(width / PIXEL);
  target.height = Math.ceil(height / PIXEL);
  target.style.width = `${target.width * PIXEL}px`;
  target.style.height = `${target.height * PIXEL}px`;
  const lc = target.getContext("2d")!;
  lc.imageSmoothingEnabled = true;
  lc.drawImage(mid, 0, 0, target.width, target.height);

  // 3. Pixelate: done by the browser via `image-rendering: pixelated` on the target canvas.
}
