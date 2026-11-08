# Project Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `/projects/[slug]` essay pages for Posting Triage, route-impact, Secure File Sharing and Character-Level GPT, with whole-card links from home and /projects that switch on per page once Jared publishes it.

**Architecture:** A `story` field on four entries in `src/data/projects.ts` drives everything: which pages exist, whether they're published, the intro line and lead image. Pure helpers in `src/lib/story.ts` (tested) compute reading time, the meta line and the slug list. One server route renders a shared client shell (`StoryPage`) around a per-slug MDX essay; MDX components supply the headings, figures and the rejected/chosen pair.

**Tech Stack:** Next.js 16 App Router (`cacheComponents` on), TypeScript, Tailwind 4, `@next/mdx` (already installed and configured), Motion's `useInView`, Vitest (node environment, no DOM).

**Spec:** `docs/superpowers/specs/2026-11-08-project-detail-pages-design.md`

## Global Constraints

- Never write copy in Jared's voice: every heading, intro line, paragraph and caption is a `[bracketed placeholder]`.
- Colors, materials and type only from `docs/visual-system.md`; teal sea palette via `SubpageSky palette={TEAL_SEA}`, as /projects and /resume do.
- Essay column max 680px; body Schibsted 17px / line-height 1.7; section headings Newsreader ~26px; intro line Newsreader italic ~18px / 1.5 / 88% ink.
- Image focus pull: `blur(5px) brightness(1.15)` → none, 800ms ease, once on scroll into view; Reduce Motion shows it sharp at once. No other animation is added.
- Unpublished pages: render in `npm run dev`, 404 in production builds, and their cards don't link.
- Jared commits. Each task ends by handing him the `git add` (specific paths) and `git commit` commands; never run them. No `Co-Authored-By`.
- Verify every task with `npm test`, `npm run lint`, `npm run build`, and the browser for visible changes.

## Review Focus

1. **Nested interactive elements in a whole-card link:** clicking the GitHub circle, "visit →" or the screenshot must do only their own action, never also navigate to the detail page. → Task 4 browser check.
2. **Light teal sea:** the dimmed rejected image, captions and the italic intro must stay readable on the pale sea. → Task 3 browser check in light mode.
3. **Unknown or unpublished slug in production:** `/projects/nope` and an unpublished slug give the 404 page, not a crash. → Task 1 test on `storySlugs` + Task 2 `npm run build && npm start` check.
4. **Phone width (375px):** the long route-impact title wraps cleanly, the pair stacks rejected first, and nothing scrolls sideways. → Task 3 browser check.
5. **Keyboard:** a whole-card link is reachable with Tab, shows the focus ring, and inner links stay separately tabbable. → Task 4 browser check.

---

### Task 1: Story data and helpers

**Files:**
- Modify: `src/data/projects.ts` (Project type, the four entries)
- Create: `src/lib/story.ts`
- Test: `src/lib/story.test.ts`

**Interfaces:**
- Produces:
  - `type Story = { published: boolean; intro: string; image?: { src: string; alt: string } }`, and `story?: Story` on `Project`.
  - `readingMinutes(text: string): number` = `max(1, ceil(words / 200))`, where words are whitespace-separated tokens after stripping MDX/JSX tags.
  - `storyMeta(p: Project, minutes: number): string` → personal: `personal · {year} · {n} min read`; coursework: `{classLabel} · {term} · {n} min read`.
  - `storySlugs(includeDrafts: boolean): string[]` → slugs of projects with a `story`, filtered to `published` unless `includeDrafts`.
  - `isLinkedStory(p: Project): boolean` → `p.story?.published === true`.
  - `storyImage(p: Project): { src: string; alt: string }` → `p.story?.image ?? p.image`.

- [ ] **Step 1: Write failing tests** in `src/lib/story.test.ts`:
  - `readingMinutes("")` → 1; 200 words → 1; 201 words → 2; `"<Figure src=\"/a.png\" />\n## [why]\nword word"` counts only `## [why] word word` tokens (4 → 1 minute).
  - `storyMeta` for Posting Triage with 3 → `"personal · 2026 · 3 min read"`; for Secure File Sharing with 2 → `"CS 161 · Fall 2025 · 2 min read"`.
  - `storySlugs(true)` equals `["posting-triage","route-impact","secure-file-sharing","character-gpt"]` (in list order); `storySlugs(false)` → `[]` while all four are unpublished.
  - `isLinkedStory` is false for all four and for a project without `story`.
  - `storyImage` returns `story.image` when set, else `project.image`.
