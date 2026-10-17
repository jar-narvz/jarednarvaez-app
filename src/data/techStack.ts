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
      items: ["Python", "Java", "Go", "TypeScript", "JavaScript", "C", "SQL", "HTML/CSS", "RISC-V Assembly"],
      speed: 26,
    },
    {
      name: "web and tools",
      items: [
        "React",
        "Next.js",
        "Tailwind CSS",
        "Node.js",
        "Figma",
        "Vercel",
        "Git",
        "GitHub",
        "VS Code",
        "IntelliJ",
        "Unreal Engine 5",
        "Wireshark",
      ],
      speed: 23,
    },
    {
      name: "ML and data",
      items: ["PyTorch", "scikit-learn", "NumPy", "Pandas", "Matplotlib", "Jupyter", "Tableau", "ArcGIS Pro"],
      speed: 25,
    },
  ] satisfies TechRow[],
};
