// Tech stack content (docs/visual-system.md → Tech stack section; copy from docs/content.md →
// Tech stack). Each name has a logo in src/icons/techLogos.ts.

import type { TechName } from "@/icons/techLogos";

export type TechRow = {
  name: string;
  items: TechName[];
  speed: number; // px per second, so the loop time follows the row's length
};

export const techStack = {
  label: "tech stack",
  heading: "my stack",
  line: "languages and frameworks i use to design and build frontend, backend, ml/ai and fullstack",
  rows: [
    {
      name: "languages",
      items: ["Python", "Java", "Go", "TypeScript", "C", "C++", "SQL", "RISC-V Assembly"],
      speed: 26,
    },
    {
      name: "frameworks and tools",
      items: ["React", "Next.js", "Node.js", "Figma", "PyTorch", "scikit-learn", "NumPy", "Pandas"],
      speed: 23,
    },
  ] satisfies TechRow[],
};
