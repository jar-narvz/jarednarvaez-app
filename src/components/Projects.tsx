"use client";

import Image from "next/image";
import { useState } from "react";
import Collapse from "@/components/Collapse";
import CollapsibleHeader from "@/components/CollapsibleHeader";
import ScreenshotViewer from "@/components/ScreenshotViewer";
import TagList from "@/components/TagList";
import ToggleButton from "@/components/ToggleButton";
import UnderlineLink from "@/components/UnderlineLink";
import {
  featuredProjects,
  projectsSection,
  showProjectPages,
  type Project,
} from "@/data/projects";
import { staggerDelay } from "@/lib/stagger";

// Projects (docs/visual-system.md → Projects): an editorial numbered index, collapsed by default
// like experience but animated differently on purpose. Opening, the rule above row i draws left →
// right at 50 + 160·i ms and the row fades up at 150 + 160·i ms, then the closing rule draws.
// Each project opens on its own into a soft cell whose screenshot comes into focus. Closing runs
// in reverse and closes every project. Layout values follow docs/reference/home-mockup.html.

const ROW_STAGGER = { base: 150, step: 160 };
/** Each rule starts drawing this long before its row fades up. */
const RULE_LEAD_MS = 100;
/** "all projects →" fades in this long after the last row starts. */
const ALL_LINK_LAG_MS = 100;
const BODY_ID = "projects-body";

// [screenshot] placeholder gradients (from the mockup), used while a project has no image src.
const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg,#5E3A66,#A4527A)",
  "linear-gradient(135deg,#2E2A56,#E8846A)",
  "linear-gradient(135deg,#A4527A,#F7C27E)",
];

