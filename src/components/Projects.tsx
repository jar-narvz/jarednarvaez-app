"use client";

import Image from "next/image";
import { useState } from "react";
import Collapse from "@/components/Collapse";
import CollapsibleHeader from "@/components/CollapsibleHeader";
import ScreenshotViewer from "@/components/ScreenshotViewer";
import TagList from "@/components/TagList";
import UnderlineLink from "@/components/UnderlineLink";
import {
  featuredProjects,
  projectsSection,
  showAllProjectsLink,
  showWriteUps,
  SITE_LINK_LABEL,
  type Project,
} from "@/data/projects";
import { GithubIcon } from "@/icons/lineIcons";
import { staggerDelay } from "@/lib/stagger";

// Projects (docs/visual-system.md → Projects): an editorial numbered index, collapsed by default
// like experience but animated differently on purpose. Opening, the rule above row i draws left →
// right at 50 + 160·i ms and the row fades up with its soft cell at 150 + 160·i ms; 200ms later
// the cell's screenshot comes into focus. Then the closing rule draws. Since 2026-10-30 every
// project shows open with the section (2 projects, no per-project "+"). Closing runs in reverse.
// Layout values follow docs/reference/home-mockup.html.

const ROW_STAGGER = { base: 150, step: 160 };
/** Each rule starts drawing this long before its row fades up. */
const RULE_LEAD_MS = 100;
/** A row's screenshot starts coming into focus this long after the row (as on /projects). */
const FOCUS_LAG_MS = 200;
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

  // After the last row: the closing rule draws, then "all projects →" fades in. Closing, they go first.
  const afterLastMs = ROW_STAGGER.base + projects.length * ROW_STAGGER.step;

  return (
    <section
      id="projects"
      className="pl-(--content-l) pr-(--content-r) py-(--collapsible-py) [text-shadow:var(--text-shadow)]"
    >
      <CollapsibleHeader
        label={projectsSection.label}
        heading={projectsSection.heading}
        open={open}
        controls={BODY_ID}
        onToggle={() => setOpen(!open)}
      />

      <Collapse open={open} id={BODY_ID} durationMs={450}>
        <div className="mt-4 max-w-(--block-w)">
          <ol>
            {projects.map((project, i) => (
              <ProjectRow
                key={project.slug}
                project={project}
                index={i}
                sectionOpen={open}
                delayMs={staggerDelay(i, projects.length, open, ROW_STAGGER)}
              />
            ))}
          </ol>
          <Rule drawn={open} delayMs={open ? afterLastMs - RULE_LEAD_MS : 0} />

          {showAllProjectsLink && (
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
}: {
  project: Project;
  index: number;
  sectionOpen: boolean;
  delayMs: number;
}) {
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
        {/* Row header: number · title · type/year. On phones type/year drops under the title. */}
        <div className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-center gap-3.5 py-3.5 max-sm:grid-cols-[28px_minmax(0,1fr)]">
          <span className="text-[13px] text-ink/60 tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          {/* Ink, turning accent on hover only: with every project open, the spec's "accent while
              open" would leave every title gold (decided 2026-10-30). */}
          <h3 className="font-serif text-[clamp(24px,3vw,30px)] leading-[1.15] font-normal tracking-[-0.015em] transition-colors duration-300 group-hover:text-accent motion-reduce:transition-none">
            {project.title}
          </h3>
          <p className="text-right text-[13px] leading-[1.4] text-ink/70 max-sm:col-start-2 max-sm:row-start-2 max-sm:text-left">
            {project.type}
            <br />
            {project.year}
          </p>
        </div>

        {/* The cell: same material as the tech stack pills, indented to start under the title. It
            fades up with its row. */}
        <div className="mt-0.5 mb-4.5 ml-12.5 flex gap-4.5 rounded-[14px] border border-ink/30 bg-tint/34 p-3.5 max-sm:ml-0 max-sm:flex-col">
          <ProjectImage
            project={project}
            index={index}
            focused={sectionOpen}
            delayMs={sectionOpen ? delayMs + FOCUS_LAG_MS : delayMs}
          />
          <div className="min-w-0">
            <p className="text-[15px] leading-[1.55]">{project.summary}</p>
            <TagList tags={project.tags} className="mt-2.5" />
            {(project.github || project.site) && (
              <div className="mt-3 flex items-center gap-4">
                {project.github && (
                  // The hero link buttons' material, scaled down to sit under the tags.
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
                  // External project page, visible without hovering; not the /projects detail page.
                  <UnderlineLink
                    href={project.site}
                    newTab
                    ariaLabel={`${project.title} link, opens in a new tab`}
                  >
                    {SITE_LINK_LABEL}
                  </UnderlineLink>
                )}
              </div>
            )}
            {showWriteUps && (
              <p className="mt-3">
                <UnderlineLink href={`/projects/${project.slug}`}>view project →</UnderlineLink>
              </p>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

/** Screenshot with the focus pull: blur(5px) brightness(1.15) → sharp over 800ms, after `delayMs`.
 *  Click it to see it large (ScreenshotViewer). */
function ProjectImage({
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
  const size = "w-50 max-w-full flex-none rounded-lg max-sm:w-full";
  const style = { transitionDelay: `${delayMs}ms` };
  const focusPull = `aspect-[16/10] rounded-lg transition-[filter] duration-800 ease-[ease] motion-reduce:transition-none ${
    focused ? "filter-none" : "blur-[5px] brightness-115"
  }`;

  if (project.image.src) {
    return (
      <ScreenshotViewer src={project.image.src} alt={project.image.alt} className={size}>
        <Image
          src={project.image.src}
          alt={project.image.alt}
          width={400}
          height={250}
          style={style}
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
      style={{ ...style, background: PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length] }}
      className={`grid place-items-center text-[12px] ${size} ${focusPull}`}
    >
      [screenshot]
    </div>
  );
}
