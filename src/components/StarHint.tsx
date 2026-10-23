"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { connect } from "@/data/connect";
import { keepStarsOut } from "@/lib/sky/starless";
import {
  getServerHasMyStar,
  getServerSkyDark,
  hasMyStar,
  isSkyDark,
  onDarkChange,
  onMyStarChange,
} from "@/lib/stars/live";

// Leave a star's hint, bottom-right of connect (docs/visual-system.md → Connect → Hint): 13px at
// ~85% cream. When the sky is dark enough to place a star: "click the sky to leave a star" with
// "click the sky" in the accent, hidden once you've left yours; otherwise "stars come out at
// night". The lines fade over 400ms (instant under Reduce Motion). Not clickable: the sky is.

export default function StarHint() {
  const dark = useSyncExternalStore(onDarkChange, isSkyDark, getServerSkyDark);
  const placed = useSyncExternalStore(onMyStarChange, hasMyStar, getServerHasMyStar);
  const invite = dark && !placed;
  const { starHint } = connect;
  const ref = useRef<HTMLParagraphElement>(null);

  // No white stars behind the hint's small text.
  useEffect(() => {
    if (ref.current) return keepStarsOut(ref.current);
  }, []);
  const fade = "col-start-1 row-start-1 transition-opacity duration-400 motion-reduce:transition-none";

  // Both lines share one grid cell, so they fade over each other in place.
  return (
    <p ref={ref} className="pointer-events-none absolute right-(--content-r) bottom-12 grid justify-items-end text-right text-[13px] text-ink/85 [text-shadow:var(--text-shadow)]">
      <span aria-hidden={!invite} className={`${fade} ${invite ? "opacity-100" : "opacity-0"}`}>
        <b className="font-medium text-accent">{starHint.dark.action}</b> {starHint.dark.rest}
      </span>
      <span aria-hidden={dark} className={`${fade} ${dark ? "opacity-0" : "opacity-100"}`}>
        {starHint.day}
      </span>
    </p>
  );
}
