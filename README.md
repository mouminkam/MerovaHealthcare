<h1 align="center">Merova Healthcare — Investor Site</h1>

<p align="center">
  <em>A single-page investor site for a pharmaceutical manufacturing holding.<br/>
  Its hero is a scroll-scrubbed sequence — rendered live, frame by frame, with no images to download.</em>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-12-0055FF?logo=framer&logoColor=white" />
</p>

---

## What this is

**Merova Healthcare** is a (fictional) holding company that acquires, integrates and scales pharmaceutical
manufacturers across three verticals — **generics**, **contract manufacturing (CMO)** and **specialty
products**. This is its investor-facing site: the platform, the investment thesis, the market opportunity,
portfolio companies, the return model, leadership, and an inquiry form.

> This is a portfolio demo. Every company, person, figure and address on the site is invented, the contact
> address uses the reserved `.test` domain, and the inquiry form simulates sending — nothing leaves the
> browser. There are no API keys, no `.env` file and no backend.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # production build (type-checked)
npm start          # serve the production build
```

## The hero: a scroll-scrubbed sequence, rendered live

The hero is pinned for three screens of scrolling, and scroll position *is* the timeline — scroll down and
the film plays forward, scroll up and it plays back, exactly like an Apple-style image-sequence hero. The
difference is that no frames are downloaded: every frame is computed from scroll progress in
`lib/hero-scene.ts`, a hand-written 2D canvas renderer with no dependencies.

It tells the site's own thesis in three stages, which the stage rail at the bottom tracks:

1. **Acquire.** The camera flies through a field of small, isolated manufacturer networks, all slate grey
   (independent). One by one they are acquired and light up in their vertical's colour — generics coral,
   CMO burgundy, specialty peach. The five portfolio companies (`lib/portfolio.ts`, the same data the
   Portfolio section renders) are labelled at the moment they're acquired.
2. **Integrate.** The islands peel off and spiral in toward a single point. The ones the camera has
   already passed rush in from behind the viewer, streaking with scroll speed.
3. **Scale.** They lock into a geodesic sphere — the platform — banded peach → coral → burgundy by
   vertical, links snapping in as each node lands, and a pulse radiates from its equator.

How it's built:

- **A pure function of progress.** Positions, colours and links are all derived from scroll progress (plus
  a little ambient time for drift, twinkle and slow rotation, so an idle page still breathes). That's what
  makes scrubbing backwards replay the sequence exactly in reverse.
- **Deterministic scene.** A seeded generator builds ~760 nodes on desktop (~420 on phones) in islands, a
  Fibonacci-lattice sphere assigned in latitude bands, and a nearest-neighbour mesh — identical on every
  load, so the composition is designed, not random.
- **Cinematic, cheaply.** 3D perspective with a look-at camera, fog, depth-of-field bokeh for nodes near the
  lens, additive glow sprites, and edges batched into colour × alpha buckets so thousands of links cost a
  few dozen strokes.
- **Resolution-independent.** Rendered at the device's pixel ratio (capped at 2×), so it's sharp on a 4K
  monitor and a phone alike. If a device can't hold ~40 fps, it steps its resolution down on its own.
- **Measured.** The scene's per-frame JavaScript costs about 0.3 ms on desktop and 0.2 ms on mobile — around
  2% of a 60 fps frame budget. The loop pauses when the hero is off screen or the tab is hidden.
- **Accessible.** The headline and CTAs are on screen from the first paint, the stage captions are real text,
  and with `prefers-reduced-motion` the section drops its pinning and shows a single still frame.

### Why it replaced the old hero

The previous hero had the same scroll-scrub idea, but played back a **189-frame WebP sequence (12 MB,
1280×720)** of AI-generated footage:

| | Before | After |
| --- | --- | --- |
| Hero assets | 189 images · 12 MB | 0 images |
| Whole page | 12 MB+ | 420 KB (the whole redesigned site) |
| Sharpness | 720p stretched to full screen | native pixel density |
| Smoothness | 189 fixed frames | a new frame for every scroll position |
| Headline visible | after scrolling ~30% of the pin | on first paint |
| Palette | teal footage on a burgundy/coral theme | the theme's own coral, burgundy and peach |

## One visual language, hero to footer

The rest of the site speaks the hero's language instead of repeating a card template:

- **One colour vocabulary.** Generics are coral, CMO is burgundy, Specialty is peach and independent
  manufacturers are slate — in the hero scene, the platform explorer, the portfolio map, every legend and
  every chart (`lib/verticals.ts`). Colour always means a vertical; it's never decoration.
- **A mark drawn from the sphere.** The logo is the platform sphere reduced to seven nodes — a flat-top
  geodesic hexagon banded peach → coral → burgundy around a core (`components/ui/Logo.tsx`, also the favicon).
- **Exhibits, not cards.** Data sits in framed figures captioned like an investor memo ("Exhibit 4 ·
  Portfolio sites"), and every chart is drawn from the site's own numbers.
- **Type with roles.** Syne for display, Inter for reading, Geist Mono for labels and figures.
- **Motion that echoes the scrub, in few places.** The ROVA letters fill as you scroll past them and the
  mission statement brightens word by word; everything else just rises in once.

## What's on the page

| Section | What it shows |
| --- | --- |
| Platform | The hero's finished sphere as an explorer — hover a vertical and its band lights while the others dim; each vertical lists its real portfolio companies |
| Thesis | Five pinned, horizontally scrubbed panels, each with an exhibit: a unit chart of 15,000+ manufacturers, the 3–5x value range, 25–40% cost reduction, today's $420M portfolio revenue stacked against the $1B target, and 20% IRR compounding onto the 2.5–3x MOIC target |
| Market | Circles with area proportional to market value, and the 8.2% CAGR carried to an implied ~$2.1T in 2030 (labelled as derived) |
| Portfolio | The five sites plotted by real latitude and longitude, linked to the Zurich headquarters; the lit link carries a flow of pulses |
| CMO | Capacity by dosage form on one linear scale, certifications, and the formulation → packaging path |
| Returns | The target terms, value creation as one 100% bar (operations, the ROVA lever, is the only coral segment), and a Gantt timeline with distributions and the exit window marked |
| Leadership | A roster with monograms ringed in the platform's bands |
| ROVA | The four steps under outlined letters that fill in order as you scroll |
| Mission | The purpose statement, brightening word by word as it's read |
| Contact | A simulated inquiry form with native radio pills and a proper sent state |

The navigation is a floating pill with a scroll-spy that measures which section holds the middle of the
viewport, so the highlight stays correct through the pinned thesis in both directions.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | **Next.js 16** (App Router, statically prerendered) + **React 19** |
| Styling | **Tailwind CSS v4** — brand tokens in `app/globals.css` (burgundy, coral, slate) |
| Motion | **GSAP ScrollTrigger** (thesis horizontal scroll), **Framer Motion** (reveals), **Lenis** (smooth scroll) |
| Hero | Hand-written 2D canvas renderer with 3D projection, pinned with CSS `position: sticky` — no WebGL, no libraries |
| Type | **Syne** (display) · **Inter** (text) · **Geist Mono** (labels, figures), self-hosted through `next/font` |
| Charts | Hand-built SVG and CSS — no charting library |

## Project structure

```text
app/
  layout.tsx            Fonts, metadata, viewport
  page.tsx              Section order
  globals.css           Theme tokens (incl. the vertical colours) + utilities
  icon.svg              Favicon — the Merova mark
