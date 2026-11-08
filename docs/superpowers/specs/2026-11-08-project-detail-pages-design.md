# Project detail pages — design

Decided with Jared on 2026-11-08 in a brainstorming session. Mockups: the "anatomy" and "signpost" screens from that session (teal sea, placeholder copy). This replaces nothing new in the log: detail pages for the featured projects were already decided (`decisions-log.md`, 2026-10-30, "The featured projects get detail pages on the site (design first)"), which superseded that day's earlier "no detail pages at first". Once Jared approves this doc, and only with his OK, its decisions get copied into `design.md`, `decisions-log.md` and `visual-system.md` (Notion stays the source of truth), and "Detail pages" and "Write-up page" leave `design.md` → "Not designed yet".

## Intent

A detail page is Jared's side of a project. The repo holds the code and how to run it; the external project page ("visit →") holds the live demo and the numbers. This page holds what neither can: **why he built it, how it connects to him, and why it's built the way it is.** It answers the interview question "walk me through a decision you made" before it's asked.

Who reads it: a recruiter or interviewer who clicked a project on the home page or /projects and wants depth.

## Goals

- Tell the story behind the project as an essay Jared writes: the reason, the connection to him, then the design choices, woven into the story.
- Show the alternatives he threw away next to what he chose, when a rejected version exists.
- Tell readers on the first screen where to go: the repo and project page for how it works, trying it and the numbers; this page for the story.
- One page design for all four pages.

## Non-goals

- Re-stating the README, setup instructions, or eval numbers (they live in the repo and on the project page).
- Interactive demos or embedded live versions inside the essay.
- Detail pages for the other five /projects entries.
- A table of contents, comments, or a "next project" link.

## Anti-goals (failure even if it works)

- **Copy in Jared's voice written by anyone but Jared.** Every heading, intro line, paragraph and caption is a `[placeholder]` until he writes it.
- Quiz or "your call" blocks like the reference post's: a gimmick on a project page.
- A list of decisions in place of an essay.
- A box or gate in front of the story.

## Pages

| Page | Slug | Kind | Link row |
|---|---|---|---|
| Posting Triage | `posting-triage` | detail page (personal) | GitHub circle + "visit →" |
| OpenStreetMap Route-Impact Pipeline | `route-impact` | detail page (personal) | GitHub circle + "visit →" |
| Secure File Sharing System | `secure-file-sharing` | write-up (CS 161) | none (class code stays private) |
| Character-Level GPT | `character-gpt` | write-up (CS 188) | none |

All four live at `/projects/[slug]` (the slug field and route the data file and spec already name). Content is MDX in the repo (stack decision).

## Constraints (already decided elsewhere)

- Subpage look: teal sea abstract scene, dark and light versions with the toggle, subpage header (mark · home · projects · résumé · contact · toggle), then the 1px rule at 22% ink, the shared contact block and the footer line. `visual-system.md` → Subpages.
- Fonts: Newsreader headings, Schibsted Grotesk body. Colors and pill/cell materials only from `visual-system.md`.
- Text readable in both teal sea versions, desktop and phone width.

## Layout (top to bottom)

