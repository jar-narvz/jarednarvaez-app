// Height 0 ↔ auto for collapsible content. CSS can't transition to `height: auto`, but it can
// transition a grid row from 0fr to 1fr, which ends at the content's natural height. While closed,
// the content is `inert`: hidden from screen readers and skipped by Tab.
export default function Collapse({
  open,
  id,
  durationMs,
  children,
}: {
  open: boolean;
  id: string;
  durationMs: number;
  children: React.ReactNode;
}) {
  return (
    <div
      id={id}
      inert={!open}
      style={{ gridTemplateRows: open ? "1fr" : "0fr", transitionDuration: `${durationMs}ms` }}
      className="grid transition-[grid-template-rows] ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none"
    >
      {/* -mx-2 px-2 widens the clip box 8px each side without moving the content, so toggles
          flush with the column edge keep their full 44px tap ring (it reaches 7px out). */}
      <div className="-mx-2 min-h-0 overflow-hidden px-2">{children}</div>
    </div>
  );
}
