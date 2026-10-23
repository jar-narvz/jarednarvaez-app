"use client";

import { useEffect, useRef } from "react";
import { accentAt, grainAt, keyframeAt, mixColor, smoothstep } from "@/lib/sky/blend";
import {
  dayness,
  GLIDE_S,
  glideHour,
  grainAtHour,
  hourAtScroll,
  keyframeAtHour,
  shorterWay,
  starsAtHour,
  sunAt,
} from "@/lib/sky/hours";
import { SUN_GOLD } from "@/lib/sky/palette";
import { PIXEL, renderSky } from "@/lib/sky/render";
import { coastScene, tallCoastScene, type DrawnSky } from "@/lib/sky/scene";
import { getVisitorSky, loadVisitorStars, onMyStarChange, publishSkyFrame } from "@/lib/stars/live";
import { getSkyMode, localHour, onSkyModeChange, publishShownHour, takeGlide } from "@/lib/sky/skyHour";
import { onStarlessChange, textBoxes } from "@/lib/sky/starless";
import { textDayness, themeAt } from "@/lib/sky/theme";
import { GRAIN_FRAME_MS, grainFrames } from "@/lib/sky/texture";

/** The sky's values that can differ from the 24-hour clock's (scroll mode keeps the prototype's). */
type Moment = { hour: number; sunX: number; stars: number; grain: number; accent: string };

/** How far down the page the visitor is: 0 at the top (golden hour), 1 at the bottom (night). */
function scrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

// The fixed background sky. In scroll mode it follows scroll progress from golden hour to night;
// in the other sky modes (skyHour.ts) it holds the picked hour or the visitor's clock. It writes
// the live colors to CSS variables, publishes the hour it's showing for the nav's dials, and has
// moving film grain on top. Clouds drift and stars twinkle on their own, so the sky repaints every
// frame (except under Reduce Motion). Clicking a sky control glides the sky to its new hour the
// shorter way around the clock (GLIDE_S, smoothstep); Reduce Motion jumps instead.
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
    // "My time": the visitor's clock, refreshed every 30s (docs/visual-system.md → Mode behavior).
    let clockHour = localHour();
    const clock = window.setInterval(() => {
      clockHour = localHour();
      if (getSkyMode().mode === "local") schedulePaint();
    }, 30_000);

    /** The hour the sky holds in the fixed modes, or null in scroll mode. */
    const fixedHour = () => {
      const m = getSkyMode();
      if (m.mode === "hour") return m.hour;
      if (m.mode === "local") return clockHour;
      return null;
    };

    // Visitor stars (leave a star), fetched once for the page (live.ts) and read every frame. If
    // the API is down the list stays empty and the sky is unchanged.
    let cancelled = false;
    loadVisitorStars().then(() => {
      if (!cancelled) schedulePaint();
    });

    // A glide in progress: where it started and when. Its end is wherever the mode now points,
    // read every frame (in scroll mode, the visitor may scroll during it).
    let glide: { from: Moment; start: number; delta: number } | null = null;
    // What was last painted, so a glide can start from exactly there (even mid-glide).
    let painted: Moment | null = null;

    // Sky at the current scroll position (or fixed hour) and time, plus the live CSS variables.
    const paintSky = () => {
      const { clientWidth: w, clientHeight: h } = frame;
      if (!w || !h) return;
      const t = scrollProgress();
      const fixed = fixedHour();
      let k: DrawnSky = keyframeAt(t);
      let grainLevel = grainAt(t);
      // Scroll mode never reaches daytime, so its dayness is 0 and its colors stay the evening's.
      let day = 0;
      let eveningAccent = accentAt(t);
      let hour = hourAtScroll(t);
      if (fixed !== null) {
        hour = fixed;
        day = dayness(fixed);
        k = { ...keyframeAtHour(fixed), day };
        grainLevel = grainAtHour(fixed);
        eveningAccent = SUN_GOLD;
      }

      if (glide) {
        const progress = (performance.now() - glide.start) / (GLIDE_S * 1000);
        if (progress >= 1) {
          glide = null;
        } else {
          // Colors, sun height and dayness follow the clock as it turns. Scroll mode keeps the
          // prototype's fixed sun x, its own star curve and its Starlight accent, so those blend
          // from where the glide started to where it ends: nothing jumps when it lands.
          const e = smoothstep(progress, 0, 1);
          const { from } = glide;
          hour = glideHour(from.hour, glide.delta, progress);
          const to: Moment = {
            hour: fixed ?? hourAtScroll(t),
            sunX: k.sunX ?? sunAt(18.5).x,
            stars: k.stars,
            grain: grainLevel,
            accent: eveningAccent,
          };
          const settle = (clock: (h: number) => number, pick: (m: Moment) => number) =>
            clock(hour) + (1 - e) * (pick(from) - clock(from.hour)) + e * (pick(to) - clock(to.hour));
          day = dayness(hour);
          k = {
            ...keyframeAtHour(hour),
            day,
            sunX: settle((x) => sunAt(x).x, (m) => m.sunX),
            stars: Math.min(1, Math.max(0, settle(starsAtHour, (m) => m.stars))),
          };
          grainLevel = settle(grainAtHour, (m) => m.grain);
          eveningAccent = mixColor(from.accent, eveningAccent, e);
        }
      }

      painted = { hour, sunX: k.sunX ?? sunAt(18.5).x, stars: k.stars, grain: grainLevel, accent: eveningAccent };
      publishShownHour(hour);
      // Portrait screens (phones) get the tall version of the coast.
      const scene = w < h ? tallCoastScene : coastScene;
      const drawn = renderSky(sky, w, h, scene, k, time, getVisitorSky(), textBoxes(PIXEL));
      if (drawn) publishSkyFrame(drawn, k.stars);
      // The variables only change with scroll or the hour, so skip rewriting them on still
      // frames. Written in scroll mode too, so leaving a fixed hour puts the evening back.
      const moment = `${t} ${fixed} ${glide ? hour : ""}`;
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
    const stopSkyMode = onSkyModeChange(() => {
      if (getSkyMode().mode === "local") clockHour = localHour();
      // Glide from what's on screen now, unless the change was a drag on the dial (or Reduce
      // Motion is on), which jumps and cancels any glide in progress.
      if (takeGlide() && painted && !reducedMotion.matches) {
        const target = fixedHour() ?? hourAtScroll(scrollProgress());
        glide = { from: painted, start: performance.now(), delta: shorterWay(painted.hour, target) };
      } else {
        glide = null;
      }
      schedulePaint();
    });
    // Text starting or stopping to keep stars out (the hover label) repaints a still sky too.
    const stopStarless = onStarlessChange(schedulePaint);
    // Placing your star (or losing it if saving fails) repaints a still sky too.
    const stopMyStar = onMyStarChange(schedulePaint);
    updateMotion();
    reducedMotion.addEventListener("change", updateMotion);

    return () => {
      cancelled = true;
      frameObserver.disconnect();
      pageObserver.disconnect();
      window.removeEventListener("scroll", schedulePaint);
      stopSkyMode();
      stopStarless();
      stopMyStar();
      window.clearInterval(clock);
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
