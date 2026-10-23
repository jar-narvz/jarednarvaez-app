import type { VisitorStar } from "./types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * A visitor star's hover label: `City, Region · Mon YYYY · h:mm am/pm` (docs/visual-system.md →
 * Connect), e.g. "Manila, PH · Oct 2026 · 8:15 pm". The month comes from `leftAt` (UTC); the time
 * is the visitor's own clock. Unknown places drop out: "PH · Oct 2026 · 8:15 pm".
 */
export function starLabel(star: Pick<VisitorStar, "city" | "region" | "leftAt" | "localTime">) {
  const place = [star.city, star.region].filter(Boolean).join(", ");
  const left = new Date(star.leftAt);
  const when = Number.isNaN(left.getTime()) ? "" : `${MONTHS[left.getUTCMonth()]} ${left.getUTCFullYear()}`;
  return [place, when, star.localTime].filter(Boolean).join(" · ");
}
