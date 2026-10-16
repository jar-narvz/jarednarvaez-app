import Sparkle from "@/components/Sparkle";
import { hero } from "@/data/hero";

// The hero (docs/visual-system.md → Hero layout): editorial left on the sky's plum vignette,
// right side open to the sun. Order: portrait → stacked name → hero line → "currently" line.
// The name is the only focal point; nothing here is bigger or brighter than it.
// Layout values follow docs/reference/home-mockup.html.
export default function Hero() {
  return (
    <section className="flex min-h-svh items-center px-(--margin) pt-30 pb-20">
      {/* Nudged a little above center, as in the mockup. */}
      <div className="flex max-w-160 -translate-y-[4vh] flex-col gap-5.5 [text-shadow:var(--text-shadow)]">
        {/* [portrait] placeholder: swap for the real photo in the content pass. */}
        <div
          role="img"
          aria-label={hero.portrait.alt}
          className="grid size-21 place-items-center rounded-full border-2 border-cream bg-[radial-gradient(circle_at_35%_35%,#F7C27E,#A4527A_60%,#3A2E62)] font-serif text-[28px] text-cream shadow-[0_6px_20px_rgba(42,22,48,0.4)]"
        >
          {hero.portrait.initials}
        </div>

        <h1 className="font-serif text-[clamp(52px,7.5vw,72px)] leading-[0.95] font-normal tracking-[-0.045em]">
          {hero.firstName}
          <em className="block">{hero.surname}</em>
        </h1>

        <p className="max-w-[46ch] text-[18px] text-ink/78">{hero.heroLine}</p>

        <p className="flex items-center gap-2 text-[14px] text-accent">
          <Sparkle twinkle />
          {hero.currently}
        </p>
      </div>
    </section>
  );
}
