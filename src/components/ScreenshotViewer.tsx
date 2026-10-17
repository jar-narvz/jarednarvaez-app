"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

// Click a project screenshot to see it large (Jared, 2026-10-17, option 1 "zoom"): the screenshot
// grows out of its thumbnail (400ms, cubic-bezier(.2,.8,.2,1)) over the phone menu's material (plum
// #2A1630 at 60% with blur, fading in over 300ms), and shrinks back on close. Closes on the ×
// button, a click outside the image, or Esc. Reduce Motion: opens and closes instantly.

const ZOOM = { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] } as const;
const INSTANT = { duration: 0 } as const;

/** true only in the browser, and false while hydrating, so the portal never renders on the server. */
const noop = () => () => {};
const useIsClient = () => useSyncExternalStore(noop, () => true, () => false);

export default function ScreenshotViewer({
  src,
  alt,
  className = "",
  children,
}: {
  src: string;
  alt: string;
  /** Classes for the thumbnail button (its size and shape). */
  className?: string;
  /** The thumbnail. */
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const layoutId = useId();
  const reduceMotion = useReducedMotion();
  const trigger = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const isClient = useIsClient();
  const motionFor = reduceMotion ? INSTANT : ZOOM;

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = "hidden"; // no page scroll behind the viewer
    closeButton.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // The × is the only control inside, so Tab stays on it.
      if (e.key === "Tab") {
        e.preventDefault();
        closeButton.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const opener = trigger.current;
    return () => {
      root.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`View larger: ${alt}`}
        className={`block cursor-zoom-in ${className}`}
      >
        {/* While open, the large copy stands in for the thumbnail, so hide this one. */}
        <motion.div layoutId={layoutId} transition={motionFor} style={{ opacity: open ? 0 : 1 }}>
          {children}
        </motion.div>
      </button>

      {isClient &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="viewer"
                role="dialog"
                aria-modal="true"
                aria-label={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={reduceMotion ? INSTANT : { duration: 0.3, ease: "easeOut" }}
                onClick={() => setOpen(false)}
                className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-[#2A1630]/60 px-(--margin) backdrop-blur-md"
              >
                <motion.div
                  layoutId={layoutId}
                  transition={motionFor}
                  className="relative aspect-[16/10] w-[min(1200px,100%,calc(85svh*1.6))] overflow-hidden rounded-[14px] shadow-[0_20px_60px_rgba(20,10,30,0.5)]"
                >
                  <Image src={src} alt={alt} fill sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
                </motion.div>

                <button
                  ref={closeButton}
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="absolute top-6 right-(--margin) grid size-9 cursor-pointer place-items-center rounded-full border border-ink/45 bg-tint/34 text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.3" fill="none" />
                  </svg>
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
