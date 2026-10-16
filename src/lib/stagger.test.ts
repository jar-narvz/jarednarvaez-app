import { describe, expect, it } from "vitest";
import { CLOSE_STEP_MS, staggerDelay } from "./stagger";

const EXPERIENCE = { base: 250, step: 180 };

describe("staggerDelay", () => {
  it("opens rows top-down at base + step·i (experience: 250, 430, 610ms)", () => {
    expect([0, 1, 2].map((i) => staggerDelay(i, 3, true, EXPERIENCE))).toEqual([250, 430, 610]);
  });

  it("closes rows bottom-up 60ms apart, last row first", () => {
    expect([0, 1, 2].map((i) => staggerDelay(i, 3, false, EXPERIENCE))).toEqual([120, 60, 0]);
    expect(staggerDelay(2, 3, false, EXPERIENCE)).toBe(0);
    expect(staggerDelay(0, 3, false, EXPERIENCE)).toBe(2 * CLOSE_STEP_MS);
  });

  it("uses each section's own base and step (projects: 150 + 160·i)", () => {
    expect(staggerDelay(2, 3, true, { base: 150, step: 160 })).toBe(470);
  });
});
