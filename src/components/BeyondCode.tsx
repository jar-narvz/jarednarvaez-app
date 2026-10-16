"use client";

// PARKED (2026-10-16): not on the site. Beyond code moved out of the MVP until its design is
// fleshed out (docs/build-plan.md → Phase 4). Nothing renders this except the dev-only /lab page,
// which has live controls for the open questions (height, print size, frame width, frame).

import Image from "next/image";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";
import SectionLabel from "@/components/SectionLabel";
import UnderlineLink from "@/components/UnderlineLink";
import { beyondCode, scrapbook, showScrapbookPage, type ScrapbookPhoto } from "@/data/scrapbook";

// Beyond code (docs/visual-system.md → Beyond code): a framed zone (top/bottom rules + corner crop
// marks) with the text block on the left and 6 draggable prints clustered around it. Not
// collapsible. Prints drop in once when the zone scrolls into view, and again on "reset".
// Dragging writes positions straight to each print's style (no React state per frame), clamped
// to the zone; on drop a print settles at a new random tilt. On phones (≤760px) the prints are a
// fixed, wrapping scatter with dragging off. Layout values follow docs/reference/home-mockup.html.

const PHOTOS = scrapbook.filter(
  (p): p is ScrapbookPhoto & { home: NonNullable<ScrapbookPhoto["home"]> } => !!p.home,
);
const SIZE_SCALE = { sm: 1, md: 1.5, lg: 2 } as const;
const NARROW = "(max-width: 760px)";
const REDUCE_MOTION = "(prefers-reduced-motion: reduce)";

/** Drop-in: print i starts at 120 + 90·i ms and runs 300ms. */
const dropDelayMs = (i: number) => 120 + 90 * i;
const DROP_MS = 300;
const MAX_TILT = 6;

// [photo] placeholder gradients (from the mockup), used while a photo has no src.
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#A4527A,#E8846A)",
  "linear-gradient(135deg,#4E3270,#A24E78)",
  "linear-gradient(135deg,#E8846A,#FBD9A0)",
  "linear-gradient(135deg,#2E2A56,#5E3A66)",
  "linear-gradient(135deg,#A85A78,#F7C27E)",
  "linear-gradient(135deg,#5E3A66,#E2846E)",
];

const matches = (query: string) => window.matchMedia(query).matches;

