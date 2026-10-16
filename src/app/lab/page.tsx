import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BeyondCodeLab from "./BeyondCodeLab";

// Dev-only tuning page for the parked beyond code section (2026-10-16). Returns 404 in production
// so it never goes live. Delete once Jared picks values and beyond code returns to the home page.
export const metadata: Metadata = {
  title: "lab · beyond code",
  robots: { index: false, follow: false },
};

export default function LabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <BeyondCodeLab />;
}
