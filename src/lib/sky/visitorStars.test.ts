import { describe, expect, it } from "vitest";
import {
  drawableStars,
  FLARE_MS,
  flareProgress,
  myStarAlpha,
  nearestStar,
  phaseOf,
  pixelToSky,
  skyToPixel,
  visitorStarAlpha,
} from "./visitorStars";

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

describe("nearestStar", () => {
  const frame = { width: 360, horizonRow: 160 };
  // Pixels (180, 80) and (190, 80).
  const a = { id: "a", x: 0.5, y: 0.5 };
  const b = { id: "b", x: 190 / 360, y: 0.5 };

  it("finds the star under the pointer", () => {
    expect(nearestStar([a, b], { x: 180.5, y: 80.5 }, frame)).toBe(a);
  });

  it("reaches about 3 sky pixels, and no further", () => {
    expect(nearestStar([a], { x: 183.4, y: 80.5 }, frame)).toBe(a);
    expect(nearestStar([a], { x: 184, y: 80.5 }, frame)).toBeNull();
  });

  it("picks the closer of two nearby stars", () => {
    expect(nearestStar([a, b], { x: 188, y: 80.5 }, frame)).toBe(b);
  });

  it("finds nothing with no stars", () => {
    expect(nearestStar([], { x: 0, y: 0 }, frame)).toBeNull();
  });
});

describe("pixelToSky", () => {
  it("lands a placed star in the pixel that was clicked", () => {
    for (const frame of [{ width: 360, horizonRow: 161.3 }, { width: 94, horizonRow: 160 }]) {
      for (const point of [{ x: 0.2, y: 0.9 }, { x: 57.6, y: 33.1 }, { x: frame.width - 0.5, y: 120.9 }]) {
        expect(skyToPixel(pixelToSky(point, frame), frame)).toEqual({ x: Math.floor(point.x), y: Math.floor(point.y) });
      }
    }
  });
});

describe("myStarAlpha", () => {
  it("pulses slightly once placed (0.76–1.0 of the star level)", () => {
    for (let t = 0; t < 10; t += 0.07) {
      const a = myStarAlpha(1, t, 1);
      expect(a).toBeGreaterThanOrEqual(0.76 - 1e-9);
      expect(a).toBeLessThanOrEqual(1 + 1e-9);
    }
  });

  it("flares up to ~1.9× early in placing, then settles", () => {
    expect(myStarAlpha(1, 0, 0.15)).toBeCloseTo(0.88 * (1 + 0.9 * 0.85));
    expect(myStarAlpha(1, 0, 0)).toBeCloseTo(0.88);
    expect(myStarAlpha(1, 0, 1)).toBeCloseTo(0.88);
  });
});

describe("flareProgress", () => {
  it("runs 0 → 1 over 900ms, and is already done for a star placed under Reduce Motion", () => {
    expect(flareProgress(1000, 1000)).toBe(0);
    expect(flareProgress(1000, 1000 + FLARE_MS / 2)).toBeCloseTo(0.5);
    expect(flareProgress(1000, 5000)).toBe(1);
    expect(flareProgress(-Infinity, 0)).toBe(1);
  });
});
