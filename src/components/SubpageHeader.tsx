"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Monogram from "@/components/Monogram";
import { MoonIcon, SunIcon } from "@/components/SkyControls";
import { links } from "@/data/links";

// The subpage header (docs/visual-system.md → Subpages → Subpage header and contact block, decided
// 2026-10-30): the home nav's type and placement, with the "jn" mark at left and home · résumé ·
// contact · the light/dark toggle at right. Like the home nav it hides while you scroll down and
// comes back when you scroll up (250ms; instant under Reduce Motion). Everything fits in one row on
// phones, so there's no menu. "contact" scrolls to the page's contact block (#contact).

const LINKS = [
  { label: "home", href: "/" },
  { label: "résumé", href: links.resume, newTab: true },
  { label: "contact", href: "#contact" },
];

// Always shown near the top; tiny scroll jitter is ignored (same as Nav.tsx).
const SHOW_NEAR_TOP = 80;
const SCROLL_JITTER = 6;

export default function SubpageHeader({ dark, onFlip }: { dark: boolean; onFlip: () => void }) {
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < SHOW_NEAR_TOP) setHidden(false);
      else if (Math.abs(y - lastY) < SCROLL_JITTER) return;
      else setHidden(y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      className="pointer-events-none fixed inset-x-0 top-0 z-20 px-(--margin) pt-10"
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
      // Focus brings it back, so keyboard users never tab into links they can't see.
      onFocus={() => setHidden(false)}
    >
      <div className="flex items-baseline justify-between">
        <Monogram href="/" />
        <div className="pointer-events-auto flex items-center text-[14px] font-medium text-ink/82 [text-shadow:var(--text-shadow)]">
          <nav aria-label="Main">
            <ul className="flex items-center gap-7 max-sm:gap-5">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    {...(link.newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* The home nav's wider gap before its sky controls. */}
          <LightDarkToggle dark={dark} onFlip={onFlip} reduceMotion={!!reduceMotion} />
        </div>
      </div>
    </motion.header>
  );
}

/**
 * The home nav's light/dark button (SkyControls.tsx → LightDarkButton) in the same style: a moon in
 * light mode, a sun in dark mode; the new icon spins in on a swap (rotate -90° → 0, scale 0.6 → 1,
 * fade; 350ms cubic-bezier(.3,1.4,.5,1); instant under Reduce Motion).
 */
function LightDarkToggle({ dark, onFlip, reduceMotion }: { dark: boolean; onFlip: () => void; reduceMotion: boolean }) {
  const [swapped, setSwapped] = useState(false);
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light" : "Switch to dark"}
      onClick={() => {
        setSwapped(true);
        onFlip();
      }}
      className="-m-1 ml-7 grid cursor-pointer place-items-center p-1 text-ink/82 [filter:drop-shadow(var(--text-shadow))] hover:text-ink md:ml-8"
    >
      <motion.span
        key={dark ? "sun" : "moon"}
        className="block"
        initial={swapped && !reduceMotion ? { rotate: -90, scale: 0.6, opacity: 0 } : false}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.3, 1.4, 0.5, 1] }}
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </motion.span>
    </button>
  );
}
