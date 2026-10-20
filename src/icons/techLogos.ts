import {
  siC,
  siCplusplus,
  siFigma,
  siGo,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siPandas,
  siPython,
  siPytorch,
  siReact,
  siRiscv,
  siScikitlearn,
  siTypescript,
  type SimpleIcon,
} from "simple-icons";
import { database, java, type PathIcon } from "@/icons/pathIcons";

// One logo per tech stack name (docs/visual-system.md → Tech stack → Logos): single-color, drawn
// in currentColor. Simple Icons where it has the brand, the Devicon "plain" SVG for Java, a generic
// database for SQL. `null` would show an initials badge for a name with no free logo. The keys are
// the exact names on the site, so a typo in techStack.ts fails type-checking.

const si = (icon: SimpleIcon): PathIcon => ({ viewBox: "0 0 24 24", paths: [icon.path] });

export const techLogos = {
  // Languages
  Python: si(siPython),
  Java: java,
  Go: si(siGo),
  TypeScript: si(siTypescript),
  C: si(siC),
  "C++": si(siCplusplus),
  SQL: database,
  "RISC-V Assembly": si(siRiscv),
  // Frameworks and tools
  React: si(siReact),
  "Next.js": si(siNextdotjs),
  "Node.js": si(siNodedotjs),
  Figma: si(siFigma),
  PyTorch: si(siPytorch),
  "scikit-learn": si(siScikitlearn),
  NumPy: si(siNumpy),
  Pandas: si(siPandas),
} satisfies Record<string, PathIcon | null>;

export type TechName = keyof typeof techLogos;
