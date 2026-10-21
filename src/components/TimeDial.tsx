"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { formatHour, hourName, isDarkHour, wrapHour } from "@/lib/sky/hours";
import { getShownHour, onShownHourChange, setSkyMode } from "@/lib/sky/skyHour";
import { useSkyMode } from "@/components/SkyControls";

// The full time dial (docs/visual-system.md → 24-hour sky → Mode behavior; drawing from the
// approved mockup): grows down at the nav's right edge, floating on the sky (a frosted panel on
// phones). Drag the sun handle or click the ring to set the hour (snaps to 15 min); arrow keys
// step 15 min. The handle and readout follow the sky outside React, since the hour changes with
// every scroll frame.

const SIZE = 190;
const C = SIZE / 2; // center
const R = 70; // ring radius
const STEP = 0.25; // 15 minutes

/** Where an hour sits on the ring: noon at top, midnight at bottom, 6 am left, 6 pm right. */
function onRing(hour: number, radius: number) {
  const angle = ((hour - 12) * 15 * Math.PI) / 180;
  return { x: C + Math.sin(angle) * radius, y: C - Math.cos(angle) * radius };
}

// 24 hour ticks, longer and brighter at 0, 6, 12 and 18.
const TICKS = Array.from({ length: 24 }, (_, hour) => {
  const major = hour % 6 === 0;
  return { outer: onRing(hour, R), inner: onRing(hour, major ? R - 9 : R - 5), major };
});

// Motion inventory: open scale 0 → 1 from top-right, 450ms with a slight overshoot; close
// scale → 0 + fade, 220ms ease-in. Reduce Motion: no grow, appears and disappears at once.
const OPEN = { duration: 0.45, ease: [0.3, 1.3, 0.5, 1] as const };
const CLOSE = { duration: 0.22, ease: "easeIn" as const };

const DIAL_BUTTON = "cursor-pointer rounded-full border px-[11px] py-1 text-[12px] font-medium";



export default function TimeDial({
  reduceMotion,
  dialButtonRef,
  onClose,
}: {
  reduceMotion: boolean;
  dialButtonRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
}) {
  const sky = useSkyMode();
  const panelRef = useRef<HTMLDivElement>(null);
  const dialRef = useRef<SVGSVGElement>(null);
  const handleRef = useRef<SVGGElement>(null);
  const centerRef = useRef<SVGCircleElement>(null);
  const timeRef = useRef<SVGTextElement>(null);
  const nameRef = useRef<SVGTextElement>(null);

  // Handle, readout and slider value follow the hour the sky is showing.
  useEffect(
    () =>
      onShownHourChange((hour) => {
        const { x, y } = onRing(hour, R);
        handleRef.current?.setAttribute("transform", `translate(${x} ${y})`);
        // Cream center by day, dark center at night (the mockup's #2A2850).
        centerRef.current?.setAttribute("fill", isDarkHour(hour) ? "#2A2850" : "#FFF6EA");
        if (timeRef.current) timeRef.current.textContent = formatHour(hour);
        if (nameRef.current) nameRef.current.textContent = hourName(hour);
        dialRef.current?.setAttribute("aria-valuenow", hour.toFixed(2));
        dialRef.current?.setAttribute("aria-valuetext", formatHour(hour));
      }),
    [],
  );

  // Clicking anywhere outside the dial (and its mini dial button) closes it.
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || dialButtonRef.current?.contains(target)) return;
      onClose();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dialButtonRef, onClose]);

  /** The hour at a pointer position on the dial, snapped to 15 minutes. */
  const hourAt = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    const degrees = ((Math.atan2(x, -y) * 180) / Math.PI + 360) % 360;
    return wrapHour(Math.round(((12 + degrees / 15) % 24) / STEP) * STEP);
  };

  const dragging = useRef(false);
  const onPointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    dragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setSkyMode({ mode: "hour", hour: hourAt(e) });
  };
  const onPointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragging.current) setSkyMode({ mode: "hour", hour: hourAt(e) });
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: STEP, ArrowUp: STEP, ArrowLeft: -STEP, ArrowDown: -STEP }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    // Land on the 15-minute marks the dial snaps to: from "my time" at 3:18, → is 3:30, not 3:33.
    const marks = getShownHour() / STEP;
    const next = step > 0 ? Math.floor(marks + 1e-6) + 1 : Math.ceil(marks - 1e-6) - 1;
    setSkyMode({ mode: "hour", hour: wrapHour(next * STEP) });
  };

  const local = sky.mode === "local";

  return (
    <motion.div
      ref={panelRef}
      id="time-dial"
      // At the nav's right edge, under the header. On phones a frosted-glass panel sits behind it
      // (15% tint, 8px blur), since there's no open sky there and the dial would land on the hero
      // text (Jared, 2026-10-20). On desktop it floats on the open sky with no panel, as specified.
      className="pointer-events-auto absolute top-[calc(100%+10px)] right-(--margin) flex origin-top-right flex-col items-center gap-2.5 text-ink [text-shadow:var(--text-shadow)] max-md:rounded-3xl max-md:bg-tint/15 max-md:p-3 max-md:backdrop-blur-sm"
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1, transition: reduceMotion ? { duration: 0 } : OPEN }}
      exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { scale: 0, opacity: 0, transition: CLOSE }}
    >
      <svg
        ref={dialRef}
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="slider"
        aria-label="Sky time"
        aria-valuemin={0}
        aria-valuemax={24}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        // Focus ring for keyboard users only, round like the dial.
        className="block cursor-grab touch-none rounded-full [filter:drop-shadow(var(--text-shadow))] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent active:cursor-grabbing"
      >
        <circle cx={C} cy={C} r={R} fill="none" stroke="currentColor" strokeOpacity="0.45" />
        {TICKS.map(({ outer, inner, major }, i) => (
          <line
            key={i}
            x1={outer.x}
            y1={outer.y}
            x2={inner.x}
            y2={inner.y}
            stroke="currentColor"
            strokeOpacity={major ? 0.8 : 0.4}
          />
        ))}
        <g fontSize="10" fill="currentColor" opacity="0.75">
          <text x={C} y="17" textAnchor="middle">noon</text>
          <text x={C} y="181" textAnchor="middle">midnight</text>
          <text x="19" y="98" textAnchor="end">6a</text>
          <text x="171" y="98">6p</text>
        </g>
        <text ref={timeRef} x={C} y="93" textAnchor="middle" fontSize="22" fill="currentColor" className="font-serif" />
        <text ref={nameRef} x={C} y="111" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.8" />
        {/* The sun handle: accent circle with a cream (day) or dark (night) center. */}
        <g ref={handleRef}>
          <circle r="11" className="fill-accent" />
          <circle ref={centerRef} r="5" fill="#FFF6EA" />
        </g>
      </svg>
      <div className="flex gap-2">
        <button
          type="button"
          aria-pressed={local}
          // "my time" sets the sky to the visitor's clock; clicking it again returns to scroll mode.
          onClick={() => setSkyMode(local ? { mode: "scroll" } : { mode: "local" })}
          className={`${DIAL_BUTTON} bg-tint/35 ${local ? "border-underline text-accent" : "border-ink/40"}`}
        >
          my time
        </button>
        <button type="button" onClick={onClose} className={`${DIAL_BUTTON} border-transparent opacity-80`}>
          close
        </button>
      </div>
    </motion.div>
  );
}