export default function BeyondCode() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const printRefs = useRef<(HTMLLIElement | null)[]>([]);
  const tilts = useRef(PHOTOS.map((p) => p.home.rotate));
  const topZ = useRef(PHOTOS.length + 1);
  const timers = useRef<number[]>([]);

  /** Put every print back in its default spot; with `animate`, replay the drop-in. */
  function place(animate: boolean) {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const drop = animate && !matches(REDUCE_MOTION);

    PHOTOS.forEach((photo, i) => {
      const el = printRefs.current[i];
      if (!el) return;
      const tilt = photo.home.rotate;
      tilts.current[i] = tilt;
      el.style.left = `${photo.home.x}%`;
      el.style.top = `${photo.home.y}%`;
      el.style.zIndex = String(2 + i);

      if (!drop) {
        el.style.opacity = "1";
        el.style.transform = `rotate(${tilt}deg)`;
        return;
      }
      // Jump to the start (24px up, invisible) with transitions off, then let the transition
      // carry it down after its stagger delay.
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = `rotate(${tilt}deg) translateY(-24px)`;
      void el.offsetHeight; // apply the start state before turning transitions back on
      el.style.transition = "";
      el.style.transitionDelay = `${dropDelayMs(i)}ms`;
      el.style.opacity = "1";
      el.style.transform = `rotate(${tilt}deg)`;
      // Clear the delay afterwards so hover and drag respond immediately.
      timers.current.push(
        window.setTimeout(() => (el.style.transitionDelay = ""), dropDelayMs(i) + DROP_MS),
      );
    });
  }

  // Drop in once, when a quarter of the zone is on screen.
  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          place(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(zone);
    const pending = timers.current;
    return () => {
      observer.disconnect();
      pending.forEach(clearTimeout);
    };
  }, []);

  // Dragging. State lives in a ref; positions go straight to the element's style.
  const drag = useRef<{ i: number; startX: number; startY: number; left: number; top: number } | null>(null);

  function onPointerDown(i: number, e: React.PointerEvent<HTMLLIElement>) {
    if (matches(NARROW)) return; // phones: a fixed scatter that never fights scrolling
    const el = e.currentTarget;
    e.preventDefault();
    el.setPointerCapture(e.pointerId);
    el.style.transitionDelay = "";
    el.style.zIndex = String(++topZ.current);
    el.dataset.dragging = "";
    drag.current = { i, startX: e.clientX, startY: e.clientY, left: el.offsetLeft, top: el.offsetTop };
    // Reduce Motion: no scale-up.
    if (!matches(REDUCE_MOTION)) el.style.transform = `rotate(${tilts.current[i]}deg) scale(1.05)`;
  }

  function onPointerMove(e: React.PointerEvent<HTMLLIElement>) {
    const d = drag.current;
    const zone = zoneRef.current;
    if (!d || !zone) return;
    const el = e.currentTarget;
    const x = d.left + e.clientX - d.startX;
    const y = d.top + e.clientY - d.startY;
    el.style.left = `${Math.max(0, Math.min(zone.clientWidth - el.offsetWidth, x))}px`;
    el.style.top = `${Math.max(0, Math.min(zone.clientHeight - el.offsetHeight, y))}px`;
  }

  function onPointerUp(e: React.PointerEvent<HTMLLIElement>) {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    const el = e.currentTarget;
    delete el.dataset.dragging;
    // Settle at a new random tilt (−6° to +6°) so the pile always looks hand-placed.
    // Reduce Motion: keep the tilt it had.
    if (!matches(REDUCE_MOTION)) {
      tilts.current[d.i] = Math.round((Math.random() * 2 - 1) * MAX_TILT * 10) / 10;
    }
    el.style.transform = `rotate(${tilts.current[d.i]}deg)`;
  }

  return (
    <section
      id="beyond-code"
      className="px-(--margin) py-[clamp(72px,12vh,140px)]"
    >
      {/* LAB: --bc-* variables let /lab tune height, width, print size and frame (2026-10-16).
          Defaults are the current values; bake the chosen ones in and remove the variables. */}
      <div className="max-w-[var(--bc-zone-max,none)]">
      <div
        ref={zoneRef}
        className="relative mt-2 h-[var(--bc-zone-h,520px)] max-[760px]:h-auto max-[760px]:py-7"
      >
        <FrameMarks />

        <div className="absolute top-1/2 left-7 z-1 w-[min(320px,80%)] -translate-y-1/2 [text-shadow:var(--text-shadow)] max-[760px]:relative max-[760px]:top-auto max-[760px]:left-auto max-[760px]:w-auto max-[760px]:translate-y-0 max-[760px]:px-1">
          <SectionLabel>{beyondCode.label}</SectionLabel>
          <SectionHeading>{beyondCode.heading}</SectionHeading>
          <p className="mt-2.5 mb-3.5 text-[17px] text-ink/90">{beyondCode.line}</p>
          {showScrapbookPage && <UnderlineLink href="/scrapbook">open the scrapbook →</UnderlineLink>}
        </div>

        <ul
          role="list"
          aria-label="photos"
          className="max-[760px]:mt-6 max-[760px]:flex max-[760px]:flex-wrap max-[760px]:justify-center max-[760px]:gap-3.5"
        >
          {PHOTOS.map((photo, i) => (
            <li
              key={photo.id}
              ref={(el) => {
                printRefs.current[i] = el;
              }}
              onPointerDown={(e) => onPointerDown(i, e)}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={
                {
                  "--w": `calc(clamp(100px, 9.5vw, 148px) * ${SIZE_SCALE[photo.home.size]} * var(--bc-print-scale, 1))`,
                  left: `${photo.home.x}%`,
                  top: `${photo.home.y}%`,
                  zIndex: 2 + i,
                  transform: `rotate(${photo.home.rotate}deg)`,
                } as React.CSSProperties
              }
              className="absolute w-(--w) cursor-grab touch-none bg-cream px-1.5 pt-1.5 shadow-[0_6px_16px_rgba(30,10,30,.35)] select-none [transition:box-shadow_200ms_ease,transform_300ms_cubic-bezier(.3,1.4,.5,1),opacity_300ms_ease] hover:shadow-[0_10px_22px_rgba(30,10,30,.42)] motion-reduce:transition-none data-dragging:cursor-grabbing data-dragging:shadow-[0_18px_32px_rgba(30,10,30,.5)] data-dragging:[transition:box-shadow_200ms_ease,transform_200ms_ease] motion-reduce:data-dragging:transition-none max-[760px]:relative max-[760px]:top-auto! max-[760px]:left-auto! max-[760px]:w-[clamp(110px,40vw,150px)] max-[760px]:cursor-default max-[760px]:touch-auto"
            >
              <PrintPhoto photo={photo} index={i} />
              <p className="px-0.5 pt-1.5 pb-2.25 font-serif text-[14px] text-[#3A2840] italic">
                {photo.caption}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Hint line, centered under the bottom rule. Hidden on phones, where dragging is off. */}
      <p className="mt-4 flex items-center justify-center gap-2 text-[13px] text-ink/75 [text-shadow:var(--text-shadow)] max-[760px]:hidden">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
          <path d="M5 8V3.5a1 1 0 0 1 2 0V7m0-1.5a1 1 0 0 1 2 0V7m0-1a1 1 0 0 1 2 0v1.5m0-.5a1 1 0 0 1 2 0V10a4.5 4.5 0 0 1-4.5 4.5H8A4 4 0 0 1 4.6 12.6L3 10a1 1 0 0 1 1.7-1L5 9.5" />
        </svg>
        drag the photos around ·
        <button type="button" onClick={() => place(true)} className="cursor-pointer border-b border-underline text-accent">
          reset
        </button>
      </p>
      </div>
    </section>
  );
}

/** Top and bottom rules (1px ink at 28%) plus 14px corner crop marks (ink at 70%), 6px outside. */
function FrameMarks() {
  const mark = "absolute size-3.5 border-ink/70 opacity-(--bc-marks,1)";
  return (
    <div aria-hidden="true">
      <span style={{ opacity: "var(--bc-rules, 1)" }} className="absolute inset-x-0 top-0 h-px bg-ink/28" />
      <span style={{ opacity: "var(--bc-rules, 1)" }} className="absolute inset-x-0 bottom-0 h-px bg-ink/28" />
      <span className={`${mark} -top-1.5 -left-1.5 border-t border-l`} />
      <span className={`${mark} -top-1.5 -right-1.5 border-t border-r`} />
      <span className={`${mark} -bottom-1.5 -left-1.5 border-b border-l`} />
      <span className={`${mark} -right-1.5 -bottom-1.5 border-r border-b`} />
    </div>
  );
}

/** The 5:4 photo on a print: a real image, or a labeled [photo] placeholder until the content pass. */
function PrintPhoto({ photo, index }: { photo: ScrapbookPhoto; index: number }) {
  if (photo.src) {
    return (
      <Image
        src={photo.src}
        alt={photo.alt}
        width={600}
        height={480}
        draggable={false}
        className="pointer-events-none aspect-[5/4] w-full object-cover"
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={photo.alt}
      style={{ background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length] }}
      className="grid aspect-[5/4] place-items-center font-serif text-[14px] text-ink/80 italic"
    >
      [photo]
    </div>
  );
}
