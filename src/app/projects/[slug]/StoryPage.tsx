"use client";

import ContactBlock from "@/components/ContactBlock";
import FocusImage from "@/components/FocusImage";
import Footer from "@/components/Footer";
import SubpageHeader from "@/components/SubpageHeader";
import SubpageSky, { useSubpageDark } from "@/components/SubpageSky";
import UnderlineLink from "@/components/UnderlineLink";
import { SITE_LINK_LABEL, type Project } from "@/data/projects";
import { GithubIcon } from "@/icons/lineIcons";
import { storyImage } from "@/lib/story";
import { TEAL_SEA } from "@/lib/sky/subpagePalettes";

// A project's story page (docs/superpowers/specs/2026-11-08-project-detail-pages-design.md →
// Layout): the subpage header, "← all projects", the title in the /projects heading style, the meta
// line, the link row (only links the project has), the intro line, the lead screenshot, then the
// essay in a 680px column centered in the content column, and the subpage ending like /resume.

/** The lead screenshot: full column width, 16:10, 8px radius, focus pull, opens large on click. */
function LeadImage({ project }: { project: Project }) {
  const { src, alt } = storyImage(project);
  return <FocusImage src={src} alt={alt} priority />;
}

export default function StoryPage({
  project,
  meta,
  children,
}: {
  project: Project;
  meta: string;
  children: React.ReactNode;
}) {
  const [dark, flip] = useSubpageDark();
  const leadImage = <LeadImage project={project} />;

  return (
    <>
      <SubpageSky palette={TEAL_SEA} dark={dark} />
      <SubpageHeader dark={dark} onFlip={flip} />

      <main className="pr-(--content-r) pl-(--content-l) pt-24 [text-shadow:var(--text-shadow)]">
        <div className="mx-auto max-w-[680px]">
          {/* UnderlineLink sets 15px accent text on its <a>; the back link is 14px at 70% ink. */}
          <p className="[&>a]:text-[14px] [&>a]:text-ink/70">
            <UnderlineLink href="/projects">← all projects</UnderlineLink>
          </p>
          <h1 className="mt-2.5 font-serif text-[clamp(32px,4vw,40px)] leading-[1.1] font-normal tracking-[-0.02em]">
            {project.title}
          </h1>
          <p className="mt-2 text-[13px] text-ink/70">{meta}</p>

          {(project.github || project.site) && (
            <div className="mt-4 flex items-center gap-4">
              {project.github && (
                // The /projects cards' GitHub circle.
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

          {project.story && (
            <p className="mt-5 font-serif text-[18px] leading-[1.5] text-ink/88 italic">{project.story.intro}</p>
          )}

          <div className="mt-7">{leadImage}</div>

          <article className="mt-2">{children}</article>
        </div>

        {/* The home page's contact block under a full-width rule, spaced like /projects. */}
        <section
          id="contact"
          className="mt-[clamp(72px,12vh,140px)] border-t border-ink/22 py-[clamp(72px,12vh,140px)]"
        >
          <ContactBlock />
        </section>
      </main>
      <Footer />
    </>
  );
}
