"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { connect } from "@/data/connect";
import { keepStarsOut } from "@/lib/sky/starless";
import {
  areStarsAvailable,
  canResetMyStar,
  getServerHasMyStar,
  getServerSkyDark,
  hasMyStar,
  isSkyDark,
  onAvailableChange,
  onDarkChange,
  onMyStarChange,
  resetMyStar,
} from "@/lib/stars/live";

// Leave a star's hint, bottom-right of connect (docs/visual-system.md → Connect → Hint): 13px at
// ~85% cream. When the sky is dark enough to place a star: "click the sky to leave a star" with
// "click the sky" in the accent, hidden once you've left yours; otherwise "stars come out at
// night". If the stars API is down the hint hides. The lines fade over 400ms (instant under Reduce
// Motion). Not clickable: the sky is. Under the invitation sits the one-line privacy note (12px,
// ~60% cream), shown while it invites you to place a star (chosen by Jared 2026-10-23 over the
// footer, which stays one plain line). Once your star is placed (at night), a small "reset" button
// takes its place: it removes your star so you can place it again (Jared, 2026-10-23).

const serverAvailable = () => true;
const serverCanReset = () => false;

export default function StarHint() {
  const dark = useSyncExternalStore(onDarkChange, isSkyDark, getServerSkyDark);
  const placed = useSyncExternalStore(onMyStarChange, hasMyStar, getServerHasMyStar);
  const available = useSyncExternalStore(onAvailableChange, areStarsAvailable, serverAvailable);
  const resettable = useSyncExternalStore(onMyStarChange, canResetMyStar, serverCanReset);
  const invite = available && dark && !placed;
  const night = available && !dark;
  const reset = available && dark && resettable;
  const { starHint } = connect;
  const ref = useRef<HTMLParagraphElement>(null);

  // No white stars behind the hint's small text.
  useEffect(() => {
    if (ref.current) return keepStarsOut(ref.current);
  }, []);
  const fade = "col-start-1 row-start-1 transition-opacity duration-400 motion-reduce:transition-none";

  const resetStar = () => resetMyStar(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  // The lines share one grid cell, so they fade over each other in place.
  return (
    <p ref={ref} className="pointer-events-none absolute right-(--content-r) bottom-12 grid justify-items-end text-right text-[13px] text-ink/85 [text-shadow:var(--text-shadow)]">
      <span aria-hidden={!invite} className={`${fade} ${invite ? "opacity-100" : "opacity-0"}`}>
        <b className="font-medium text-accent">{starHint.dark.action}</b> {starHint.dark.rest}
        <span className="mt-0.5 block text-[12px] text-ink/60">{connect.privacyNote}</span>
      </span>
      <span aria-hidden={!night} className={`${fade} ${night ? "opacity-100" : "opacity-0"}`}>
        {starHint.day}
      </span>
      {/* Hidden, it can't be clicked or focused; shown, it takes clicks despite the hint's
          pointer-events-none. */}
      <button
        type="button"
        onClick={resetStar}
        disabled={!reset}
        tabIndex={reset ? 0 : -1}
        aria-hidden={!reset}
        aria-label="Reset your star so you can place it again"
        className={`${fade} self-start justify-self-end cursor-pointer border-b border-underline pb-px text-accent ${reset ? "pointer-events-auto opacity-100" : "opacity-0"}`}
      >
        {starHint.reset}
      </button>
    </p>
  );
}
