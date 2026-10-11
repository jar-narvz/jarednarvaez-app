"use client";

import { useEffect, useRef } from "react";
import { accentAt, grainAt, keyframeAt } from "@/lib/sky/blend";
import { renderSky } from "@/lib/sky/render";
import { coastScene, tallCoastScene } from "@/lib/sky/scene";
import { GRAIN_FRAME_MS, grainFrames } from "@/lib/sky/texture";

/** How far down the page the visitor is: 0 at the top (golden hour), 1 at the bottom (night). */
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

// The fixed background sky. It follows scroll progress from golden hour to night, writes the
// live colors to CSS variables, and has moving film grain on top.
export default function Sky() {
  const frameRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const sky = skyRef.current;
    const grain = grainRef.current;
    if (!frame || !sky || !grain) return;
    const root = document.documentElement.style;

    // Sky and live CSS variables at the current scroll position.
    const paintSky = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      const t = scrollProgress();
      // Portrait screens (phones) get the tall version of the coast.
      renderSky(sky, w, h, w < h ? tallCoastScene : coastScene, keyframeAt(t));
      root.setProperty("--accent", accentAt(t));
      root.setProperty("--grain", String(grainAt(t)));
    };

    // Repaint at most once per animation frame while scrolling.
    let pending = 0;
    const schedulePaint = () => {
      if (!pending) {
        pending = requestAnimationFrame(() => {
          pending = 0;
          paintSky();
        });
      }
    };

    let frames: HTMLCanvasElement[] = [];
    let current = 0;
    const showFrame = () => grain.getContext("2d")!.drawImage(frames[current], 0, 0);

    // On resize: new grain frames at the new size, then repaint.
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      // Grain at half the screen's resolution, finer than the 4px sky squares.
      frames = grainFrames(Math.ceil(w / 2), Math.ceil(h / 2));
      grain.width = frames[0].width;
      grain.height = frames[0].height;
      grain.style.width = `${grain.width * 2}px`;
      grain.style.height = `${grain.height * 2}px`;
      showFrame();
      paintSky();
    };

    // Swap grain frames every 70ms.
    let loop = 0;
    let last = 0;
    const tick = (now: number) => {
      if (frames.length && now - last >= GRAIN_FRAME_MS) {
        last = now;
        current = (current + 1) % frames.length;
        showFrame();
      }
      loop = requestAnimationFrame(tick);
    };

    // Reduced motion: keep one still grain frame instead of the flicker. Scroll blending stays,
    // since it only moves when the visitor scrolls.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      cancelAnimationFrame(loop);
      if (!reducedMotion.matches) loop = requestAnimationFrame(tick);
    };

    // The frame observer fires once right away, then on every resize. The page observer
    // catches the page getting taller or shorter, which changes scroll progress.
    const frameObserver = new ResizeObserver(resize);
    frameObserver.observe(frame);
    const pageObserver = new ResizeObserver(schedulePaint);
    pageObserver.observe(document.body);
    window.addEventListener("scroll", schedulePaint, { passive: true });
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);

    return () => {
      frameObserver.disconnect();
      pageObserver.disconnect();
      window.removeEventListener("scroll", schedulePaint);
      cancelAnimationFrame(loop);
      cancelAnimationFrame(pending);
      reducedMotion.removeEventListener("change", updateMotion);
    };
  }, []);

  // h-lvh: the tallest viewport height on phones, so the sky doesn't jump when the URL bar hides.
  return (
    <div
      ref={frameRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-lvh overflow-hidden"
    >
      <canvas ref={skyRef} className="absolute top-0 left-0 [image-rendering:pixelated]" />
      {/* Overlay blend lightens light areas and darkens dark ones, like the prototype. */}
      <canvas ref={grainRef} className="absolute top-0 left-0 opacity-(--grain) mix-blend-overlay" />
    </div>
  );
}
