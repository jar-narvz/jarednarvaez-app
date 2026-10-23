import type { VisitorStar } from "./types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * A visitor star's hover label: `City, Region · Mon YYYY · h:mm am/pm` (docs/visual-system.md →
 * Connect), e.g. "Manila, PH · Oct 2026 · 8:15 pm". The month comes from `leftAt` (UTC); the time
 * is the visitor's own clock. Unknown places drop out: "PH · Oct 2026 · 8:15 pm".
 */
export function starLabel(star: Pick<VisitorStar, "city" | "region" | "leftAt" | "localTime">) {
  const place = [star.city, star.region].filter(Boolean).join(", ");
  return [place, monthYear(star.leftAt), star.localTime].filter(Boolean).join(" · ");
}

/** "Oct 2026" from an ISO timestamp, or "" if it can't be read. */
function monthYear(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? "" : `${MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * Your own star's hover label: "you · Berkeley · just now" right after placing it, then
 * "you · Berkeley · Oct 2026" on later visits (the spec's "saved date").
 */
export function myStarLabel(star: Pick<VisitorStar, "city" | "leftAt">, justNow: boolean) {
  return ["you", star.city, justNow ? "just now" : monthYear(star.leftAt)].filter(Boolean).join(" · ");
}

/**
 * The visitor's clock as "8:15 pm", the form the API accepts. Built by hand: browsers' own time
 * formatting can put a narrow no-break space before "PM", which the API would turn away.
 */
export function localTimeNow(now = new Date()) {
  const h = now.getHours();
  return `${h % 12 || 12}:${String(now.getMinutes()).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}
