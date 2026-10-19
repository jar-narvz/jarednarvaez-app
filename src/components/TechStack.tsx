import MarqueeRow from "@/components/MarqueeRow";
import SectionHeading from "@/components/SectionHeading";
import SectionLabel from "@/components/SectionLabel";
import { techStack } from "@/data/techStack";
import { techLogos, type TechName } from "@/icons/techLogos";

// Copies of each list in its track: enough to fill the row edge to edge on screens up to
// ~3,300px wide with the shortest row (ML and data).
const COPIES = 4;

// The tech stack (docs/visual-system.md → Tech stack section): header on the left, then three
// logo pill rows looping in alternating directions at about 26, 23 and 25 px/s, edges fading over
// the outer 7%; only the row under the pointer pauses (Jared, 2026-10-17); still under Reduce
// Motion. Layout values follow docs/reference/home-mockup.html.
export default function TechStack() {
  return (
    <section
      id="tech"
      className="pl-(--content-l) pr-(--content-r) py-[clamp(72px,12vh,140px)] [text-shadow:var(--text-shadow)]"
    >
      <SectionLabel>{techStack.label}</SectionLabel>
      <SectionHeading>{techStack.heading}</SectionHeading>
      <p className="mt-2.5 max-w-[55ch] text-[17px] text-ink/90">{techStack.line}</p>

      <div className="mt-9 flex flex-col gap-5.5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
        {techStack.rows.map((row, i) => (
          // The list repeats COPIES times end to end, and each loop slides exactly one copy (see
          // the marquee keyframes in globals.css), so the restart is invisible. Two copies left a
          // gap at the right edge on wide screens, where the row is wider than one list.
          // The middle row runs the same loop in reverse.
          <MarqueeRow key={row.name} speed={row.speed} copies={COPIES} reverse={i % 2 === 1}>
            <PillList items={row.items} label={row.name} />
            {/* The repeats are only for the loop; screen readers hear each list once. */}
            {Array.from({ length: COPIES - 1 }, (_, c) => (
              <PillList key={c} items={row.items} hidden />
            ))}
          </MarqueeRow>
        ))}
      </div>
    </section>
  );
}

function PillList({ items, label, hidden }: { items: TechName[]; label?: string; hidden?: boolean }) {
  return (
    // role="list" keeps list semantics in Safari, which drops them when list-style is none.
    <ul role="list" aria-label={label} aria-hidden={hidden || undefined} className="flex gap-3.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2.5 rounded-full border border-ink/38 bg-tint/34 px-4.5 py-2.5 text-[18px] font-medium whitespace-nowrap"
        >
          <TechLogo name={item} />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** The logo in the text color, 22px inside a 24px slot; the name beside it does the talking, so
 *  the logo is decorative. Names without a free logo would keep an initials badge. */
function TechLogo({ name }: { name: TechName }) {
  const icon = techLogos[name];

  if (!icon) {
    return (
      <span
        aria-hidden="true"
        className="grid size-6 place-items-center rounded-md border border-ink/25 bg-ink/14 text-[11px] font-medium"
      >
        {name.replace(/[^A-Za-z]/g, "").slice(0, 2)}
      </span>
    );
  }

  return (
    <span aria-hidden="true" className="grid size-6 place-items-center">
      <svg
        viewBox={icon.viewBox}
        fill="currentColor"
        fillRule={icon.evenOdd ? "evenodd" : undefined}
        className="size-5.5"
      >
        {icon.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </span>
  );
}
