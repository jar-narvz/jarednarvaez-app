import Sparkle from "@/components/Sparkle";

// The small lowercase label that opens each section after the hero ("about", "tech stack", …):
// a still sparkle + 13px text in the accent color. Only the hero's sparkle twinkles
// (decided 2026-10-16), so labels stay calm.
export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-2 text-[13px] tracking-[0.02em] text-accent">
      <Sparkle />
      {children}
    </p>
  );
}
