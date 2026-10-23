// Visitor stars (leave a star, docs/visual-system.md → Connect): the "pixel cross" look, option B.
// Like the white stars (stars.ts) they're drawn onto the low-res sky canvas after the blur, so
// each one stays a crisp cross of 4px squares, and they share the white stars' brightness.

import type { VisitorStar } from "@/lib/stars/types";

const GOLD = "255,212,138"; // Sun gold, #FFD48A
/** The four touching pixels' strength, relative to the center. */
const ARM = 0.38;

/** The visible sky on the low-res canvas: its width and the row where the horizon falls. */
export type SkyFrame = { width: number; horizonRow: number };

/**
 * A stored star's low-res pixel. `x` is a share of the visible sky's width; `y` a share of the
 * height from the top of the screen down to the horizon, so a star keeps its place in the sky on
 * the desktop coast and the tall phone coast alike.
 */
export function skyToPixel(star: Pick<VisitorStar, "x" | "y">, frame: SkyFrame) {
  return {
    x: Math.min(frame.width - 1, Math.round(star.x * frame.width)),
    y: Math.round(star.y * frame.horizonRow),
  };
}

/**
 * The sky position of a pointer at `point` (low-res sky pixels, e.g. clientX / 4): the inverse of
 * skyToPixel, so a star placed there is drawn in the pixel that was clicked.
 */
export function pixelToSky(point: { x: number; y: number }, frame: SkyFrame) {
  return { x: Math.floor(point.x) / frame.width, y: Math.floor(point.y) / frame.horizonRow };
}

/** One visitor star's opacity: the sky's star level × a gentle twinkle between 0.6 and 1.0. */
export function visitorStarAlpha(level: number, phase: number, time: number) {
  return level * (0.8 + 0.2 * Math.sin(time * 1.8 + phase));
}

/** A repeatable twinkle phase in [0, 2π) from a star's id, so its rhythm survives reloads. */
export function phaseOf(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return ((h >>> 0) / 4294967296) * Math.PI * 2;
}

/** How close (in sky pixels) the pointer must be to a star to hover it (spec: ~3). */
export const HOVER_REACH = 3;

/**
 * The star nearest to `point` (low-res sky pixels, e.g. clientX / 4) within HOVER_REACH, or null.
 * Uses the same mapping as the drawing, so hover lines up with what's on screen.
 */
export function nearestStar<S extends Pick<VisitorStar, "x" | "y">>(
  stars: readonly S[],
  point: { x: number; y: number },
  frame: SkyFrame,
): S | null {
  let best: S | null = null;
  let bestDistance = HOVER_REACH;
  for (const star of stars) {
    const p = skyToPixel(star, frame);
    // Measured from the middle of the star's pixel.
    const d = Math.hypot(p.x + 0.5 - point.x, p.y + 0.5 - point.y);
    if (d <= bestDistance) {
      best = star;
      bestDistance = d;
    }
  }
  return best;
}

const inUnit = (n: unknown) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1;

/** The stars in an `/api/stars` response that can be drawn. Anything malformed is skipped. */
export function drawableStars(data: unknown): VisitorStar[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (s): s is VisitorStar => typeof s === "object" && s !== null && typeof s.id === "string" && inUnit(s.x) && inUnit(s.y),
  );
}

/**
 * The visitor's own star and when it was placed (ms, the animation clock; -Infinity = no flare),
 * and when it started fading out after a reset, if it has.
 */
export type MyStar = { star: VisitorStar; placedAt: number; fadingAt?: number };

/** What the sky draws for leave a star: everyone's stars, and the visitor's own if they have one. */
export type VisitorSky = { stars: readonly VisitorStar[]; mine: MyStar | null };

export const NO_VISITORS: VisitorSky = { stars: [], mine: null };

/** The placing flare and ring (Motion inventory: 900ms). */
export const FLARE_MS = 900;
/** How long your star takes to fade out after a reset. */
export const FADE_OUT_MS = 400;
/** Your star's four extra pixels, two steps out, relative to the center. */
const OUTER = 0.25;

/** Your star's opacity: a slight pulse (0.76–1.0), brightened up to ~1.9× while it flares in. */
export function myStarAlpha(level: number, time: number, flare: number) {
  const boost = 1 + 0.9 * (1 - flare) * (flare < 0.15 ? flare / 0.15 : 1);
  return level * (0.88 + 0.12 * Math.sin(time * 2)) * boost;
}

/** How far the placing flare is, 0 → 1 over FLARE_MS. */
export const flareProgress = (placedAt: number, now: number) => Math.min(1, Math.max(0, (now - placedAt) / FLARE_MS));

function cross(ctx: CanvasRenderingContext2D, x: number, y: number, a: number, step: number, strength: number) {
  ctx.fillStyle = `rgba(${GOLD},${a * strength})`;
  ctx.fillRect(x + step, y, 1, 1);
  ctx.fillRect(x - step, y, 1, 1);
  ctx.fillRect(x, y + step, 1, 1);
  ctx.fillRect(x, y - step, 1, 1);
}

/** One pixel cross: the center at `a`, its four neighbors at ARM. Each fill mixes gold into the sky pixel. */
function pixelCross(ctx: CanvasRenderingContext2D, x: number, y: number, a: number) {
  ctx.fillStyle = `rgba(${GOLD},${a})`;
  ctx.fillRect(x, y, 1, 1);
  cross(ctx, x, y, a, 1, ARM);
}

const phases = new Map<string, number>();

/**
 * Paints the visitor stars onto the low-res sky canvas. `level` is the keyframe's star value;
 * `time` (seconds, the animation clock) drives the twinkle, your star's pulse and its flare.
 */
export function drawVisitorStars(
  ctx: CanvasRenderingContext2D,
  { stars, mine }: VisitorSky,
  frame: SkyFrame,
  level: number,
  time: number,
) {
  if (level <= 0) return;
  for (const star of stars) {
    // Your own star is drawn below, with its own look.
    if (star.id === mine?.star.id) continue;
    let phase = phases.get(star.id);
    if (phase === undefined) phases.set(star.id, (phase = phaseOf(star.id)));
    const { x, y } = skyToPixel(star, frame);
    pixelCross(ctx, x, y, visitorStarAlpha(level, phase, time));
  }
  if (!mine) return;

  // Your star: four more faint pixels two steps out, a slight pulse, and the placing flare with
  // an 8-pixel ring growing from 2 to 6 sky pixels and fading (from the mockup).
  const { x, y } = skyToPixel(mine.star, frame);
  const flare = flareProgress(mine.placedAt, time * 1000);
  // After a reset it fades out before it's gone.
  const fading = mine.fadingAt === undefined ? 0 : (time * 1000 - mine.fadingAt) / FADE_OUT_MS;
  const a = myStarAlpha(level, time, flare) * (1 - Math.min(1, Math.max(0, fading)));
  pixelCross(ctx, x, y, a);
  cross(ctx, x, y, a, 2, OUTER);
  if (flare < 1) {
    const r = 2 + 4 * flare;
    ctx.fillStyle = `rgba(${GOLD},${level * 0.7 * (1 - flare)})`;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.fillRect(x + Math.round(Math.cos(angle) * r), y + Math.round(Math.sin(angle) * r), 1, 1);
    }
  }
}
