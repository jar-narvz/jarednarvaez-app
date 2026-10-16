// Experience content (docs/visual-system.md → Experience → Data shape). Bracketed text is
// placeholder copy, written with Jared in the content pass (build step 14).

export type Role = {
  title: string; // "Multi-agent systems intern"
  org: string; // shown as "@ Org"
  start: string; // "2026" or "Jun 2026"
  end?: string; // omit for "Present"
  location: string;
  current?: boolean; // twinkling star
  bullets: string[]; // 2–3, filled in the content pass
};

export const experience = {
  label: "experience",
  heading: "[experience heading]",
  // Newest first: internship, VSPA, PASAE. Which role is current is a placeholder too (confirm
  // in the content pass); the mockup marks the internship.
  roles: [
    {
      title: "[internship title]",
      org: "[company]",
      start: "[Mon 20XX]",
      location: "[City, CA]",
      current: true,
      bullets: ["[bullet: what you built]", "[bullet: the result or impact]"],
    },
    {
      title: "[VSPA role title]",
      org: "[VSPA]",
      start: "[Mon 20XX]",
      location: "[City, CA]",
      bullets: ["[bullet: what you built]", "[bullet: the result or impact]"],
    },
    {
      title: "[PASAE role title]",
      org: "[PASAE]",
      start: "[Mon 20XX]",
      location: "[City, CA]",
      bullets: ["[bullet: what you built]", "[bullet: the result or impact]"],
    },
  ] satisfies Role[],
};
