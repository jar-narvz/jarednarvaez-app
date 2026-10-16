// Scrapbook content (docs/visual-system.md → Beyond code → Data shape). One list feeds the home
// page preview (items with `home`) and, after launch, the full /scrapbook page. Bracketed text is
// placeholder copy, written with Jared in the content pass (build step 14). Which 6 photos go on
// the home page is still open; the large print needs the sharpest one.

export type ScrapbookPhoto = {
  id: string;
  src: string; // path under /public; empty shows a labeled placeholder
  alt: string;
  caption: string; // short, lowercase, Newsreader italic
  home?: {
    // only for the 6 home page prints
    x: number; // % of the zone's width
    y: number; // % of the zone's height
    rotate: number; // degrees
    size: "sm" | "md" | "lg";
  };
};

// MVP: /scrapbook isn't designed yet, so "open the scrapbook →" stays hidden. Flip this once it exists.
export const showScrapbookPage = false;

export const beyondCode = {
  label: "beyond code",
  heading: "[beyond code heading]",
  line: "[intro line]",
};

// Default arrangement from the spec (positions as % of the zone, from the mockup): a tight
// cluster around the text, larger prints on the right. Later prints sit on top.
export const scrapbook: ScrapbookPhoto[] = [
  { id: "photo-1", src: "", alt: "[photo alt]", caption: "[caption]", home: { x: 3.2, y: 1.2, rotate: -6, size: "sm" } },
  { id: "photo-2", src: "", alt: "[photo alt]", caption: "[caption]", home: { x: 25.6, y: 0, rotate: 4, size: "sm" } },
  { id: "photo-3", src: "", alt: "[photo alt]", caption: "[caption]", home: { x: 6.4, y: 66, rotate: 3, size: "sm" } },
  { id: "photo-4", src: "", alt: "[photo alt]", caption: "[caption]", home: { x: 30.4, y: 67, rotate: -5, size: "sm" } },
  // [large print]: use the strongest, sharpest photo here.
  { id: "photo-5", src: "", alt: "[photo alt]", caption: "[caption]", home: { x: 52.9, y: 2.9, rotate: -3, size: "lg" } },
  { id: "photo-6", src: "", alt: "[photo alt]", caption: "[caption]", home: { x: 72, y: 52, rotate: 6, size: "md" } },
];
