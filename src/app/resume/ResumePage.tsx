"use client";

import dynamic from "next/dynamic";
import ContactBlock from "@/components/ContactBlock";
import Footer from "@/components/Footer";
import SubpageHeader from "@/components/SubpageHeader";
import SubpageSky, { useSubpageDark } from "@/components/SubpageSky";
import UnderlineLink from "@/components/UnderlineLink";
import { links } from "@/data/links";
import { TEAL_SEA } from "@/lib/sky/subpagePalettes";

// The /resume page (decided 2026-11-08): the subpage header, "my résumé" with download and
// open-in-a-new-tab buttons, the PDF drawn as paper by pdf.js (option B), an "open the pdf →"
// fallback, then the shared contact block and the footer, like /projects. The heading row spans the
// content column like /projects' heading; the viewer is capped at 816px, a letter page at 100%
// (8.5in at 96px per inch), and centered in the column (Jared, 2026-11-08).

// pdf.js loads only here and only in the browser, never in the home page's bundle.
const PdfPages = dynamic(() => import("@/components/PdfPages"), { ssr: false });

const FILE = links.resumePdf;
const VIEWER_MAX = "max-w-[816px]";

/** Round icon button, styled like the GitHub circle on the project cards. */
function IconButton({
  href,
  label,
  download,
  children,
}: {
  href: string;
  label: string;
  download?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(download ? { download: "Jared-Narvaez-Resume.pdf" } : { target: "_blank", rel: "noopener noreferrer" })}
      className="flex size-9 items-center justify-center rounded-full border border-ink/38 bg-tint/34 text-ink/82 transition-colors duration-200 ease-out hover:border-accent/60 hover:text-accent motion-reduce:transition-none"
    >
      {children}
    </a>
  );
}

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const NewTabIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
    <path
      d="M9.5 2.5h4v4M13.5 2.5 7.5 8.5M12 9.5v3.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5H7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ResumePage() {
  const [dark, flip] = useSubpageDark();

  return (
    <>
      <SubpageSky palette={TEAL_SEA} dark={dark} />
      <SubpageHeader dark={dark} onFlip={flip} />

      <main className="pr-(--content-r) pl-(--content-l) pt-24 [text-shadow:var(--text-shadow)]">
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-serif text-[clamp(32px,4vw,40px)] leading-[1.1] font-normal tracking-[-0.02em]">
            my résumé
          </h1>
          <div className="flex gap-2 [text-shadow:none]">
            <IconButton href={FILE} label="Download résumé" download>
              <DownloadIcon />
            </IconButton>
            <IconButton href={FILE} label="Open résumé in a new tab">
              <NewTabIcon />
            </IconButton>
          </div>
        </div>

        <div className={`mx-auto mt-8 ${VIEWER_MAX}`}>
          <div className="[text-shadow:none]">
            <PdfPages file={FILE} />
          </div>
          <p className="mt-4">
            <UnderlineLink href={FILE} newTab>
              open the pdf →
            </UnderlineLink>
          </p>
        </div>

        {/* The home page's contact block under a full-width rule, spaced like /projects. */}
        <section
          id="contact"
          className="mt-[clamp(72px,12vh,140px)] border-t border-ink/22 py-[clamp(72px,12vh,140px)]"
        >
          <ContactBlock />
        </section>
      </main>
      <Footer />
    </>
  );
}
