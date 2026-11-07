"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { abstractScene, tallAbstractScene } from "@/lib/sky/abstractScene";
import { SUN_GOLD } from "@/lib/sky/palette";
import { renderSky } from "@/lib/sky/render";
import { getSkyMode } from "@/lib/sky/skyHour";
import type { SubpagePalette } from "@/lib/sky/subpagePalettes";
import { homeChoice } from "@/lib/sky/subpageTheme";
import { themeAt } from "@/lib/sky/theme";
import { GRAIN_FRAME_MS, grainFrames } from "@/lib/sky/texture";

// A subpage's fixed background (docs/visual-system.md → Subpages, decided 2026-10-30): its palette
// drawn with the abstract scene through the home sky's pipeline (renderSky, then moving grain),
// in a dark or light version. It also writes that version's text theme to the root CSS variables
// (dark = the evening theme, light = the day theme), which the page's components read. No scroll
// blending, no visitor stars. The home sky (Sky.tsx) steps aside on these pages (isSubpage).

/** Whether the device asks for dark mode, live. Dark on the server, then corrected on hydration. */
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

/**
 * Light or dark for this subpage, and a flip for its toggle: the visitor's choice from the home
 * page if they made one, else the device's setting (followed live), until they flip it here.
 */
export function useSubpageDark() {
  const deviceDark = useDeviceDark();
  const [home, setHome] = useState<boolean | null>(null);
  const [flipped, setFlipped] = useState<boolean | null>(null);

  // The sky mode lives in memory and survives client-side navigation from the home page; read it
  // after hydration, since the server always renders the default.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once after hydration
    setHome(homeChoice(getSkyMode()));
  }, []);

  const dark = flipped ?? home ?? deviceDark;
  return [dark, () => setFlipped(!dark)] as const;
}

export default function SubpageSky({ palette, dark }: { palette: SubpagePalette; dark: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const look = dark ? palette.dark : palette.light;
  const lookRef = useRef({ look, day: dark ? 0 : 1 });
  const paintRef = useRef<() => void>(() => {});

  // The text theme for this version, written once per change (not per frame).
  useEffect(() => {
    lookRef.current = { look, day: dark ? 0 : 1 };
    const theme = themeAt(dark ? 0 : 1, SUN_GOLD);
    const root = document.documentElement.style;
    root.setProperty("--ink", theme.ink);
    root.setProperty("--accent", theme.accent);
    root.setProperty("--underline", theme.underline);
    root.setProperty("--tint", theme.tint);
    root.setProperty("--text-shadow", theme.textShadow);
    root.setProperty("--grain", String(look.grain));
    paintRef.current();
  }, [look, dark]);

  useEffect(() => {
    const frame = frameRef.current;
    const sky = skyRef.current;
    const grain = grainRef.current;
    if (!frame || !sky || !grain) return;
    let time = 0;

    const paint = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      const { look, day } = lookRef.current;
      // Portrait screens (phones) get the tall version, like the home page's tall coast.
      renderSky(sky, w, h, w < h ? tallAbstractScene : abstractScene, { ...look.sky, day }, time);
    };
    paintRef.current = paint;

    let frames: HTMLCanvasElement[] = [];
    let current = 0;
    const showFrame = () => grain.getContext("2d")!.drawImage(frames[current], 0, 0);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      // Grain at half the screen's resolution, as on the home page.
      frames = grainFrames(Math.ceil(w / 2), Math.ceil(h / 2));
      grain.width = frames[0].width;
      grain.height = frames[0].height;
      grain.style.width = `${grain.width * 2}px`;
      grain.style.height = `${grain.height * 2}px`;
      showFrame();
      paint();
    };

    // Every frame: clouds drift and stars twinkle; grain frames swap every 70ms.
    let loop = 0;
    let last = 0;
    const tick = (now: number) => {
      time = now / 1000;
      if (frames.length && now - last >= GRAIN_FRAME_MS) {
        last = now;
        current = (current + 1) % frames.length;
        showFrame();
      }
      paint();
      loop = requestAnimationFrame(tick);
    };

    // Reduce Motion: grain, clouds and stars hold still, as on the home page.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      cancelAnimationFrame(loop);
      loop = 0;
      if (reducedMotion.matches) paint();
      else loop = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(frame);
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(loop);
      reducedMotion.removeEventListener("change", updateMotion);
    };
  }, []);

  // Same frame as the home sky: h-lvh so it doesn't jump when a phone's URL bar hides.
  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      style={{ background: look.sky.sky[0] }}
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden"
    >
      <canvas ref={skyRef} className="absolute top-0 left-0 [image-rendering:pixelated]" />
      <canvas ref={grainRef} className="absolute top-0 left-0 opacity-(--grain) mix-blend-overlay" />
    </div>
  );
}
