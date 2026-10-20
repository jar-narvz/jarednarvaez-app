"use client";

import { useEffect, useRef } from "react";
import { accentAt, grainAt, keyframeAt } from "@/lib/sky/blend";
import { dayness, grainAtHour, keyframeAtHour } from "@/lib/sky/hours";
import { SUN_GOLD } from "@/lib/sky/palette";
import { renderSky } from "@/lib/sky/render";
import { coastScene, tallCoastScene, type DrawnSky } from "@/lib/sky/scene";
import { getFixedSky, onFixedSkyChange } from "@/lib/sky/skyHour";
import { textDayness, themeAt } from "@/lib/sky/theme";
import { GRAIN_FRAME_MS, grainFrames } from "@/lib/sky/texture";

/** How far down the page the visitor is: 0 at the top (golden hour), 1 at the bottom (night). */
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

// The fixed background sky. It follows scroll progress from golden hour to night (or holds one
// hour when skyHour.ts fixes it), writes the live colors to CSS variables, and has moving film
// grain on top. Clouds drift and stars
// twinkle on their own, so the sky repaints every frame (except under Reduce Motion).
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

    // Seconds on the animation clock: moves the clouds and the twinkle. Frozen under Reduce Motion.
    let time = 0;
    let lastMoment = "";

    // Sky at the current scroll position (or fixed hour) and time, plus the live CSS variables.
    const paintSky = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      const t = scrollProgress();
      const fixed = getFixedSky();
      let k: DrawnSky = keyframeAt(t);
      let grainLevel = grainAt(t);
      // Scroll mode never reaches daytime, so its dayness is 0 and its colors stay the evening's.
      let day = 0;
      let eveningAccent = accentAt(t);
      if (fixed) {
        day = dayness(fixed.hour);
        k = { ...keyframeAtHour(fixed.hour), day };
        grainLevel = grainAtHour(fixed.hour);
        eveningAccent = SUN_GOLD;
      }
      // Portrait screens (phones) get the tall version of the coast.
      renderSky(sky, w, h, w < h ? tallCoastScene : coastScene, k, time);
      // The variables only change with scroll or the hour, so skip rewriting them on still
      // frames. Written in scroll mode too, so leaving a fixed hour puts the evening back.
      const moment = `${t} ${fixed?.hour}`;
      if (moment !== lastMoment) {
        lastMoment = moment;
        const theme = themeAt(textDayness(day), eveningAccent);
        root.setProperty("--ink", theme.ink);
        root.setProperty("--accent", theme.accent);
        root.setProperty("--underline", theme.underline);
        root.setProperty("--tint", theme.tint);
        root.setProperty("--text-shadow", theme.textShadow);
        root.setProperty("--grain", String(grainLevel));
      }
    };

    // Repaint at most once per animation frame while scrolling. Not needed while the
    // animation loop runs, since it repaints every frame anyway.
    let loop = 0;
    let pending = 0;
    const schedulePaint = () => {
      if (!pending && !loop) {
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

    // Every frame: repaint the sky (clouds, twinkle) and swap grain frames every 70ms.
    let last = 0;
    const tick = (now: number) => {
      time = now / 1000;
      if (frames.length && now - last >= GRAIN_FRAME_MS) {
        last = now;
        current = (current + 1) % frames.length;
        showFrame();
      }
      paintSky();
      loop = requestAnimationFrame(tick);
    };

    // Reduced motion: no loop, so grain, clouds and stars hold still where they are. Scroll
    // blending stays, since it only moves when the visitor scrolls.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => {
      cancelAnimationFrame(loop);
      loop = 0;
      if (reducedMotion.matches) schedulePaint();
      else loop = requestAnimationFrame(tick);
    };

    // The frame observer fires once right away, then on every resize. The page observer
    // catches the page getting taller or shorter, which changes scroll progress.
    const frameObserver = new ResizeObserver(resize);
    frameObserver.observe(frame);
    const pageObserver = new ResizeObserver(schedulePaint);
    pageObserver.observe(document.body);
    window.addEventListener("scroll", schedulePaint, { passive: true });
    const stopFixedSky = onFixedSkyChange(schedulePaint);
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);

    return () => {
      frameObserver.disconnect();
      pageObserver.disconnect();
      window.removeEventListener("scroll", schedulePaint);
      stopFixedSky();
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
