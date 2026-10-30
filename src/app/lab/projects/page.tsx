import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectsLab from "./ProjectsLab";

// Dev-only page for choosing the /projects background (2026-10-30). Returns 404 in production so
// it never goes live. Delete once Jared picks a background and /projects is built.
export const metadata: Metadata = {
  title: "lab · projects",
  robots: { index: false, follow: false },
};

export default function ProjectsLabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <ProjectsLab />;
}
