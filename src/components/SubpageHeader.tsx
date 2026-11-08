"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import Monogram from "@/components/Monogram";
import { NavLink, PhoneMenu, usePhoneMenu, type NavItem } from "@/components/Nav";
import { MoonIcon, SunIcon } from "@/components/SkyControls";
import { links } from "@/data/links";

// The subpage header (docs/visual-system.md → Subpages → Subpage header and contact block, decided
// 2026-10-30): the home nav's type and placement, with the "jn" mark at left and home · projects ·
// résumé · contact · the light/dark toggle at right. Like the home nav it hides while you scroll down and
// comes back when you scroll up (250ms; instant under Reduce Motion). On phones (below 768px, like
// the home nav) the links move into the home nav's full-screen menu behind a "menu" button, since
// five items no longer fit in one row on narrow phones (Jared, 2026-11-08); the toggle stays in
// the row. "contact" scrolls to the page's contact block (#contact).

// projects and résumé on every subpage now that both are pages (Jared, 2026-11-08). Pages go
// through Next's Link (NavLink), so the light/dark choice carries over between them.
const LINKS: NavItem[] = [
  { label: "home", href: "/" },
  { label: "projects", href: "/projects" },
  { label: "résumé", href: links.resume },
  { label: "contact", href: "#contact" },
];

// Always shown near the top; tiny scroll jitter is ignored (same as Nav.tsx).
const SHOW_NEAR_TOP = 80;
const SCROLL_JITTER = 6;

export default function SubpageHeader({ dark, onFlip }: { dark: boolean; onFlip: () => void }) {
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  usePhoneMenu(open, setOpen);

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
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-20 px-(--margin) pt-10"
        // Stays put while the phone menu is open.
        animate={{ y: hidden && !open ? "-100%" : 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
        // Focus brings it back, so keyboard users never tab into links they can't see.
        onFocus={() => setHidden(false)}
      >
        <div className="flex items-baseline justify-between">
          <Monogram href="/" />
          <div className="pointer-events-auto flex items-center text-[14px] font-medium text-ink/82 [text-shadow:var(--text-shadow)]">
            {/* Desktop: the links in a row. */}
            <nav aria-label="Main" className="hidden md:block">
              <ul className="flex items-center gap-7">
                {LINKS.map((link) => (
                  <li key={link.label}>
                    <NavLink link={link} className="transition-colors hover:text-ink" />
                  </li>
                ))}
              </ul>
            </nav>
            {/* Phones: the links live behind this button, before the toggle. */}
            <button
              type="button"
              className="cursor-pointer md:hidden"
              aria-expanded={open}
              aria-controls="phone-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "close" : "menu"}
            </button>
            {/* The home nav's wider gap before its sky controls. */}
            <LightDarkToggle dark={dark} onFlip={onFlip} reduceMotion={!!reduceMotion} />
          </div>
        </div>
      </motion.header>

      {/* Outside the header, like the home nav's: a fixed menu inside the sliding header would be
          pinned to the header instead of the screen. */}
      <AnimatePresence>
        {open && <PhoneMenu links={LINKS} reduceMotion={!!reduceMotion} onPick={() => setOpen(false)} />}
      </AnimatePresence>
    </>
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
      className="-m-1 ml-4 grid cursor-pointer place-items-center p-1 text-ink/82 [filter:drop-shadow(var(--text-shadow))] hover:text-ink md:ml-8"
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
