// The sky mode (docs/visual-system.md → Sky timing and modes) and the hour the sky is showing.
// Kept outside React state so the sky doesn't re-render the page (CLAUDE.md → Architecture rules):
// - the mode changes only on a click, so the nav's controls subscribe to it and re-render then;
// - the shown hour changes with every scroll frame, so the mini dial and the dial subscribe to it
//   and update their own SVG directly, without React.

export type SkyMode =
  | { mode: "scroll" } // the default: golden hour → night as you scroll
  | { mode: "hour"; hour: number } // pick the time: the dial or the light/dark button
  | { mode: "local" }; // my time: the visitor's clock

const SCROLL: SkyMode = { mode: "scroll" };

let current: SkyMode = SCROLL;
let glideNext = false;
const modeListeners = new Set<() => void>();

export const getSkyMode = () => current;

/** The mode the server renders with: always scroll, so the page hydrates the same. */
export const getServerSkyMode = () => SCROLL;

/**
 * Changes the mode. `glide` asks the sky to travel there around the clock (~1.2s) instead of
 * jumping: the light/dark button, "my time" and the "sunset" pill glide; dragging the dial
 * doesn't, so the sky follows the finger.
 */
export function setSkyMode(next: SkyMode, { glide = false } = {}) {
  current = next;
  glideNext = glide;
  modeListeners.forEach((listener) => listener());
}

/** Whether the latest mode change asked to glide (Sky.tsx reads it once, then it resets). */
export function takeGlide() {
  const glide = glideNext;
  glideNext = false;
  return glide;
}

/** Calls `listener` whenever the mode changes. Returns a function that stops it. */
export function onSkyModeChange(listener: () => void) {
  modeListeners.add(listener);
  return () => {
    modeListeners.delete(listener);
  };
}

// The hour the sky is drawing, 0–24. Sky.tsx publishes it whenever it changes.
let shownHour = 18.5;
const hourListeners = new Set<(hour: number) => void>();

export const getShownHour = () => shownHour;

export function publishShownHour(hour: number) {
  if (hour === shownHour) return;
  shownHour = hour;
  hourListeners.forEach((listener) => listener(hour));
}

/** Calls `listener` with the shown hour now and whenever it changes. Returns a function that stops it. */
export function onShownHourChange(listener: (hour: number) => void) {
  hourListeners.add(listener);
  listener(shownHour);
  return () => {
    hourListeners.delete(listener);
  };
}

/** The visitor's clock as an hour, e.g. 7:30 pm → 19.5. */
export function localHour(now = new Date()) {
  return now.getHours() + now.getMinutes() / 60;
}
