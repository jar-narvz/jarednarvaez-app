"use client";

import { useEffect, useRef } from "react";
import ContactBlock from "@/components/ContactBlock";
import StarHint from "@/components/StarHint";
import StarLabel from "@/components/StarLabel";
import YouLabel from "@/components/YouLabel";
import { keepStarsOut } from "@/lib/sky/starless";

// Connect (docs/visual-system.md → Connect): the contact block (ContactBlock, shared with the
// subpages) plus leave a star. The last section: at least one screen tall, so the bottom of the
// scroll, which is full night, lands on it. The block sits left on the vignette. On the open sky
// around it visitors hover stars for their labels and click to leave their own (StarLabel; never
// over the block), which gets a "you" label (YouLabel), with the hint bottom right (StarHint).
// The footer line sits under it, so its height comes off the screen here and the two share the
// last screen.

export default function Connect() {
  const sectionRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);

  // No white stars behind the contact block, where they'd read as bits of letters.
  useEffect(() => {
    if (blockRef.current) return keepStarsOut(blockRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-[calc(100svh-var(--footer-height))] items-center pl-(--content-l) pr-(--content-r) [text-shadow:var(--text-shadow)]"
    >
      <ContactBlock ref={blockRef} />
      <StarLabel sectionRef={sectionRef} blockRef={blockRef} />
      <YouLabel sectionRef={sectionRef} />
      <StarHint />
    </section>
  );
}
