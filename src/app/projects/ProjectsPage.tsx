"use client";

import ContactBlock from "@/components/ContactBlock";
import Footer from "@/components/Footer";
import ProjectCards from "@/components/ProjectCards";
import SubpageHeader from "@/components/SubpageHeader";
import SubpageSky, { useSubpageDark } from "@/components/SubpageSky";
import { projects, projectsByGroup } from "@/data/projects";
import { TEAL_SEA } from "@/lib/sky/subpagePalettes";

// The /projects page: the subpage header, the heading with the project count, the two groups of
// cards, then the shared contact block and the footer (docs/visual-system.md → Subpages). Teal sea
// in its dark or light version: the visitor's home page choice, else the device's, until they flip
// it with the header's toggle. Spacing is the lab mockup's, which Jared approved.
/** "coursework & clubs" → "group-coursework-clubs", for the heading's id. */
const groupId = (name: string) => `group-${name.replace(/[^a-z0-9]+/g, "-")}`;

export default function ProjectsPage() {
  const [dark, flip] = useSubpageDark();

  return (
    <>
      <SubpageSky palette={TEAL_SEA} dark={dark} />
      <SubpageHeader dark={dark} onFlip={flip} />

      <main className="pr-(--content-r) pl-(--content-l) pt-24 [text-shadow:var(--text-shadow)]">
        <h1 className="font-serif text-[clamp(32px,4vw,40px)] leading-[1.1] font-normal tracking-[-0.02em]">
          my projects
        </h1>
        <p className="mt-2 text-[15px] text-ink/80">{projects.length} projects</p>

        {projectsByGroup().map((group) => (
          <section key={group.name} aria-labelledby={groupId(group.name)} className="mt-12">
            <h2
              id={groupId(group.name)}
              className="flex items-baseline gap-2 border-b border-ink/22 pb-2 text-[13px] text-ink/70"
            >
              <span className="text-[15px] font-medium text-ink">{group.name}</span>
              {group.projects.length}
            </h2>
            <ProjectCards projects={group.projects} />
          </section>
        ))}

        {/* The home page's contact block, at normal section spacing (no leave a star), under a
            full-width rule like the group headings' (decided 2026-10-30), with the section gap on
            both sides of the rule. */}
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
