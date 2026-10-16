# Formal design doc

> Exported from Notion ("formal design doc", under the personal website planning doc) on 2026-10-16. The formal design doc in the standard structure; sections are still mostly empty. Fill sections from decisions in `design.md` and `visual-system.md`, with justifications.

## 1. Abstract

*One paragraph summary of the project — written LAST, once the design settles.*

## 2. Glossary

*Domain-specific terms used in this doc.*

| Term | Definition |
|---|---|
| | |

## 3. Problem statement

### Current state

*State of the problem + state of the current solution.*

### Desired state

*Framed as needs, not solutions (e.g. "recruiters need to see experience and contact info").*

## 4. Solution statement

### Functional requirements

*What the site absolutely must do.*

### Non-functional requirements

*Qualities, principles, heuristics.*

### Non-goals

*What the site deliberately does not address.*

## 5. Solution design

### Site structure & navigation

### Home page

### Theme & visual identity

*Color, typography, motion, tone of voice.*

### Requirement → design mapping

| Functional requirement | How the design achieves it |
|---|---|
| | |

### Edge cases

## 6. Solution implementation

### Mockups

### User flow

## 7. Plan & timeline

### MVP

The whole home page in scroll mode, with real content, deployed on Vercel as soon as possible: the sky (golden hour → night with grain, stars and cloud drift, desktop and phone coasts), nav, hero, intro, tech stack, experience, projects, beyond code, and connect's contact block. Links to pages that don't exist yet stay hidden.

Why this cut: every piece is already fully specified and none needs a backend, so it can ship quickly for recruiting. The deferred features are self-contained and can land after launch without reworking the MVP.

### Phases

| Phase | What | Status |
|---|---|---|
| 0. Setup | Fresh Next.js scaffold on `rebuild`, fonts, color variables | Done |
| 1. Sky | Static golden hour, scroll blending, stars, cloud drift, grain | Done |
| 2. Home page sections | Nav (done), hero, intro, tech stack, experience, projects, beyond code, connect contact block | In progress |
| 3. Launch | Content pass, pre-launch checks, go live (old site to `legacy`, `rebuild` → `main`) | — |
| 4. After launch | Sky modes 2 and 3 → leave a star → /projects, project detail and /scrapbook pages (design first) → live widgets → easter eggs | — |

Step-by-step tracking lives in `build-plan.md`.
