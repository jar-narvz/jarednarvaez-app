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
  github?: string; // repo link, shown as an icon when the project is open
  featured?: boolean; // shown on the home page (2 for the MVP)
  order?: number; // home page order
};

// MVP: /projects and the detail pages aren't designed yet, so "view project →" and
// "all projects →" stay hidden. Flip this once those pages exist.
export const showProjectPages = false;

// Screenshots are 16:10 PNGs (1600×1000) in public/.
export const projects: Project[] = [
  {
    // From posting-triage-site-kit (project.json → one_liner; diagrams/pipeline-dark.svg alt text).
    slug: "posting-triage",
    title: "Posting Triage",
    type: "Personal project",
    year: "2026",
    summary:
      "A tool that reads a job posting and answers APPLY, FLAG, SKIP, or DEAD, with a one-line reason quoted from the posting itself.",
    tags: ["FastAPI", "Docker", "AWS", "Claude API"],
    image: {
      src: "/posting-triage.png",
      alt: "Flowchart: posting URL, liveness check (removed → DEAD with careers page; unreadable → FLAG couldn't verify), Claude fills a form with an exact quote per field, code checks every quote is in the posting (if not, even after a retry → FLAG unless a verified field already SKIPs), then rules plus the profile give APPLY, FLAG or SKIP with the deciding quote.",
    },
    github: "https://github.com/jar-narvz/posting-triage",
    featured: true,
    order: 1,
  },
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
    order: 2,
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
    order: 3,
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
