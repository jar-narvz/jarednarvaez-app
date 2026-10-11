// TEMP test content for step 2 (fonts and colors). Replaced by the hero in step 7.
// Sizes borrow from the hero spec: name 72px, hero line 18px, 96px left margin.
export default function Home() {
  return (
    <main className="p-24">
      <h1 className="font-serif text-[72px] leading-[0.95] tracking-[-0.045em]">
        [test heading] <em>italic</em>
      </h1>
      <p className="mt-6 text-[18px]">[test paragraph]</p>
      <p className="mt-2 text-[14px] text-accent">[test accent line]</p>
    </main>
  );
}
