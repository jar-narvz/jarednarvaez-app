// Leave a star's shared state: the visitor stars, plus what the sky last drew. The sky (Sky.tsx)
// draws the stars; connect (StarLabel, StarHint) needs the same list and where each star lands on
// this screen. Kept outside React state like skyHour.ts (CLAUDE.md → Architecture rules):
// - the star list loads once;
// - the sky frame and star level change every frame, so they're plain values read on demand;
// - "dark enough to place" only flips now and then, so the hint subscribes to that.

import { drawableStars, type SkyFrame } from "@/lib/sky/visitorStars";
import type { VisitorStar } from "./types";

/** Star level at or above which the sky counts as dark enough to place a star (spec: ~0.95). */
export const DARK_LEVEL = 0.95;

let stars: VisitorStar[] = [];
let loading: Promise<VisitorStar[]> | null = null;

export const getVisitorStars = () => stars;

/** Fetches `/api/stars` once for the whole page. If the API is down the list stays empty. */
export function loadVisitorStars() {
  loading ??= fetch("/api/stars")
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => (stars = drawableStars(data)))
    .catch(() => stars);
  return loading;
}

// What the sky last drew: its low-res frame and the star level (0 at golden hour, 1 at night).
let frame: SkyFrame = { width: 0, horizonRow: 0 };
let level = 0;
let dark = false;
const darkListeners = new Set<() => void>();

export const getSkyFrame = () => frame;
export const getStarLevel = () => level;
export const isSkyDark = () => dark;

/** Dark during server rendering: scroll mode always reaches full night at connect. */
export const getServerSkyDark = () => true;

/** Sky.tsx calls this on every paint. Listeners hear only when "dark enough" flips. */
export function publishSkyFrame(next: SkyFrame, nextLevel: number) {
  frame = next;
  level = nextLevel;
  const nextDark = nextLevel >= DARK_LEVEL;
  if (nextDark === dark) return;
  dark = nextDark;
  darkListeners.forEach((listener) => listener());
}

/** Calls `listener` whenever the sky crosses DARK_LEVEL. Returns a function that stops it. */
export function onDarkChange(listener: () => void) {
  darkListeners.add(listener);
  return () => {
    darkListeners.delete(listener);
  };
}
