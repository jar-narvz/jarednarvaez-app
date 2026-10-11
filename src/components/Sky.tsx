"use client";

import { useEffect, useRef } from "react";
import { goldenHour } from "@/lib/sky/palette";
import { renderSky } from "@/lib/sky/render";
import { coastScene, tallCoastScene } from "@/lib/sky/scene";
import { GRAIN_FRAME_MS, grainFrames } from "@/lib/sky/texture";

// The fixed background sky: static golden hour, with moving film grain on top.
export default function Sky() {
  const frameRef = useRef<HTMLDivElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const sky = skyRef.current;
    const grain = grainRef.current;
    if (!frame || !sky || !grain) return;

    let frames: HTMLCanvasElement[] = [];
    let current = 0;
    const showFrame = () => grain.getContext("2d")!.drawImage(frames[current], 0, 0);

    const draw = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      // Portrait screens (phones) get the tall version of the coast.
      renderSky(sky, w, h, w < h ? tallCoastScene : coastScene, goldenHour);

      // Grain at half the screen's resolution, finer than the 4px sky squares.
      frames = grainFrames(Math.ceil(w / 2), Math.ceil(h / 2));
      grain.width = frames[0].width;
      grain.height = frames[0].height;
      grain.style.width = `${grain.width * 2}px`;
      grain.style.height = `${grain.height * 2}px`;
      showFrame();
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

    // Reduced motion: keep one still grain frame instead of the flicker.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      cancelAnimationFrame(loop);
      if (!reducedMotion.matches) loop = requestAnimationFrame(tick);
    };

    // Fires once right away, then on every resize.
    const observer = new ResizeObserver(draw);
    observer.observe(frame);
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(loop);
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
