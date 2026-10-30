// Lab-only (2026-10-30): the 10 projects for the /projects mockup, in Jared's groups and the
// draft strength order he approved. The four home projects come from src/data/projects.ts; the
// other six are copied word for word from docs/content.md → More projects.

import { projects } from "@/data/projects";

export type LabProject = {
  title: string;
  meta: string; // type or class · term
  summary: string;
  tags: string[];
  image?: { src: string; alt: string };
  github?: string;
  site?: string;
};

function home(slug: string): LabProject {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`no project ${slug}`);
  const classes: Record<string, string> = { "secure-file-sharing": "CS 161", "character-gpt": "CS 188" };
  return {
    title: p.title,
    meta: `${classes[slug] ?? p.type} · ${p.year}`,
    summary: p.summary,
    tags: p.tags,
    image: p.image.src ? p.image : undefined,
    github: p.github,
    site: p.site,
  };
}

export const GROUPS: { name: string; projects: LabProject[] }[] = [
  { name: "personal", projects: [home("posting-triage"), home("route-impact")] },
  {
    name: "coursework & clubs",
    projects: [
      home("secure-file-sharing"),
      home("character-gpt"),
      {
        title: "Reliable Transport (TCP)",
        meta: "CS 168 · Spring 2026",
        summary:
          "A subset of TCP: handshake, sliding window, out-of-order reassembly, teardown and RFC 6298 retransmission timers",
        tags: ["Python", "TCP"],
      },
      {
        title: "Reinforcement Learning Agents",
        meta: "CS 188 · Spring 2026",
        summary:
          "Value iteration and Q-learning agents that learn Gridworld, a crawler robot and Pacman, which wins after 50 episodes",
        tags: ["Python", "Q-learning", "MDPs"],
      },
      {
        title: "RISC-V CPU",
        meta: "CS 61C · Spring 2025",
        summary:
          "A CPU that runs real RISC-V instructions, built in Logisim from the ALU, register file, immediate generator and control logic",
        tags: ["Logisim", "RISC-V"],
      },
      {
        title: "Build Your Own World",
        meta: "CS 61B · Spring 2024",
        summary:
          "A tile-based exploration game in Java: seeded rooms and hallways, a playable avatar, save/load and custom tile art",
        tags: ["Java", "Procedural generation"],
      },
      {
        title: "Neural Net Classifier in Assembly",
        meta: "CS 61C · Spring 2025",
        summary:
          "A neural-net classifier in RISC-V assembly: matrix multiply, ReLU, argmax and matrix file I/O written by hand",
        tags: ["RISC-V Assembly"],
      },
      {
        title: "PASAE Website",
        meta: "PASAE (Webmaster) · 2024–2025",
        summary:
          "Updated the homepage, events, core team and archive pages of PASAE's public site, pasae.berkeley.edu",
        tags: ["HTML", "SCSS", "JavaScript", "PHP"],
      },
    ],
  },
];
