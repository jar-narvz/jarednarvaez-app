import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// live.ts keeps module-level state (one load per page), so each test gets a fresh copy.
const freshLive = async () => {
  vi.resetModules();
  return import("./live");
};

const star = { id: "a", x: 0.5, y: 0.3, city: "Berkeley", region: "CA", leftAt: "2026-10-22T03:15:00.000Z", localTime: "8:15 pm" };

beforeEach(() => {
  vi.stubGlobal("window", undefined);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loadVisitorStars", () => {
  it("keeps the stars and stays available when the API answers", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json([star])));
    const live = await freshLive();
    expect(await live.loadVisitorStars()).toEqual([star]);
    expect(live.areStarsAvailable()).toBe(true);
  });

  it("marks the stars unavailable, with an empty sky, when the API is down", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Response.json({ error: "stars unavailable" }, { status: 503 })));
    const live = await freshLive();
    const heard = vi.fn();
    live.onAvailableChange(heard);
    expect(await live.loadVisitorStars()).toEqual([]);
    expect(live.areStarsAvailable()).toBe(false);
    expect(heard).toHaveBeenCalledOnce();
  });

  it("treats a network error the same way", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => Promise.reject(new TypeError("Failed to fetch"))));
    const live = await freshLive();
    expect(await live.loadVisitorStars()).toEqual([]);
    expect(live.areStarsAvailable()).toBe(false);
  });

  it("fetches once for the whole page", async () => {
    const fetch = vi.fn(async () => Response.json([star]));
    vi.stubGlobal("fetch", fetch);
    const live = await freshLive();
    await Promise.all([live.loadVisitorStars(), live.loadVisitorStars()]);
    expect(fetch).toHaveBeenCalledOnce();
  });
});
