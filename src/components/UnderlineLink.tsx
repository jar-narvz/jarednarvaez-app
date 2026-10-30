import Link from "next/link";

// The site's text link (docs/visual-system.md → Color): accent text with a Sun gold underline.
// Used for "view project →", "all projects →", "open the scrapbook →" and connect's links.
// `newTab` is for external pages: a plain <a> that opens in a new tab.
export default function UnderlineLink({
  href,
  newTab,
  ariaLabel,
  children,
}: {
  href: string;
  newTab?: boolean;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  const className = "border-b border-underline pb-px text-[15px] font-medium text-accent";

  if (newTab) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ariaLabel} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={ariaLabel} className={className}>
      {children}
    </Link>
  );
}
