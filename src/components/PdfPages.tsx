"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// The /resume viewer (option B, chosen 2026-11-08): each PDF page drawn by pdf.js as a sheet of
// paper on the sky. The text layer keeps the text selectable and the annotation layer keeps the
// PDF's links clickable. Loaded only on the page that uses it (next/dynamic, no server render), so
// pdf.js never reaches the home page's bundle.
// The legacy worker, like the legacy library (aliased in next.config.ts): it carries fallbacks for
// JavaScript features phone browsers don't have yet.
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();

// pdf.js reads each page's text with `for await` over a ReadableStream, which Safari's engine (all
// iPhone browsers) doesn't support yet and the legacy build doesn't patch, so the text layer
// crashed on Jared's phone (2026-11-08). Same behavior as the built-in version: read chunks until
// done, then let go of the stream.
type IterableStream = ReadableStream & { [Symbol.asyncIterator]?: () => AsyncIterator<unknown> };
if (typeof ReadableStream !== "undefined" && !(ReadableStream.prototype as IterableStream)[Symbol.asyncIterator]) {
  (ReadableStream.prototype as IterableStream)[Symbol.asyncIterator] = async function* (this: ReadableStream) {
    const reader = this.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        yield value;
      }
    } finally {
      reader.releaseLock();
    }
  };
}

const LETTER = 11 / 8.5; // page height / width

export default function PdfPages({ file }: { file: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [pages, setPages] = useState(0);

  // Draw at the column's width, redrawn when it changes (phone rotation, window resize).
  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    setWidth(Math.round(box.getBoundingClientRect().width)); // first draw without waiting on the observer
    const ro = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    ro.observe(box);
    return () => ro.disconnect();
  }, []);

  // A blank sheet the size of the page holds the space while pdf.js loads, so nothing jumps.
  const sheet = (
    <div className="bg-[#FFFFFF]" style={{ width, height: width * LETTER }} aria-hidden="true" />
  );

  return (
    <div ref={boxRef} className="w-full">
      {width > 0 && (
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setPages(numPages)}
          loading={sheet}
          error={<p className="text-[15px] text-ink/80">The résumé didn&apos;t load here.</p>}
          className="flex flex-col gap-6"
        >
          {Array.from({ length: pages }, (_, i) => (
            <div key={i} className="overflow-hidden rounded-[4px] shadow-[0_6px_16px_rgba(42,22,48,0.35)]">
              <Page pageNumber={i + 1} width={width} loading={sheet} />
            </div>
          ))}
        </Document>
      )}
    </div>
  );
}
