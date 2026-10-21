"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import SkyControls, { shiftTransition } from "@/components/SkyControls";
import { links } from "@/data/links";

// The site nav: top-right, quiet (docs/visual-system.md → Hero layout: 14px, weight 500,
// cream at ~82%, no monogram). Links in page order, lowercase, then the sky controls
// (SkyControls: light/dark, mini dial, "sunset" pill), which stay visible on phones too.
//
// Chosen on /lab (step 6, 2026-10-11): it hides while you scroll down and comes back when you
// scroll up, so the controls stay reachable without covering text; on phones the links open
// in a full-screen menu.

const LINKS = [
  { label: "about", href: "#about" },
  { label: "experience", href: "#experience" },
  { label: "projects", href: "#projects" },
  { label: "résumé", href: links.resume },
  { label: "contact", href: "#contact" },
];

/** The résumé PDF opens in a new tab (as in connect) so the site stays open; section links stay put. */
const newTab = (href: string) =>
  href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" };

// The plum text shadow (shared with the hero in globals.css), so the nav stays readable
// when it sits over dusk and night.
const SHADOW = "[text-shadow:var(--text-shadow)]";

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
  const [dialOpen, setDialOpen] = useState(false);

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

  // The nav stays put while the phone menu or the time dial is open.
  const isHidden = hidden && !open && !dialOpen;

  return (
    <>
      <motion.header
        className={`fixed inset-x-0 top-0 z-20 pointer-events-none px-(--margin) pt-10`}
        // -100% of the header's own height, which includes the 40px top offset.
        animate={{ y: isHidden ? "-100%" : 0 }}
        transition={transition}
        // Keyboard users tabbing into the nav while it's slid away would focus links they can't
        // see, so it comes back as soon as anything inside it gets focus (step 15).
        onFocus={() => setHidden(false)}
      >
        {/* One layout group, so the links re-measure and glide too when the sky controls change. */}
        <LayoutGroup>
          <div className="flex items-center justify-end">
            <motion.nav
              aria-label="Main"
              // Glides with the sky controls when the "sunset" pill comes or goes.
              layout="position"
              transition={shiftTransition(!!reduceMotion)}
              className={`pointer-events-auto text-[14px] font-medium text-ink/82 ${SHADOW}`}
            >
              {/* Desktop: the five links in a row. */}
              <ul className="hidden items-center gap-7 md:flex">
                {LINKS.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} {...newTab(link.href)} className="transition-colors hover:text-ink">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.nav>

            <div className={`pointer-events-auto flex items-center gap-3 text-[14px] font-medium text-ink/82 md:ml-8 ${SHADOW}`}>
              {/* Phones: the links live behind this button, before the sky controls. */}
              <motion.button
                type="button"
                layout="position"
                transition={shiftTransition(!!reduceMotion)}
                className="mr-1 cursor-pointer md:hidden"
                aria-expanded={open}
                aria-controls="phone-menu"
                onClick={() => setOpen((o) => !o)}
              >
                {open ? "close" : "menu"}
              </motion.button>
              <SkyControls dialOpen={dialOpen} onDialOpenChange={setDialOpen} />
            </div>
          </div>
        </LayoutGroup>
      </motion.header>

      {/* Outside the header on purpose: the header slides with a transform, and a fixed element
          inside a transformed parent would be pinned to the header instead of the screen. It sits
          under the header (z-10 vs z-20) so the "close" button stays on top. */}
      <AnimatePresence>
        {open && <PhoneMenu reduceMotion={!!reduceMotion} onPick={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}

// Phone menu timings (Motion inventory): the backdrop fades in over 250ms and out over 200ms;
// each link rises 10px and fades in, one after another. The links run a little slower than the
// inventory's 350ms / 60 + 40·i ms, at Jared's request after testing on his phone (2026-10-16).
const MENU_OPEN_S = 0.25;
const MENU_CLOSE_S = 0.2;
const LINK_S = 0.45;
const linkDelay = (i: number) => (80 + 60 * i) / 1000;
const CSS_EASE = [0.25, 0.1, 0.25, 1] as const; // CSS `ease`, as in the mockup

// Phones: big links stacked on the left over a darkened, blurred sky.
function PhoneMenu({ reduceMotion, onPick }: { reduceMotion: boolean; onPick: () => void }) {
  // Reduce Motion: the menu and its links appear and disappear instantly.
  const instant = { duration: 0 };
  return (
    <motion.div
      id="phone-menu"
      className="fixed inset-0 z-10 bg-tint/60 px-(--margin) pt-32 backdrop-blur-md md:hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: reduceMotion ? instant : { duration: MENU_OPEN_S, ease: "easeOut" } }}
      exit={{ opacity: 0, transition: reduceMotion ? instant : { duration: MENU_CLOSE_S, ease: "easeOut" } }}
    >
      <ul className={`flex flex-col gap-5 font-serif text-[36px] leading-none text-ink ${SHADOW}`}>
        {LINKS.map((link, i) => (
          <motion.li
            key={link.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? instant : { duration: LINK_S, ease: CSS_EASE, delay: linkDelay(i) }}
          >
            <a href={link.href} {...newTab(link.href)} onClick={onPick}>
              {link.label}
            </a>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
