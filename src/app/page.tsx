import Connect from "@/components/Connect";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Nav from "@/components/Nav";
import Projects from "@/components/Projects";
import SectionDivider from "@/components/SectionDivider";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <>
      <Nav />
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
