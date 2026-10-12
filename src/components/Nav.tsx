"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

// The site nav: top-right, quiet (docs/visual-system.md → Hero layout: 14px, weight 500,
// cream at ~82%, no monogram). Links in page order, lowercase. The sky controls are inert
// placeholders until the sky modes are built in Phase 3.
//
// Chosen on /lab (step 6, 2026-10-11): it hides while you scroll down and comes back when you
// scroll up, so the controls stay reachable without covering text; on phones the links open
// in a full-screen menu.

const RESUME_HREF = "#resume"; // [résumé link] placeholder: PDF or external link not decided yet

const LINKS = [
  { label: "about", href: "#about" },
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  { label: "résumé", href: RESUME_HREF },
  { label: "contact", href: "#contact" },
];

// The plum text shadow from the prototype (rgba(42,18,40,.6), 18px blur), brought forward
// from step 7 for the nav so it stays readable when it sits over dusk and night.
const SHADOW = "[text-shadow:0_0_18px_rgba(42,18,40,0.6)]";

// Always shown near the top; tiny scroll jitter is ignored.
const SHOW_NEAR_TOP = 80;
const SCROLL_JITTER = 6;

const SLIDE_S = 0.25;

export default function Nav() {
  const reduceMotion = useReducedMotion();
  // Reduce Motion: everything appears and disappears instantly (decided 2026-10-11).
  const transition = { duration: reduceMotion ? 0 : SLIDE_S, ease: "easeOut" } as const;

  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  // Hide while scrolling down, come back on any scroll up.
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

  // While the phone menu is open: Escape closes it, and the page can't scroll underneath.
  // It also closes if the screen widens to the desktop nav (e.g. a phone turned sideways),
  // since the "close" button disappears at that width.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onWiden = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWiden);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWiden);
      document.body.style.overflow = "";
    };
  }, [open]);

  const isHidden = hidden && !open;

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-20 pointer-events-none px-6 pt-10 md:px-24`}
        // -100% of the header's own height, which includes the 40px top offset.
        animate={{ y: isHidden ? "-100%" : 0 }}
        transition={transition}
      >
        <div className="flex items-center justify-end">
          <nav aria-label="Main" className={`pointer-events-auto text-[14px] font-medium text-ink/82 ${SHADOW}`}>
            {/* Desktop: the five links in a row. */}
            <ul className="hidden items-center gap-7 md:flex">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-ink">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className={`pointer-events-auto flex items-center gap-4 text-[14px] font-medium text-ink/82 md:ml-10 ${SHADOW}`}>
            <SkyControls />
            {/* Phones: the links live behind this button. */}
            <button
              type="button"
              className="ml-2 md:hidden"
              aria-expanded={open}
              aria-controls="phone-menu"
              onClick={() => setOpen((o) => !o)}
            >
              {open ? "close" : "menu"}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Outside the header on purpose: the header slides with a transform, and a fixed element
          inside a transformed parent would be pinned to the header instead of the screen. It sits
          under the header (z-10 vs z-20) so the "close" button stays on top. */}
      <AnimatePresence>
        {open && <PhoneMenu transition={transition} onPick={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// Light/dark (sun and moon swap on click) and local time. Placeholders until Phase 3: they
// look real so Jared can judge the nav's width and balance, but they do nothing yet.
function SkyControls() {
  const placeholder = "[placeholder: sky modes come in Phase 3]";
  return (
    <>
      <button type="button" aria-disabled="true" aria-label={`Light or dark sky ${placeholder}`} title={placeholder} className="cursor-default">
        <SunIcon />
      </button>
      <button type="button" aria-disabled="true" aria-label={`Use my local time ${placeholder}`} title={placeholder} className="cursor-default">
        <ClockIcon />
      </button>
    </>
  );
}

type Transition = { duration: number; ease: "easeOut" };

// Phones: big links stacked on the left over a darkened, blurred sky.
function PhoneMenu({ transition, onPick }: { transition: Transition; onPick: () => void }) {
  return (
    <motion.div
      id="phone-menu"
      className="fixed inset-0 z-10 bg-[#2A1630]/60 px-6 pt-32 backdrop-blur-md md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={transition}
    >
      <ul className={`flex flex-col gap-5 font-serif text-[36px] leading-none text-ink ${SHADOW}`}>
        {LINKS.map((link) => (
          <li key={link.label}>
            <a href={link.href} onClick={onPick}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// 16px line icons in the nav's ink color. Placeholders until the icon set is decided.
function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1.5v1.5M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1 1M11.6 11.6l1 1M3.4 12.6l1-1M11.6 4.4l1-1" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 4.5V8l2.25 1.5" />
    </svg>
  );
}
