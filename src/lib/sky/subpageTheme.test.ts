import { describe, expect, it } from "vitest";
import { homeChoice, isSubpage, startsDark } from "./subpageTheme";

describe("isSubpage", () => {
  it("covers /projects and its write-ups", () => {
    expect(isSubpage("/projects")).toBe(true);
    expect(isSubpage("/projects/secure-file-sharing")).toBe(true);
  });

  it("leaves the home page and the other lab pages on the home sky", () => {
    expect(isSubpage("/")).toBe(false);
    expect(isSubpage("/lab")).toBe(false);
    expect(isSubpage("/lab/logo")).toBe(false);
    expect(isSubpage("/projectsfoo")).toBe(false);
  });
});

describe("homeChoice", () => {
  it("reads a picked hour as a light/dark choice", () => {
    expect(homeChoice({ mode: "hour", hour: 0 })).toBe(true); // the dark button's midnight
    expect(homeChoice({ mode: "hour", hour: 12 })).toBe(false); // the light button's midday
  });

  it("counts scroll mode and my time as no choice", () => {
    expect(homeChoice({ mode: "scroll" })).toBeNull();
    expect(homeChoice({ mode: "local" })).toBeNull();
  });
});

describe("startsDark", () => {
  it("follows the device when the visitor made no choice", () => {
    expect(startsDark({ mode: "scroll" }, true)).toBe(true);
    expect(startsDark({ mode: "scroll" }, false)).toBe(false);
  });

  it("lets the home page's choice win over the device", () => {
    expect(startsDark({ mode: "hour", hour: 12 }, true)).toBe(false);
    expect(startsDark({ mode: "hour", hour: 0 }, false)).toBe(true);
  });
});
