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

const inUnit =(n: unknown) => typeof n === "number" && Number.isFinite(n) && n >= 0 && n <= 1;

/** The stars in an `/api/stars` response that can be drawn. Anything malformed is skipped. */
export function drawableStars(data: unknown): VisitorStar[] {
  if (!Array.isArray(data)) return [];
  return data.filter(
    (s): s is VisitorStar => typeof s === "object" && s !== null && typeof s.id === "string" && inUnit(s.x) && inUnit(s.y),
  );
}

const phases = new Map<string, number>();

/** Paints the visitor stars onto the low-res sky canvas. `level` is the keyframe's star value. */
export function drawVisitorStars(
  ctx: CanvasRenderingContext2D,
  stars: readonly VisitorStar[],
  frame: SkyFrame,
  level: number,
  time: number,
) {
  if (level <= 0) return;
  for (const star of stars) {
    let phase = phases.get(star.id);
    if (phase === undefined) phases.set(star.id, (phase = phaseOf(star.id)));
    const a = visitorStarAlpha(level, phase, time);
    const { x, y } = skyToPixel(star, frame);
    // Same 1×1 fills as the white stars: each mixes gold into the sky pixel under it.
    ctx.fillStyle = `rgba(${GOLD},${a})`;
    ctx.fillRect(x, y, 1, 1);
    ctx.fillStyle = `rgba(${GOLD},${a * ARM})`;
    ctx.fillRect(x + 1, y, 1, 1);
    ctx.fillRect(x - 1, y, 1, 1);
    ctx.fillRect(x, y + 1, 1, 1);
    ctx.fillRect(x, y - 1, 1, 1);
  }
}
