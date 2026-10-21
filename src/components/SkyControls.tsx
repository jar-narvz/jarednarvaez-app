"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import TimeDial from "@/components/TimeDial";
import { isDarkHour } from "@/lib/sky/hours";
import {
  getServerSkyMode,
  getShownHour,
  getSkyMode,
  onShownHourChange,
  onSkyModeChange,
  setSkyMode,
} from "@/lib/sky/skyHour";

// The nav's sky controls (docs/visual-system.md → 24-hour sky → Mode behavior), in order:
// light/dark button → mini dial → "sunset" pill, which appears last on the far right outside
// scroll mode (Jared, 2026-10-20; was first, before light/dark). The mini dial opens the full
// time dial (TimeDial) below it.

/** The current sky mode, re-rendering only when it changes (a click, never a scroll frame). */
export function useSkyMode() {
  return useSyncExternalStore(onSkyModeChange, getSkyMode, getServerSkyMode);
}

// Motion inventory timings.
const PILL_S = 0.3; // "sunset" pill: translateX 8px → 0 + fade
const ICON_S = 0.35; // light/dark icon spins in
const ICON_EASE = [0.3, 1.4, 0.5, 1] as const;
const CSS_EASE = [0.25, 0.1, 0.25, 1] as const; // CSS `ease`, as in the mockup

/**
 * When the "sunset" pill comes or goes, everything to its left (light/dark, mini dial, the links
 * or the phone's "menu" button) glides over to its new place instead of jumping: the same 300ms
 * as the pill (Jared, 2026-10-20). Instant under Reduce Motion.
 */
export const shiftTransition = (reduceMotion: boolean) => ({
  layout: { duration: reduceMotion ? 0 : PILL_S, ease: CSS_EASE },
});

// Icon buttons at ~82% ink, full on hover, with the text shadow's glow so they read over the sky.
const ICON_BUTTON =
  "grid cursor-pointer place-items-center p-1 text-ink/82 [filter:drop-shadow(var(--text-shadow))] hover:text-ink";

export default function SkyControls({
  dialOpen,
  onDialOpenChange,
}: {
  dialOpen: boolean;
  onDialOpenChange: (open: boolean) => void;
}) {
  const reduceMotion = !!useReducedMotion();
  const sky = useSkyMode();
  const dialButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <motion.span layout="position" transition={shiftTransition(reduceMotion)}>
        <LightDarkButton reduceMotion={reduceMotion} />
      </motion.span>
      <motion.span layout="position" transition={shiftTransition(reduceMotion)}>
        <MiniDial ref={dialButtonRef} open={dialOpen} onClick={() => onDialOpenChange(!dialOpen)} />
      </motion.span>
      <SunsetPill visible={sky.mode !== "scroll"} reduceMotion={reduceMotion} />
      {/* The dial stays at the nav's right edge while the icons glide (Jared, 2026-10-20), so it
          sits outside the gliding icons. */}
      <AnimatePresence>
        {dialOpen && (
          <TimeDial reduceMotion={reduceMotion} dialButtonRef={dialButtonRef} onClose={() => onDialOpenChange(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

/**
 * "sunset": back to scroll mode. Slides in whenever the visitor has left it. It takes no space
 * while hidden, so in scroll mode the mini dial sits on the right edge. Colors follow the theme
 * (option B, Jared, 2026-10-20): the underline color for the border (Sun gold by evening, plum
 * by day) and the accent for the text, so it stays readable on the daytime sky.
 */
function SunsetPill({ visible, reduceMotion }: { visible: boolean; reduceMotion: boolean }) {
  const hidden = { opacity: 0, x: 8 };
  return (
    // popLayout: the leaving pill stops taking space at once, so the controls glide right while it
    // slides away, instead of waiting for it to finish.
    <AnimatePresence initial={false} mode="popLayout">
      {visible && (
        <motion.button
          type="button"
          onClick={() => setSkyMode({ mode: "scroll" })}
          initial={hidden}
          animate={{ opacity: 1, x: 0 }}
          exit={hidden}
          transition={{ duration: reduceMotion ? 0 : PILL_S, ease: CSS_EASE }}
          className="cursor-pointer rounded-full border border-underline/70 bg-tint/40 px-2.5 py-1 text-[12px] font-medium text-accent"
        >
          sunset
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/**
 * A moon while the sky is light (or in scroll mode): jumps to midnight. A sun at night: jumps to
 * midday. The new icon spins in when it swaps.
 */
function LightDarkButton({ reduceMotion }: { reduceMotion: boolean }) {
  const [dark, setDark] = useState(false);
  // No spin on the first paint, only when the icon actually swaps.
  const [swapped, setSwapped] = useState(false);
  const darkRef = useRef(false);

  useEffect(() => {
    const update = () => {
      const next = getSkyMode().mode !== "scroll" && isDarkHour(getShownHour());
      if (next === darkRef.current) return;
      darkRef.current = next;
      setDark(next);
      setSwapped(true);
    };
    // The hour changes with the sky; the mode can change without it (back to scroll at night).
    const stopHour = onShownHourChange(update);
    const stopMode = onSkyModeChange(update);
    return () => {
      stopHour();
      stopMode();
    };
  }, []);

  return (
    <button
      type="button"
      aria-label={dark ? "Switch to day sky" : "Switch to night sky"}
      onClick={() => setSkyMode({ mode: "hour", hour: dark ? 12 : 0 })}
      className={ICON_BUTTON}
    >
      <motion.span
        key={dark ? "sun" : "moon"}
        className="block"
        initial={swapped && !reduceMotion ? { rotate: -90, scale: 0.6, opacity: 0 } : false}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : ICON_S, ease: ICON_EASE }}
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </motion.span>
    </button>
  );
}

/**
 * 22px ring with an inner ring and a dot at the sky's current hour (noon at top, midnight at
 * bottom, 6 am left, 6 pm right). The dot is in the accent color (Jared, 2026-10-20; the spec's
 * gold would vanish on the cream daytime sky) and moves with every frame, outside React.
 */
function MiniDial({
  ref,
  open,
  onClick,
}: {
  ref: React.Ref<HTMLButtonElement>;
  open: boolean;
  onClick: () => void;
}) {
  const dotRef = useRef<SVGCircleElement>(null);

  useEffect(
    () =>
      onShownHourChange((hour) => {
        dotRef.current?.setAttribute("transform", `rotate(${(hour - 12) * 15} 24 24)`);
      }),
    [],
  );

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Sky time dial"
      aria-expanded={open}
      aria-controls="time-dial"
      onClick={onClick}
      className={ICON_BUTTON}
    >
      <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="22" className="fill-tint/45 stroke-ink/60" strokeWidth="2.4" />
        <circle cx="24" cy="24" r="13" fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="2.4" />
        <circle ref={dotRef} cx="24" cy="11" r="5.5" className="fill-accent" transform="rotate(97.5 24 24)" />
      </svg>
    </button>
  );
}

// 16px line icons, from the approved mockup.
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M13.5 9.8A5.8 5.8 0 0 1 6.2 2.5a5.8 5.8 0 1 0 7.3 7.3Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3" />
    </svg>
  );
}