1. **Subpage header** — unchanged.
2. **"← all projects"** — small text link to `/projects`, Schibsted ~14px at the meta line's strength.
3. **Title** — Newsreader, the /projects h1 style (`clamp(32px,4vw,40px)`, line-height 1.1, -0.02em).
4. **Meta line** — personal: `personal · {year} · {n} min read`; coursework: `{class} · {term} · {n} min read` (the /projects card's class · term). 13px at 70% ink. Reading time computed from the MDX word count (200 words/min, rounded up), not typed by hand.
5. **Link row** — the 32px GitHub circle, then "visit →" (the site's one label for an external page), only for links the project has. The write-ups have no link row.
6. **Intro line (option A, chosen)** — one or two sentences Jared writes that send readers to the right place: how it works, trying it and the numbers are in the repo and on the project page; this page is the story. Newsreader italic, ~18px, line-height 1.5, ~88% ink, directly under the link row. For the write-ups it says what the page is (no repo to point to); wording is Jared's. Rejected: B a two-way cell in front of the story (a box before the story starts); C labeled links (relies on a project page existing and adds clutter).
7. **Lead screenshot** — one picture of the finished thing, full column width, 16:10, 8px radius (the /projects screenshot style). Opens large on click like the home cells' screenshots.
8. **The essay** — the same for all four pages, write-ups included (Jared, 2026-11-08): his three parts in order: why he built it → how it connects to him → his design choices. Each section has a short heading phrase he writes (Newsreader ~26px); skimming the headings should tell the arc. Body Schibsted 17px, line-height 1.7, 680px max column, centered in the content column.
9. **Inline pictures** — only where one is relevant, placed at the moment the text discusses it, with a one-line caption.
10. **Rejected vs. chosen pair** — when a rejected version exists: two images side by side (rejected left, dimmed; chosen right), each with a one-line caption. On phones they stack, rejected first.
11. **Rule, contact block, footer line** — unchanged subpage ending.

## Motion

One new row in the motion inventory, reusing an existing animation (no new one invented): each image in the page (lead screenshot, inline pictures, pair images) comes into focus once as it scrolls into view — `blur(5px) brightness(1.15)` → none, 800ms ease (the /projects screenshot focus pull). Reduce Motion: shown sharp at once. Text does not animate.

## How readers get here

- **Home:** the whole featured cell links to `/projects/[slug]` (already decided); its GitHub icon, "visit →" and screenshot keep their own actions.
- **/projects (Jared, 2026-11-08):** the four cards become whole-card links to their page, like the home cells; the GitHub circle and "visit →" inside keep their own actions. No text label. Replaces the /projects spec's "No whole-card link" for these four cards only; the other five stay as they are.
- **No "view project →" or "read the story →" label anywhere (Jared, 2026-11-08).** The card itself is the way in, on home and /projects. The old `view project →` label and the `showWriteUps` flag go away.
- Until a page is published, its cards don't link anywhere (they look and behave as today).
- **"all projects →"** on the home page stays as specified.

## Publishing (Claude's call, 2026-11-08)

- Each of the four projects gets a `story` entry in `src/data/projects.ts` with a `published` flag (replaces the single global `showWriteUps` boolean). It lives in the data file, not MDX frontmatter, because the home and /projects cards (client components) need it and `@next/mdx` doesn't parse frontmatter.
- Unpublished pages render in `npm run dev` at their real URL so Jared can review them, and 404 in production (left out of `generateStaticParams`).
- The home and /projects whole-card links are built in this step, active only for published pages. So the step can ship with all four pages unpublished and nothing visible changing on the live site.

## Content model

- One MDX file per page holding only the essay. Everything the page top needs (title, group, year or class/term, links, intro line, lead image) comes from the project's entry in `src/data/projects.ts`, so nothing is typed twice.
- Lead image (Claude's call): defaults to the project's `image` in `projects.ts`, with an optional frontmatter override. Posting Triage and Secure File Sharing currently use flowcharts there, so Jared may want to override them with a screenshot or the Posting Triage demo GIF.
- A small set of MDX components: an inline figure (image + caption) and the rejected/chosen pair.
- Until Jared writes a page, it ships with bracketed placeholders; pages with no copy yet should not be linked from home or /projects.

## Edge cases

- No rejected version for a choice → just the text, or a single figure.
- Missing lead screenshot → the site's `[screenshot]` gradient placeholder, labeled.
- Long titles (route-impact) wrap on phones without breaking the meta line.
- Light version: the dimmed rejected image must still be visibly an image on the pale sea.

## Left to the builder

- Spacing between sections, figure margins, exact caption size (start from the mockup: 48px above headings, 13px captions at 70% ink).
- Whether reading time comes from a remark plugin or a build-time count.
- MDX setup details, as long as it stays content-in-repo with no CMS.

## Open (Jared's, not blocking the build)

- The copy for all four pages, and which screenshots and rejected versions he has.
