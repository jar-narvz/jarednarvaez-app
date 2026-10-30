"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { dayness, formatHour, hourName, isDarkHour } from "@/lib/sky/hours";
import { SUN_GOLD } from "@/lib/sky/palette";
import { getSkyMode } from "@/lib/sky/skyHour";
import { textDayness, themeAt } from "@/lib/sky/theme";
import { CardList, LAYOUTS, type Layout } from "./Cards";
import LabSky, { type LabBackground } from "./LabSky";
import { GROUPS } from "./labProjects";
import { PALETTES, PLAIN } from "./palettes";

// Dev-only (2026-10-30): a mock /projects page for choosing the subpage background. The cards are
// deliberately plain (card design is the next decision), so only the background changes. The
// panel picks the background and, for the coast and abstract skies, the fixed moment.
// Blue hour and teal sea also have light versions: the page starts light or dark from the home
// page's light/dark choice if the visitor made one, else from the device's setting, and the
// visitor can flip it with a small toggle (Jared, 2026-10-30). The panel's "start from" row
// fakes the home choice, since this page isn't reached from the home page.
// Teal sea won for /projects (2026-10-30); the "cards" row now compares card layouts (Cards.tsx)
// and the "motion" row turns the proposed scroll-in animation on or off.

const BACKGROUNDS = ["home coast", "abstract", ...PALETTES.map((p) => p.name), "plain"] as const;
type Choice = (typeof BACKGROUNDS)[number];

/** Sunset: between golden hour (18.5) and dusk (19.6), where the home page's projects section sits. */
const SUNSET = 19;

const total = GROUPS.reduce((n, g) => n + g.projects.length, 0);

type Start = "device" | "home: light" | "home: dark";
const STARTS: Start[] = ["device", "home: light", "home: dark"];

/** Whether the device asks for dark mode, live. Dark on the server (the evening look). */
function useDeviceDark() {
  return useSyncExternalStore(
    (onChange) => {
      const q = window.matchMedia("(prefers-color-scheme: dark)");
      q.addEventListener("change", onChange);
      return () => q.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-color-scheme: dark)").matches,
    () => true,
  );
}

