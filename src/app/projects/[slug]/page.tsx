import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STORIES } from "@/content/projects";
import { projects } from "@/data/projects";
import { readingMinutes, storyMeta, storySlugs } from "@/lib/story";
import StoryPage from "./StoryPage";

// /projects/[slug] (docs/superpowers/specs/2026-11-08-project-detail-pages-design.md): a project's
// story as an MDX essay. Drafts (story.published false) render in dev only; in production only
// published stories are shown and every other slug is a 404. cacheComponents rejects both
// `dynamicParams = false` and an empty generateStaticParams (all four are drafts for now), so every
// story slug is prerendered and the page itself calls notFound() for drafts in production and for
// any slug outside the list.
// `ensureStatic = "navigation"` makes an unlisted slug's first request wait for the whole page, so
// notFound() runs before anything streams and the response is a real 404 (without it the static
// shell is sent first and /projects/nope came back 200 with a noindex not-found page).
export const ensureStatic = "navigation";

// `instant = false`: navigations into this page may block until it resolves. The page awaits
// `params` outside <Suspense>, which dev validation flags (instant-shell-url-data). The usual fix,
// a <Suspense> fallback around the params read, doesn't fit here: every real essay is prerendered
// whole (generateStaticParams + "use cache"), so a fallback would only ever show for unknown slugs,
// and streaming one would send the 200 shell before notFound() and lose the real 404. Blocking is
// the behavior we want, so this declares it instead of working around it.
export const instant = false;

const includeDrafts = process.env.NODE_ENV !== "production";

export function generateStaticParams() {
  return storySlugs(true).map((slug) => ({ slug }));
}

type Props = { params: Promise<{ slug: string }> };

const findProject = (slug: string) => projects.find((p) => p.slug === slug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  // Title lowercase like the other subpages'.
  const title = `${project.title.toLowerCase()} · jared narvaez`;
  return { title, openGraph: { title }, twitter: { title } };
}

/** Reading time from the essay's MDX source; cached, since cacheComponents rejects uncached I/O. */
async function storyMinutes(slug: string): Promise<number> {
  "use cache";
  const source = await readFile(path.join(process.cwd(), "src/content/projects", `${slug}.mdx`), "utf8");
  return readingMinutes(source);
}

export default async function ProjectStory({ params }: Props) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project || !storySlugs(includeDrafts).includes(slug) || !STORIES[slug]) notFound();

  const { default: Essay } = await STORIES[slug]();
  const minutes = await storyMinutes(slug);

  return (
    <StoryPage project={project} meta={storyMeta(project, minutes)}>
      <Essay />
    </StoryPage>
  );
}
