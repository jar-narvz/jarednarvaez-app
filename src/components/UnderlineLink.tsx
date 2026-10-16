import Link from "next/link";

// The site's text link (docs/visual-system.md → Color): accent text with a Sun gold underline.
// Used for "view project →", "all projects →", "open the scrapbook →" and connect's links.
export default function UnderlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="border-b border-underline pb-px text-[15px] font-medium text-accent">
      {children}
    </Link>
  );
}
