"use client";

import { useEffect, useRef, type RefObject } from "react";
import { PIXEL } from "@/lib/sky/render";
import { nearestStar, skyToPixel } from "@/lib/sky/visitorStars";
import { starLabel } from "@/lib/stars/format";
import { getSkyFrame, getStarLevel, getVisitorStars } from "@/lib/stars/live";
import type { VisitorStar } from "@/lib/stars/types";

// The hover label over a visitor star (docs/visual-system.md → Connect → Leave a star). Only inside
// connect and never over the contact block: hovering (mouse) or tapping (touch, shown ~2s) a star
// shows `City, Region · Mon YYYY · h:mm am/pm` just above it and makes the cursor a pointer. The
// label fades in over 200ms (instant under Reduce Motion). It's moved by writing its style, not
// React state, like the sky.

/** How long a tapped star's label stays up on phones. */
const TAP_LABEL_MS = 2000;
/** Below this star level the stars are too faint to hover (the mockup's cut-off). */
const MIN_LEVEL = 0.25;
/** Gap between the label and the screen edges, and between the label and its star. */
const EDGE = 8;

type Props = {
  sectionRef: RefObject<HTMLElement | null>;
  blockRef: RefObject<HTMLElement | null>;
};

export default function StarLabel({ sectionRef, blockRef }: Props) {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const block = blockRef.current;
    const label = labelRef.current;
    if (!section || !block || !label) return;

    let shown: VisitorStar | null = null;
    let tapTimer: number | undefined;

    const starAt = (e: PointerEvent) => {
      if (block.contains(e.target as Node) || getStarLevel() <= MIN_LEVEL) return null;
      return nearestStar(getVisitorStars(), { x: e.clientX / PIXEL, y: e.clientY / PIXEL }, getSkyFrame());
    };

    const show = (star: VisitorStar) => {
      if (star !== shown) {
        shown = star;
        label.textContent = starLabel(star);
        // Centered over the star, kept inside the screen edges (phones are narrow).
        const p = skyToPixel(star, getSkyFrame());
        const half = label.offsetWidth / 2;
        const x = Math.min(window.innerWidth - half - EDGE, Math.max(half + EDGE, (p.x + 0.5) * PIXEL));
        label.style.left = `${x}px`;
        label.style.top = `${p.y * PIXEL - EDGE}px`;
      }
      label.dataset.on = "true";
    };

    const hide = () => {
      shown = null;
      label.dataset.on = "false";
      section.style.cursor = "";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const star = starAt(e);
      if (star) {
        show(star);
        section.style.cursor = "pointer";
      } else {
        hide();
      }
    };

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "mouse") hide();
    };

    // Phones have no hover: a tap on a star shows its label for ~2s.
    const onTap = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      const star = starAt(e);
      if (!star) return;
      show(star);
      window.clearTimeout(tapTimer);
      tapTimer = window.setTimeout(hide, TAP_LABEL_MS);
    };

    // The stars are fixed to the screen, so scrolling slides connect away under a still label.
    const onScroll = () => {
      if (shown) hide();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointerup", onTap);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerup", onTap);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(tapTimer);
    };
  }, [sectionRef, blockRef]);

  // Decorative like the sky canvas it labels, so hidden from screen readers.
  return (
    <div
      ref={labelRef}
      aria-hidden="true"
      data-on="false"
      className="pointer-events-none fixed top-0 left-0 z-20 -translate-x-1/2 -translate-y-full text-[12px] whitespace-nowrap text-ink opacity-0 transition-opacity duration-200 [text-shadow:var(--text-shadow)] data-[on=true]:opacity-100 motion-reduce:transition-none"
    />
  );
}
