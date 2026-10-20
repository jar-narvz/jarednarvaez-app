<!-- Exported from Jared's "Website content pass" doc on 2026-10-16. This file is the source of all site copy for build step 14. Files named here are in ~/website-content (portrait.jpg, Jared-Narvaez-Resume.pdf, secure-file-sharing.png, character-gpt.png): copy them into public/. Since 2026-10-19 the portrait lives only in public/portrait.jpg (new 300×300 sunset photo). Use the text exactly as written; keep a [placeholder] for any field still marked "?". -->

# Website content pass

Oct 16, 2026 · @jared

## How to use this doc

Fill the **Your content** column in every table below, then hand this doc back to Claude Code, which drops each answer into the site's data files. Everything on the site today is a `[placeholder]`; this doc lists every one of them.

- **Write it in Jared's voice.** The chat helping you can draft and tighten, but the words should sound like Jared, not like a template.
- **Keep the structure.** Don't rename fields or reorder tables. Fill the last column; add rows only where a table says you can.
- **Respect the length guides.** They come from the layout (column widths, font sizes), so going over means awkward wrapping.
- **Not sure yet?** Write `?` and a note. **Don't want it?** Write `skip`.
- **Files (photos, screenshots, résumé PDF) don't go in this doc.** Put them in one folder, write each file's name in its row, and give Claude Code the folder (or drag the files into its chat).
- **Fixed on the site already, no need to fill:** the name (Jared / *Narvaez*), section labels (about, tech stack, experience, projects, connect) and the nav links.

## Links and files

These feed the nav's résumé link and the connect section at the bottom of the page.

| Field | Where it shows | Guide | Your content |
| --- | --- | --- | --- |
| Email | Connect, with a "copy" button | The address people should write to | jaredrnarvaez@gmail.com |
| LinkedIn | Connect | Full URL | https://www.linkedin.com/in/jaredrnarvaez/ |
| GitHub | Connect | Full URL | https://github.com/jar-narvz |
| Résumé | Nav + connect | A PDF file name (hosted on the site) or a full URL | Jared-Narvaez-Resume.pdf (in ~/website-content) |
| Portrait photo | Hero, small circle above the name | File name. Square crop, face centered, at least 400×400 px, JPG or PNG | public/portrait.jpg, 300×300 square crop (new sunset photo, 2026-10-19) |

## Hero

The first screen, at golden hour: portrait, the stacked name, then these two lines. The name is the only focal point, so both lines stay short and quiet.

| Field | Where it shows | Guide | Your content |
| --- | --- | --- | --- |
| Hero line | Under the name, 20px | One sentence that carries both the engineer and the person. Up to ~90 characters (wraps to 2 lines at ~46) | creating experiences, sharing memories |
| Currently line | Below the hero line, small, gold, with a twinkling sparkle | What Jared is up to right now, e.g. a role or what he's building. Up to ~50 characters. Live widgets (now playing, location) come after launch | Interning at PhysaFlow, CS + DS @ Berkeley |
| Portrait alt text | Read aloud by screen readers | Describes the photo in a few words, e.g. "Jared smiling outdoors at sunset" | Jared Narvaez smiling by the ocean at sunset |

## Intro (about)

Right under the hero. Recruiters skim the four facts; everyone else reads the lead and paragraph.

| Field | Where it shows | Guide | Your content |
| --- | --- | --- | --- |
| Lead sentence | Big serif line, ~32px | One sentence, ~10–20 words (wraps at ~30 characters per line, so 2–3 lines) | Hey! I'm Jared. I'm studying Computer Science and Data Science at UC Berkeley, and I love dancing, hiking and eating! |
| Underlined phrase | Inside the lead, with a gold underline | A few words copied exactly from the lead sentence, the warmest part | dancing, hiking and eating |
| Paragraph | Body text under the lead | Who Jared is, what he studies, what he cares about. ~50–90 words, one paragraph | I'm currently interning at PhysaFlow and working as a Data Assistant at VSPA. I'm also serving as the Vice President of External Relations for the Pilipinx Association of Scientists, Architects, and Engineers, and I love to dance on my school dance teams. Outside of school I love exploring the Bay Area, whether that's a new trailhead or the newest trending restaurant on TikTok. |
| Fact: studying | Row of four short facts | Up to ~28 characters, e.g. a degree and school | CS + Data Science @ Berkeley |
| Fact: leading | Same row | Up to ~28 characters, e.g. a role and org | External VP @ PASAE |
| Fact: currently @ | Same row | Up to ~28 characters | PhysaFlow + VSPA |
| Fact: based in | Same row | City, state | The Bay Area |

