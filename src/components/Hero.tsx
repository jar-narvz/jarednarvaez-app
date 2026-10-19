import Image from "next/image";
import HeroLinks from "@/components/HeroLinks";
import Sparkle from "@/components/Sparkle";
import { hero } from "@/data/hero";

// The hero (docs/visual-system.md → Hero layout): editorial left on the sky's plum vignette,
// right side open to the sun. Order: portrait → stacked name → hero line → "currently" line →
// link buttons (added 2026-10-17).
// The name is the only focal point; nothing here is bigger or brighter than it.
// Layout values follow docs/reference/home-mockup.html.
export default function Hero() {
  return (
    <section className="flex min-h-svh items-center px-(--margin) pt-30 pb-20">
      {/* Nudged a little above center, as in the mockup. */}
      <div className="flex max-w-160 -translate-y-[4vh] flex-col gap-5.5 [text-shadow:var(--text-shadow)]">
        {/* 84px round portrait with a 2px cream border. First thing on screen, so it loads eagerly. */}
        <Image
          src={hero.portrait.src}
          alt={hero.portrait.alt}
          width={84}
          height={84}
          preload
          className="size-21 rounded-full border-2 border-cream object-cover shadow-[0_6px_20px_rgba(42,22,48,0.4)]"
        />

        <h1 className="font-serif text-[clamp(52px,7.5vw,72px)] leading-[0.95] font-normal tracking-[-0.045em]">
          {hero.firstName}
          <em className="block">{hero.surname}</em>
        </h1>

        {/* 20px, up from the 18px prototype value (chosen by Jared in /lab, 2026-10-19). */}
        <p className="max-w-[46ch] text-[20px] text-ink/78">{hero.heroLine}</p>

        <p className="flex items-center gap-2 text-[14px] text-accent">
          <Sparkle twinkle />
          {hero.currently}
        </p>

        <HeroLinks />
      </div>
    </section>
  );
}
