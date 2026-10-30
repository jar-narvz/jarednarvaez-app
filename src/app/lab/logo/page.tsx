import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Connect from "@/components/Connect";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import SectionDivider from "@/components/SectionDivider";
import TechStack from "@/components/TechStack";
import LogoLab from "./LogoLab";

// Dev-only page for the "jn" monogram (2026-10-30): the real home page with the mark at top left
// and a panel for its size and strength. Returns 404 in production so it never goes live. Delete
// once Jared picks the mark and it's built into the nav.
export const metadata: Metadata = {
  title: "lab · logo",
  robots: { index: false, follow: false },
};

export default function LogoLabPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <>
      <Nav />
      <LogoLab />
      <main>
        <Hero />
        <Intro />
        <TechStack />
        <SectionDivider wide />
        <Experience />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Connect />
      </main>
      <Footer />
    </>
  );
}
