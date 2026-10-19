import SectionHeading from "@/components/SectionHeading";
import SectionLabel from "@/components/SectionLabel";
import ToggleButton from "@/components/ToggleButton";

// Header for a collapsible section (experience, projects): label + heading on the left, the round
// toggle at the right end of the row, bottoms aligned. 640px max, from docs/reference/home-mockup.html.
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
    <div className="flex max-w-(--block-w) items-end justify-between gap-4">
      <div>
        <SectionLabel>{label}</SectionLabel>
        <SectionHeading>{heading}</SectionHeading>
      </div>
      <ToggleButton open={open} controls={controls} label={label} onClick={onToggle} />
    </div>
  );
}