## Tech stack

A heading and one line, then two rows of logo pills (languages, frameworks & tools) that loop across the screen. Claude Code adds the official logos, so just list exact names.

| Field | Where it shows | Guide | Your content |
| --- | --- | --- | --- |
| Heading | ~40px serif | 2–5 words | my stack |
| Line | Under the heading | One sentence, up to ~100 characters | languages and frameworks i use to design and build frontend, backend, ml/ai and fullstack |
| Languages | Row 1 pills | 6–10 names, comma-separated, most important first, e.g. Python, Java, TypeScript | Python, Java, Go, TypeScript, C, C++, SQL, RISC-V Assembly |
| Frameworks & tools | Row 2 pills | 6–10 names, comma-separated, web and ML together | React, Next.js, Node.js, Figma, PyTorch, scikit-learn, NumPy, Pandas |

## Experience

A collapsible timeline, newest role first. Each role shows title @ org and dates · location; its "+" opens the bullets. The current role's star twinkles.

| Field | Guide | Your content |
| --- | --- | --- |
| Heading | 2–5 words, ~40px serif | what i've done |

One row per role, newest first.

| Title | Org | Start | End | Location | Current? | Bullet 1 | Bullet 2 | Bullet 3 | Tags |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Multi-Agent Systems & Agentic Product Engineer Intern | PhysaFlow | Oct 2026 |  | San Francisco Bay Area (remote) | yes | Ramping up on a startup's multi-agent product codebase, studying agent architecture, orchestration, and tool integration ahead of contributing to agentic product features. |  |  | Multi-Agent Systems, Python, Systems Design, Software Architecture |
| Data Assistant | UC Berkeley, Visiting Scholar & Postdoc Affairs | Jun 2026 |  | Berkeley, CA | no | Maintain and audit 2,000+ scholar and postdoc records across internal databases, validating incoming submissions for accuracy and completeness to keep institutional records audit-ready for quarterly compliance reviews. | Built automated reporting and validation workflows, replacing manual data handling with reusable spreadsheet logic and integrity checks. | Maintain the department's public-facing website, transforming institutional data for 3 scholar populations into demographic, diversity, and career-outcome visualizations and dashboards on a biannual refresh cycle. | Data Validation, Google Sheets, Tableau |
| Vice President of External Relations | PASAE | Apr 2025 |  | Berkeley, CA | no | Led semester-long recruitment pipeline (tabling, info sessions, kickoffs) and co-organized UC Berkeley career fairs hosting 90+ employers and 2,000+ students; secured speakers and sponsors for flagship events. | Managed and mentored a team of External Reps and interns: ran weekly standups, scoped workstreams, and created onboarding playbooks. | Served as a career development resource for 60+ active members. | skip |
| Computer Science Representative & Webmaster | PASAE | May 2024 | May 2025 | Berkeley, CA | no | Academic liaison to CDSS and EECS students, providing them with academic resources and industry opportunities. | Spearheaded semester-long projects with a team of 3 interns, mentoring them to build personal websites in React.js and teaching game development fundamentals in Unreal Engine 5. | Managed PASAE's website, enhancing user experience and improving student access to resources and networking. | React, Java, C++, Unreal Engine 5, Web Design |
| Computer Science Representative Intern | PASAE | Sep 2023 | May 2024 | Berkeley, CA | no | Developed intern projects using C++, React.js, and Java, gaining an understanding of software engineering principles. | Used Unreal Engine 5 to learn game development fundamentals, gaining hands-on experience with game mechanics and 3D environments. | Led professional development workshops, such as LinkedIn and LeetCode workshops. | C++, React, Java, Unreal Engine 5 |
| Events Coordinator | KOSMOS @ Cal | May 2024 | Dec 2024 | Berkeley, CA | no | Partnered with multiple teams in UC Berkeley's dance community to coordinate and host joint socials and events, improving inter-team connectedness. | Organized and executed 2–3 monthly events, coordinating logistics, timelines, and communication across executives and board members, increasing member participation and engagement. |  | Event Planning |
| Tech Team | KOSMOS @ Cal | Feb 2024 | Dec 2024 | Berkeley, CA | no | Edited dance covers and their thumbnails with Lightroom, Premiere Pro, and Final Cut Pro. | Shadowed filmers during recordings of YouTube dance covers, which amassed 1,000+ views within 6 months. |  | Lightroom, Premiere Pro, Final Cut Pro |

