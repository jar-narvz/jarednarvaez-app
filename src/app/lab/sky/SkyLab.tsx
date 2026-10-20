"use client";

import { useEffect, useState } from "react";
import { setFixedSky } from "@/lib/sky/skyHour";

// Dev-only (2026-10-20): a floating panel that holds the sky at one hour, to check the 24-hour
// sky (and, in part 3, the day text theme) until the nav's dial can set the hour.

const NAMES: [number, string][] = [
  [0, "midnight"],
  [5.3, "dawn"],
  [6.8, "sunrise"],
  [12, "midday"],
  [16, "afternoon"],
  [18.5, "golden hour"],
  [19.6, "dusk"],
  [21, "night"],
];

/** 19.5 → "7:30 pm". */
function clock(hour: number) {
  const h = Math.floor(hour) % 24;
  const m = Math.round((hour - Math.floor(hour)) * 60);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

/** The keyframe this hour is on or just past (a rough label for the lab only). */
const nameAt = (hour: number) => [...NAMES].reverse().find(([h]) => h <= hour)?.[1] ?? "midnight";

export default function SkyLab() {
  const [hour, setHour] = useState(18.5);
  // Collapsed to the slider row, so the land at the bottom of the sky shows (mostly for phones).
  const [open, setOpen] = useState(true);

  useEffect(() => {
    setFixedSky({ hour });
  }, [hour]);

  // Back to scroll mode when leaving the page (the sky lives in the layout and stays mounted).
  useEffect(() => () => setFixedSky(null), []);

  const pill = (on: boolean) =>
    `cursor-pointer rounded-full border px-2.5 py-0.5 ${on ? "border-accent text-accent" : "border-ink/35 text-ink/85"}`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-2 border-t border-ink/20 bg-tint/80 py-3 pr-4 pl-16 text-[13px] backdrop-blur-md">
      <div className="flex items-center gap-3">
        <span className="w-40 shrink-0 tabular-nums">
          {clock(hour)} · {nameAt(hour)}
        </span>
        <input
          type="range"
          min={0}
          max={24}
          step={0.25}
          value={hour}
          onChange={(e) => setHour(Number(e.target.value))}
          aria-label="sky hour"
          className="w-full accent-(--accent)"
        />
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className={pill(false)}>
          {open ? "less" : "more"}
        </button>
      </div>
      <div hidden={!open} className="flex flex-wrap items-center gap-1.5">
        {NAMES.map(([h, name]) => (
          <button key={name} type="button" aria-pressed={hour === h} onClick={() => setHour(h)} className={pill(hour === h)}>
            {name}
          </button>
        ))}
        <span className="ml-4 text-ink/70">switchover</span>
        {[6.75, 17].map((h) => (
          <button key={h} type="button" aria-pressed={hour === h} onClick={() => setHour(h)} className={pill(hour === h)}>
            {clock(h)}
          </button>
        ))}

      </div>
    </div>
  );
}
