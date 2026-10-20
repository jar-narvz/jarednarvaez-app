// The sky's color math: scroll progress in, colors and values out. No canvas or React here,
// so it's easy to test (blend.test.ts). Ported from the prototype's `key()` and `grainA()`.

import { STARLIGHT, SUN_GOLD, dusk, goldenHour, night, type SkyKeyframe } from "./palette";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** 0 before `a`, 1 after `b`, and an eased curve in between (starts and ends gently). */
export function smoothstep(t: number, a: number, b: number) {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
}

/** Straight mix between two numbers. Written this way so u=0 and u=1 land exactly on a and b. */
const mix = (a: number, b: number, u: number) => a * (1 - u) + b * u;

function rgb(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

/** Mixes two #RRGGBB colors channel by channel, like the prototype. Returns #RRGGBB. */
export function mixColor(a: string, b: string, u: number): string {
  const A = rgb(a);
  const B = rgb(b);
  const out = A.map((c, i) => Math.round(mix(c, B[i], u)).toString(16).padStart(2, "0"));
  return `#${out.join("")}`.toUpperCase();
}

/** A #RRGGBB color as rgba() with the given opacity. */
export function withAlpha(hex: string, alpha: number) {
  return `rgba(${rgb(hex).join(",")},${alpha})`;
}

/** Mixes two keyframes field by field: u=0 is `a`, u=1 is `b`. */
export function mixKeyframes(a: SkyKeyframe, b: SkyKeyframe, u: number): SkyKeyframe {
  const colors = <T extends string[]>(x: T, y: T) => x.map((c, i) => mixColor(c, y[i], u)) as T;
  return {
    sky: colors(a.sky, b.sky),
    clouds: colors(a.clouds, b.clouds),
    sun: mixColor(a.sun, b.sun, u),
    sunY: mix(a.sunY, b.sunY, u),
    water: colors(a.water, b.water),
    land: mixColor(a.land, b.land, u),
    near: mixColor(a.near, b.near, u),
    reflection: mix(a.reflection, b.reflection, u),
    stars: mix(a.stars, b.stars, u),
    vignette: mixColor(a.vignette, b.vignette, u),
    vignetteStrength: mix(a.vignetteStrength, b.vignetteStrength, u),
    vignetteReach: mix(a.vignetteReach, b.vignetteReach, u),
  };
}

/** The sky at scroll progress t: golden hour (0) → dusk (0.5) → night (1). */
export function keyframeAt(t: number): SkyKeyframe {
  const p = clamp01(t);
  return p < 0.5 ? mixKeyframes(goldenHour, dusk, p * 2) : mixKeyframes(dusk, night, (p - 0.5) * 2);
}

/** Accent text: Starlight → Sun gold over roughly the first third of the scroll. */
export function accentAt(t: number) {
  return mixColor(STARLIGHT, SUN_GOLD, smoothstep(t, 0, 1 / 3));
}

/** Grain opacity: 0.07 at golden hour, building to 0.22 at night (the prototype's grain curve). */
export function grainAt(t: number) {
  return 0.07 + 0.15 * smoothstep(t, 0.2, 0.9);
}
