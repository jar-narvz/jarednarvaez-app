import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Schibsted_Grotesk } from "next/font/google";
import Sky from "@/components/Sky";
import "./globals.css";

// Headings and the hero name. Italic is loaded for the surname.
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Body, nav, and labels.
const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
});

// Tech stack pills only (chosen by Jared in /lab, 2026-10-19). One weight. Not preloaded: the
// pills sit below the hero, so it shouldn't compete with the hero's fonts; the rows wait for
// document.fonts.ready before they start looping.
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: "500",
  preload: false,
});

// Page metadata (docs/content.md → Page metadata; title lowercase at Jared's request, 2026-10-17).
// The social preview image is src/app/opengraph-image.png, which Next.js picks up on its own.
const TITLE = "jared narvaez";
const DESCRIPTION =
  "Jared Narvaez studies CS + Data Science at UC Berkeley and builds fullstack and AI/ML projects. Open to 2027 full-time roles and Spring 2027 co-ops.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  // Link previews (iMessage, LinkedIn, Slack) read these rather than the title and description.
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${schibstedGrotesk.variable} ${plexMono.variable} antialiased`}
    >
      <body className="font-sans text-ink">
        <Sky />
        {children}
      </body>
    </html>
  );
}
