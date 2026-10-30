import type { Metadata } from "next";
import ProjectsPage from "./ProjectsPage";

// /projects (docs/design.md → Projects page, decided 2026-10-30): every project as a grid card in
// two groups, strongest first, on the teal sea background. Title lowercase like the home page's.
const TITLE = "projects · jared narvaez";

export const metadata: Metadata = {
  title: TITLE,
  openGraph: { title: TITLE },
  twitter: { title: TITLE },
};

export default function Projects() {
  return <ProjectsPage />;
}
