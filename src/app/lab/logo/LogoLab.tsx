"use client";

import Link from "next/link";
import { FloatingMonogram, MarkPanel, markQuery, useMark } from "../Monogram";

// The mark over the real home page (on the home page it scrolls back to the top), plus the panel.
export default function LogoLab() {
  const [mark, setMark] = useMark();
  return (
    <>
      <FloatingMonogram mark={mark} href="#" />
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/20 bg-tint/80 px-4 py-3 text-[13px] backdrop-blur-md">
        <MarkPanel mark={mark} onChange={setMark} />
        <p className="mt-2 text-center text-ink/70">
          lab · logo on the home page ·{" "}
          <Link href={`/lab/projects${markQuery(mark)}`} className="text-accent underline">
            see it on /lab/projects →
          </Link>
        </p>
      </div>
    </>
  );
}
