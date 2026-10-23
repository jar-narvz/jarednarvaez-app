import { describe, expect, it } from "vitest";
import { starLabel } from "./format";

const star = { city: "Manila", region: "PH", leftAt: "2026-10-18T13:15:00.000Z", localTime: "9:15 pm" };

describe("starLabel", () => {
  it("reads City, Region · Mon YYYY · time, as in the spec", () => {
    expect(starLabel(star)).toBe("Manila, PH · Oct 2026 · 9:15 pm");
  });

  it("drops an unknown city", () => {
    expect(starLabel({ ...star, city: "" })).toBe("PH · Oct 2026 · 9:15 pm");
  });

  it("drops the place entirely when neither part is known", () => {
    expect(starLabel({ ...star, city: "", region: "" })).toBe("Oct 2026 · 9:15 pm");
  });

  it("skips a date it can't read", () => {
    expect(starLabel({ ...star, leftAt: "not a date" })).toBe("Manila, PH · 9:15 pm");
  });
});
