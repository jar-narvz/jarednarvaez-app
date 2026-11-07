// Which pages hold a fixed subpage look instead of the home sky, and whether a subpage starts
// light or dark (docs/visual-system.md → Subpages, decided 2026-10-30). Plain functions, so they're
// easy to test (subpageTheme.test.ts).

import { isDarkHour } from "./hours";
import type { SkyMode } from "./skyHour";

/** Pages with their own fixed background (SubpageSky). Everywhere else gets the home sky. */
const SUBPAGES = ["/projects"];

export function isSubpage(pathname: string) {
  return SUBPAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * The visitor's light/dark choice from the home page, if they made one: true for dark, false for
 * light, null for none. Picking an hour (the light/dark button or the dial) counts, night hours
 * meaning dark. Scroll mode and "my time" count as no choice for now: whether they should is
 * still open (docs/design.md → still open).
 */
export function homeChoice(mode: SkyMode): boolean | null {
  return mode.mode === "hour" ? isDarkHour(mode.hour) : null;
}

/** A subpage's starting look: the home page's choice, else the device's setting. */
export function startsDark(mode: SkyMode, deviceDark: boolean) {
  return homeChoice(mode) ?? deviceDark;
}
