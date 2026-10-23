// Leave a star's data (docs/visual-system.md → Connect → Data, API and privacy). Positions are
// stored relative to the sky, not pixels, so a star sits in the same place on any screen.

export type VisitorStar = {
  id: string;
  x: number; // 0–1, share of sky width
  y: number; // 0–1, share of sky height above the horizon
  city: string; // "Manila"
  region: string; // "PH" or "CA"
  leftAt: string; // ISO timestamp (UTC)
  localTime: string; // "8:15 pm", the visitor's local time when left (sent by the browser)
};

/** What the browser sends to place a star. Everything else is filled in on the server. */
export type NewStar = Pick<VisitorStar, "x" | "y" | "localTime">;
