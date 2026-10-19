import SectionLabel from "@/components/SectionLabel";
import { intro } from "@/data/intro";

// The intro (docs/visual-system.md → Intro layout): label → Newsreader lead with one
// underlined phrase → paragraph → a row of four quick facts (2×2 on phones), all on the
// left vignette and left of the sun. No animations beyond the sky itself.
// Layout values follow docs/reference/home-mockup.html.
export default function Intro() {
  return (
    <section
      id="about"
      className="pl-(--content-l) pr-(--content-r) py-[clamp(72px,12vh,140px)] [text-shadow:var(--text-shadow)]"
    >
      <SectionLabel>{intro.label}</SectionLabel>

      <p className="mt-3.5 max-w-[30ch] font-serif text-[clamp(26px,3vw,32px)] leading-[1.25] tracking-[-0.015em] text-balance">
        {intro.lead.before}
        <span className="border-b-[1.5px] border-underline">{intro.lead.underlined}</span>
        {intro.lead.after}
      </p>

      <p className="mt-4.5 max-w-[62ch] text-[17px] leading-[1.65] text-ink/92">{intro.paragraph}</p>

      <dl className="mt-9 grid max-w-160 grid-cols-2 gap-5 sm:grid-cols-4">
        {intro.facts.map((fact) => (
          <div key={fact.label} className="border-t border-ink/40 pt-2.5">
            <dt className="text-[13px] text-ink/72">{fact.label}</dt>
            <dd className="mt-0.5 text-[15px]">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
