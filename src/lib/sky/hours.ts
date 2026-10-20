// The 24-hour sky's math (docs/visual-system.md → 24-hour sky), used by sky modes 2 and 3:
// an hour in (0–24), colors and values out. No canvas or React here, so it's easy to test
// (hours.test.ts). Ported from the approved mockup's `keyAt()`, `starA()` and `dayness()`.
// Scroll mode keeps its own math in blend.ts; it's the 18.5 → 19.6 → 21 stretch of this clock.

import { mixKeyframes } from "./blend";
import {
  afternoon,
  dawn,
  dusk,
  goldenHour,
  midday,
  midnight,
  night,
  sunrise,
  type SkyKeyframe,
} from "./palette";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Wraps any hour onto the clock: -1 → 23, 25 → 1, 24 → 0. Hours already on the clock come back
 * untouched; the usual ((h % 24) + 24) % 24 would turn 6.2 into 6.1999….
 */
export function wrapHour(hour: number) {
  const h = hour % 24;
  return h < 0 ? h + 24 : h + 0; // + 0 turns -0 into 0
}

// Hour → keyframe, in order around the clock. Midnight is at both ends so 21 → 24 blends night
// into midnight.
const DAY_CYCLE: [number, SkyKeyframe][] = [
  [0, midnight],
  [5.3, dawn],
  [6.8, sunrise],
  [12, midday],
  [16, afternoon],
  [18.5, goldenHour],
  [19.6, dusk],
  [21, night],
  [24, midnight],
];

/**
 * The sun's center in the 680×380 design space: an arc from 6:00 (left) to 20:30 (right),
 * highest early in the afternoon. Before 6:00 and after 20:30 it rests below the horizon.
 */
export function sunAt(hour: number) {
  const f = clamp01((wrapHour(hour) - 6) / 14.5);
  const height = Math.sin(Math.PI * f);
  return { x: 85 + 482 * f, y: 330 - 148 * height };
}

/** Star level in the fixed modes: full 21:00–4:48, fading out by 6:12 and back in from 19:36. */
export function starsAtHour(hour: number) {
  const h = wrapHour(hour);
  if (h >= 21 || h < 4.8) return 1;
  if (h >= 19.6) return (h - 19.6) / 1.4;
  if (h < 6.2) return 1 - (h - 4.8) / 1.4;
  return 0;
}

/** Grain opacity by hour: lightest in daylight, 0.22 under full stars. */
export const grainAtHour = (hour: number) => 0.07 + 0.15 * starsAtHour(hour);

/**
 * How much of the day text theme applies, 0–1: rises 6:12 → 7:12, falls 16:36 → 17:36.
 * Part 3 blends the text colors, tints and vignette with it.
 */
export function dayness(hour: number) {
  const h = wrapHour(hour);
  if (h < 6.2 || h > 17.6) return 0;
  if (h < 7.2) return h - 6.2;
  if (h > 16.6) return 17.6 - h;
  return 1;
}

/** The hour that scroll progress t stands for: golden hour (0) → dusk (0.5) → night (1). */
export function hourAtScroll(t: number) {
  const p = clamp01(t);
  return p < 0.5 ? 18.5 + 1.1 * (p / 0.5) : 19.6 + 1.4 * ((p - 0.5) / 0.5);
}

/** A keyframe plus the sun's x, which only moves in the fixed modes (scroll mode keeps it put). */
export type HourSky = SkyKeyframe & { sunX: number };

/** The sky at any hour: neighboring keyframes mixed channel by channel, the sun on its arc. */
export function keyframeAtHour(hour: number): HourSky {
  const h = wrapHour(hour);
  let i = 0;
  while (DAY_CYCLE[i + 1][0] <= h) i++;
  const [startHour, a] = DAY_CYCLE[i];
  const [endHour, b] = DAY_CYCLE[i + 1];
  const sun = sunAt(h);
  return {
    ...mixKeyframes(a, b, (h - startHour) / (endHour - startHour)),
    sunX: sun.x,
    sunY: sun.y,
    stars: starsAtHour(h),
  };
}
