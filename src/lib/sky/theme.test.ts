import { describe, expect, it } from "vitest";
import { mixColor } from "./blend";
import { CREAM, NAVY, PLUM, PLUM_TINT, STARLIGHT, SUN_GOLD } from "./palette";
import { textDayness, themeAt } from "./theme";

describe("themeAt", () => {
  it("gives today's evening values at dayness 0, so scroll mode doesn't change", () => {
    expect(themeAt(0, STARLIGHT)).toEqual({
      ink: CREAM,
      accent: STARLIGHT,
      underline: SUN_GOLD,
      tint: PLUM_TINT,
      textShadow: "0 0 18px rgba(42,18,40,0.6)",
    });
  });

  it("gives the day theme at dayness 1", () => {
    expect(themeAt(1, SUN_GOLD)).toEqual({
      ink: NAVY,
      accent: PLUM,
      underline: PLUM,
      tint: CREAM,
      textShadow: "0 0 18px rgba(255,246,234,0.7)",
    });
  });

  it("is halfway between at dayness 0.5", () => {
    const t = themeAt(0.5, SUN_GOLD);
    expect(t.ink).toBe(mixColor(CREAM, NAVY, 0.5));
    expect(t.accent).toBe(mixColor(SUN_GOLD, PLUM, 0.5));
  });

  it("clamps dayness outside 0–1", () => {
    expect(themeAt(-1, SUN_GOLD)).toEqual(themeAt(0, SUN_GOLD));
    expect(themeAt(2, SUN_GOLD)).toEqual(themeAt(1, SUN_GOLD));
  });
});

describe("textDayness", () => {
  it("follows the sky's ramp when the window is the whole hour", () => {
    expect(textDayness(0.3, 1)).toBe(0.3);
  });

  it("switches in the middle 6 minutes of the hour by default", () => {
    expect(textDayness(0.44)).toBe(0);
    expect(textDayness(0.5)).toBeCloseTo(0.5);
    expect(textDayness(0.56)).toBe(1);
  });

  it("switches within the middle of the ramp for a shorter window", () => {
    expect(textDayness(0.3, 0.25)).toBe(0);
    expect(textDayness(0.5, 0.25)).toBe(0.5);
    expect(textDayness(0.7, 0.25)).toBe(1);
  });
});
