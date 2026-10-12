import { describe, expect, it } from "vitest";
import { accentAt, grainAt, keyframeAt, mixColor, smoothstep, withAlpha } from "./blend";
import { STARLIGHT, SUN_GOLD, dusk, goldenHour, night } from "./palette";

describe("mixColor", () => {
  it("returns the endpoints exactly", () => {
    expect(mixColor("#3A2E62", "#1E1C44", 0)).toBe("#3A2E62");
    expect(mixColor("#3A2E62", "#1E1C44", 1)).toBe("#1E1C44");
  });

  it("mixes each channel separately", () => {
    // 0 → 255 halfway is 127.5, which rounds to 128 (0x80).
    expect(mixColor("#000000", "#FFFFFF", 0.5)).toBe("#808080");
    expect(mixColor("#FF0000", "#0000FF", 0.5)).toBe("#800080");
  });
});

describe("keyframeAt", () => {
  it("is golden hour at the top, dusk halfway, and night at the bottom", () => {
    expect(keyframeAt(0)).toEqual(goldenHour);
    expect(keyframeAt(0.5)).toEqual(dusk);
    expect(keyframeAt(1)).toEqual(night);
  });

  it("is halfway between golden hour and dusk at a quarter of the way down", () => {
    const k = keyframeAt(0.25);
    expect(k.sunY).toBe(284); // halfway between 268 and 300
    expect(k.reflection).toBeCloseTo(0.65); // halfway between 1 and 0.3
    expect(k.sky[0]).toBe(mixColor(goldenHour.sky[0], dusk.sky[0], 0.5));
  });

  it("clamps scroll progress outside 0–1 (e.g. iPhone overscroll bounce)", () => {
    expect(keyframeAt(-0.2)).toEqual(goldenHour);
    expect(keyframeAt(1.3)).toEqual(night);
  });

  it("fades the stars in: none at golden hour, faint at dusk, full at night", () => {
    expect(keyframeAt(0).stars).toBe(0);
    expect(keyframeAt(0.5).stars).toBe(0.3);
    expect(keyframeAt(0.75).stars).toBeCloseTo(0.65);
    expect(keyframeAt(1).stars).toBe(1);
  });

  it("sets the sun fully below the horizon at night", () => {
    // Horizon at 272, sun radius 56: center at 330 puts the top edge at 274.
    expect(keyframeAt(1).sunY - 56).toBeGreaterThan(272);
  });
});

describe("accentAt", () => {
  it("goes from Starlight to Sun gold over the first third", () => {
    expect(accentAt(0)).toBe(STARLIGHT);
    expect(accentAt(1 / 3)).toBe(SUN_GOLD);
    expect(accentAt(1)).toBe(SUN_GOLD);
  });
});

describe("grainAt", () => {
  it("is faint at golden hour and builds to 0.22 at night", () => {
    expect(grainAt(0)).toBe(0.07);
    expect(grainAt(0.2)).toBe(0.07); // hasn't started building yet
    expect(grainAt(1)).toBeCloseTo(0.22);
  });
});

describe("helpers", () => {
  it("smoothstep eases from 0 to 1 between its edges", () => {
    expect(smoothstep(0, 0.2, 0.9)).toBe(0);
    expect(smoothstep(0.55, 0.2, 0.9)).toBeCloseTo(0.5);
    expect(smoothstep(1, 0.2, 0.9)).toBe(1);
  });

  it("withAlpha turns a hex color into rgba()", () => {
    expect(withAlpha("#2A1630", 0.45)).toBe("rgba(42,22,48,0.45)");
  });
});
