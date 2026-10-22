import type { NewStar } from "./types";

/** Lowest a star may sit: ~90% of the way from the top of the sky down to the horizon (spec). */
export const MAX_Y = 0.9;

// "8:15 pm" or "12:05 am": the short local time the hover label shows.
const LOCAL_TIME = /^(1[0-2]|[1-9]):[0-5]\d (am|pm)$/;

const inRange = (n: unknown, min: number, max: number): n is number =>
  typeof n === "number" && Number.isFinite(n) && n >= min && n <= max;

/** The star a `POST` body describes, or null if anything is off. Extra fields are dropped. */
export function parseNewStar(body: unknown): NewStar | null {
  if (typeof body !== "object" || body === null) return null;
  const { x, y, localTime } = body as Record<string, unknown>;
  if (!inRange(x, 0, 1) || !inRange(y, 0, MAX_Y)) return null;
  if (typeof localTime !== "string" || !LOCAL_TIME.test(localTime)) return null;
  return { x, y, localTime };
}
