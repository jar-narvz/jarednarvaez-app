import { describe, expect, it } from "vitest";
import { localTimeNow, myStarLabel, starLabel } from "./format";
import { parseNewStar } from "./validate";

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

describe("myStarLabel", () => {
  it("says just now right after placing", () => {
    expect(myStarLabel({ city: "Berkeley", leftAt: star.leftAt }, true)).toBe("you · Berkeley · just now");
  });

  it("shows the saved month on later visits", () => {
    expect(myStarLabel({ city: "Berkeley", leftAt: star.leftAt }, false)).toBe("you · Berkeley · Oct 2026");
  });

  it("drops the city while it's still unknown", () => {
    expect(myStarLabel({ city: "", leftAt: star.leftAt }, true)).toBe("you · just now");
  });
});

describe("localTimeNow", () => {
  it("writes the visitor's clock as h:mm am/pm", () => {
    expect(localTimeNow(new Date(2026, 9, 22, 20, 5))).toBe("8:05 pm");
    expect(localTimeNow(new Date(2026, 9, 22, 0, 30))).toBe("12:30 am");
    expect(localTimeNow(new Date(2026, 9, 22, 12, 0))).toBe("12:00 pm");
    expect(localTimeNow(new Date(2026, 9, 22, 9, 59))).toBe("9:59 am");
  });

  it("is always a time the API accepts", () => {
    for (let m = 0; m < 24 * 60; m += 7) {
      const localTime = localTimeNow(new Date(2026, 9, 22, 0, m));
      expect(parseNewStar({ x: 0.5, y: 0.5, localTime })).not.toBeNull();
    }
  });
});
