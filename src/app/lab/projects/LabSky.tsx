"use client";

import { useEffect, useRef } from "react";
import { dayness, grainAtHour, keyframeAtHour } from "@/lib/sky/hours";
import { renderSky } from "@/lib/sky/render";
import { coastScene, tallCoastScene, type DrawnSky, type SkyScene } from "@/lib/sky/scene";
import { GRAIN_FRAME_MS, grainFrames } from "@/lib/sky/texture";
import { abstractScene, tallAbstractScene } from "@/lib/sky/abstractScene";
import { PLAIN } from "./palettes";

// Lab-only (2026-10-30): a fixed subpage background, compared across options. The site's sky
// steps aside on this page (isSubpage), so this draws the coast and abstract skies itself. Same pipeline as Sky.tsx: renderSky, then moving grain on top.
// No visitor stars and no scroll: a subpage holds one look. Text colors are set by the lab page.

export type LabBackground =
  | { kind: "coast" | "abstract"; hour: number }
  | { kind: "palette"; sky: DrawnSky; grain: number }
  | { kind: "plain" };

/** What to draw for a background, or null for plain. */
function look(bg: LabBackground, portrait: boolean): { scene: SkyScene; k: DrawnSky; grain: number } | null {
  if (bg.kind === "plain") return null;
  const abstract = portrait ? tallAbstractScene : abstractScene;
  if (bg.kind === "palette") return { scene: abstract, k: bg.sky, grain: bg.grain };
  const scene = bg.kind === "coast" ? (portrait ? tallCoastScene : coastScene) : abstract;
  return { scene, k: { ...keyframeAtHour(bg.hour), day: dayness(bg.hour) }, grain: grainAtHour(bg.hour) };
}

export default function LabSky({ background }: { background: LabBackground }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);
  const bgRef = useRef(background);
  const paintRef = useRef<() => void>(() => {});

  useEffect(() => {
    bgRef.current = background;
    paintRef.current();
  }, [background]);

  useEffect(() => {
    const frame = frameRef.current;
    const sky = skyRef.current;
    const grain = grainRef.current;
    if (!frame || !sky || !grain) return;
    let time = 0;

    const paint = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      const drawn = look(bgRef.current, w < h);
      sky.style.display = drawn ? "" : "none";
      grain.style.opacity = String(drawn?.grain ?? 0);
      if (drawn) renderSky(sky, w, h, drawn.scene, drawn.k, time);
    };
    paintRef.current = paint;

    let frames: HTMLCanvasElement[] = [];
    let current = 0;
    const showFrame = () => grain.getContext("2d")!.drawImage(frames[current], 0, 0);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      frames = grainFrames(Math.ceil(w / 2), Math.ceil(h / 2));
      grain.width = frames[0].width;
      grain.height = frames[0].height;
      grain.style.width = `${grain.width * 2}px`;
      grain.style.height = `${grain.height * 2}px`;
      showFrame();
      paint();
    };

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

    // Reduce Motion: grain and clouds hold still, as on the home page.
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

  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      style={{ background: PLAIN, zIndex: -5 }}
      className="pointer-events-none fixed inset-x-0 top-0 h-lvh overflow-hidden"
    >
      <canvas ref={skyRef} className="absolute top-0 left-0 [image-rendering:pixelated]" />
      <canvas ref={grainRef} className="absolute top-0 left-0 mix-blend-overlay" />
    </div>
  );
}
