import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  turbopack: {
    // react-pdf imports pdf.js's modern build, which calls brand-new JavaScript (Map
    // getOrInsertComputed) that phone browsers don't have yet, so the résumé failed to draw on
    // Jared's phone (2026-11-08). The legacy build ships fallbacks for those features.
    resolveAlias: {
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.mjs",
      "pdfjs-dist/web/pdf_viewer.mjs": "pdfjs-dist/legacy/web/pdf_viewer.mjs",
    },
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
