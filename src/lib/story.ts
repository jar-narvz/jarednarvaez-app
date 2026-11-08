import { projects, type Project } from "../data/projects";

const WORDS_PER_MINUTE = 200;

/** Reading time for an MDX body: JSX tags are stripped first, since attributes aren't read. */
export function readingMinutes(text: string): number {
  const words = text
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

/** The meta line under a story title. Personal: "personal · 2026"; coursework: "CS 161 · Fall 2025". */
export function storyMeta(p: Project, minutes: number): string {
  const lead =
    p.group === "personal" ? `personal · ${p.year}` : `${p.classLabel} · ${p.term}`;
  return `${lead} · ${minutes} min read`;
}

/** Slugs of projects that have a story, in list order; drafts only when asked for. */
export function storySlugs(includeDrafts: boolean): string[] {
  return projects
    .filter((p) => p.story && (includeDrafts || p.story.published))
    .map((p) => p.slug);
}

/** True when other pages should link to the story (only published ones). */
export function isLinkedStory(p: Project): boolean {
  return p.story?.published === true;
}

export function storyImage(p: Project): { src: string; alt: string } {
  return p.story?.image ?? p.image;
}
