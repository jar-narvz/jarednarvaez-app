"use client";

import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Lab-only (2026-10-30): the "jn" monogram (option A), for choosing its size and strength on the
// home page (/lab/logo) and the subpage header (/lab/projects). Newsreader, lowercase, with the n
// in italic like the hero surname. It links home. The choice rides in the URL (?size=24&ink=82)
// so both lab pages show the same mark.

export const SIZES = [20, 24, 28] as const;
export const INKS = [82, 100] as const;
export type Mark = { size: number; ink: number };
export const DEFAULT_MARK: Mark = { size: 24, ink: 82 };

/** The mark settings from the URL, read after hydration; `set` writes them back. */
export function useMark() {
  const [mark, setMark] = useState<Mark>(DEFAULT_MARK);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const size = Number(q.get("size"));
    const ink = Number(q.get("ink"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
    setMark({
      size: (SIZES as readonly number[]).includes(size) ? size : DEFAULT_MARK.size,
      ink: (INKS as readonly number[]).includes(ink) ? ink : DEFAULT_MARK.ink,
    });
  }, []);
  const set = (next: Mark) => {
    setMark(next);
    const q = new URLSearchParams(window.location.search);
    q.set("size", String(next.size));
    q.set("ink", String(next.ink));
    window.history.replaceState(null, "", `?${q}`);
  };
  return [mark, set] as const;
}

export const markQuery = (m: Mark) => `?size=${m.size}&ink=${m.ink}`;

/** Hides on scroll down and returns on scroll up, like the home nav (Nav.tsx). */
export function useHideOnScroll() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 80) setHidden(false);
      else if (Math.abs(y - lastY) < 6) return;
      else setHidden(y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return hidden;
}

export function Monogram({ mark, href = "/" }: { mark: Mark; href?: string }) {
  return (
    <Link
      href={href}
      aria-label="jared narvaez, home"
      style={{ fontSize: mark.size, color: `color-mix(in srgb, var(--ink) ${mark.ink}%, transparent)` }}
      className="pointer-events-auto font-serif leading-none font-normal tracking-[-0.03em] [text-shadow:var(--text-shadow)] transition-colors hover:text-ink!"
    >
      j<span className="italic">n</span>
    </Link>
  );
}

/** A fixed top-left mark on the nav's margin and 40px from the top, sliding away with the nav. */
export function FloatingMonogram({ mark, href }: { mark: Mark; href?: string }) {
  const hidden = useHideOnScroll();
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-20 pt-10 pl-(--margin)"
      animate={{ y: hidden ? "-100%" : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
    >
      <Monogram mark={mark} href={href} />
    </motion.div>
  );
}

/** The mark's panel row: size and strength pills, plus a favicon preview. */
export function MarkPanel({ mark, onChange }: { mark: Mark; onChange: (m: Mark) => void }) {
  const pill = (on: boolean) =>
    `cursor-pointer rounded-full border px-2.5 py-0.5 ${on ? "border-accent text-accent" : "border-ink/35 text-ink/85"}`;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <span className="text-ink/70">mark size</span>
      {SIZES.map((s) => (
        <button key={s} type="button" aria-pressed={s === mark.size} onClick={() => onChange({ ...mark, size: s })} className={pill(s === mark.size)}>
          {s}px
        </button>
      ))}
      <span className="ml-2 text-ink/70">strength</span>
      {INKS.map((k) => (
        <button key={k} type="button" aria-pressed={k === mark.ink} onClick={() => onChange({ ...mark, ink: k })} className={pill(k === mark.ink)}>
          {k}% ink
        </button>
      ))}
      <span className="ml-2 text-ink/70">favicon</span>
      <FaviconPreview px={32} />
      <FaviconPreview px={16} />
    </div>
  );
}

/** Rough favicon preview: the mark in Sun gold on dusk's top color. The real icon would be drawn
 *  from the letter outlines, since a favicon can't load the web font. */
function FaviconPreview({ px }: { px: number }) {
  return (
    <span
      aria-label={`favicon preview at ${px}px`}
      role="img"
      style={{ width: px, height: px, fontSize: px * 0.72, borderRadius: px / 5 }}
      className="grid place-items-center bg-[#1E1C44] pb-[0.08em] font-serif leading-none tracking-[-0.04em] text-[#FFD48A]"
    >
      <span>
        j<span className="italic">n</span>
      </span>
    </span>
  );
}
