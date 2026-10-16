// The Newsreader heading under each section label (~40px, from docs/reference/home-mockup.html).
export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-1.5 font-serif text-[clamp(32px,4vw,40px)] leading-[1.1] font-normal tracking-[-0.02em] text-balance">
      {children}
    </h2>
  );
}
