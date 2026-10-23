"use client";

import { useEffect, useRef, useState } from "react";
import SectionHeading from "@/components/SectionHeading";
import SectionLabel from "@/components/SectionLabel";
import StarHint from "@/components/StarHint";
import StarLabel from "@/components/StarLabel";
import { connect } from "@/data/connect";
import { links } from "@/data/links";

// Connect (docs/visual-system.md → Connect): the contact block plus leave a star. The last
// section: at least one screen tall, so the bottom of the scroll, which is full night, lands on
// it. The block sits left on the vignette: label → heading → line → email with a "copy" pill →
// LinkedIn · GitHub · Résumé. The open sky around it shows visitor stars' labels on hover
// (StarLabel; never over the block), with the hint bottom right (StarHint). Placing a star comes
// with leave a star part 4. Layout values follow docs/reference/home-mockup.html. The footer line
// sits under it, so its height comes off the screen here and the two share the last screen.

/** How long the pill says "copied" (Motion inventory: instant swap, 1.4s). */
const COPIED_MS = 1400;

const CONTACT_LINKS = [
  { label: "LinkedIn", href: links.linkedin },
  { label: "GitHub", href: links.github },
  { label: "Résumé", href: links.resume },
];

export default function Connect() {
  const sectionRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-[calc(100svh-var(--footer-height))] items-center pl-(--content-l) pr-(--content-r) [text-shadow:var(--text-shadow)]"
    >
      <div ref={blockRef} className="w-[min(320px,100%)]">
        <SectionLabel>{connect.label}</SectionLabel>
        <SectionHeading>{connect.heading}</SectionHeading>
        <p className="mt-2.5 text-[17px] text-ink/88">{connect.line}</p>

        <p className="mt-4.5 flex flex-wrap items-center gap-2.5 text-[17px] font-medium">
          <span id="contact-email">{links.email}</span>
          <CopyPill text={links.email} targetId="contact-email" />
        </p>

        <ul role="list" className="mt-3.5 flex gap-4 text-[14px]">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                // External destinations open in a new tab; "#" placeholders stay put.
                {...(link.href.startsWith("#") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className="border-b border-underline pb-px"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <StarLabel sectionRef={sectionRef} blockRef={blockRef} />
      <StarHint />
    </section>
  );
}

/** "copy" pill: copies the email, says "copied" for 1.4s. If the clipboard is blocked, it selects
 *  the address instead and says "selected". A hidden live region announces the result. */
function CopyPill({ text, targetId }: { text: string; targetId: string }) {
  const [status, setStatus] = useState<"copy" | "copied" | "selected">("copy");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
    } catch {
      const el = document.getElementById(targetId);
      const selection = window.getSelection();
      if (el && selection) {
        const range = document.createRange();
        range.selectNodeContents(el);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setStatus("selected");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("copy"), COPIED_MS);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label="Copy email address"
        className="cursor-pointer rounded-full border border-underline/50 bg-tint/30 px-2.5 py-0.75 text-[12px] font-normal text-accent"
      >
        {status}
      </button>
      <span role="status" className="sr-only">
        {status === "copied" ? "Email address copied" : status === "selected" ? "Email address selected" : ""}
      </span>
    </>
  );
}
