# jarnarvz.com

Jared Narvaez's personal site: one evening, from golden hour to night, as you scroll.

**Live:** https://jarnarvz.com

## Stack

- **Next.js 16** (App Router), **React 19**, **TypeScript**
- **Tailwind CSS 4**, plus CSS variables that the sky writes as it changes
- **Canvas 2D** for the sky (no graphics library)
- **Motion** for UI transitions
- **Simple Icons** for the tech stack logos
- **Newsreader**, **Schibsted Grotesk** and **IBM Plex Mono**, loaded with `next/font`
- **Vitest** for the sky's color math
- **Vercel** for hosting
- **MDX** is set up for the upcoming project pages

## How it's built

```
src/
  app/          the home page, root layout and metadata; /lab is a dev-only tuning page (404 in production)
  components/   one component per section (Hero, Intro, TechStack, Experience, Projects, Connect, ...)
  lib/sky/      the sky's color math as plain, tested functions, kept apart from the drawing code
  data/         all site content as typed TypeScript files
docs/           the design docs the site was built from
```

**The sky drives the whole page.** `Sky.tsx` works out the current moment (from scroll progress, the time dial, or the visitor's local time) and draws the scene on a tiny canvas. The canvas is upscaled once with smoothing (the blur) and again without it (crisp 4px squares), with animated film grain on top. Whenever the moment changes, it writes live values such as ink, accent and grain strength to CSS variables on the root element. Components read those variables, so colors change with the sky without React re-rendering the page.

The color math lives in `src/lib/sky/` as pure functions (keyframes in, colors out) with Vitest tests, so the colors can be checked without a browser.

**Content lives in the repo.** Each section reads from its own file in `src/data/` (`experience.ts`, `projects.ts`, `techStack.ts`, `intro.ts`, ...), each with a TypeScript type for its shape. Updating the site means editing those files; there's no CMS. Projects are one list, and a `featured` flag picks which ones appear on the home page.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # Vitest
npm run lint
npm run build      # production build
```

To test on a phone on the same Wi-Fi, run `npm run dev:phone` and open the "Network:" URL it prints. While it runs, use that URL on the laptop too; `localhost:3000` won't load.

**Deploying:** Vercel builds `main` for production at jarnarvz.com, and every pushed branch gets its own preview URL.

## How it was designed

### Process

The process follows Samuel Rizzon's [How this site was built](https://www.samuelrizzon.dev/log/how-this-site-was-built):

- **One central metaphor.** Every later decision traces back to it.
- **One thing at a time.** Get one section right, then move on.
- **Options, then react.** Compare a few versions side by side, then choose.
- **Keep what's rejected.** Each rejected option is logged with the reason.
- **Test like a stranger on a real phone** before calling anything done.

### Finding the metaphor

The first metaphor was a junk journal / scrapbook. The hero mockups (a notebook spread, a journal cover, a desk scrapbook) read as bland, and literal props like tickets, stamps and tape were dropped. A "torn-paper editorial" look came next, but the torn edges had no reason behind them. Pages torn from a journal, peeling back layers, a topographic map, a constellation and a dance formation were all proposed and rejected.

Instead of picking from more suggestions, the next step was reflection on two questions: what *place* feels right (sunsets and big views over the ocean, warm colors meeting the incoming night) and what *feeling* (nostalgia, like looking at old photos, while still quirky and warm). That gave the metaphor: **golden hour.** The site is one evening, and scrolling sets the sun.

<!-- TODO (Jared): in your words, why golden hour? -->

### Three decisions

**1. Golden hour drives the whole page.** The hero is always golden hour and the contact section is always full night; the sky in between follows overall scroll progress. The same idea replaced a generic light/dark toggle: the sun being up *is* light mode, and visitors can pick any hour on a 24-hour dial or use their own local time.
*Rejected:* a separate sky stage per section; a standard theme toggle.

**2. A pixelated, blurred sky instead of smooth gradients.** The scene is drawn on a tiny canvas, blurred by upscaling, then pixelated into 4px squares with film grain on top. That avoids the smooth "AI gradient" look while staying soft, and the squares stay 4px on every screen size.
*Rejected:* a WebGL shader (harder to tweak), pixel shimmer (looked low resolution in motion), stippled dither (too busy at night).

**3. The sky writes CSS variables, not React state.** Sky state recolors nearly everything on the page, and it changes continuously as you scroll. Writing it to CSS variables on the root element lets every component follow the sky without re-rendering the app. One React app shell holds that state easily, which is also why Next.js was picked.
*Rejected:* Astro with React islands (the sky state would have to cross isolated islands), SvelteKit (a new framework in the middle of recruiting).

### References

- [drewmanley.vercel.app](https://drewmanley.vercel.app): the atmospheric background, looping tech stack rows, collapsible work section, centered column
- [samuelrizzon.dev](https://www.samuelrizzon.dev): the design process, and interactivity
- [adixcode.com](https://adixcode.com): the tech stack marquee, and live widgets (planned)
- [imdaryl.com](https://imdaryl.com): the draggable photo scrapbook (planned for "beyond code")

### Working with Claude

Design happened in a Claude.ai project: options were mocked up as live, interactive prototypes over the animated sky, and each decision was logged in a Notion planning doc. The site was then built in Claude Code from those docs, one reviewed step at a time. All of the site's copy is Jared's own.

<!-- TODO (Jared): how you want Claude credited here, and anything you'd add about how the collaboration worked. -->

### Full history

- [`docs/design.md`](docs/design.md): principles and the current state of every decision
- [`docs/decisions-log.md`](docs/decisions-log.md): every decision with its date, reason and what was rejected
- [`docs/visual-system.md`](docs/visual-system.md): exact colors, type, layout and the motion inventory
- [`docs/reference/home-mockup.html`](docs/reference/home-mockup.html): the approved full home page mockup

## What's next

1. **Leave a star:** visitors click the night sky in the contact section to leave a star
2. **/projects** and project detail pages
3. **Beyond code**, a draggable photo scrapbook on the home page, and a **/scrapbook** page
4. **Live widgets** (now playing, location) in the hero
5. **Easter eggs**

---

designed and built by Jared Narvaez
