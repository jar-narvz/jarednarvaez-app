// Projects content (docs/visual-system.md → Projects → Data shape). One list feeds both the home
// page (featured only, by `order`) and /projects (all, in list order: strongest first within each
// group, decided 2026-10-30). Copy from docs/content.md → Projects and More projects.

export type Project = {
  slug: string; // detail page: /projects/[slug] (MDX)
  title: string;
  type?: string; // home page row: "Class project", "Personal project" ... (featured projects)
  year?: string; // home page row
  group: ProjectGroup; // /projects group
  classLabel?: string; // /projects card: the class or club, e.g. "CS 161" (else `type`)
  term?: string; // /projects card: e.g. "Spring 2026" (else `year`)
  summary: string; // 1–2 lines
  tags: string[]; // tech used
  image: { src: string; alt: string }; // 16:10 screenshot; src is a path under /public
  github?: string; // repo link, shown as an icon when the project is open
  site?: string; // external project page, shown as "project page →" beside the GitHub icon
  featured?: boolean; // shown on the home page (2: Posting Triage and route-impact, decided 2026-10-30)
  order?: number; // home page order
};

export type ProjectGroup = "personal" | "coursework & clubs";

/** /projects groups, in page order. */
export const PROJECT_GROUPS: ProjectGroup[] = ["personal", "coursework & clubs"];

// "all projects →" under the home projects list links to /projects (on since 2026-10-30, when
// /projects was built); "view project →" stays hidden until a write-up exists (Secure File
// Sharing and Character-Level GPT, later).
export const showAllProjectsLink = true;
export const showWriteUps = false;

