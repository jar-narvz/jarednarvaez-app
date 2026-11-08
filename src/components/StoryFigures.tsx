import FocusImage from "@/components/FocusImage";

// Figures inside a project essay (MDX): one image with a caption, or the rejected/chosen pair.

type Fig = { src: string; alt: string; caption: string };

function Caption({ children }: { children: React.ReactNode }) {
  return <figcaption className="mt-1.5 text-[13px] text-ink/70">{children}</figcaption>;
}

export function Figure({ src, alt, caption }: Fig) {
  return (
    <figure className="my-6">
      <FocusImage src={src} alt={alt} />
      <Caption>{caption}</Caption>
    </figure>
  );
}

/** Rejected first in the DOM, so it stacks first on phones; it's dimmed, the chosen one is not. */
export function Pair({ rejected, chosen }: { rejected: Fig; chosen: Fig }) {
  return (
    <div className="my-6 grid gap-3.5 sm:grid-cols-2">
      <figure>
        <FocusImage src={rejected.src} alt={rejected.alt} dimmed />
        <Caption>{rejected.caption}</Caption>
      </figure>
      <figure>
        <FocusImage src={chosen.src} alt={chosen.alt} />
        <Caption>{chosen.caption}</Caption>
      </figure>
    </div>
  );
}
