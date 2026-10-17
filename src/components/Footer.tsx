// The footer (docs/visual-system.md → Footer): one plain line under connect at full night,
// left-aligned on the side margin with the contact block, 28px from the bottom plus the safe-area
// inset. 12px Schibsted, ~60% cream, plum text shadow. Static; keeps the bottom-right corner clear
// for the leave-a-star hint. Its height is --footer-height (globals.css), which Connect subtracts.
export default function Footer() {
  return (
    <footer className="h-(--footer-height) px-(--margin) text-[12px] leading-5 text-ink/60 [text-shadow:var(--text-shadow)]">
      designed and built by Jared Narvaez
    </footer>
  );
}
