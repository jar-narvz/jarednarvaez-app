// Stagger timing for collapsible sections (docs/visual-system.md → Experience / Projects →
// Animation). Opening, rows enter top-down at base + step·i. Closing, they leave bottom-up,
// 60ms apart, with the last row going first.

export const CLOSE_STEP_MS = 60;

export type Stagger = { base: number; step: number };

/** Transition delay (ms) for row `i` of `count` rows when the section opens or closes. */
export function staggerDelay(i: number, count: number, open: boolean, { base, step }: Stagger) {
  return open ? base + step * i : CLOSE_STEP_MS * (count - 1 - i);
}
