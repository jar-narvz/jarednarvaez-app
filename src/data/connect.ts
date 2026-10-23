// Connect content (docs/visual-system.md → Connect → Contact block; copy from docs/content.md →
// Connect). Addresses live in links.ts.

export const connect = {
  label: "connect",
  heading: "reach out!",
  line: "I'd love to chat about anything! Looking for full-time roles starting 2027 and Spring 2027 co-ops.",
  // Leave a star's hint (wording from docs/visual-system.md → Connect, confirmed by Jared 2026-10-22).
  starHint: {
    dark: { action: "click the sky", rest: "to leave a star" },
    day: "stars come out at night",
  },
  // Leave a star's privacy note, under the hint (docs/visual-system.md → Connect → Privacy; wording
  // chosen by Jared 2026-10-23). Keep it true to what /api/stars stores.
  privacyNote: "your star keeps only your city and the time",
};
