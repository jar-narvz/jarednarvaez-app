import type { Metadata } from "next";
import { Newsreader, Schibsted_Grotesk } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Jared Narvaez",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${schibstedGrotesk.variable} antialiased`}
    >
      <body className="font-sans text-ink">
        <Sky />
        {children}
      </body>
    </html>
  );
}
