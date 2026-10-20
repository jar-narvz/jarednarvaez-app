// The day text theme (docs/visual-system.md → 24-hour sky → Day text theme and blending):
// dayness in, the page's live color values out. No canvas or React here, so it's easy to test
// (theme.test.ts). Sky.tsx writes the result to CSS variables; components only read those.

import { mixColor, withAlpha } from "./blend";
import { CREAM, NAVY, PLUM, PLUM_GLOW, PLUM_TINT, SUN_GOLD } from "./palette";

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/**
 * How much of the sky's one-hour dayness ramp the text takes to switch between cream and navy:
 * the middle 6 minutes (option C, Jared's pick in /lab/sky, 2026-10-20). Over the full hour, as
 * first specified, the text sat at a mid-grey that nearly matched the sky for much of it. The sky
 * and vignette keep the full hour.
 */
export const TEXT_SWITCH = 6 / 60;

/** The text's dayness: the sky's, squeezed into the middle `window` of its ramp (1 = all of it). */
export function textDayness(day: number, window = TEXT_SWITCH) {
  if (window >= 1) return clamp01(day);
  return clamp01((day - (0.5 - window / 2)) / window);
}

export type TextTheme = {
  ink: string;
  accent: string;
  underline: string;
  tint: string;
  textShadow: string;
};

/**
 * The text colors at dayness `day` (0 = evening, 1 = full day). `eveningAccent` is the accent
 * before it blends toward plum: Starlight → Sun gold in scroll mode, Sun gold at fixed hours.
 * The day's text shadow (cream at 0.7, same 18px shape) isn't in the spec; Jared approved it
 * on 2026-10-20 from the mockup's daytime strength.
 */
export function themeAt(day: number, eveningAccent: string): TextTheme {
  const d = clamp01(day);
  return {
    ink: mixColor(CREAM, NAVY, d),
    accent: mixColor(eveningAccent, PLUM, d),
    underline: mixColor(SUN_GOLD, PLUM, d),
    tint: mixColor(PLUM_TINT, CREAM, d),
    textShadow: `0 0 18px ${withAlpha(mixColor(PLUM_GLOW, CREAM, d), 0.6 + 0.1 * d)}`,
  };
}
