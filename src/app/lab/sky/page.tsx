import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Home from "@/app/page";
import SkyLab from "./SkyLab";

// Dev-only page for sky modes part 2 (2026-10-20): the home page with the sky held at any hour,
// to check the 24-hour sky (and the day text theme in part 3). Returns 404 in production
// so it never goes live. Delete once part 4's dial can set the hour on the real page.
export const metadata: Metadata = {
  title: "lab · 24-hour sky",
  robots: { index: false, follow: false },
};

export default function SkyLabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <Home />
      <SkyLab />
    </>
  );
}
