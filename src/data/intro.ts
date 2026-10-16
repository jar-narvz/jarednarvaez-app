// Intro content (docs/visual-system.md → Intro layout). Bracketed text is placeholder copy,
// written with Jared in the content pass (build step 14).

export const intro = {
  label: "about",
  // The lead is split so one phrase can carry the Sun gold underline.
  lead: {
    before: "[lead sentence, with ",
    underlined: "[one warm phrase]",
    after: " underlined]",
  },
  paragraph: "[about paragraph]",
  // The four fact labels are part of the design; only the values are placeholders.
  facts: [
    { label: "studying", value: "[studying]" },
    { label: "leading", value: "[leading]" },
    { label: "outside code", value: "[outside code]" },
    { label: "based in", value: "[based in]" },
  ],
};
