"use client";

import { useEffect, useRef, type RefObject } from "react";
import { PIXEL } from "@/lib/sky/render";
import { keepStarsOut } from "@/lib/sky/starless";
import { skyToPixel } from "@/lib/sky/visitorStars";
import { getMyStar, getSkyFrame, getStarLevel, onMyStarChange, onSkyPaint } from "@/lib/stars/live";

// The small "you" label just right of the visitor's own star (docs/visual-system.md → Connect →
// Leave a star): Sun gold (the accent), Schibsted 13px. Shown while the stars are visible and the
// label sits over connect, i.e. below its top edge, so it never lands on the projects above it
// (decided 2026-10-30). Right after placing it fades in over 300ms, starting 350ms in (Motion
// inventory); otherwise it fades with the sky. Instant under Reduce Motion. Updated after each sky
// paint by writing its style, not React state.

/** Below this star level your star is too faint to label (the mockup's cut-off). */
const MIN_LEVEL = 0.25;
/** The label's delay after placing, so it follows the flare (Motion inventory). */
const PLACED_DELAY_MS = 350;

export default function YouLabel({ sectionRef }: { sectionRef: RefObject<HTMLElement | null> }) {
  const labelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const label = labelRef.current;
    if (!section || !label) return;

    // Start off, matching `visible`: when Next hides the home page and brings it back, the label
    // keeps the "on" it had when you left, and update() only writes changes.
    let visible = false;
    label.dataset.on = "false";
    // While the label shows, no white stars behind it (starless.ts).
    let releaseStars: (() => void) | null = null;

    const update = () => {
      const mine = getMyStar();
      let y = 0;
      if (mine) {
        const p = skyToPixel(mine.star, getSkyFrame());
        y = (p.y + 0.5) * PIXEL;
        label.style.left = `${(p.x + 0.5) * PIXEL}px`;
        label.style.top = `${y}px`;
      }
      const r = section.getBoundingClientRect();
      const overConnect = y > r.top && y < r.bottom;
      const next = !!mine && getStarLevel() > MIN_LEVEL && overConnect;
      if (next === visible) return;
      visible = next;
      label.dataset.on = String(next);
      if (next) releaseStars ??= keepStarsOut(label);
      else {
        releaseStars?.();
        releaseStars = null;
      }
    };

    const stopPaint = onSkyPaint(update);
    const stopMine = onMyStarChange(() => {
      // Just placed (with the flare): wait for it before fading in.
      const placedAt = getMyStar()?.placedAt ?? -Infinity;
      label.style.transitionDelay = Number.isFinite(placedAt) && !visible ? `${PLACED_DELAY_MS}ms` : "";
      update();
    });
    // Back to no delay once it has faded in, so later fades follow the sky straight away.
    const clearDelay = () => (label.style.transitionDelay = "");
    label.addEventListener("transitionend", clearDelay);
    update();

    return () => {
      stopPaint();
      stopMine();
      label.removeEventListener("transitionend", clearDelay);
      releaseStars?.();
      label.dataset.on = "false";
    };
  }, [sectionRef]);

  // Decorative, like the sky it labels: hidden from screen readers.
  return (
    <div
      ref={labelRef}
      aria-hidden="true"
      data-on="false"
      className="pointer-events-none fixed top-0 left-0 z-20 translate-x-3 -translate-y-1/2 text-[13px] whitespace-nowrap text-accent opacity-0 transition-opacity duration-300 [text-shadow:var(--text-shadow)] data-[on=true]:opacity-100 motion-reduce:transition-none"
    >
      you
    </div>
  );
}