- **Title + org** share one line at 17px; longer titles wrap to a second line, which is fine.
- **Start / End:** "Jun 2026" or "2026". Leave End blank for "Present".
- **Current?** "yes" for the role whose star twinkles (usually one).
- **Bullets:** 1–3 per role, full length from Jared's LinkedIn and resume (not shortened); long bullets wrap to 2–3 lines inside the open role.

## Projects

An editorial numbered index (01, 02, 03) with big serif titles. Each project opens into a card with a screenshot, a short summary and tech tags. Two featured projects, most impressive first.

| Field | Guide | Your content |
| --- | --- | --- |
| Heading | 2–5 words, ~40px serif | what i've made |

One row per featured project, in the order they should appear.

| Title | Type | Year | Summary | Tags | Screenshot file | Screenshot alt text |
| --- | --- | --- | --- | --- | --- | --- |
| Secure File Sharing System | Class project | 2025 | An encrypted file store in Go that stays safe on an untrusted server, with sharing, revocation and fast appends | Go, AES-CTR, HMAC, RSA | secure-file-sharing.png (in ~/website-content) | Flowchart of the secure file sharing system: user authentication, encrypted file storage as chunks, and sharing and revocation |
| Character-Level GPT | Class project | 2026 | Neural nets in PyTorch, from 97%+ MNIST to an RNN language ID and a transformer that writes Shakespeare | Python, PyTorch, Transformers | character-gpt.png (in ~/website-content) | Flowchart of the character-level GPT: training data, transformer model and sampling, with generated text at iteration 0 and 9,900 |

