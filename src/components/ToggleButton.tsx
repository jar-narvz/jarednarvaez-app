// The round "+" toggle shared by experience and projects (docs/visual-system.md → Experience →
// Layout): a 30px circle with a 1px ink border at 45% and a 12px "+" of two 1.3px strokes. Open, it
// rotates 45° into "×" (400ms, slight overshoot) and the border turns accent. An invisible ring
// widens the tap area to 44px while the circle stays 30px. The ring is placed from inside the 1px
// border, so it takes 8px each side to reach 44px (28 + 16), and reaches 7px past the circle.
export default function ToggleButton({
  open,
  controls,
  label,
  onClick,
}: {
  open: boolean;
  /** id of the region this button opens. */
  controls: string;
  /** What it shows, completing "Show …" / "Hide …". */
  label: string;
  /** Optional when a parent element handles the click (role rows and section headers toggle from
   *  anywhere on them). */
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={`${open ? "Hide" : "Show"} ${label}`}
      onClick={onClick}
      className={`relative grid size-7.5 flex-none cursor-pointer place-items-center rounded-full border text-ink [transition:rotate_400ms_cubic-bezier(.3,1.4,.5,1),border-color_300ms_ease] after:absolute after:-inset-2 motion-reduce:transition-none ${
        open ? "rotate-45 border-accent" : "border-ink/45"
      }`}
    >
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
        <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.3" fill="none" />
      </svg>
    </button>
  );
}
