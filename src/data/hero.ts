// Hero content (docs/visual-system.md → Hero layout; copy from docs/content.md → Hero).

export const hero = {
  firstName: "Jared",
  surname: "Narvaez",
  heroLine: "creating experiences, sharing memories",
  // Live widgets (now playing, location) come after launch and still need design.
  currently: "Interning at PhysaFlow, CS + DS @ Berkeley",
  // 300×300 square crop in public/ (new photo, 2026-10-19). Enough for the 84px circle up to 3×
  // screens; don't show it much larger.
  portrait: { src: "/portrait.jpg", alt: "Jared Narvaez smiling by the ocean at sunset" },
};
