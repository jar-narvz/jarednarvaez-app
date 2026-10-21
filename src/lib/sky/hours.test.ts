import { describe, expect, it } from "vitest";
import { mixColor } from "./blend";
import {
  dayness,
  formatHour,
  glideHour,
  hourName,
  isDarkHour,
  grainAtHour,
  hourAtScroll,
  keyframeAtHour,
  shorterWay,
  starsAtHour,
  sunAt,
  wrapHour,
} from "./hours";
import { afternoon, dusk, goldenHour, midday, midnight, night, type SkyKeyframe } from "./palette";

/** Everything but the sun's position and the stars, which hours.ts works out on its own. */
const colorsOf = (k: SkyKeyframe & { sunX?: number }) => {
  const { sunX, sunY, stars, ...rest } = k;
  void [sunX, sunY, stars];
  return rest;
};

describe("keyframeAtHour", () => {
  it("matches scroll mode's golden hour, dusk and night at 18.5, 19.6 and 21", () => {
    expect(colorsOf(keyframeAtHour(18.5))).toEqual(colorsOf(goldenHour));
    expect(colorsOf(keyframeAtHour(19.6))).toEqual(colorsOf(dusk));
    expect(colorsOf(keyframeAtHour(21))).toEqual(colorsOf(night));
  });

  it("lands on the new keyframes at their hours", () => {
    expect(colorsOf(keyframeAtHour(0))).toEqual(colorsOf(midnight));
    expect(colorsOf(keyframeAtHour(12))).toEqual(colorsOf(midday));
    expect(colorsOf(keyframeAtHour(16))).toEqual(colorsOf(afternoon));
  });

  it("is halfway between midday and afternoon at 14:00", () => {
    expect(keyframeAtHour(14).sky[0]).toBe(mixColor(midday.sky[0], afternoon.sky[0], 0.5));
  });

  it("wraps past midnight: 22:30 is halfway from night to midnight, and 24 is 0", () => {
    expect(keyframeAtHour(22.5).sky[0]).toBe(mixColor(night.sky[0], midnight.sky[0], 0.5));
    expect(keyframeAtHour(24)).toEqual(keyframeAtHour(0));
    expect(keyframeAtHour(-1)).toEqual(keyframeAtHour(23));
  });

  it("puts the sun on its arc, within 1.5px of scroll mode's sun at golden hour, dusk and night", () => {
    expect(Math.abs(keyframeAtHour(18.5).sunY - goldenHour.sunY)).toBeLessThan(1.5);
    expect(Math.abs(keyframeAtHour(19.6).sunY - dusk.sunY)).toBeLessThan(1.5);
    expect(keyframeAtHour(21).sunY).toBe(night.sunY);
    expect(keyframeAtHour(14).sunX).toBe(sunAt(14).x);
  });
});

describe("sunAt", () => {
  it("rises at 6:00 on the left and sets at 20:30 on the right, below the horizon", () => {
    expect(sunAt(6)).toEqual({ x: 85, y: 330 });
    expect(sunAt(20.5)).toEqual({ x: 567, y: 330 });
    expect(sunAt(3)).toEqual({ x: 85, y: 330 });
  });

  it("is highest at the middle of its arc (13:15)", () => {
    expect(sunAt(13.25).y).toBeCloseTo(182);
    expect(sunAt(12).y).toBeGreaterThan(182);
    expect(sunAt(14.5).y).toBeGreaterThan(182);
  });
});

describe("starsAtHour", () => {
  it("is full from 21:00 to 4:48 and gone in the day", () => {
    expect(starsAtHour(21)).toBe(1);
    expect(starsAtHour(0)).toBe(1);
    expect(starsAtHour(4.79)).toBe(1);
    expect(starsAtHour(6.2)).toBe(0);
    expect(starsAtHour(12)).toBe(0);
    expect(starsAtHour(19.6)).toBe(0);
  });

  it("fades out from 4:48 to 6:12 and back in from 19:36 to 21:00", () => {
    expect(starsAtHour(5.5)).toBeCloseTo(0.5);
    expect(starsAtHour(20.3)).toBeCloseTo(0.5);
  });
});

describe("grainAtHour", () => {
  it("is 0.07 in daylight and 0.22 under full stars", () => {
    expect(grainAtHour(12)).toBe(0.07);
    expect(grainAtHour(0)).toBeCloseTo(0.22);
  });
});

describe("dayness", () => {
  it("rises 6:12 → 7:12, holds through the day, falls 16:36 → 17:36", () => {
    expect(dayness(6.2)).toBe(0);
    expect(dayness(6.7)).toBeCloseTo(0.5);
    expect(dayness(7.2)).toBeCloseTo(1);
    expect(dayness(12)).toBe(1);
    expect(dayness(17.1)).toBeCloseTo(0.5);
    expect(dayness(17.6)).toBeCloseTo(0);
    expect(dayness(18.5)).toBe(0);
    expect(dayness(0)).toBe(0);
  });
});

describe("hourAtScroll", () => {
  it("maps the scroll to 18.5 → 19.6 → 21", () => {
    expect(hourAtScroll(0)).toBe(18.5);
    expect(hourAtScroll(0.5)).toBeCloseTo(19.6);
    expect(hourAtScroll(1)).toBeCloseTo(21);
    expect(hourAtScroll(1.3)).toBeCloseTo(21);
  });
});

describe("wrapHour", () => {
  it("wraps any hour onto 0–24", () => {
    expect(wrapHour(25)).toBe(1);
    expect(wrapHour(-1)).toBe(23);
    expect(wrapHour(24)).toBe(0);
  });
});

describe("dial helpers", () => {
  it("names each hour after the keyframe it's on or past", () => {
    expect(hourName(4)).toBe("midnight");
    expect(hourName(5.3)).toBe("dawn");
    expect(hourName(7)).toBe("sunrise");
    expect(hourName(13)).toBe("midday");
    expect(hourName(18.5)).toBe("golden hour");
    expect(hourName(20)).toBe("dusk");
    expect(hourName(23)).toBe("night");
  });

  it("formats hours as clock times", () => {
    expect(formatHour(19.5)).toBe("7:30 pm");
    expect(formatHour(0)).toBe("12:00 am");
    expect(formatHour(12)).toBe("12:00 pm");
    expect(formatHour(6.75)).toBe("6:45 am");
    expect(formatHour(23.999)).toBe("12:00 am");
  });

  it("calls the sky dark once more than half the stars are out", () => {
    expect(isDarkHour(0)).toBe(true);
    expect(isDarkHour(12)).toBe(false);
    expect(isDarkHour(18.5)).toBe(false);
    expect(isDarkHour(20.5)).toBe(true);
  });
});

describe("glides", () => {
  it("go the shorter way around the clock", () => {
    expect(shorterWay(23, 1)).toBe(2);
    expect(shorterWay(1, 23)).toBe(-2);
    expect(shorterWay(18.5, 0)).toBe(5.5);
    expect(shorterWay(0, 18.5)).toBe(-5.5);
  });

  it("go forward on a 12-hour tie", () => {
    expect(shorterWay(12, 0)).toBe(12);
    expect(shorterWay(0, 12)).toBe(12);
  });

  it("ease from the start hour to the end, wrapping past midnight", () => {
    expect(glideHour(23, 2, 0)).toBe(23);
    expect(glideHour(23, 2, 0.5)).toBe(0);
    expect(glideHour(23, 2, 1)).toBe(1);
    expect(glideHour(12, -6, 1)).toBe(6);
  });
});
