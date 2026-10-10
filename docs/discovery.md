# Discovery

> Exported from Notion ("discovery", under the personal website planning doc) on 2026-10-09. Research and the history of how directions were found. Open this when revisiting why something was chosen, or for reference sites. Some early answers here (Fern palette, Manrope) were later superseded; `design.md` and `visual-system.md` are current.

## Reference sites

*4ish comparable personal sites as if I were the visitor: what works, what doesn't, where the flow feels awkward, what I can steal.*

| Site | What works | What doesn't / awkward flow | Steal this? |
|---|---|---|---|
| [drewmanley.vercel.app](https://drewmanley.vercel.app/#about) | i like the colors and the abstract background. everything is on theme, fitting the blue white gradient, even the github repos. | sometimes the scrolling can feel heavy? and i like the idea of a home page, but im not sure if its better to have a home page with absolutely everything, or a homepage with summaries of everything and tabs that go more in depth. | i like the colors and the artsy style, including the font, but i wouldnt steal it to the exact color |
| [samuelrizzon.dev](https://www.samuelrizzon.dev/) | the animations of everything when scrolling is so cool. the entire page has a theme, the 8bit font theme and the 8bit characters all over. i like the interactivity | i dont like the ai generated art images like the pixel art. the tabs on the top lead to other sections in the front page | i like the interactivity and the games that you can play |
| [adixcode.com](https://adixcode.com/) | custom cursor, different sizes when hovering. i like the layout of some of the specific sections like how the projects is layed out (idk if i would steal that) and how the tech stack specifically is displayed, very cool. i really like the integrations like the spotify and the globe where it shows where the person is located. | the different modules seem a bit borning tbh | |
| [imdaryl.com](https://imdaryl.com/) | the quirk of this website is very on theme with the owner, and is unique to him since he is a designer such as the measurments on the sides of the screen. i really like the section of like the polaroid scrapbook kinda. i like how that is also interactable and you can drag and drop his different photos. i really like the globe of all the user visitors, from not only the country but also the os and device the site was accessed in. and also it gives a unique ticket for this visitor, from location and os/device. also gives an option to download this ticket. i also like the timeline of accomplishments and goals | the projects/timeline with all the different tabs, dropdowns can get confusing and there is a lot in ur face when in that section | |

## Current solution audit

[jarednarvaez.vercel.app](https://jarednarvaez.vercel.app/) (the old "Create Next App" site):

- no title
- no icon
- no content in any pages
- no theme or design
- no url

## Brainstorm & answers

### Big-picture direction

- **Impression to leave:** a well-rounded person beyond code
- **Structure:** hybrid — home page as a hub, with dedicated detail pages per project
- **Vibe:** minimal & clean + warm & editorial

### Audience & content

- **Primary audience:** equal weight — recruiters and everyone else
- **Beyond-code content to show:** dance, PASAE / community leadership, game dev & creative projects, personal interests and other fun things
- **Home page first screen:** mix of option A (intro + photo) and option B (editorial statement)

### Interactivity

- **Level:** between "calm base with 1–2 signature moments" and "playful throughout" — likes animation, plus a couple of signature moments
- **Signature ideas:** draggable photo scrapbook, visitor globe / visitor ticket, live widgets (Spotify / now playing, location)

### Theme (early answers, superseded by golden hour)

- **Color:** Fern — richer green fading to white (light `#FAFCF8` bg, `#B9D9B4` gradient, `#3A7046` accent, `#1C2B20` text); dark mode deep forest `#0F1610` with `#2F5434` glow
- **Typography:** Newsreader (headings) + Manrope (body) — modern bookish, clean
- **Mode:** dark by default + light mode toggle

### Home page sections (superseded order)

- **Order:** hero → featured projects → tech stack (adixcode.com style) → experience (internship, VSPA, PASAE) → beyond code scrapbook (dance, PASAE, fun) → contact + visitor globe
- **Tech stack placement:** moved below projects so projects lead after the hero; projects carry their own stack tags
- **Tech stack style:** like adixcode.com — rows of tool logos grouped by category, scrolling sideways as marquees

## Exploration history

*How the direction was found, in order. Kept so rejected ideas aren't re-proposed.*

- **Central metaphor:** junk journal / scrapbook — metaphor liked, but first hero mockups (notebook spread, journal cover, desk scrapbook) rejected as bland and tacky; bright white background too harsh. Reference: papercraft site with textured kraft paper, paper-cut illustrated trees and clouds, layered depth. Unsure about a photo in the hero.
- **Metaphor vs. minimalism:** decided — clean, Drew-like layout + rich art-directed atmosphere (texture, depth, Fern greens); journal metaphor only as subtle touches, no literal props. Gathering visual references on a Pinterest board: [pin.it/UA1i1qpOx](https://pin.it/UA1i1qpOx)
- **Agreed pattern:** atmosphere (art-directed backdrop with depth and texture) under a clean, readable layout — not literal props.
- **Pinterest board** ([personal website design](https://pin.it/UA1i1qpOx), 7 pins): none matched Drew's vibe as strongly, but wants that vibe plus the metaphor while staying clean. Recurring threads: torn-paper edges between sections, real photography cut out and collaged (not drawn props), editorial serif or condensed headlines, cream paper texture, handwritten annotations. Closest blend of atmosphere + clean: the green landscape wedding site (pin 3).
- **Direction:** "torn-paper editorial" with Drew's minimalist, artistic abstract background. Prefers the dark version (dark default); wants more realistic torn edges. Concern: torn edges alone feel meaningless, so the metaphor is getting lost and needs a reason behind the paper. Neither "pages torn from my journal" nor "peeling back the layers" clicked; topographic map, constellation, and stage formation also proposed. Switching approach: discover a metaphor from personal reflection instead of picking from suggested ones.
- **Metaphor discovery answers:**
  - **Place:** sunsets and big views, especially from a mountain over the ocean or on a coast or beach. Loves the warm colors contrasting with the incoming night sky.
  - **Feeling:** nostalgia, like looking at old photos (part of why the scrapbook and photobooth ideas appeal), while still quirky, unique, and artistic. Warm feelings.
- **Metaphor chosen: Golden hour.** The site is one evening: scrolling sets the sun, from golden hour (intro) through sunset (work) and dusk (personal) to night (contact under the stars). Content appears as warm, captured moments (film photos, photobooth strips). Wants to keep the clean, minimalist, artistic vibe alongside it.
- **Palette impact:** golden hour implies sunset colors (gold, coral, rose, violet, indigo), which replaced Fern green.
- **Rendering style:** worried smooth sunset gradients read as "AI slop"; still loves Drew's background. Drew's background is a limited palette (a few flat blues + cream) joined by dithering (pixel-dot patterns) with a mountain silhouette — not a smooth gradient. Proposed: golden hour rendered the same way — flat sunset color bands joined by dithering, sun setting into the ocean, mountain silhouette.
  - Feedback on first dithered mockup: pixels too chunky, scene felt empty; wanted to see how the sky changes going down the page; open to blur. Next iteration: fine, pixel-size dithering; blurred far layers (clouds, headland) for depth with a sharp near ridge; fuller scene; frames for golden hour → dusk → night.
  - Wants it more pixelated but blurred overall: visible pixel structure, soft picture. Technique: blur the whole scene, then snap it to a square pixel grid (soft mosaic). Type stays crisp on top; at night, stars can be crisp single pixels.
  - Tuning: smaller pixels (~4px, down from 6px) without losing texture, and more blur for a moodier, dreamier feel. **Saved as the baseline.**
  - Exploring a variant: Pacific Northwest / Northern California coast sunset with fern and pine trees, to bring back the Fern green.
    - Feedback: taller trees reaching the middle/upper-middle of the hero; trees only, no ferns; much blurrier overall, especially the trees, to keep the dreamy feel.
    - Readability: the gold italic surname was hard to read against the gold and coral sky. Fix: both names in warm cream (surname stays italic), soft plum shadow behind the name, and a gentle darker vignette on the left of the sky. Rule: text must stay readable at every point of the sky's scroll transition.
    - Tested maximum blur (trees unrecognizable). Then removed trees: back to the pure coast sunset at maximum blur.
    - Idea floated: page loads at max blur and slowly settles into partial focus, like a memory coming back.
    - Prefers the max-blur open coast over the PNW tree version. Testing texture on the blur: A pixel shimmer (each pixel varies slightly), B film grain (fine grain over soft pixels), C stippled dither (colors step into bands with speckled edges, like Drew's).
    - Built a live animated prototype (golden hour → night, slider + play, texture toggle) to compare how each texture behaves in motion.
    - Feedback: shimmer reads as "low resolution" in motion (dropped). Likes film grain and dither for the abstract mood, but grain is too loud at bright golden hour and dither gets busy at night. Each works best at the opposite end of the evening. Next test: hybrid that uses dither at golden hour and hands off to grain as night falls; also tuned grain (lighter when bright) and tuned dither (calmer at night).
- **Accent exploration (resolved 2026-10-08):** the accent has to stay readable as the sky shifts gold → navy.
  - Greens: green flash (light), Sage, Fern, Moss. Darker greens were hard to read, Moss especially at night. Fern green fully retired.
  - Sun: Sun gold looks great on dark sky but is hard to read on bright golden hour. Honey and Apricot look good but are slightly hard to read on the first two sky states, which bothered me.
  - Star: First star is the easiest to read but clashes with the sunset colors. Starlight is a good balance but a bit bland alone. Twilight (lavender) was hard to read.
  - Treatments tested: A backed plum chip (reliable but adds UI chrome), B Starlight text + warm dot and underlines, C accent shifts from Starlight to warm as the sky darkens. Chose a B + C combo, then swapped the dot for a four-point sparkle ("the first star").
- **Typography revisit (resolved 2026-10-08):**
  - Headings: still liked Newsreader's modern bookish, clean feel. Fraunces and Instrument Serif felt too curvy; Literata not clean or mature enough. Compared similar serifs (Source Serif 4, Spectral, Crimson Pro, EB Garamond, Libre Caslon, Noto Serif Display), then found the real issue was the name's default spacing. Tuned it: tight letters, stacked, italic surname.
  - The italic surname was never a real decision; it carried over from early mockups. Kept after testing it by eye.
  - Body: wanted the feel of Anthropic Sans (not licensed for outside use). Chose Schibsted Grotesk from free quiet grotesks.
- **Vibe shift? (resolved by golden hour):** "minimal & clean" may no longer fit — the new reference is rich, textured, and illustrated. Settled as clean layout + rich atmosphere.
