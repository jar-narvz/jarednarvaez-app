"use client";

import { useEffect, useRef, type RefObject } from "react";
import { PIXEL } from "@/lib/sky/render";
import { keepStarsOut } from "@/lib/sky/starless";
import { nearestStar, pixelToSky, skyToPixel } from "@/lib/sky/visitorStars";
import { myStarLabel, starLabel } from "@/lib/stars/format";
import {
  getHoverableStars,
  getMyStar,
  getSkyFrame,
  getStarLevel,
  hasMyStar,
  isMyStarJustNow,
  isSkyDark,
  placeMyStar,
} from "@/lib/stars/live";
import type { VisitorStar } from "@/lib/stars/types";
import { MAX_Y } from "@/lib/stars/validate";

// Leave a star's pointer handling in connect (docs/visual-system.md → Connect → Leave a star),
// only inside the section and never over the contact block:
// - Hover (mouse) or tap (touch, shown ~2s) a star: `City, Region · Mon YYYY · h:mm am/pm` shows
//   just above it (your own: "you · City · just now", or its month on later visits) and the
//   cursor is a pointer. The label fades in over 200ms (instant under Reduce Motion).
// - Click or tap open sky to place your one star, when the sky is dark enough and above the
//   ~90% line (not on the water); the cursor is a crosshair wherever that's possible.
// The label is moved by writing its style, not React state, like the sky.

/** How long a tapped star's label stays up on phones. */
const TAP_LABEL_MS = 2000;
/** Below this star level the stars are too faint to hover (the mockup's cut-off). */
const MIN_LEVEL = 0.25;
/** Gap between the label and the screen edges, and between the label and its star. */
const EDGE = 8;
/** A press that moves further than this (px) is a drag or a text selection, not a click. */
const CLICK_SLOP = 6;

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
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    let shown: VisitorStar | null = null;
    let tapTimer: number | undefined;
    // Where the current press started on open sky, so only a real click places a star.
    let pressedAt: { x: number; y: number } | null = null;
    // While the label shows, no white stars behind it (starless.ts).
    let releaseStars: (() => void) | null = null;

    const overBlock = (e: PointerEvent) => block.contains(e.target as Node);
    const skyPoint = (e: PointerEvent) => ({ x: e.clientX / PIXEL, y: e.clientY / PIXEL });

    const starAt = (e: PointerEvent) => {
      if (overBlock(e) || getStarLevel() <= MIN_LEVEL) return null;
      return nearestStar(getHoverableStars(), skyPoint(e), getSkyFrame());
    };

    /** Where a star would go if placed here, or null if it can't be placed here. */
    const placeAt = (e: PointerEvent) => {
      const frame = getSkyFrame();
      if (overBlock(e) || !isSkyDark() || hasMyStar() || !frame.width) return null;
      const p = pixelToSky(skyPoint(e), frame);
      return p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= MAX_Y ? p : null;
    };

    const show = (star: VisitorStar) => {
      if (star !== shown) {
        shown = star;
        label.textContent =
          star.id === getMyStar()?.star.id ? myStarLabel(star, isMyStarJustNow()) : starLabel(star);
        // Centered over the star, kept inside the screen edges (phones are narrow).
        const p = skyToPixel(star, getSkyFrame());
        const half = label.offsetWidth / 2;
        const x = Math.min(window.innerWidth - half - EDGE, Math.max(half + EDGE, (p.x + 0.5) * PIXEL));
        label.style.left = `${x}px`;
        label.style.top = `${p.y * PIXEL - EDGE}px`;
      }
      label.dataset.on = "true";
      releaseStars ??= keepStarsOut(label);
    };

    const hide = () => {
      releaseStars?.();
      releaseStars = null;
      shown = null;
      label.dataset.on = "false";
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const star = starAt(e);
      if (star) show(star);
      else hide();
      section.style.cursor = star ? "pointer" : placeAt(e) ? "crosshair" : "";
    };

    const onLeave = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      hide();
      section.style.cursor = "";
    };

    const onDown = (e: PointerEvent) => {
      pressedAt = overBlock(e) || (e.pointerType === "mouse" && e.button !== 0) ? null : { x: e.clientX, y: e.clientY };
    };

    const onUp = (e: PointerEvent) => {
      const start = pressedAt;
      pressedAt = null;
      const star = starAt(e);
      // Phones have no hover: a tap on a star shows its label for ~2s.
      if (star) {
        if (e.pointerType === "mouse") return;
        show(star);
        window.clearTimeout(tapTimer);
        tapTimer = window.setTimeout(hide, TAP_LABEL_MS);
        return;
      }
      if (!start || Math.hypot(e.clientX - start.x, e.clientY - start.y) > CLICK_SLOP) return;
      const p = placeAt(e);
      if (!p) return;
      placeMyStar(p.x, p.y, !reducedMotion.matches);
      section.style.cursor = "";
    };

    // The stars are fixed to the screen, so scrolling slides connect away under a still label.
    const onScroll = () => {
      if (shown) hide();
    };

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    section.addEventListener("pointerdown", onDown);
    section.addEventListener("pointerup", onUp);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      section.removeEventListener("pointerdown", onDown);
      section.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(tapTimer);
      releaseStars?.();
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