export default function Projects() {
  const projects = featuredProjects();
  const [open, setOpen] = useState(false);
  const [openRows, setOpenRows] = useState<ReadonlySet<number>>(new Set());

  function toggleSection() {
    if (open) setOpenRows(new Set()); // closing the section closes every project too
    setOpen(!open);
  }

  function toggleRow(i: number) {
    setOpenRows((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  // After the last row: the closing rule draws, then "all projects →" fades in. Closing, they go first.
  const afterLastMs = ROW_STAGGER.base + projects.length * ROW_STAGGER.step;

  return (
    <section
      id="projects"
      className="pl-(--content-l) pr-(--content-r) py-[clamp(72px,12vh,140px)] [text-shadow:var(--text-shadow)]"
    >
      <CollapsibleHeader
        label={projectsSection.label}
        heading={projectsSection.heading}
        open={open}
        controls={BODY_ID}
        onToggle={toggleSection}
      />

      <Collapse open={open} id={BODY_ID} durationMs={450}>
        <div className="mt-4 max-w-160">
          <ol>
            {projects.map((project, i) => (
              <ProjectRow
                key={project.slug}
                project={project}
                index={i}
                sectionOpen={open}
                delayMs={staggerDelay(i, projects.length, open, ROW_STAGGER)}
                open={openRows.has(i)}
                onToggle={() => toggleRow(i)}
              />
            ))}
          </ol>
          <Rule drawn={open} delayMs={open ? afterLastMs - RULE_LEAD_MS : 0} />

          {showProjectPages && (
            <p
              style={{ transitionDelay: `${open ? afterLastMs + ALL_LINK_LAG_MS : 0}ms` }}
              className={`mt-4.5 transition-opacity duration-400 ease-[ease] motion-reduce:transition-none ${
                open ? "opacity-100" : "opacity-0"
              }`}
            >
              <UnderlineLink href="/projects">all projects →</UnderlineLink>
            </p>
          )}
        </div>
      </Collapse>
    </section>
  );
}

/** 1px rule at 22% ink that draws left → right over 600ms. */
function Rule({ drawn, delayMs }: { drawn: boolean; delayMs: number }) {
  return (
    <div
      aria-hidden="true"
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`h-px origin-left bg-ink/22 transition-transform duration-600 ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none ${
        drawn ? "scale-x-100" : "scale-x-0"
      }`}
    />
  );
}

function ProjectRow({
  project,
  index,
  sectionOpen,
  delayMs,
  open,
  onToggle,
}: {
  project: Project;
  index: number;
  sectionOpen: boolean;
  delayMs: number;
  open: boolean;
  onToggle: () => void;
}) {
  const detailsId = `projects-row-${index}`;
  const ruleDelayMs = sectionOpen ? delayMs - RULE_LEAD_MS : delayMs;

  return (
    <li>
      {/* The rule sits outside the fading row so its whole draw is visible. */}
      <Rule drawn={sectionOpen} delayMs={ruleDelayMs} />

      <div
        style={{ transitionDelay: `${delayMs}ms` }}
        className={`transition-[opacity,translate] duration-450 ease-[ease] motion-reduce:transition-none ${
          sectionOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {/* Row header: number · title · type/year · toggle. On phones type/year drops under the
            title. The whole header toggles on click (a mouse convenience); the button is the
            real control, and its click bubbles up to here. */}
        <div
          onClick={onToggle}
          className="group grid cursor-pointer grid-cols-[36px_minmax(0,1fr)_auto_30px] items-center gap-3.5 py-3.5 max-sm:grid-cols-[28px_minmax(0,1fr)_30px]"
        >
          <span className="text-[13px] text-ink/60 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className={`font-serif text-[clamp(24px,3vw,30px)] leading-[1.15] font-normal tracking-[-0.015em] transition-colors duration-300 group-hover:text-accent motion-reduce:transition-none ${
              open ? "text-accent" : ""
            }`}
          >
            {project.title}
          </h3>
          <p className="text-right text-[13px] leading-[1.4] text-ink/70 max-sm:col-start-2 max-sm:row-start-2 max-sm:text-left">
            {project.type}
            <br />
            {project.year}
          </p>
          <ToggleButton open={open} controls={detailsId} label={`details for ${project.title}`} />
        </div>

        <Collapse open={open} id={detailsId} durationMs={450}>
          {/* The cell: same material as the tech stack pills, indented to start under the title. */}
          <div
            className={`mt-0.5 mb-4.5 ml-12.5 flex gap-4.5 rounded-[14px] border border-ink/30 bg-tint/34 p-3.5 transition-[opacity,translate] delay-120 duration-300 ease-[ease] motion-reduce:transition-none max-sm:ml-0 max-sm:flex-col ${
              open ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
            }`}
          >
            <ProjectImage project={project} index={index} open={open} />
            <div className="min-w-0">
              <p className="text-[15px] leading-[1.55]">{project.summary}</p>
              <TagList tags={project.tags} className="mt-2.5" />
              {showProjectPages && (
                <p className="mt-3">
                  <UnderlineLink href={`/projects/${project.slug}`}>view project →</UnderlineLink>
                </p>
              )}
            </div>
          </div>
        </Collapse>
      </div>
    </li>
  );
}

/** Screenshot with the focus pull: blur(5px) brightness(1.15) → sharp, 800ms after 200ms. Click it
 *  to see it large (ScreenshotViewer). */
function ProjectImage({ project, index, open }: { project: Project; index: number; open: boolean }) {
  const size = "w-50 max-w-full flex-none rounded-lg max-sm:w-full";
  const focusPull = `aspect-[16/10] rounded-lg transition-[filter] delay-200 duration-800 ease-[ease] motion-reduce:transition-none ${
    open ? "filter-none" : "blur-[5px] brightness-115"
  }`;

  if (project.image.src) {
    return (
      <ScreenshotViewer src={project.image.src} alt={project.image.alt} className={size}>
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={400}
          height={250}
          className={`w-full object-cover ${focusPull}`}
        />
      </ScreenshotViewer>
    );
  }

  // [screenshot] placeholder until the content pass.
  return (
    <div
      role="img"
      aria-label={project.image.alt}
      style={{ background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length] }}
      className={`grid place-items-center text-[12px] ${size} ${focusPull}`}
    >
      [screenshot]
    </div>
  );
}
