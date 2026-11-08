import type { MDXComponents } from "mdx/types";
import { Figure, Pair } from "@/components/StoryFigures";
import UnderlineLink from "@/components/UnderlineLink";

// The project essays' type (docs/superpowers/specs/2026-11-08-project-detail-pages-design.md →
// Layout): Newsreader section headings ~26px, Schibsted body 17px at line-height 1.7, and the
// site's text link (a new tab for external pages).
const components: MDXComponents = {
  Figure,
  Pair,
  h2: ({ children }) => (
    <h2 className="mt-12 mb-2.5 font-serif text-[26px] leading-[1.2] font-normal">{children}</h2>
  ),
  p: ({ children }) => <p className="mb-4 text-[17px] leading-[1.7]">{children}</p>,
  a: ({ href = "", children }) => (
    <UnderlineLink href={href} newTab={href.startsWith("http")}>
      {children}
    </UnderlineLink>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