- [ ] **Step 2: Run** `npx vitest run src/lib/story.test.ts` → FAIL (module not found).
- [ ] **Step 3: Add `story`** to the four entries in `projects.ts`: `{ published: false, intro: "[intro line: where to go for how it works, trying it and the numbers; this page is the story]" }` for the two personal projects, and `"[intro line: what this page is]"` for the two write-ups. Leave `showWriteUps` alone; Task 4 removes it.
- [ ] **Step 4: Implement** `src/lib/story.ts` with the signatures above (imports `projects` and `Project` from `@/data/projects`).
- [ ] **Step 5: Run** `npm test` → all pass; `npm run lint` → clean.
- [ ] **Step 6: Hand Jared the commit:**
```bash
git add src/data/projects.ts src/lib/story.ts src/lib/story.test.ts
git commit -m "Add story data and helpers for project detail pages"
```

### Task 2: The detail page route and essay skeletons

**Files:**
- Create: `src/app/projects/[slug]/page.tsx` (server)
- Create: `src/app/projects/[slug]/StoryPage.tsx` (client shell)
- Create: `src/content/projects/index.ts` (slug → MDX loader map)
- Create: `src/content/projects/{posting-triage,route-impact,secure-file-sharing,character-gpt}.mdx`
- Modify: `src/mdx-components.tsx` (h2, p, a)

**Interfaces:**
- Consumes: `storySlugs`, `storyMeta`, `readingMinutes`, `storyImage` (Task 1); `SubpageSky`, `useSubpageDark`, `SubpageHeader`, `ContactBlock`, `Footer`, `UnderlineLink`, `GithubIcon`, `SITE_LINK_LABEL`, `ScreenshotViewer`.
- Produces:
  - `STORIES: Record<string, () => Promise<{ default: React.ComponentType }>>` in `src/content/projects/index.ts`, with explicit `import("./posting-triage.mdx")` etc. (no template-literal imports).
  - `StoryPage({ project, meta, children }: { project: Project; meta: string; children: React.ReactNode })`.
  - Lead image rendered through a `leadImage` slot that Task 3 swaps to `FocusImage`; in this task it is a plain `ScreenshotViewer` + `next/image`, 16:10, 8px radius, full column width.

