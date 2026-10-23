// Leave a star's shared state: the visitor stars, plus what the sky last drew. The sky (Sky.tsx)
// draws the stars; connect (StarLabel, StarHint) needs the same list and where each star lands on
// this screen. Kept outside React state like skyHour.ts (CLAUDE.md → Architecture rules):
// - the star list loads once;
// - the sky frame and star level change every frame, so they're plain values read on demand;
// - "dark enough to place" only flips now and then, so the hint subscribes to that;
// - the visitor's own star changes once (placed, or rolled back if saving fails);
// - whether the stars API is up changes at most once (it went down).

// Relative, not "@/": Vitest has no path alias, and live.test.ts loads this file.
import { drawableStars, FADE_OUT_MS, type MyStar, type SkyFrame, type VisitorSky } from "../sky/visitorStars";
import { localTimeNow } from "./format";
import type { VisitorStar } from "./types";

/** Star level at or above which the sky counts as dark enough to place a star (spec: ~0.95). */
export const DARK_LEVEL = 0.95;

let stars: VisitorStar[] = [];
let loading: Promise<VisitorStar[]> | null = null;

// Whether the stars API is working. Assumed up until a request fails, so the hint doesn't flicker
// on load. When it's down (spec → Failure) the sky still draws its white stars, the hint hides
// and placing quietly does nothing.
let available = true;
const availableListeners = new Set<() => void>();

export const areStarsAvailable = () => available;

function markUnavailable() {
  if (!available) return;
  available = false;
  availableListeners.forEach((listener) => listener());
}

/** Calls `listener` when the stars API turns out to be down. Returns a function that stops it. */
export function onAvailableChange(listener: () => void) {
  availableListeners.add(listener);
  return () => {
    availableListeners.delete(listener);
  };
}

/** Fetches `/api/stars` once for the whole page. If the API is down the list stays empty. */
export function loadVisitorStars() {
  loading ??= fetch("/api/stars")
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => (stars = drawableStars(data)))
    .catch(() => {
      markUnavailable();
      return stars;
    });
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

const paintListeners = new Set<() => void>();

/** Calls `listener` after every sky paint (keep it cheap). Returns a function that stops it. */
export function onSkyPaint(listener: () => void) {
  paintListeners.add(listener);
  return () => {
    paintListeners.delete(listener);
  };
}

/**
 * Sky.tsx calls this on every paint. Paint listeners hear every time; dark listeners only when
 * "dark enough" flips.
 */
export function publishSkyFrame(next: SkyFrame, nextLevel: number) {
  frame = next;
  level = nextLevel;
  paintListeners.forEach((listener) => listener());
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

// The visitor's own star (one per visitor). The whole star is kept in localStorage, not just its
// id: the GET list is cached for 60s and capped at 500, so it may not include it. Its secret
// owner token (owner.ts) is kept with it, so "reset" can prove it's theirs.
const STORAGE_KEY = "leave-a-star";
// undefined until first read (localStorage only exists in the browser).
let mine: MyStar | null | undefined;
let myToken: string | null = null;
let justNow = false;
let resetting = false;
const mineListeners = new Set<() => void>();
const mineChanged = () => mineListeners.forEach((listener) => listener());

/** The saved star, or null. A private window or blocked storage reads as no star. */
function readSaved(): MyStar | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const { token, ...saved } = raw ? JSON.parse(raw) : {};
    const star = drawableStars([saved])[0];
    if (!star) return null;
    myToken = typeof token === "string" ? token : null;
    return { star, placedAt: -Infinity };
  } catch {
    return null;
  }
}

export function getMyStar() {
  if (mine === undefined) mine = typeof window === "undefined" ? null : readSaved();
  return mine;
}

export const hasMyStar = () => getMyStar() !== null;

/** No star during server rendering, so the page hydrates the same. */
export const getServerHasMyStar = () => false;

/** Whether the visitor can reset their star: they have one, with its owner token (newer stars). */
export const canResetMyStar = () => getMyStar() !== null && myToken !== null && !resetting;

/** Whether the visitor placed their star during this visit (its label then says "just now"). */
export const isMyStarJustNow = () => justNow;

/** Calls `listener` when the visitor's star is placed or rolled back. Returns a function that stops it. */
export function onMyStarChange(listener: () => void) {
  mineListeners.add(listener);
  return () => {
    mineListeners.delete(listener);
  };
}

/** Everything the sky draws for leave a star. */
export const getVisitorSky = (): VisitorSky => ({ stars, mine: getMyStar() });

/** Every star the pointer can hover, your own included. */
export function getHoverableStars() {
  const m = getMyStar();
  return m ? [...stars.filter((s) => s.id !== m.star.id), m.star] : stars;
}

/**
 * Places the visitor's star at sky position (x, y). It shows (and flares, unless `animate` is
 * false for Reduce Motion) right away while the POST runs; if saving fails it quietly disappears
 * again. "Too soon" (the rate limit) only rolls it back; anything else also marks the API down.
 */
export function placeMyStar(x: number, y: number, animate: boolean) {
  if (getMyStar()) return;
  const localTime = localTimeNow();
  const placing: MyStar = {
    star: { id: "placing", x, y, city: "", region: "", leftAt: new Date().toISOString(), localTime },
    placedAt: animate ? performance.now() : -Infinity,
  };
  mine = placing;
  justNow = true;
  mineChanged();

  fetch("/api/stars", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ x, y, localTime }),
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((data) => {
      const { token, ...rest } = data ?? {};
      const saved = drawableStars([rest])[0];
      if (!saved) throw new Error("bad star");
      mine = { ...placing, star: saved };
      myToken = typeof token === "string" ? token : null;
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...saved, token: myToken }));
      } catch {
        // Storage blocked: the star stays for this visit only.
      }
      mineChanged();
    })
    .catch((reason) => {
      mine = null;
      justNow = false;
      mineChanged();
      if (reason !== 429) markUnavailable();
    });
}

/** Forgets the visitor's star here: the sky, the list and localStorage. */
function forgetMyStar(id: string) {
  stars = stars.filter((s) => s.id !== id);
  mine = null;
  myToken = null;
  justNow = false;
  resetting = false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked: nothing was saved.
  }
  mineChanged();
}

/**
 * Reset: removes the visitor's star from the sky (DELETE with its owner token) so they can place
 * it again. It fades out over FADE_OUT_MS (instant when `animate` is false, for Reduce Motion).
 * If the server says it isn't theirs, reset stops being offered; if the API is down, nothing
 * changes except that the stars are marked unavailable.
 */
export function resetMyStar(animate: boolean) {
  const current = getMyStar();
  if (!current || !myToken || resetting) return;
  resetting = true;
  mineChanged();

  fetch("/api/stars", {
    method: "DELETE",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: current.star.id, token: myToken }),
  })
    .then((r) => {
      if (r.ok) {
        if (!animate) return forgetMyStar(current.star.id);
        mine = { ...current, fadingAt: performance.now() };
        mineChanged();
        window.setTimeout(() => forgetMyStar(current.star.id), FADE_OUT_MS);
        return;
      }
      resetting = false;
      if (r.status === 403) myToken = null;
      else if (r.status >= 500) markUnavailable();
      mineChanged();
    })
    .catch(() => {
      resetting = false;
      markUnavailable();
      mineChanged();
    });
}
