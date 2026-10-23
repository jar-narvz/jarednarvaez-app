// Stars, ported from the prototype's `texture()` (docs/reference/sky-prototype.html). Each star is
// one crisp low-res sky pixel, drawn after the blur so it shows as a single sharp 4px square.
//
// The prototype scattered 46 random stars over its 170×46-pixel star band, about 1 per 170
// pixels. Here every low-res pixel in the band gets a repeatable "dice roll" instead, so the
// density is the same on any screen size and the stars stay in the same place across reloads.

import { isBehindText, type PixelBox } from "./starless";

/**
 * Chance that a low-res pixel in the star band holds a star. 1 in 240: about 30% sparser than
 * the prototype's 1 in 170, which read as too many on the full-size sky (Jared, 2026-10-11).
 */
export const STAR_ODDS = 1 / 240;
const STAR_COLOR = "255,241,222";

type Star = { x: number; y: number; brightness: number; phase: number };

/** Repeatable pseudo-random number in [0, 1) for pixel (x, y). `salt` gives independent rolls. */
export function hash(x: number, y: number, salt: number) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(salt, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1103515245);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** One star's opacity: the sky's star level × its own brightness × a slow twinkle. */
export function starAlpha(level: number, brightness: number, phase: number, time: number) {
  return level * brightness * (0.6 + 0.4 * Math.sin(time * 1.8 + phase));
}

/** The stars in a band `rows` pixels tall and `width` wide. Brightness and twinkle phase as in the prototype. */
export function starsIn(width: number, rows: number): Star[] {
  const stars: Star[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < width; x++) {
      if (hash(x, y, 0) < STAR_ODDS) {
        stars.push({ x, y, brightness: 0.5 + 0.5 * hash(x, y, 1), phase: hash(x, y, 2) * Math.PI * 2 });
      }
    }
  }
  return stars;
}

// The star list only changes when the band's size does, so keep the last one.
let cached = { width: -1, rows: -1, stars: [] as Star[] };

/**
 * Paints the stars onto the low-res sky canvas. `level` is the keyframe's star value; stars
 * inside `textBoxes` are left out, so none sit behind text (starless.ts).
 */
export function drawStars(
  ctx: CanvasRenderingContext2D,
  width: number,
  rows: number,
  level: number,
  time: number,
  textBoxes: readonly PixelBox[] = [],
) {
  if (level <= 0) return;
  if (cached.width !== width || cached.rows !== rows) {
    cached = { width, rows, stars: starsIn(width, rows) };
  }
  // A 1×1 fill at this opacity mixes the star color into the sky pixel, like the prototype.
  for (const s of cached.stars) {
    if (isBehindText(s.x, s.y, textBoxes)) continue;
    ctx.fillStyle = `rgba(${STAR_COLOR},${starAlpha(level, s.brightness, s.phase, time)})`;
    ctx.fillRect(s.x, s.y, 1, 1);
  }
}
