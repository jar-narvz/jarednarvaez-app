import SectionHeading from "@/components/SectionHeading";
import SectionLabel from "@/components/SectionLabel";
import { techStack } from "@/data/techStack";

// Copies of each list in its track: enough to fill the row edge to edge on screens up to
// ~3,300px wide with the placeholder list. Revisit if the real list is much shorter.
const COPIES = 4;

// The tech stack (docs/visual-system.md → Tech stack section): header on the left, then two
// pill rows looping in opposite directions (42s and 48s), edges fading over the outer 7%,
// paused on hover, still under Reduce Motion. Layout values follow docs/reference/home-mockup.html.
export default function TechStack() {
  return (
    <section
      id="tech"
      className="px-(--margin) py-[clamp(72px,12vh,140px)] [text-shadow:var(--text-shadow)]"
    >
      <SectionLabel>{techStack.label}</SectionLabel>
      <SectionHeading>{techStack.heading}</SectionHeading>
      <p className="mt-2.5 max-w-[55ch] text-[17px] text-ink/90">{techStack.line}</p>

      <div className="group mt-9 flex flex-col gap-5.5 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)]">
        {techStack.rows.map((row, i) => (
          // The list repeats COPIES times end to end, and each loop slides exactly one copy (see
          // the marquee keyframes in globals.css), so the restart is invisible. Two copies left a
          // gap at the right edge on wide screens, where the row is wider than one list.
          // Row 2 runs the same loop in reverse.
          <div
            key={row.name}
            style={{ "--copies": COPIES } as React.CSSProperties}
            className={`flex w-max gap-3.5 animate-marquee group-hover:[animation-play-state:paused] ${
              i === 1 ? "[animation-direction:reverse] [animation-duration:48s]" : ""
            }`}
          >
            <PillList items={row.items} label={row.name} />
            {/* The repeats are only for the loop; screen readers hear each list once. */}
            {Array.from({ length: COPIES - 1 }, (_, c) => (
              <PillList key={c} items={row.items} hidden />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function PillList({ items, label, hidden }: { items: string[]; label?: string; hidden?: boolean }) {
  return (
    // role="list" keeps list semantics in Safari, which drops them when list-style is none.
    <ul role="list" aria-label={label} aria-hidden={hidden || undefined} className="flex gap-3.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2.5 rounded-full border border-ink/38 bg-tint/34 px-4.5 py-2.5 text-[18px] font-medium whitespace-nowrap"
        >
          {/* [logo] placeholder: two letters in a square until real logos arrive in the content pass. */}
          <span
            aria-hidden="true"
            className="grid size-6 place-items-center rounded-md border border-ink/25 bg-ink/14 text-[11px] font-medium"
          >
            {item.replace(/[^A-Za-z]/g, "").slice(0, 2)}
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
