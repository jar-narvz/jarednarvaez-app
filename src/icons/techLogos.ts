import {
  siArcgis,
  siC,
  siFigma,
  siGit,
  siGithub,
  siGo,
  siHtml5,
  siIntellijidea,
  siJavascript,
  siJupyter,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siPandas,
  siPython,
  siPytorch,
  siReact,
  siRiscv,
  siScikitlearn,
  siTailwindcss,
  siTypescript,
  siUnrealengine,
  siVercel,
  siWireshark,
  type SimpleIcon,
} from "simple-icons";
import { database, java, matplotlib, vscode, type PathIcon } from "@/icons/pathIcons";

// One logo per tech stack name (docs/visual-system.md → Tech stack → Logos): single-color, drawn
// in currentColor. Simple Icons where it has the brand, Devicon "plain" SVGs for Java, VS Code and
// Matplotlib, a generic database for SQL. `null` keeps the initials badge (Tableau has no free
// logo). The keys are the exact names on the site, so a typo in techStack.ts fails type-checking.

const si = (icon: SimpleIcon): PathIcon => ({ viewBox: "0 0 24 24", paths: [icon.path] });

export const techLogos = {
  // Languages
  Python: si(siPython),
  Java: java,
  Go: si(siGo),
  TypeScript: si(siTypescript),
  JavaScript: si(siJavascript),
  C: si(siC),
  SQL: database,
  "HTML/CSS": si(siHtml5),
  "RISC-V Assembly": si(siRiscv),
  // Web & tools
  React: si(siReact),
  "Next.js": si(siNextdotjs),
  "Tailwind CSS": si(siTailwindcss),
  "Node.js": si(siNodedotjs),
  Figma: si(siFigma),
  Vercel: si(siVercel),
  Git: si(siGit),
  GitHub: si(siGithub),
  "VS Code": vscode,
  IntelliJ: si(siIntellijidea),
  "Unreal Engine 5": si(siUnrealengine),
  Wireshark: si(siWireshark),
  // ML & data
  PyTorch: si(siPytorch),
  "scikit-learn": si(siScikitlearn),
  NumPy: si(siNumpy),
  Pandas: si(siPandas),
  Matplotlib: matplotlib,
  Jupyter: si(siJupyter),
  Tableau: null,
  "ArcGIS Pro": si(siArcgis),
} satisfies Record<string, PathIcon | null>;

export type TechName = keyof typeof techLogos;