- [ ] **Step 1: `page.tsx`.** `export const dynamicParams = false`; `generateStaticParams()` → `storySlugs(process.env.NODE_ENV !== "production").map(slug => ({ slug }))`. `generateMetadata` → title `"{title lowercased} · jared narvaez"` (the other subpages' pattern). The page awaits `params`, calls `notFound()` if the slug isn't in that list, loads the MDX via `STORIES[slug]`, and computes minutes from the `.mdx` source read with `fs.readFile(path.join(process.cwd(), "src/content/projects", `${slug}.mdx`), "utf8")` inside an `async function storyMinutes(slug)` marked `"use cache"` (cacheComponents rejects uncached I/O outside Suspense).
- [ ] **Step 2: `StoryPage.tsx`,** top to bottom, inside `<main className="pr-(--content-r) pl-(--content-l) pt-24 [text-shadow:var(--text-shadow)]">` with an inner `mx-auto max-w-[680px]` column: "← all projects" (`UnderlineLink href="/projects"`, 14px, 70% ink) → `h1` in the /projects heading classes, `mt-2.5` → meta line (13px, `text-ink/70`, `mt-2`) → link row only if `github` or `site` (the 32px GitHub circle and `SITE_LINK_LABEL`, copied from `ProjectCards`'s markup) → intro (`font-serif italic text-[18px] leading-[1.5] text-ink/88 mt-5`) → lead image (`mt-7`) → `<article className="mt-2">{children}</article>`. Then the rule + `ContactBlock` section and `Footer`, exactly as `ResumePage.tsx` does.
- [ ] **Step 3: `mdx-components.tsx`:** `h2` → `font-serif text-[26px] leading-[1.2] font-normal mt-12 mb-2.5`; `p` → `text-[17px] leading-[1.7] mb-4`; `a` → `UnderlineLink` (new tab when the href starts with `http`).
- [ ] **Step 4: MDX skeletons,** identical in all four files:
```mdx
## [why I built it]

[paragraph]

## [how it connects to me]

[paragraph]

## [a design choice]

[paragraph]
```
- [ ] **Step 5: Verify.** `npm run build` passes. With `npm run dev` (via `preview_start` "dev"), open `http://localhost:3000/projects/posting-triage` and `/projects/secure-file-sharing`: header, back link, title, `personal · 2026 · 1 min read` / `CS 161 · Fall 2025 · 1 min read`, GitHub + "visit →" only on the first, intro, lead image, three headings, contact block, footer. Flip the light/dark toggle once. No console errors.
- [ ] **Step 6: Production 404 check.** `npm run build && npx next start -p 3100`; `curl -s -o /dev/null -w "%{http_code}" localhost:3100/projects/posting-triage` → `404`; same for `/projects/nope` → `404`. Stop the server.
- [ ] **Step 7: Hand Jared the commit:**
```bash
git add "src/app/projects/[slug]" src/content/projects src/mdx-components.tsx
git commit -m "Add the project detail page with placeholder essays"
```

### Task 3: Figures, the rejected/chosen pair and the focus pull

**Files:**
- Create: `src/lib/useReduceMotion.ts` (moved out of `ProjectCards.tsx`, same body)
- Modify: `src/components/ProjectCards.tsx` (import the hook instead of defining it)
- Create: `src/components/FocusImage.tsx`
- Create: `src/components/StoryFigures.tsx` (`Figure`, `Pair`)
- Modify: `src/mdx-components.tsx` (register `Figure`, `Pair`), `src/app/projects/[slug]/StoryPage.tsx` (lead image → `FocusImage`)
- Modify: `src/content/projects/posting-triage.mdx` (one placeholder `Pair` under "[a design choice]", for review only)

**Interfaces:**
- Produces:
  - `useReduceMotion(): boolean` (server/hydration `false`, then live).
  - `FocusImage({ src, alt, dimmed? }: { src: string; alt: string; dimmed?: boolean })` — 16:10, 8px radius, `ScreenshotViewer` (opens large), focus pull once on `useInView(ref, { once: true, margin: "0px 0px -10% 0px" })`, sharp at once under Reduce Motion; `dimmed` adds `opacity-70 grayscale-[.4]` (tune in the browser for the light sea, Review Focus 2). Empty `src` → the labeled `[screenshot]` gradient placeholder.
  - `Figure({ src, alt, caption })` and `Pair({ rejected, chosen }: { rejected: Fig; chosen: Fig })` where `Fig = { src: string; alt: string; caption: string }`. Pair: `grid gap-3.5 sm:grid-cols-2`, rejected first in DOM (so it stacks first on phones) and `dimmed`. Captions 13px at 70% ink, `mt-1.5`. Figure margins `my-6`.

- [ ] **Step 1: Move `useReduceMotion`** to `src/lib/useReduceMotion.ts`; `ProjectCards.tsx` imports it. `npm test && npm run lint` pass and /projects looks unchanged.
- [ ] **Step 2: Build `FocusImage`, `Figure`, `Pair`;** register `Figure` and `Pair` in `mdx-components.tsx`; swap the lead image to `FocusImage`.
- [ ] **Step 3: Add the review placeholder** to posting-triage.mdx: `<Pair rejected={{ src: "", alt: "[rejected version]", caption: "[rejected: why]" }} chosen={{ src: "", alt: "[chosen version]", caption: "[chosen: why]" }} />`.
- [ ] **Step 4: Browser checks** at `/projects/posting-triage`: images come into focus as they scroll in (once); with Reduce Motion emulated they're sharp at once; light mode keeps the dimmed image and captions readable; at 375px wide the pair stacks rejected first, the route-impact title (`/projects/route-impact`) wraps, and there's no sideways scroll. Screenshot dark desktop and light phone for Jared.
- [ ] **Step 5: `npm run build`** passes.
- [ ] **Step 6: Hand Jared the commit:**
```bash
git add src/lib/useReduceMotion.ts src/components/ProjectCards.tsx src/components/FocusImage.tsx src/components/StoryFigures.tsx src/mdx-components.tsx "src/app/projects/[slug]/StoryPage.tsx" src/content/projects/posting-triage.mdx
git commit -m "Add figures and the rejected/chosen pair to detail pages"
```

### Task 4: Whole-card links on home and /projects

**Files:**
- Modify: `src/components/Projects.tsx` (cell link; remove `showWriteUps` import and the "view project →" block)
- Modify: `src/components/ProjectCards.tsx` (card link)
- Modify: `src/data/projects.ts` (delete the `showWriteUps` export)

**Interfaces:**
- Consumes: `isLinkedStory` (Task 1).

- [ ] **Step 1: Stretched-link pattern** (no `<a>` inside `<a>`): when `isLinkedStory(project)`, the cell/card gets `relative`; the title becomes `<Link href={`/projects/${slug}`} className="after:absolute after:inset-0 after:rounded-[14px] focus-visible:outline-…">`; the GitHub circle, `UnderlineLink`, and the `ScreenshotViewer` wrapper get `relative z-10` so they stay on top and keep their own actions. On the home row the cell is the link area (the row header stays as is). Hover: the existing title-to-accent hover. When not linked, markup is unchanged.
- [ ] **Step 2: Remove** `showWriteUps` and the "view project →" block from `Projects.tsx`, and the export from `projects.ts`.
- [ ] **Step 3: Verify with a temporary flip.** Set `posting-triage`'s `story.published` to `true` locally (don't commit it). On `/` (open the projects section) and `/projects`: clicking the cell/card background opens `/projects/posting-triage`; clicking GitHub, "visit →" or the screenshot does only its own action (Review Focus 1); Tab reaches the card link with a visible focus ring, then the inner links (Review Focus 5); route-impact's cell still doesn't link. Revert the flip and confirm `git diff src/data/projects.ts` shows only the `showWriteUps` removal.
- [ ] **Step 4: `npm test && npm run lint && npm run build`** pass.
- [ ] **Step 5: Hand Jared the commit:**
```bash
git add src/components/Projects.tsx src/components/ProjectCards.tsx src/data/projects.ts
git commit -m "Make project cards open their detail page once published"
```

### Task 5: Record the decisions in the design docs

Only with Jared's OK (given when he approves this plan).

**Files:**
- Modify: `docs/design.md` (Structure / Projects lines; remove "Detail pages" and "Write-up page" from "Not designed yet"; add a "Project detail pages" line)
- Modify: `docs/decisions-log.md` (2026-11-08 rows: the page design, intro option A over B and C, whole-card links with no label, write-ups share the design, `published` per page)
- Modify: `docs/visual-system.md` (Subpages → new "Project detail pages" section from the spec's Layout; /projects cards: whole-card link for the four; Projects → drop "view project →"; Motion inventory: one row for detail-page images)
- Modify: `docs/build-plan.md` ("Now" line only; the "/projects page + project detail pages" box stays unticked until Jared reviews and decides)
- Include: `docs/superpowers/specs/2026-11-08-project-detail-pages-design.md`, `docs/superpowers/plans/2026-11-08-project-detail-pages.md`

- [ ] **Step 1: Write the doc edits,** one line per decision, matching each file's existing style.
- [ ] **Step 2: Show Jared the diff** and the running pages (`/projects/posting-triage`, light and dark, desktop and phone width), and remind him to check on his real phone with `npm run dev:phone`.
- [ ] **Step 3: Hand Jared the commit:**
```bash
git add docs/design.md docs/decisions-log.md docs/visual-system.md docs/build-plan.md docs/superpowers/specs/2026-11-08-project-detail-pages-design.md docs/superpowers/plans/2026-11-08-project-detail-pages.md
git commit -m "Record the project detail page design"
```
