// A subtle line between sections, framing the collapsible ones (experience, and projects in
// step 11). Placed between sections so neighbours share one line instead of stacking two.
// Same material as the projects rules: 1px ink at 22%. Static; no animation.
// Default: 640px from the side margin, the width of the collapsible header rows, so it stays
// left of the sun. `wide`: margin to margin, matching the tech stack rows it sits under.
// Values chosen with Jared 2026-10-16, not yet in visual-system.md.
export default function SectionDivider({ wide = false }: { wide?: boolean }) {
  return (
    <div aria-hidden="true" className="pl-(--content-l) pr-(--content-r)">
      <div className={`h-px bg-ink/22 ${wide ? "" : "max-w-160"}`} />
    </div>
  );
}
