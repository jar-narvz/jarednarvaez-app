// A subtle line between sections, framing the collapsible ones (experience, and projects in
// step 11). Placed between sections so neighbours share one line instead of stacking two.
// Same material as the projects rules: 1px ink at 22%. Static; no animation.
// Default: --block-w, the width of the collapsible header rows (the full content column since
// 2026-10-19). `wide`: column edge to column edge, matching the tech stack rows it sits under.
// See docs/visual-system.md → Page layout.
export default function SectionDivider({ wide = false }: { wide?: boolean }) {
  return (
    <div aria-hidden="true" className="pl-(--content-l) pr-(--content-r)">
      <div className={`h-px bg-ink/22 ${wide ? "" : "max-w-(--block-w)"}`} />
    </div>
  );
}
