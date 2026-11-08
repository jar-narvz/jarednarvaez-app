"use client";

import Image from "next/image";
import { useInView } from "motion/react";
import { useRef } from "react";
import ScreenshotViewer from "@/components/ScreenshotViewer";
import { useReduceMotion } from "@/lib/useReduceMotion";

// An image on a project's story page, with the same focus pull as the /projects cards' screenshots:
// as it scrolls into view (once) it goes from blur(5px) brightness(1.15) to sharp over 800ms, ease.
// Reduce Motion: sharp at once. Opens large on click. `dimmed` is the rejected half of a Pair.

// [screenshot] placeholder gradient, the first of the home page's three.
const PLACEHOLDER = "linear-gradient(135deg,#5E3A66,#A4527A)";

export default function FocusImage({
  src,
  alt,
  dimmed = false,
  priority = false,
}: {
  src: string;
  alt: string;
  dimmed?: boolean;
  /** Eager-load; for the lead image above the fold. */
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReduceMotion();
  const focused = inView || reduceMotion;

  const classes = `aspect-[16/10] w-full rounded-lg transition-[filter] duration-800 ease-[ease] motion-reduce:transition-none ${
    focused ? "filter-none" : "blur-[5px] brightness-115"
  }`;

  return (
    <div ref={ref} className={dimmed ? "opacity-70 grayscale-[.4]" : undefined}>
      {src ? (
        <ScreenshotViewer src={src} alt={alt} className="w-full rounded-lg">
          <Image
            src={src}
            alt={alt}
            width={1360}
            height={850}
            sizes="(min-width: 760px) 680px, 100vw"
            preload={priority}
            className={`object-cover ${classes}`}
          />
        </ScreenshotViewer>
      ) : (
        <div
          role="img"
          aria-label={alt}
          style={{ background: PLACEHOLDER }}
          className={`grid place-items-center text-[12px] text-cream ${classes}`}
        >
          [screenshot]
        </div>
      )}
    </div>
  );
}
