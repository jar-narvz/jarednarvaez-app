// The four-point sparkle (docs/visual-system.md → Color): 12px, Sun gold by default. The hero's
// "currently" line twinkles it; section labels use it still. Timeline stars pass their own classes
// (accent fill, opacity, glow) in `className`, which replaces the default color.
export default function Sparkle({
  twinkle = false,
  className = "text-sun-gold",
}: {
  twinkle?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="-7 -7 14 14"
      width="12"
      height="12"
      className={`block flex-none ${className} ${twinkle ? "animate-twinkle" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M0,-6.5C.9,-1 1,-1 6.5,0C1,1 .9,.9 0,6.5C-.9,1 -1,1 -6.5,0C-1,-1 -.9,-.9 0,-6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
