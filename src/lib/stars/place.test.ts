import { describe, expect, it } from "vitest";
import { DEV_PLACE, placeFromHeaders } from "./place";

describe("placeFromHeaders", () => {
  it("uses the state code in the US", () => {
    const headers = new Headers({
      "x-vercel-ip-country": "US",
      "x-vercel-ip-country-region": "CA",
      "x-vercel-ip-city": "Berkeley",
    });
    expect(placeFromHeaders(headers)).toEqual({ city: "Berkeley", region: "CA" });
  });

  it("uses the country code elsewhere", () => {
    const headers = new Headers({
      "x-vercel-ip-country": "PH",
      "x-vercel-ip-country-region": "00",
      "x-vercel-ip-city": "Manila",
    });
    expect(placeFromHeaders(headers)).toEqual({ city: "Manila", region: "PH" });
  });

  it("decodes URL-encoded city names", () => {
    const headers = new Headers({ "x-vercel-ip-country": "BR", "x-vercel-ip-city": "S%C3%A3o%20Paulo" });
    expect(placeFromHeaders(headers).city).toBe("São Paulo");
  });

  it("leaves the city empty when Vercel doesn't know it", () => {
    expect(placeFromHeaders(new Headers({ "x-vercel-ip-country": "FR" }))).toEqual({ city: "", region: "FR" });
    expect(placeFromHeaders(new Headers({ "x-vercel-ip-country": "FR", "x-vercel-ip-city": "%E0" })).city).toBe("");
  });

  it("comes back empty with no geo headers (the route swaps in the dev stand-in locally)", () => {
    expect(placeFromHeaders(new Headers())).toEqual({ city: "", region: "" });
    expect(DEV_PLACE).toEqual({ city: "Local", region: "Dev" });
  });
});
