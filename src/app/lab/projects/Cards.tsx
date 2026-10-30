"use client";

import Image from "next/image";
import { useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import TagList from "@/components/TagList";
import UnderlineLink from "@/components/UnderlineLink";
import { GithubIcon } from "@/icons/lineIcons";
import type { LabProject } from "./labProjects";

// Lab-only (2026-10-30): three card layouts for /projects, same data and links in each.
//   A grid: three columns, image on top.
//   B rows: one column, a ~180px thumbnail left of the text (Brittany Chiang's main list).
//   C two-column: horizontal cards, a small thumbnail beside the text, two per row.
// Proposed motion, borrowed from the home projects section: each card fades up (opacity 0 → 1,
// translateY 8px → 0, 450ms ease) as it scrolls into view, staggered 160ms across a row of the
// layout (150 + 160·column ms), and its screenshot gets the focus pull (blur(5px) brightness(1.15)
// → none, 800ms ease, 200ms after the card). Reduce Motion: everything shows at once, sharp.

export const LAYOUTS = ["A grid", "B rows", "C two-column"] as const;
export type Layout = (typeof LAYOUTS)[number];

const COLUMNS: Record<Layout, number> = { "A grid": 3, "B rows": 1, "C two-column": 2 };

const LIST: Record<Layout, string> = {
  "A grid": "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
  "B rows": "flex max-w-(--block-w) flex-col gap-4",
  "C two-column": "grid gap-4 lg:grid-cols-2",
};

const CARD: Record<Layout, string> = {
  "A grid": "flex flex-col gap-3",
  "B rows": "flex gap-4.5 max-sm:flex-col",
  "C two-column": "flex gap-4 max-sm:flex-col",
};

const IMAGE: Record<Layout, string> = {
  "A grid": "w-full",
  "B rows": "w-45 flex-none self-start max-sm:w-full",
  "C two-column": "w-32 flex-none self-start max-sm:w-full",
};

// [screenshot] placeholder gradients, the same three as the home page's.
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#5E3A66,#A4527A)",
  "linear-gradient(135deg,#2E2A56,#E8846A)",
  "linear-gradient(135deg,#A4527A,#F7C27E)",
];

export function CardList({ layout, projects, animate }: { layout: Layout; projects: LabProject[]; animate: boolean }) {
  return (
    <ul role="list" className={`mt-5 ${LIST[layout]}`}>
      {projects.map((p, i) => (
        <Card key={p.title} project={p} index={i} layout={layout} animate={animate} />
      ))}
    </ul>
  );
}

function Card({ project, index, layout, animate }: { project: LabProject; index: number; layout: Layout; animate: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduceMotion = useReducedMotion();
  const shown = !animate || !!reduceMotion || inView;
  const delayMs = animate ? 150 + 160 * (index % COLUMNS[layout]) : 0;
  const motionOff = !animate ? "transition-none" : "motion-reduce:transition-none";

  return (
    <li
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`rounded-[14px] border border-ink/30 bg-tint/34 p-3.5 transition-[opacity,translate] duration-450 ease-[ease] ${motionOff} ${
        shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      } ${CARD[layout]}`}
    >
      <Screenshot
        project={project}
        index={index}
        className={IMAGE[layout]}
        focus={shown}
        delayMs={delayMs + 200}
        motionOff={motionOff}
      />
      <div className="min-w-0">
        <h3 className={`font-serif leading-[1.2] font-normal ${layout === "A grid" ? "text-[20px]" : "text-[22px]"}`}>
          {project.title}
        </h3>
        <p className="mt-0.5 text-[13px] text-ink/70">{project.meta}</p>
        <p className="mt-2 text-[15px] leading-[1.55]">{project.summary}</p>
        <TagList tags={project.tags} className="mt-2.5" />
        {(project.github || project.site) && (
          <div className="mt-3 flex items-center gap-4">
            {project.github && (
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
              <UnderlineLink href={project.site} newTab ariaLabel={`${project.title} project page, opens in a new tab`}>
                project page →
              </UnderlineLink>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

/** 16:10 screenshot (or a labeled placeholder) with the home page's focus pull. */
function Screenshot({
  project,
  index,
  className,
  focus,
  delayMs,
  motionOff,
}: {
  project: LabProject;
  index: number;
  className: string;
  focus: boolean;
  delayMs: number;
  motionOff: string;
}) {
  const look = `aspect-[16/10] rounded-lg transition-[filter] duration-800 ease-[ease] ${motionOff} ${
    focus ? "filter-none" : "blur-[5px] brightness-115"
  } ${className}`;
  const style = { transitionDelay: `${delayMs}ms` };

  if (project.image) {
    return (
      <Image
        src={project.image.src}
        alt={project.image.alt}
        width={400}
        height={250}
        style={style}
        className={`object-cover ${look}`}
      />
    );
  }
  return (
    <div
      role="img"
      aria-label={`[${project.title} screenshot]`}
      style={{ ...style, background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length] }}
      className={`grid place-items-center text-[12px] text-cream ${look}`}
    >
      [screenshot]
    </div>
  );
}
