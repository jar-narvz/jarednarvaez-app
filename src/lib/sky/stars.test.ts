import { describe, expect, it } from "vitest";
import { STAR_ODDS, hash, starAlpha, starsIn } from "./stars";

describe("hash", () => {
  it("gives the same number for the same pixel, so stars don't move on reload", () => {
    expect(hash(12, 7, 0)).toBe(hash(12, 7, 0));
    expect(hash(12, 7, 0)).not.toBe(hash(12, 7, 1));
  });

  it("stays in [0, 1)", () => {
    for (let i = 0; i < 1000; i++) {
      const h = hash(i, i * 3, i % 3);
      expect(h).toBeGreaterThanOrEqual(0);
      expect(h).toBeLessThan(1);
    }
  });
});

describe("starsIn", () => {
  it("matches the chosen density (STAR_ODDS) on a desktop-sized band", () => {
    // 360 × 110 low-res pixels: ~165 stars expected at 1 in 240.
    const count = starsIn(360, 110).length;
    const expected = 360 * 110 * STAR_ODDS;
    expect(count).toBeGreaterThan(expected * 0.8);
    expect(count).toBeLessThan(expected * 1.2);
  });

  it("keeps brightness in the prototype's 0.5–1 range", () => {
    for (const s of starsIn(200, 60)) {
      expect(s.brightness).toBeGreaterThanOrEqual(0.5);
      expect(s.brightness).toBeLessThanOrEqual(1);
    }
  });

  it("has no stars in an empty band", () => {
    expect(starsIn(360, 0)).toEqual([]);
  });
});

describe("starAlpha", () => {
  it("is invisible when the sky's star level is 0 (golden hour)", () => {
    expect(starAlpha(0, 1, 0, 5)).toBe(0);
  });

  it("twinkles between 20% and 100% of the star's brightness", () => {
    // sin = -1 → 0.6 - 0.4 = 0.2; sin = 1 → 1.
    expect(starAlpha(1, 1, -Math.PI / 2, 0)).toBeCloseTo(0.2);
    expect(starAlpha(1, 1, Math.PI / 2, 0)).toBeCloseTo(1);
  });
});
