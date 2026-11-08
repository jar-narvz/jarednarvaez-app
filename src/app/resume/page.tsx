import type { Metadata } from "next";
import ResumePage from "./ResumePage";

// /resume (decided 2026-11-08): the résumé shown on the page with pdf.js, laid out like /projects
// on the teal sea background. Title lowercase like the home page's.
const TITLE = "résumé · jared narvaez";

export const metadata: Metadata = {
  title: TITLE,
  openGraph: { title: TITLE },
  twitter: { title: TITLE },
};

export default function Resume() {
  return <ResumePage />;
}
