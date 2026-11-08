// Projects content (docs/visual-system.md → Projects → Data shape). One list feeds both the home
// page (featured only, by `order`) and /projects (all, in list order: strongest first within each
// group, decided 2026-10-30). Copy from docs/content.md → Projects and More projects.

// A project's detail page (/projects/[slug]). `published` gates the link to it; the page itself
// can exist as a draft first.
export type Story = {
  published: boolean;
  intro: string; // one line under the title
  image?: { src: string; alt: string }; // page header image, in place of `image`
};

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
  demo?: { src: string; poster: string; alt: string }; // /projects card: a GIF that loops while on screen, in place of `image`
  github?: string; // repo link, shown as an icon when the project is open
  site?: string; // external page (project page, live demo, live site), shown as SITE_LINK_LABEL beside the GitHub icon
  featured?: boolean; // shown on the home page (2: Posting Triage and route-impact, decided 2026-10-30)
  order?: number; // home page order
  story?: Story; // detail page at /projects/[slug]
};

export type ProjectGroup = "personal" | "coursework & clubs";

/** /projects groups, in page order. */
export const PROJECT_GROUPS: ProjectGroup[] = ["personal", "coursework & clubs"];

// "all projects →" under the home projects list links to /projects (on since 2026-10-30, when
// /projects was built). Cards link to /projects/[slug] once that project's `story.published`
// is true.
export const showAllProjectsLink = true;

// The one label for every external link, on the home page and /projects (Jared, 2026-11-06: a
// general word, so it fits a project page, a live demo and a live site alike).
export const SITE_LINK_LABEL = "visit →";

// Screenshots are 16:10 images in public/.
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
    demo: {
      src: "/posting-triage-demo.gif",
      poster: "/posting-triage-demo-poster.png",
      alt: "Terminal demo: Posting Triage sorts four job postings into APPLY, FLAG, SKIP and DEAD.",
    },
    github: "https://github.com/jar-narvz/posting-triage",
    site: "https://jar-narvz.github.io/posting-triage/",
    featured: true,
    order: 1,
    story: {
      published: false,
      intro: "[intro line: where to go for how it works, trying it and the numbers; this page is the story]",
    },
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
      src: "/route-impact.png",
      alt: "The route-impact fault playground: a dark map of the Bay Area with the Bay Bridge broken in red and rerouted trips in white, beside a panel reading 2 broken, 169 slowed, +2,859 added minutes.",
    },
    github: "https://github.com/jar-narvz/route-impact",
    site: "https://jar-narvz.github.io/route-impact/site/playground/",
    featured: true,
    order: 2,
    story: {
      published: false,
      intro: "[intro line: where to go for how it works, trying it and the numbers; this page is the story]",
    },
  },
  {
    slug: "secure-file-sharing",
    title: "Secure File Sharing System",
    type: "Class project",
    year: "2025",
    group: "coursework & clubs",
    classLabel: "CS 161",
    term: "Fall 2025",
    summary:
      "An encrypted file store in Go that stays safe on an untrusted server, with sharing, revocation and fast appends.",
    tags: ["Go", "AES-CTR", "HMAC", "RSA"],
    image: {
      src: "/secure-file-sharing.png",
      alt: "Flowchart of the secure file sharing system: logging in, storing and loading encrypted chunks, then sharing a file and removing access",
    },
    story: {
      published: false,
      intro: "[intro line: what this page is]",
    },
  },
  {
    slug: "character-gpt",
    title: "Character-Level GPT",
    type: "Class project",
    year: "2026",
    group: "coursework & clubs",
    classLabel: "CS 188",
    term: "Spring 2026",
    summary:
      "Neural nets in PyTorch, from 97%+ MNIST to an RNN language ID and a transformer that writes Shakespeare.",
    tags: ["Python", "PyTorch", "Transformers"],
    image: {
      src: "/character-gpt.png",
      alt: "Flowchart of the character-level GPT: training data, the transformer model, then sampling, with a line of generated text from iteration 9,900",
    },
    story: {
      published: false,
      intro: "[intro line: what this page is]",
    },
  },
  // The rest of /projects, from docs/content.md → More projects, plus a closing period on each
  // summary (Jared, 2026-11-06). Cards without an image show the [screenshot] placeholder.
  {
    slug: "reliable-transport",
    title: "Reliable Transport (TCP)",
    group: "coursework & clubs",
    classLabel: "CS 168",
    term: "Spring 2026",
    summary:
      "A subset of TCP: handshake, sliding window, out-of-order reassembly, teardown and RFC 6298 retransmission timers.",
    tags: ["Python", "TCP"],
    image: {
      src: "/reliable-transport.png",
      alt: "Flowchart of the TCP implementation: connect and send within the window, receive in order, then retransmit on timeout and close",
    },
  },
  {
    slug: "rl-agents",
    title: "Reinforcement Learning Agents",
    group: "coursework & clubs",
    classLabel: "CS 188",
    term: "Spring 2026",
    summary:
      "Value iteration and Q-learning agents that learn Gridworld, a crawler robot and Pacman, which wins after 50 episodes.",
    tags: ["Python", "Q-learning", "MDPs"],
    image: { src: "/rl-agents-demo-poster.png", alt: "Pacman playing a mediumClassic maze after training" },
    demo: {
      // Recorded from the running project: Q-learning on MazeGrid, then Pacman after 50 training
      // episodes (the spec's ApproximateQAgent command; 55 of 60 test games won across 6 seeds).
      src: "/rl-agents-demo.gif",
      poster: "/rl-agents-demo-poster.png",
      alt: "Demo: a Q-learning agent fills in a maze's Q-values, then a trained Pacman clears a maze and wins.",
    },
  },
  {
    slug: "risc-v-cpu",
    title: "RISC-V CPU",
    group: "coursework & clubs",
    classLabel: "CS 61C",
    term: "Spring 2025",
    summary:
      "A CPU that runs real RISC-V instructions, built in Logisim from the ALU, register file, immediate generator and control logic.",
    tags: ["Logisim", "RISC-V"],
    image: {
      src: "/risc-v-cpu.png",
      alt: "Flowchart of the two-stage RISC-V CPU: fetch, then decode and execute, then memory and writeback",
    },
  },
  {
    slug: "build-your-own-world",
    title: "Build Your Own World",
    group: "coursework & clubs",
    classLabel: "CS 61B",
    term: "Spring 2024",
    summary:
      "A tile-based exploration game in Java: seeded rooms and hallways, a playable avatar, save/load and custom tile art.",
    tags: ["Java", "Procedural generation"],
    image: {
      src: "/build-your-own-world.png",
      alt: "A generated world from the game: brown rooms and hallways with textured walls, and the yellow star avatar",
    },
  },
  {
    slug: "pasae-website",
    title: "PASAE Website",
    group: "coursework & clubs",
    classLabel: "PASAE (Webmaster)",
    term: "2024–2025",
    summary:
      "Updated the homepage, events, core team and archive pages of PASAE's public site, pasae.berkeley.edu.",
    tags: ["HTML", "SCSS", "JavaScript", "PHP"],
    image: {
      src: "/pasae-website.jpg",
      alt: "The PASAE website's home page: the navigation over a group photo of members on the UC Berkeley campus",
    },
    site: "https://pasae.berkeley.edu/",
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
