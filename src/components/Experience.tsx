"use client";

import { useState } from "react";
import Collapse from "@/components/Collapse";
import CollapsibleHeader from "@/components/CollapsibleHeader";
import Sparkle from "@/components/Sparkle";
import TagList from "@/components/TagList";
import ToggleButton from "@/components/ToggleButton";
import { experience, type Role } from "@/data/experience";
import { staggerDelay } from "@/lib/stagger";

// Experience (docs/visual-system.md → Experience): collapsed by default. The header "+" opens a
// vertical timeline whose markers are sparkle stars; opening is like stars coming out one by one
// (line draws down, star i pops at 170 + 180·i ms, row i fades up at 250 + 180·i ms). Closing runs
// in reverse, bottom-up, and closes every open role. Each role opens on its own; several can be
// open at once. All motion is CSS transitions; open/closed is React state that changes on click.
// Layout values follow docs/reference/home-mockup.html.

const ROW_STAGGER = { base: 250, step: 180 };
/** Each star pops in this long before its row fades up (170 + 180·i). */
const STAR_LEAD_MS = 80;
const BODY_ID = "experience-body";

export default function Experience() {
  const { label, heading, roles } = experience;
  const [open, setOpen] = useState(false);
  const [openRoles, setOpenRoles] = useState<ReadonlySet<number>>(new Set());

  function toggleSection() {
    if (open) setOpenRoles(new Set()); // closing the section closes every role too
    setOpen(!open);
  }

  function toggleRole(i: number) {
    setOpenRoles((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <section
      id="experience"
      className="pl-(--content-l) pr-(--content-r) py-[clamp(72px,12vh,140px)] [text-shadow:var(--text-shadow)]"
    >
      <CollapsibleHeader
        label={label}
        heading={heading}
        open={open}
        controls={BODY_ID}
        onToggle={toggleSection}
      />

      <Collapse open={open} id={BODY_ID} durationMs={450}>
        <div className="relative mt-5.5 max-w-140 pl-6">
          {/* Timeline rail: runs star to star (22px in from each end, as in the mockup; chosen
              over the spec's 10px on 2026-10-16) and draws down over 700ms. */}
          <span
            aria-hidden="true"
            className={`absolute top-5.5 bottom-5.5 left-1.25 w-px origin-top bg-ink/30 transition-transform duration-700 ease-[cubic-bezier(.4,0,.2,1)] motion-reduce:transition-none ${
              open ? "scale-y-100" : "scale-y-0"
            }`}
          />
          <ol>
            {roles.map((role, i) => (
              <RoleRow
                key={role.title}
                role={role}
                index={i}
                sectionOpen={open}
                delayMs={staggerDelay(i, roles.length, open, ROW_STAGGER)}
                open={openRoles.has(i)}
                onToggle={() => toggleRole(i)}
              />
            ))}
          </ol>
        </div>
      </Collapse>
    </section>
  );
}

function RoleRow({
  role,
  index,
  sectionOpen,
  delayMs,
  open,
  onToggle,
}: {
  role: Role;
  index: number;
  sectionOpen: boolean;
  delayMs: number;
  open: boolean;
  onToggle: () => void;
}) {
  const detailsId = `experience-role-${index}`;
  const starDelayMs = sectionOpen ? delayMs - STAR_LEAD_MS : delayMs;

  // Star: accent fill. Current twinkles; past roles sit at 55%; an open role is full and glows
  // (the star-glow utility in globals.css).
  const starState = open
    ? "opacity-100 star-glow"
    : role.current
      ? ""
      : "opacity-55";

  return (
    <li
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`relative py-2.5 transition-[opacity,translate] duration-450 ease-[ease] motion-reduce:transition-none ${
        sectionOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {/* Marker, centered on the rail and aligned with line 1. Pops in with overshoot. */}
      <span
        aria-hidden="true"
        style={{ transitionDelay: `${starDelayMs}ms` }}
        className={`absolute top-4.25 -left-6 size-3 transition-transform duration-500 ease-[cubic-bezier(.3,1.6,.5,1)] motion-reduce:transition-none ${
          sectionOpen ? "scale-100" : "scale-0"
        }`}
      >
        <Sparkle
          twinkle={role.current}
          className={`text-accent transition-[opacity,filter] duration-300 motion-reduce:transition-none ${starState}`}
        />
      </span>

      {/* The whole row toggles on click (a mouse convenience); the button is the real control,
          and its click bubbles up to here. */}
      <div onClick={onToggle} className="flex cursor-pointer items-start justify-between gap-3">
        <div>
          {/* Always at least two lines tall (Jared, 2026-10-17), so one-line titles keep the same
              rhythm as the long ones that wrap. */}
          <p className="min-h-[2lh] text-[17px] font-medium">
            {role.title} <span className="text-accent">@ {role.org}</span>
          </p>
          {/* Tabular numerals on the dates only: in Schibsted they also widen the comma, which
              reads as "Berkeley , CA" in the location. */}
          <p className="mt-0.5 text-[14px] tracking-[0.02em] text-ink/75">
            <span className="tabular-nums">
              {role.start} – {role.end ?? "Present"}
            </span>{" "}
            · {role.location}
          </p>
        </div>
        <ToggleButton open={open} controls={detailsId} label={`details for ${role.title}`} />
      </div>

      <Collapse open={open} id={detailsId} durationMs={400}>
        {/* Bullets, then the role's tech tags (none for non-technical roles). */}
        <div
          className={`mt-2 mb-0.5 transition-[opacity,translate] delay-100 duration-300 ease-[ease] motion-reduce:transition-none ${
            open ? "translate-y-0 opacity-92" : "-translate-y-1 opacity-0"
          }`}
        >
          <ul className="list-disc pl-4.5 text-[15px] leading-[1.6]">
            {role.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
          {role.tags && <TagList tags={role.tags} className="mt-2.5" />}
        </div>
      </Collapse>
    </li>
  );
}