export default function ProjectsLab() {
  const [choice, setChoice] = useState<Choice>("teal sea");
  const [hour, setHour] = useState(SUNSET);
  const [start, setStart] = useState<Start>("device");
  const [flipped, setFlipped] = useState<boolean | null>(null);
  const [layout, setLayout] = useState<Layout>("B rows");
  const [animate, setAnimate] = useState(true);
  const deviceDark = useDeviceDark();

  // A real light/dark choice on the home page carries over (client-side navigation keeps it).
  useEffect(() => {
    const m = getSkyMode();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
    if (m.mode === "hour") setStart(isDarkHour(m.hour) ? "home: dark" : "home: light");
  }, []);

  const palette = PALETTES.find((p) => p.name === choice);
  const usesHour = choice === "home coast" || choice === "abstract";
  const startDark = start === "device" ? deviceDark : start === "home: dark";
  const dark = flipped ?? startDark;
  const light = !!palette?.light && !dark;

  const background: LabBackground = useMemo(() => {
    if (choice === "plain") return { kind: "plain" };
    if (palette) {
      const look = light && palette.light ? palette.light : palette;
      return { kind: "palette", sky: { ...look.sky, day: light ? 1 : 0 }, grain: look.grain };
    }
    return { kind: choice === "home coast" ? "coast" : "abstract", hour };
  }, [choice, palette, hour, light]);

  // Dark palettes and plain keep the evening text theme; light ones take the day theme; the hour
  // skies blend between them like the home page.
  const theme = themeAt(usesHour ? textDayness(dayness(hour)) : light ? 1 : 0, SUN_GOLD);
  const vars = {
    "--ink": theme.ink,
    "--accent": theme.accent,
    "--underline": theme.underline,
    "--tint": theme.tint,
    "--text-shadow": theme.textShadow,
  } as React.CSSProperties;

  return (
    <div style={vars} className="text-ink">
      <LabSky background={background} />
      {palette?.light && <LightDarkToggle dark={dark} onFlip={() => setFlipped(!dark)} />}

      <main className="pr-(--content-r) pb-48 pl-(--content-l) pt-24 [text-shadow:var(--text-shadow)]">
        <p className="text-[13px] text-ink/70">lab · /projects cards</p>
        <h1 className="mt-2 font-serif text-[clamp(32px,4vw,40px)] leading-[1.1] font-normal tracking-[-0.015em]">
          [projects heading]
        </h1>
        <p className="mt-2 text-[15px] text-ink/80">{total} projects</p>

        {GROUPS.map((group) => (
          <section key={group.name} className="mt-12">
            <h2 className="flex items-baseline gap-2 border-b border-ink/22 pb-2 text-[13px] text-ink/70">
              <span className="text-[15px] font-medium text-ink">{group.name}</span>
              {group.projects.length}
            </h2>
            {/* Remount on a switch so the scroll-in animation plays again. */}
            <CardList key={`${layout}-${animate}`} layout={layout} projects={group.projects} animate={animate} />
          </section>
        ))}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/20 bg-tint/80 px-4 py-3 text-[13px] backdrop-blur-md">
        <div className="mb-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-ink/70">cards</span>
          {LAYOUTS.map((l) => (
            <Pill key={l} on={l === layout} onClick={() => setLayout(l)}>
              {l}
            </Pill>
          ))}
          <span className="ml-2 text-ink/70">motion</span>
          <Pill on={animate} onClick={() => setAnimate(true)}>
            on
          </Pill>
          <Pill on={!animate} onClick={() => setAnimate(false)}>
            off
          </Pill>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-ink/70">background</span>
          {BACKGROUNDS.map((b) => {
            const on = b === choice;
            return (
              <button
                key={b}
                type="button"
                aria-pressed={on}
                onClick={() => setChoice(b)}
                className={`cursor-pointer rounded-full border px-2.5 py-0.5 ${
                  on ? "border-accent text-accent" : "border-ink/35 text-ink/85"
                }`}
              >
                {b}
              </button>
            );
          })}
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-ink/80">
          {usesHour && (
            <label className="flex flex-wrap items-center justify-center gap-2">
              <span className="text-ink/70">moment</span>
              <input
                type="range"
                min={0}
                max={23.75}
                step={0.25}
                value={hour}
                onChange={(e) => setHour(Number(e.target.value))}
                className="w-40 accent-(--accent)"
              />
              <span className="tabular-nums">
                {formatHour(hour)} · {hourName(hour)}
              </span>
              <button
                type="button"
                onClick={() => setHour(SUNSET)}
                className="cursor-pointer rounded-full border border-ink/35 px-2 py-0.5"
              >
                sunset
              </button>
            </label>
          )}
          {palette && (
            <span>
              {light && palette.light ? palette.light.note : palette.note}
              {(() => {
                const hexes = light && palette.light ? palette.light.newHexes : palette.newHexes;
                return hexes.length > 0 ? ` · new hexes: ${hexes.join(" ")}` : " · only existing hexes";
              })()}
            </span>
          )}
          {choice === "plain" && <span>flat {PLAIN} (dusk&apos;s top color), no grain</span>}
        </div>
        {palette?.light && (
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-ink/80">
            <span className="text-ink/70">start from</span>
            {STARTS.map((s) => {
              const on = s === start;
              return (
                <button
                  key={s}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setStart(s);
                    setFlipped(null);
                  }}
                  className={`cursor-pointer rounded-full border px-2.5 py-0.5 ${
                    on ? "border-accent text-accent" : "border-ink/35 text-ink/85"
                  }`}
                >
                  {s}
                </button>
              );
            })}
            <span>
              → showing {dark ? "dark" : "light"}
              {flipped !== null ? " (toggled)" : start === "device" ? ` (device is ${deviceDark ? "dark" : "light"})` : ""}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * The subpage's small light/dark toggle, in the home nav's spot and style (SkyControls.tsx →
 * LightDarkButton): a moon in light mode, a sun in dark mode; the new icon spins in on a swap.
 */
function LightDarkToggle({ dark, onFlip }: { dark: boolean; onFlip: () => void }) {
  const reduceMotion = useReducedMotion();
  const [swapped, setSwapped] = useState(false);
  return (
    <button
      type="button"
      aria-label={dark ? "Switch to light" : "Switch to dark"}
      onClick={() => {
        setSwapped(true);
        onFlip();
      }}
      className="fixed top-6 right-(--margin) z-20 grid cursor-pointer place-items-center p-1 text-ink/82 [filter:drop-shadow(var(--text-shadow))] hover:text-ink"
    >
      <motion.span
        key={dark ? "sun" : "moon"}
        className="block"
        initial={swapped && !reduceMotion ? { rotate: -90, scale: 0.6, opacity: 0 } : false}
        animate={{ rotate: 0, scale: 1, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.3, 1.4, 0.5, 1] }}
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </motion.span>
    </button>
  );
}

// The home nav's 16px line icons (SkyControls.tsx), copied for the lab.
function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M13.5 9.8A5.8 5.8 0 0 1 6.2 2.5a5.8 5.8 0 1 0 7.3 7.3Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <circle cx="8" cy="8" r="3" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.4 1.4M11.6 11.6 13 13M3 13l1.4-1.4M11.6 4.4 13 3" />
    </svg>
  );
}

function Pill({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`cursor-pointer rounded-full border px-2.5 py-0.5 ${
        on ? "border-accent text-accent" : "border-ink/35 text-ink/85"
      }`}
    >
      {children}
    </button>
  );
}
