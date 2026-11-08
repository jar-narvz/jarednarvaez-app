"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// The /resume viewer (option B, chosen 2026-11-08): each PDF page drawn by pdf.js as a sheet of paper on the sky. The text layer keeps the
// text selectable and the annotation layer keeps the PDF's links clickable. Loaded only on this
// page that uses it (next/dynamic, no server render), so pdf.js never reaches the home page's bundle.
pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

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
