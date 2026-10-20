// Which hour the sky is fixed at, or null for scroll mode (the default). Sky.tsx reads it on
// every paint; whatever sets it calls setFixedSky, which tells Sky.tsx to repaint. Kept outside
// React state so changing the hour doesn't re-render the page (CLAUDE.md → Architecture rules).
// Only /lab/sky sets it for now; the nav's dial and "my time" will use it in sky modes part 4.

export type FixedSky = { hour: number };

let fixed: FixedSky | null = null;
const listeners = new Set<() => void>();

export const getFixedSky = () => fixed;

export function setFixedSky(next: FixedSky | null) {
  fixed = next;
  listeners.forEach((listener) => listener());
}

/** Calls `listener` whenever the fixed hour changes. Returns a function that stops it. */
export function onFixedSkyChange(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
