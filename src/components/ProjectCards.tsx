"use client";

import Image from "next/image";
import { useInView } from "motion/react";
import { useRef, useSyncExternalStore } from "react";
import ScreenshotViewer from "@/components/ScreenshotViewer";
import TagList from "@/components/TagList";
import UnderlineLink from "@/components/UnderlineLink";
import { cardMeta, SITE_LINK_LABEL, type Project } from "@/data/projects";
import { GithubIcon } from "@/icons/lineIcons";

// /projects cards (docs/visual-system.md → Subpages → /projects cards, decided 2026-10-30): a grid,
// 3 columns on desktop, 2 on tablets, 1 on phones. Each card is the home projects cell's material
// with the screenshot on top, then title, class · term, summary, tags and links. As a card scrolls
// into view (once) it fades up (opacity 0 → 1, translateY 8px → 0, 450ms ease) after 150 + 160·c ms,
// c being its column among the columns showing, and 200ms later its screenshot comes into focus
// (blur(5px) brightness(1.15) → none, 800ms ease). Reduce Motion: shown at once, sharp. Screenshots
// open large on click, like the home page's.

const FADE = { base: 150, step: 160 };
const FOCUS_LAG_MS = 200;

// [screenshot] placeholder gradients, the same three as the home page's (Projects.tsx).
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#5E3A66,#A4527A)",
  "linear-gradient(135deg,#2E2A56,#E8846A)",
  "linear-gradient(135deg,#A4527A,#F7C27E)",
];

// The grid's breakpoints (Tailwind's sm and lg), for the stagger.
const SM = "(min-width: 640px)";
const LG = "(min-width: 1024px)";

/** How many columns the grid shows right now. 1 on the server; the cards are hidden until in view anyway. */
function useColumns() {
  return useSyncExternalStore(
    (onChange) => {
      const queries = [SM, LG].map((q) => window.matchMedia(q));
      queries.forEach((q) => q.addEventListener("change", onChange));
      return () => queries.forEach((q) => q.removeEventListener("change", onChange));
    },
    () => (window.matchMedia(LG).matches ? 3 : window.matchMedia(SM).matches ? 2 : 1),
    () => 1,
  );
}

const REDUCE = "(prefers-reduced-motion: reduce)";

/**
 * Reduce Motion, false on the server and while hydrating, then the real value. Motion's
 * useReducedMotion is already true on the first client render, which doesn't match the server's
 * HTML; React leaves the mismatched class alone, so the cards would stay at opacity 0.
 */
function useReduceMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(REDUCE);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(REDUCE).matches,
    () => false,
  );
}

export default function ProjectCards({ projects }: { projects: Project[] }) {
  const columns = useColumns();
  return (
    <ul role="list" className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project, i) => (
        <Card key={project.slug} project={project} index={i} delayMs={FADE.base + FADE.step * (i % columns)} />
      ))}
    </ul>
  );
}

function Card({ project, index, delayMs }: { project: Project; index: number; delayMs: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReduceMotion();
  const shown = inView || reduceMotion;

  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`flex flex-col gap-3 rounded-[14px] border border-ink/30 bg-tint/34 p-3.5 transition-[opacity,translate] duration-450 ease-[ease] motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      <Screenshot project={project} index={index} focused={shown} delayMs={delayMs + FOCUS_LAG_MS} />
      <div>
        <h3 className="font-serif text-[20px] leading-[1.2] font-normal">{project.title}</h3>
        <p className="mt-0.5 text-[13px] text-ink/70">{cardMeta(project)}</p>
      </div>
      <p className="text-[15px] leading-[1.55]">{project.summary}</p>
      <TagList tags={project.tags} />
      {(project.github || project.site) && (
        <div className="flex items-center gap-4">
          {project.github && (
            // The hero link buttons' material, scaled down (as in the home projects cell).
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${project.title} on GitHub`}
              className="flex size-8 items-center justify-center rounded-full border border-ink/38 bg-tint/34 text-ink/82 transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent motion-reduce:transition-none"
            >
              <GithubIcon size={15} />
            </a>
          )}
          {project.site && (
            <UnderlineLink href={project.site} newTab ariaLabel={`${project.title} link, opens in a new tab`}>
              {SITE_LINK_LABEL}
            </UnderlineLink>
          )}
        </div>
      )}
    </li>
  );
}

/** 16:10 screenshot with the focus pull; a labeled [screenshot] gradient while there's no image. */
function Screenshot({
  project,
  index,
  focused,
  delayMs,
}: {
  project: Project;
  index: number;
  focused: boolean;
  delayMs: number;
}) {
  const style = { transitionDelay: `${delayMs}ms` };
  const focusPull = `aspect-[16/10] w-full rounded-lg transition-[filter] duration-800 ease-[ease] motion-reduce:transition-none ${
    focused ? "filter-none" : "blur-[5px] brightness-115"
  }`;

  if (project.demo) {
    return <Demo demo={project.demo} className={focusPull} style={style} />;
  }

  if (project.image.src) {
    return (
      <ScreenshotViewer src={project.image.src} alt={project.image.alt} className="w-full rounded-lg">
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={400}
          height={250}
          style={style}
          className={`object-cover ${focusPull}`}
        />
      </ScreenshotViewer>
    );
  }

  // [screenshot] placeholder until the project has an image.
  return (
    <div
      role="img"
      aria-label={project.image.alt}
      style={{ ...style, background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length] }}
      className={`grid place-items-center text-[12px] text-cream ${focusPull}`}
    >
      [screenshot]
    </div>
  );
}

/**
 * A demo GIF (Jared, 2026-11-06, lab option C): it loops while the card is on screen, phones too,
 * and shows its still otherwise, since a GIF can't be paused. It restarts each time it returns.
 * Letterboxed in the 16:10 frame; opens large like a screenshot. Reduce Motion: the still only.
 */
function Demo({
  demo,
  className,
  style,
}: {
  demo: NonNullable<Project["demo"]>;
  className: string;
  style: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduceMotion = useReduceMotion();
  const src = reduceMotion ? demo.poster : demo.src;

  return (
    <div ref={ref}>
      <ScreenshotViewer src={src} alt={demo.alt} contain className="w-full rounded-lg">
        <Image
          src={inView ? src : demo.poster}
          alt={demo.alt}
          width={400}
          height={250}
          unoptimized
          style={style}
          className={`bg-[#141414] object-contain ${className}`}
        />
      </ScreenshotViewer>
    </div>
  );
}
