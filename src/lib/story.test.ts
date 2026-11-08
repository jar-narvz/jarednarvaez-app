import { describe, expect, it } from "vitest";
import { projects, type Project } from "../data/projects";
import { isLinkedStory, readingMinutes, storyImage, storyMeta, storySlugs } from "./story";

const bySlug = (slug: string) => projects.find((p) => p.slug === slug)!;
const words = (n: number) => Array(n).fill("word").join(" ");

describe("readingMinutes", () => {
  it("is at least 1 minute, even for empty text", () => {
    expect(readingMinutes("")).toBe(1);
  });

  it("rounds up at 200 words per minute", () => {
    expect(readingMinutes(words(200))).toBe(1);
    expect(readingMinutes(words(201))).toBe(2);
  });

  it("does not count MDX/JSX tags as words", () => {
    // Only `## [why] word word` (4 tokens) counts; the <Figure ... /> tag is stripped.
    expect(readingMinutes('<Figure src="/a.png" />\n## [why]\nword word')).toBe(1);
    expect(readingMinutes(`<Figure src="/a.png" alt="many words in a tag" />\n${words(201)}`)).toBe(2);
  });
});

describe("storyMeta", () => {
  it("personal projects: personal · year · n min read", () => {
    expect(storyMeta(bySlug("posting-triage"), 3)).toBe("personal · 2026 · 3 min read");
  });

  it("coursework: class · term · n min read", () => {
    expect(storyMeta(bySlug("secure-file-sharing"), 2)).toBe("CS 161 · Fall 2025 · 2 min read");
  });
});

describe("storySlugs", () => {
  it("lists every project with a story, in list order, when drafts are included", () => {
    expect(storySlugs(true)).toEqual(["posting-triage", "route-impact", "secure-file-sharing", "character-gpt"]);
  });

  it("lists nothing while every story is unpublished", () => {
    expect(storySlugs(false)).toEqual([]);
  });
});

describe("isLinkedStory", () => {
  it("is false for the four unpublished stories", () => {
    for (const slug of storySlugs(true)) expect(isLinkedStory(bySlug(slug))).toBe(false);
  });

  it("is false for a project without a story, true once published", () => {
    const base = bySlug("rl-agents");
    expect(isLinkedStory(base)).toBe(false);
    expect(isLinkedStory({ ...base, story: { published: true, intro: "x" } })).toBe(true);
  });
});

describe("storyImage", () => {
  const p: Project = bySlug("posting-triage");

  it("uses the story's own image when set", () => {
    const image = { src: "/story.png", alt: "story" };
    expect(storyImage({ ...p, story: { published: false, intro: "x", image } })).toEqual(image);
  });

  it("falls back to the project image", () => {
    expect(storyImage(p)).toEqual(p.image);
  });
});
