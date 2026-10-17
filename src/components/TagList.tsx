// Small tech tag pills, shared by an open project cell and an open experience role
// (docs/visual-system.md → Projects → Expanded details; Experience → Details).
export default function TagList({ tags, className = "" }: { tags: string[]; className?: string }) {
  return (
    <ul role="list" className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((tag, t) => (
        <li
          key={`${tag}-${t}`}
          className="rounded-full border border-ink/38 bg-tint/30 px-2.5 py-0.75 text-[12px]"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}