components/
  sections/             One file per page section (PlatformSequenceHero, PlatformOverview, …)
  providers/            Lenis smooth-scroll provider
  ui/
    Navbar.tsx          Floating pill navigation with scroll-spy
    Logo.tsx            The mark and wordmark
    SectionHeader.tsx   Eyebrow + headline + lede, shared by every section
    Exhibit.tsx         The framed, captioned figure
    …                   shadcn/ui primitives
lib/
  hero-scene.ts         Scene generator, timeline and canvas renderer (hero + platform explorer)
  verticals.ts          The three verticals and their colours
  portfolio.ts          Portfolio companies, site coordinates and HQ
  gsap.ts, lenis.ts     GSAP/Lenis setup
  animations.ts         Shared Framer Motion variants
```

## Honest trade-offs

- The canvas renders on the main thread. The scene's own maths is cheap (~0.3 ms a frame), but rasterising
  hundreds of glow sprites is the real cost on weak GPUs — hence the automatic resolution step-down. A WebGL
  version would scale to far denser scenes if the effect ever needed it.
- Pinning the hero for three screens is a deliberate choice for a showcase piece; on a content-heavy page
  you'd shorten the section (it's one class: `h-[400svh]`) or drop the pin.
- The scene is built once for the viewport it loads in, so rotating a phone keeps the original field
  proportions (it still resizes and stays sharp).
- The platform explorer runs a second canvas, but only while it's on screen, and the hero's canvas stops once
  you scroll past it — the two only overlap briefly at the hand-over between the sections.
- The portfolio map is a coordinate plot, not a basemap — no coastlines, just the sites on a graticule. It
  keeps the page free of map data and tiles, at the cost of geographic context.
- The inquiry form is simulated for the demo. Reconnecting it means replacing `handleSubmit` in
  `components/sections/ContactSection.tsx` with a call to a real endpoint.
- Several shadcn/ui primitives in `components/ui/` are unused by this page; they're kept as the project's
  component kit.
