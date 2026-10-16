// The four-point sparkle (docs/visual-system.md → Color): Sun gold, 12px. The hero's
// "currently" line twinkles it; section labels will use it still.
export default function Sparkle({ twinkle = false }: { twinkle?: boolean }) {
  return (
    <svg
      viewBox="-7 -7 14 14"
      width="12"
      height="12"
      className={`flex-none text-sun-gold ${twinkle ? "animate-twinkle" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M0,-6.5C.9,-1 1,-1 6.5,0C1,1 .9,.9 0,6.5C-.9,1 -1,1 -6.5,0C-1,-1 -.9,-.9 0,-6.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
