"use client";

import { useState } from "react";
import BeyondCode from "@/components/BeyondCode";

// Dev-only (2026-10-16): the parked beyond code section with live controls for its four open
// values. Each control writes a --bc-* variable that BeyondCode reads. The first choice in each
// row is the original spec/mockup value; it opens on the combination Jared was last looking at.

const CONTROLS = {
  height: { label: "section height", options: ["520px", "600px", "680px"] },
  scale: { label: "print size", options: ["1", "1.25", "1.5"] },
  width: { label: "frame width", options: ["none", "1000px", "860px"] },
  frame: { label: "frame", options: ["lines + corners", "corners only", "none"] },
} as const;

type Key = keyof typeof CONTROLS;

const display = (key: Key, value: string) =>
  key === "scale" ? `${value}×` : key === "width" && value === "none" ? "full" : value;

export default function BeyondCodeLab() {
  const [values, setValues] = useState<Record<Key, string>>({
    height: "600px",
    scale: "1.25",
    width: "1000px",
    frame: "lines + corners",
  });

  const vars = {
    "--bc-zone-h": values.height,
    "--bc-print-scale": values.scale,
    "--bc-zone-max": values.width,
    "--bc-rules": values.frame === "lines + corners" ? 1 : 0,
    "--bc-marks": values.frame === "none" ? 0 : 1,
  } as React.CSSProperties;

  return (
    <main>
      {/* Spacer so the section sits near dusk on the scroll, as it does on the home page. */}
      <div className="flex h-[160vh] items-start px-(--margin) pt-10 [text-shadow:var(--text-shadow)]">
        <p className="text-[14px] text-ink/80">lab · beyond code tuning — scroll down ↓</p>
      </div>

      <div style={vars}>
        <BeyondCode />
      </div>
      <div aria-hidden="true" className="h-[60vh]" />

      <div className="fixed inset-x-0 bottom-0 z-30 flex flex-wrap justify-center gap-x-6 gap-y-2 border-t border-ink/20 bg-tint/80 px-4 py-3 text-[13px] backdrop-blur-md">
        {(Object.keys(CONTROLS) as Key[]).map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-ink/70">{CONTROLS[key].label}</span>
            {CONTROLS[key].options.map((option) => {
              const on = values[key] === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setValues((v) => ({ ...v, [key]: option }))}
                  className={`cursor-pointer rounded-full border px-2.5 py-0.5 ${
                    on ? "border-accent text-accent" : "border-ink/35 text-ink/85"
                  }`}
                >
                  {display(key, option)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </main>
  );
}
