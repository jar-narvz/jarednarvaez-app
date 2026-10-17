// Intro content (docs/visual-system.md → Intro layout; copy from docs/content.md → Intro).

export const intro = {
  label: "about",
  // The lead is split so one phrase can carry the Sun gold underline.
  lead: {
    before:
      "Hey! I'm Jared. I'm studying Computer Science and Data Science at UC Berkeley, and I love ",
    underlined: "dancing, hiking and eating",
    after: "!",
  },
  paragraph:
    "I'm currently interning at PhysaFlow and working as a Data Assistant at VSPA. I'm also serving as the Vice President of External Relations for the Pilipinx Association of Scientists, Architects, and Engineers, and I love to dance on my school dance teams. Outside of school I love exploring the Bay Area, whether that's a new trailhead or the newest trending restaurant on TikTok.",
  // The four fact labels are part of the design (docs/design.md → Intro).
  facts: [
    { label: "studying", value: "CS + Data Science @ Berkeley" },
    { label: "leading", value: "External VP @ PASAE" },
    { label: "currently @", value: "PhysaFlow + VSPA" },
    { label: "based in", value: "The Bay Area" },
  ],
};
