import SectionHeading from "@/components/SectionHeading";
import SectionLabel from "@/components/SectionLabel";
import ToggleButton from "@/components/ToggleButton";

// Header for a collapsible section (experience, projects): label + heading on the left, the round
// toggle at the right end of the row, bottoms aligned. --block-w wide (the content column).
// Clicking anywhere on the row toggles, like a role row (Jared, 2026-10-19): the button has no
// handler of its own, so its click bubbles here once. The button stays the keyboard control.
export default function CollapsibleHeader({
  label,
  heading,
  open,
  controls,
  onToggle,
}: {
  label: string;
  heading: string;
  open: boolean;
  controls: string;
  onToggle: () => void;
}) {
  return (
    <div onClick={onToggle} className="flex max-w-(--block-w) cursor-pointer items-end justify-between gap-4">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <SectionHeading>{heading}</SectionHeading>
      </div>
      <ToggleButton open={open} controls={controls} label={label} />
    </div>
  );
}
