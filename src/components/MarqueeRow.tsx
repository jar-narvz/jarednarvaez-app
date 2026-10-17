"use client";

import { useEffect, useRef, useState } from "react";

// One looping tech stack row. The spec sets speed in px/s (docs/visual-system.md → Tech stack), so
// the loop time has to follow the row's real width: measure it once the web fonts have loaded
// (pill widths depend on them), then start the marquee. Measuring before the fonts land and again
// after would change the duration mid-loop, which makes the row jump. The width doesn't depend on
// the viewport, so there's nothing to re-measure on resize.
export default function MarqueeRow({
  speed,
  copies,
  reverse,
  children,
}: {
  speed: number;
  copies: number;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [durationS, setDurationS] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    document.fonts.ready.then(() => {
      const el = ref.current;
      if (cancelled || !el) return;
      // Each loop slides one copy plus one gap (see the marquee keyframes in globals.css).
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      setDurationS((el.scrollWidth + gap) / copies / speed);
    });
    return () => {
      cancelled = true;
    };
  }, [copies, speed]);

  return (
    <div
      ref={ref}
      style={
        {
          "--copies": copies,
          ...(durationS && { animationDuration: `${durationS}s` }),
        } as React.CSSProperties
      }
      className={`flex w-max gap-3.5 hover:[animation-play-state:paused] ${
        durationS ? "animate-marquee" : ""
      } ${reverse ? "[animation-direction:reverse]" : ""}`}
    >
      {children}
    </div>
  );
}
