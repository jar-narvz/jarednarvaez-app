import Hero from "@/components/Hero";
import Nav from "@/components/Nav";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        {/* TEMP spacer: keeps the page long enough for the sky to reach night while the
            later sections don't exist yet. Shrink it as sections land; remove by step 13. */}
        <div aria-hidden="true" className="h-[300vh]" />
      </main>
    </>
  );
}