// Screenshots are 16:10 PNGs (1600×1000) in public/.
export const projects: Project[] = [
  {
    // Summary matches the project page (site); image alt from posting-triage-site-kit
    // (diagrams/pipeline-dark.svg alt text).
    slug: "posting-triage",
    title: "Posting Triage",
    type: "Personal project",
    year: "2026",
    group: "personal",
    summary:
      "Reads a job posting and answers APPLY, FLAG, SKIP, or DEAD, with the line from the posting that decided it.",
    tags: ["FastAPI", "Docker", "AWS", "Claude API"],
    image: {
      src: "/posting-triage.png",
      alt: "Flowchart: posting URL, liveness check (removed → DEAD with careers page; unreadable → FLAG couldn't verify), Claude fills a form with an exact quote per field, code checks every quote is in the posting (if not, even after a retry → FLAG unless a verified field already SKIPs), then rules plus the profile give APPLY, FLAG or SKIP with the deciding quote.",
    },
    github: "https://github.com/jar-narvz/posting-triage",
    site: "https://jar-narvz.github.io/posting-triage/",
    featured: true,
    order: 1,
  },
  {
    // Summary from the route-impact README's one-liner; tags from the v3.5 résumé.
    slug: "route-impact",
    title: "OpenStreetMap Route-Impact Pipeline",
    type: "Personal project",
    year: "2026",
    group: "personal",
    summary: "Measures how a day of OpenStreetMap edits changes navigation in Northern California.",
    tags: ["Python", "DuckDB", "SQL"],
    image: {
      // [screenshot] placeholder: no image yet, so the card shows a gradient.
      src: "",
      alt: "[route-impact screenshot]",
    },
    github: "https://github.com/jar-narvz/route-impact",
    featured: true,
    order: 2,
  },
  {
    slug: "secure-file-sharing",
    title: "Secure File Sharing System",
    type: "Class project",
    year: "2025",
    group: "coursework & clubs",
    classLabel: "CS 161", // term still open (docs/design.md → still open), so the card shows the year
    summary:
      "An encrypted file store in Go that stays safe on an untrusted server, with sharing, revocation and fast appends",
    tags: ["Go", "AES-CTR", "HMAC", "RSA"],
    image: {
      src: "/secure-file-sharing.png",
      alt: "Flowchart of the secure file sharing system: user authentication, encrypted file storage as chunks, and sharing and revocation",
    },
  },
  {
    slug: "character-gpt",
    title: "Character-Level GPT",
    type: "Class project",
    year: "2026",
    group: "coursework & clubs",
    classLabel: "CS 188", // term still open, as above
    summary:
      "Neural nets in PyTorch, from 97%+ MNIST to an RNN language ID and a transformer that writes Shakespeare",
    tags: ["Python", "PyTorch", "Transformers"],
    image: {
      src: "/character-gpt.png",
      alt: "Flowchart of the character-level GPT: training data, transformer model and sampling, with generated text at iteration 0 and 9,900",
    },
  },
  // The rest of /projects, word for word from docs/content.md → More projects. No screenshots yet
  // (docs/design.md → still open), so their cards show the [screenshot] placeholder.
  {
    slug: "reliable-transport",
    title: "Reliable Transport (TCP)",
    group: "coursework & clubs",
    classLabel: "CS 168",
    term: "Spring 2026",
    summary:
      "A subset of TCP: handshake, sliding window, out-of-order reassembly, teardown and RFC 6298 retransmission timers",
    tags: ["Python", "TCP"],
    image: { src: "", alt: "[Reliable Transport (TCP) screenshot]" },
  },
  {
    slug: "rl-agents",
    title: "Reinforcement Learning Agents",
    group: "coursework & clubs",
    classLabel: "CS 188",
    term: "Spring 2026",
    summary:
      "Value iteration and Q-learning agents that learn Gridworld, a crawler robot and Pacman, which wins after 50 episodes",
    tags: ["Python", "Q-learning", "MDPs"],
    image: { src: "", alt: "[Reinforcement Learning Agents screenshot]" },
  },
  {
    slug: "risc-v-cpu",
    title: "RISC-V CPU",
    group: "coursework & clubs",
    classLabel: "CS 61C",
    term: "Spring 2025",
    summary:
      "A CPU that runs real RISC-V instructions, built in Logisim from the ALU, register file, immediate generator and control logic",
    tags: ["Logisim", "RISC-V"],
    image: { src: "", alt: "[RISC-V CPU screenshot]" },
  },
  {
    slug: "build-your-own-world",
    title: "Build Your Own World",
    group: "coursework & clubs",
    classLabel: "CS 61B",
    term: "Spring 2024",
    summary:
      "A tile-based exploration game in Java: seeded rooms and hallways, a playable avatar, save/load and custom tile art",
    tags: ["Java", "Procedural generation"],
    image: { src: "", alt: "[Build Your Own World screenshot]" },
  },
  {
    slug: "nn-classifier-assembly",
    title: "Neural Net Classifier in Assembly",
    group: "coursework & clubs",
    classLabel: "CS 61C",
    term: "Spring 2025",
    summary:
      "A neural-net classifier in RISC-V assembly: matrix multiply, ReLU, argmax and matrix file I/O written by hand",
    tags: ["RISC-V Assembly"],
    image: { src: "", alt: "[Neural Net Classifier in Assembly screenshot]" },
  },
  {
    slug: "pasae-website",
    title: "PASAE Website",
    group: "coursework & clubs",
    classLabel: "PASAE (Webmaster)",
    term: "2024–2025",
    summary:
      "Updated the homepage, events, core team and archive pages of PASAE's public site, pasae.berkeley.edu",
    tags: ["HTML", "SCSS", "JavaScript", "PHP"],
    image: { src: "", alt: "[PASAE Website screenshot]" },
  },
];

export const projectsSection = {
  label: "projects",
  heading: "what i've made",
};

/** /projects: every project in its group, in list order. */
export function projectsByGroup() {
  return PROJECT_GROUPS.map((name) => ({ name, projects: projects.filter((p) => p.group === name) }));
}

/** A /projects card's meta line: class · term, falling back to type · year. */
export function cardMeta(p: Project) {
  return `${p.classLabel ?? p.type} · ${p.term ?? p.year}`;
}

/** The home page's projects: featured only, in `order`. */
export function featuredProjects() {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));
}