- **Title:** up to ~30 characters (it's set at 30px).
- **Type:** a couple of words, e.g. "Class project", "Game dev", "Web app", "Hackathon".
- **Summary:** what it is, what Jared built, what it does. 1–2 lines, up to ~140 characters.
- **Tags:** 2–4 technologies, comma-separated.
- **Screenshot:** a 16:10 image (e.g. 1600×1000 px), PNG or JPG. A plain screenshot works; no frame needed.
- **Alt text:** what the screenshot shows, in one short sentence.
- The "view project" pages come after launch, so no links are needed yet.

### More projects (for the /projects page, after launch)

Not on the home page. Kept here so the full list is ready when /projects is built; swap any of these into the featured two above.

| Title | Class | Term | Summary | Tags |
| --- | --- | --- | --- | --- |
| Reinforcement Learning Agents | CS 188 | Spring 2026 | Value iteration and Q-learning agents that learn Gridworld, a crawler robot and Pacman, which wins after 50 episodes | Python, Q-learning, MDPs |
| Ghostbusters | CS 188 | Spring 2026 | Pacman tracks invisible ghosts from noisy sonar using Bayes nets, exact inference and a particle filter | Python, Bayes nets, Particle filters |
| Pacman Search & Adversarial Agents | CS 188 | Spring 2026 | Path planning with DFS, BFS, UCS and A*, then minimax, alpha-beta and expectimax agents that play against ghosts | Python, A*, Minimax |
| Reliable Transport (TCP) | CS 168 | Spring 2026 | A subset of TCP: handshake, sliding window, out-of-order reassembly, teardown and RFC 6298 retransmission timers | Python, TCP |
| Distance-Vector Router | CS 168 | Spring 2026 | A routing protocol with split horizon, poison reverse and triggered updates, tested in a network simulator | Python, Routing |
| Traceroute | CS 168 | Spring 2026 | Traceroute built from scratch, including handling errors and misbehaving routers along the path | Networking |
| RISC-V CPU | CS 61C | Spring 2025 | A CPU that runs real RISC-V instructions, built in Logisim from the ALU, register file, immediate generator and control logic | Logisim, RISC-V |
| Neural Net Classifier in Assembly | CS 61C | Spring 2025 | A neural-net classifier in RISC-V assembly: matrix multiply, ReLU, argmax and matrix file I/O written by hand | RISC-V Assembly |
| Snek | CS 61C | Spring 2025 | A multi-snake game in C that loads boards from any stream, manages heap memory, and plays in the terminal | C, Valgrind |
| Ngordnet | CS 61B | Spring 2024 | A word explorer: NGram word-history charts plus a hand-built WordNet graph for hyponym queries, behind a web front end | Java, Graphs |
| 2048 | CS 61B | Spring 2024 | Game logic for 2048: tilting, merging and scoring | Java |
| PASAE Website | PASAE (Webmaster) | 2024–2025 | Updated the homepage, events, core team and archive pages of PASAE's public site, pasae.berkeley.edu | HTML, SCSS, JavaScript, PHP |
| Build Your Own World | CS 61B | Spring 2024 | A tile-based exploration game in Java: seeded rooms and hallways, a playable avatar, save/load and custom tile art | Java, Procedural generation |

## Connect

The last screen, at full night. The email and links come from "Links and files" above.

| Field | Where it shows | Guide | Your content |
| --- | --- | --- | --- |
| Heading | ~40px serif | 2–4 words, an invitation | reach out! |
| Line | Under the heading | One sentence inviting people to reach out, up to ~90 characters | I'd love to chat about anything! Looking for full-time work starting 2027. |

## Page metadata (for launch)

What shows in the browser tab, in Google results, and on link previews when the site is shared (iMessage, LinkedIn, Slack). Used in step 15, just before launch.

| Field | Where it shows | Guide | Your content |
| --- | --- | --- | --- |
| Page title | Browser tab, search results | Currently "Jared Narvaez". Keep it, or add a short role, e.g. "Jared Narvaez · software engineer" | Jared Narvaez · software engineer |
| Description | Search results, link previews | One sentence, up to ~150 characters. This doubles as the site's one-sentence purpose, which is still open | Jared Narvaez studies CS + Data Science at UC Berkeley and builds fullstack and AI/ML projects. Open to full-time roles in 2027. |
| Social preview image | The card shown when the link is shared | Optional file, 1200×630 px. Write `make one` and Claude Code will build it from the hero at golden hour | make one |

## Notes back to Claude Code

Answer these if you can (tick them off), and add anything that didn't fit a field.

- [x] **Experience:** besides bullets, should an open role show anything else, like tech tags or a link to a related project? (still open in the design doc)

  Answer: yes, show tech tags under the bullets (the Tags column in the experience table). No project link for now.
- [x] **Footer:** want a small line at the very bottom of the page (e.g. "designed and built by Jared Narvaez")? It isn't designed yet; yes or no is enough for now.

  Answer: yes, "designed and built by Jared Narvaez". Designed 2026-10-16: one plain line, 12px, ~60% cream, left-aligned under connect (visual-system.md → Footer).
- [ ] **Italic:** the surname is italic. Should italic appear anywhere else in this copy? (still open in the design doc)

  Answer: not sure yet. Keep italic to the surname for now.
- [ ] **Anything else** for Claude Code:
  - Facts, experience, projects and tech stack come from the swe and ds/ml/ai resumes (Oct 7) plus the planning doc. Experience bullets are now full length, taken from Jared's LinkedIn (Oct 16) with only typo fixes.
  - Email is jaredrnarvaez@gmail.com, the address on the resumes.
  - Only PhysaFlow is marked current so one star twinkles; other roles with no End still show "Present".
  - Projects come from the course specs (61B Sp24, 61C Sp25, 161 Fa25, 168 and 188 Sp26) and the code on Jared's laptop. Featured on the home page: only Secure File Sharing and Character-Level GPT (Jared's pick); every other project is in "More projects". Still to add: which BYOW ambition features Jared built (e.g. enemies, line of sight, light sources) and this site once live.
  - TypeScript, Next.js and Tailwind are in the stack because this site is built with them; they're not on the resumes yet.

Beyond code (the photo scrapbook) is parked until after launch, so it has no fields here.
