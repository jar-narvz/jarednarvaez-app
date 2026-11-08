import Link from "next/link";

// The "jn" mark (docs/visual-system.md → Subpages → Mark, decided 2026-10-30): top left on every
// page, linking home. Newsreader 20px, lowercase, both letters upright (matching the favicon,
// 2026-11-07), at the nav links' 82% ink (full ink on hover) with the plum text shadow. On the home
// page it's an in-page link back to the top; on subpages it goes to the home page.

export default function Monogram({ href, onClick }: { href: "#" | "/"; onClick?: () => void }) {
  const props = {
    "aria-label": "jared narvaez, home",
    onClick,
    className:
      "pointer-events-auto font-serif text-[20px] leading-none font-normal tracking-[-0.03em] text-ink/82 [text-shadow:var(--text-shadow)] transition-colors hover:text-ink",
  };
  const mark = "jn";
  return href === "#" ? (
    <a href="#" {...props}>
      {mark}
    </a>
  ) : (
    <Link href="/" {...props}>
      {mark}
    </Link>
  );
}
