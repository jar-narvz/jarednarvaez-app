// Projects content (docs/visual-system.md → Projects → Data shape). One list feeds both the home
// page (featured only, by `order`) and, after launch, /projects (all). Copy from docs/content.md →
// Projects; the rest of the list ("More projects") joins when /projects is built.

export type Project = {
  slug: string; // detail page: /projects/[slug] (MDX)
  title: string;
  type: string; // "Class project", "Game dev", "Web" ...
  year: string;
  summary: string; // 1–2 lines
  tags: string[]; // tech used
  image: { src: string; alt: string }; // 16:10 screenshot; src is a path under /public
  featured?: boolean; // shown on the home page (2 for the MVP)
  order?: number; // home page order
};

// MVP: /projects and the detail pages aren't designed yet, so "view project →" and
// "all projects →" stay hidden. Flip this once those pages exist.
export const showProjectPages = false;

// Screenshots are 16:10 PNGs (1600×1000) in public/.
export const projects: Project[] = [
  {
    slug: "secure-file-sharing",
    title: "Secure File Sharing System",
    type: "Class project",
    year: "2025",
    summary:
      "An encrypted file store in Go that stays safe on an untrusted server, with sharing, revocation and fast appends",
    tags: ["Go", "AES-CTR", "HMAC", "RSA"],
    image: {
      src: "/secure-file-sharing.png",
      alt: "Flowchart of the secure file sharing system: user authentication, encrypted file storage as chunks, and sharing and revocation",
    },
    featured: true,
    order: 1,
  },
  {
    slug: "character-gpt",
    title: "Character-Level GPT",
    type: "Class project",
    year: "2026",
    summary:
      "Neural nets in PyTorch, from 97%+ MNIST to an RNN language ID and a transformer that writes Shakespeare",
    tags: ["Python", "PyTorch", "Transformers"],
    image: {
      src: "/character-gpt.png",
      alt: "Flowchart of the character-level GPT: training data, transformer model and sampling, with generated text at iteration 0 and 9,900",
    },
    featured: true,
    order: 2,
  },
];

export const projectsSection = {
  label: "projects",
  heading: "what i've made",
};

/** The home page's projects: featured only, in `order`. */
export function featuredProjects() {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
}
