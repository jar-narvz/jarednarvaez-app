import { describe, expect, it } from "vitest";
import { drawableStars, phaseOf, skyToPixel, visitorStarAlpha } from "./visitorStars";

describe("skyToPixel", () => {
  it("maps x across the visible sky and y down to the horizon (desktop)", () => {
    // 1440×900 screen: 360×225 low-res, horizon around row 161.
    const frame = { width: 360, horizonRow: 161 };
    expect(skyToPixel({ x: 0, y: 0 }, frame)).toEqual({ x: 0, y: 0 });
    expect(skyToPixel({ x: 0.5, y: 0.5 }, frame)).toEqual({ x: 180, y: 81 });
    expect(skyToPixel({ x: 1, y: 1 }, frame)).toEqual({ x: 359, y: 161 });
  });

  it("keeps a star at the same share of the sky on the tall phone coast", () => {
    // 375×812 phone: ~94 wide, horizon much lower down the screen.
    const phone = skyToPixel({ x: 0.74, y: 0.41 }, { width: 94, horizonRow: 160 });
    expect(phone).toEqual({ x: 70, y: 66 });
  });
});

describe("visitorStarAlpha", () => {
  it("twinkles between 0.6 and 1.0 of the sky's star level", () => {
    for (let t = 0; t < 10; t += 0.07) {
      const a = visitorStarAlpha(1, 0.3, t);
      expect(a).toBeGreaterThanOrEqual(0.6 - 1e-9);
      expect(a).toBeLessThanOrEqual(1 + 1e-9);
    }
    expect(visitorStarAlpha(0.3, 0, 0)).toBeCloseTo(0.24);
  });

  it("is zero at golden hour, like the white stars", () => {
    expect(visitorStarAlpha(0, 1.2, 5)).toBe(0);
  });
});

describe("phaseOf", () => {
  it("gives each star its own repeatable phase in [0, 2π)", () => {
    expect(phaseOf("sample-1")).toBe(phaseOf("sample-1"));
    expect(phaseOf("sample-1")).not.toBe(phaseOf("sample-2"));
    for (const id of ["a", "sample-3", crypto.randomUUID()]) {
      expect(phaseOf(id)).toBeGreaterThanOrEqual(0);
      expect(phaseOf(id)).toBeLessThan(Math.PI * 2);
    }
  });
});

describe("drawableStars", () => {
  it("keeps well-formed stars and skips the rest", () => {
    const good = { id: "a", x: 0.5, y: 0.2, city: "Berkeley", region: "CA", leftAt: "", localTime: "8:15 pm" };
    expect(drawableStars([good, { id: "b", x: 2, y: 0.1 }, { x: 0.5, y: 0.5 }, null, "star"])).toEqual([good]);
  });

  it("returns nothing for a response that isn't a list (API down or an error body)", () => {
    expect(drawableStars({ error: "stars unavailable" })).toEqual([]);
    expect(drawableStars(null)).toEqual([]);
  });
});
