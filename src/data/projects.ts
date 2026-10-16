// Projects content (docs/visual-system.md → Projects → Data shape). One list feeds both the home
// page (featured only, by `order`) and, after launch, /projects (all). Bracketed text is
// placeholder copy, written with Jared in the content pass (build step 14).

export type Project = {
  slug: string; // detail page: /projects/[slug] (MDX)
  title: string;
  type: string; // "Class project", "Game dev", "Web" ...
  year: string;
  summary: string; // 1–2 lines
  tags: string[]; // tech used
  image: { src: string; alt: string }; // 16:10 screenshot; src is a path under /public
  featured?: boolean; // shown on the home page (about 3)
  order?: number; // home page order
};

// MVP: /projects and the detail pages aren't designed yet, so "view project →" and
// "all projects →" stay hidden. Flip this once those pages exist.
export const showProjectPages = false;

// [screenshot] placeholders: an empty src shows a labeled gradient box until real
// screenshots arrive in the content pass.
export const projects: Project[] = [
  {
    slug: "project-one",
    title: "[project title]",
    type: "[type]",
    year: "[20XX]",
    summary: "[summary: what it is, what you built, what it does]",
    tags: ["[tag]", "[tag]"],
    image: { src: "", alt: "[screenshot alt]" },
    featured: true,
    order: 1,
  },
  {
    slug: "project-two",
    title: "[project title]",
    type: "[type]",
    year: "[20XX]",
    summary: "[summary: what it is, what you built, what it does]",
    tags: ["[tag]", "[tag]"],
    image: { src: "", alt: "[screenshot alt]" },
    featured: true,
    order: 2,
  },
  {
    slug: "project-three",
    title: "[project title]",
    type: "[type]",
    year: "[20XX]",
    summary: "[summary: what it is, what you built, what it does]",
    tags: ["[tag]", "[tag]"],
    image: { src: "", alt: "[screenshot alt]" },
    featured: true,
    order: 3,
  },
];

export const projectsSection = {
  label: "projects",
  heading: "[projects heading]",
};

/** The home page's projects: featured only, in `order`. */
export function featuredProjects() {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
}
