<p align="center">
  <img src=".github/assets/logo.png" alt="Merova Healthcare" width="300" />
</p>

<h1 align="center">Merova Healthcare — Investor Site</h1>

<p align="center">
  <em>Pharmaceutical manufacturers, acquired one by one and run as one platform.<br/>
  A hero that scrubs like a film — without shipping a single frame of it.</em>
</p>

<p align="center">
  <a href="https://merova-project-2.vercel.app/" target="_blank" rel="noopener noreferrer">
    <img alt="Live Demo" src="https://img.shields.io/badge/▶_LIVE_DEMO-merova--project--2.vercel.app-e8927c?style=for-the-badge&logoColor=white" />
  </a>
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img alt="GSAP" src="https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?logo=greensock&logoColor=white" />
  <img alt="Canvas" src="https://img.shields.io/badge/hero-hand--written_canvas-e8927c" />
</p>

---

## What this is

This is the investor-facing site for **Merova Healthcare**, a fictional holding company that acquires,
integrates and scales pharmaceutical manufacturers across three verticals — **generics**, **contract
manufacturing (CMO)** and **specialty products**. One long page walks an investor through the platform,
the investment thesis, the market, the portfolio, CMO capacity, the return model, leadership, the operating
framework and an inquiry form — each section built as a data exhibit, not a card with a number on it.

It's built the way you'd build the real thing: the hero is a scroll-scrubbed sequence rendered live on a
canvas, every chart is drawn from the site's own figures, and one colour vocabulary runs from the logo to
the footer.

> 🔗 **[merova-project-2.vercel.app](https://merova-project-2.vercel.app/)** is this exact repository,
> deployed as-is — click through instead of cloning it if you just want to see it running.
>
> There's no backend, no database and no API keys anywhere in this build, on purpose. Every company,
> person, figure and address on the site is invented, the contact address uses the reserved `.test`
> domain, and the inquiry form simulates sending — nothing leaves the browser. Clone it and it runs in
> under a minute.

## Getting started

```bash
npm install
npm run dev
```

Open **http://localhost:3000**. Nothing else to configure: no `.env` file, no seed step, no images to
download. The hero scene, the portfolio map and every chart are generated in the browser the moment the
page loads.

```bash
npm run build          # production build (runs the TypeScript check)
npm start               # serve the production build
```

## What's actually in the box

- **A film with no frames** — the hero is pinned for three screens of scrolling and scroll position *is*
  the timeline: a field of isolated manufacturers is acquired island by island, spirals inward, and locks
  into a geodesic sphere. Scroll up and it plays back exactly in reverse. Every frame is computed, so it's
  sharp on a 4K monitor and weighs nothing — see [the first worked example](#1-the-hero-used-to-weigh-12-mb-now-it-weighs-nothing).
- **The platform, explorable** — the Platform section redraws the hero's finished sphere; hover a vertical
  and its band lights up while the other two step back, next to that vertical's real portfolio companies.
- **Charts drawn from the site's own numbers** — circles sized by market value, the portfolio plotted by
  real latitude and longitude, CMO capacity on one linear scale, a Gantt investment timeline, and a
  compounding curve that shows the 20% IRR landing on the 2.5–3x MOIC target. No charting library, no
  decorative shapes pretending to be data.
- **A horizontal thesis** — five pinned panels (fragmentation → consolidation → integration → scale →
  returns) scrubbed sideways on desktop, each with its own exhibit, and a plain vertical stack on phones and
  with reduced motion.
- **Scroll-linked moments, used sparingly** — the ROVA letters fill as you scroll past them and the mission
  statement brightens word by word. Everything else simply rises in once.
- **Built to be read by everyone** — the headline is on screen from the first paint, captions and figures
  are real text, the inquiry type uses native radio inputs, and `prefers-reduced-motion` drops every pin
  and animation for still frames.

## Brand identity

The palette is the theme's own — slate, **coral `#e8927c`** and **burgundy `#c94666`**, with **peach
`#f7bea8`** — and colour always carries meaning: coral is Generics, burgundy is CMO, peach is Specialty and
slate is an independent manufacturer. The hero scene, the platform explorer, the portfolio map and every
legend read those colours from a single file, `lib/verticals.ts`, so they can't drift apart.

The logo above is the platform sphere reduced to seven nodes: a flat-top geodesic hexagon banded peach →
coral → burgundy around a glowing core, exactly the way the sphere at the end of the hero is banded.
`components/ui/Logo.tsx` renders it in the navigation and footer, and the browser tab icon (`app/icon.svg`)
is the same mark, so the tab and the header never disagree.

Type has three jobs: **Syne** for display, **Inter** for reading, **Geist Mono** for labels and figures.

## Page sections

```
/#top          hero — the scroll-scrubbed acquire → integrate → scale sequence
/#platform     Exhibit 1 — the sphere as an explorer, one band per vertical
/#thesis       five pinned panels, fragmentation to returns
/#market       Exhibits 2–3 — market size to scale, growth to 2030
/#portfolio    Exhibit 4 — the five sites plotted by coordinates, linked to Zurich
/#cmo          Exhibit 5 — capacity by dosage form, certifications, the production path
/#returns      Exhibits 6–7 — value creation by source, the investment timeline
/#leadership   executives and advisory board
/#rova         the four-step operating framework
/#mission      purpose, vision and mission
/#contact      the (simulated) investor inquiry form
```

## How it's put together

```
app/
  layout.tsx          Fonts (Syne, Inter, Geist Mono) and metadata.
  page.tsx            Section order — the whole site is one statically
                       prerendered page.
  globals.css         Theme tokens, including the three vertical colours.
  icon.svg            The Merova mark, as the favicon.
components/
  sections/           One file per section. PlatformSequenceHero pins itself
                       with CSS position: sticky; the thesis uses GSAP
                       ScrollTrigger.
  ui/                 Navbar (floating pill + scroll-spy), Logo, SectionHeader
                       and Exhibit — the pieces every section is built from.
lib/
  hero-scene.ts       The scene generator, timeline and canvas renderer —
                       used by the hero and, zoomed in, by the platform explorer.
  verticals.ts        The three verticals and their colours.
  portfolio.ts        Portfolio companies, site coordinates and headquarters —
                       shared by the Portfolio section, the hero's acquisition
                       labels and the thesis revenue chart.
```

## Two worked examples

### 1. The hero used to weigh 12 MB. Now it weighs nothing.

The original hero had a good idea and a heavy implementation: scrolling scrubbed through a **189-frame WebP
sequence** of AI-generated footage — a network condensing into a glowing sphere. It came to 12 MB, each frame
was 1280×720 stretched across the whole screen (so it was soft on anything larger than a laptop), the footage
was teal on a coral-and-burgundy site, and the headline didn't appear until you'd scrolled about a third of
the way through the pin.

The scroll-scrub was worth keeping; the frames weren't. `lib/hero-scene.ts` tells the same story as that
footage, but computes every frame from scroll progress: about 760 nodes in small islands, a camera that flies
through them, islands acquired one by one (the five real portfolio companies are labelled at the moment they're
acquired), then pulled in along curved paths to a Fibonacci-lattice sphere banded by vertical. Because every
position is a pure function of progress, scrolling back up replays it exactly in reverse, like an image
sequence — except there's a new frame for every scroll position instead of 189 fixed ones.

| | Before | After |
| --- | --- | --- |
| Hero assets | 189 images · 12 MB | 0 images |
| Whole page | 12 MB+ | 420 KB |
| Sharpness | 720p, stretched | native pixel density, capped at 2× |
| Headline visible | after ~30% of the pin | on first paint |
| JavaScript per frame | — | ~0.3 ms desktop, ~0.2 ms mobile |

### 2. The pin that started too early

After the redesign, a scripted pass through the page turned up something odd: jump straight to the Platform
section and the navigation briefly insisted you were reading the Thesis. Measuring the Thesis element at that
exact moment showed why — it was `position: fixed`, pinned on top of the viewport, while the page was still
well above it. A second later it corrected itself.

GSAP measures a pinned section's start position once, when the trigger is created. But everything above the
Thesis could still change height afterwards — most visibly when the web fonts finished loading and re-wrapped
every paragraph above it. The trigger kept its old, too-early start, and for a moment it pinned over the section
before it. The fix is a `ResizeObserver` on the sections above the pin plus a `document.fonts.ready` hook, both
calling `ScrollTrigger.refresh()`, so the start always tracks the real layout. The navigation's scroll-spy was
rewritten at the same time: instead of trusting `IntersectionObserver` events (which can arrive out of order while
GSAP re-measures), it measures which section holds the middle of the viewport once per frame. Checked afterwards
with real mouse-wheel scrolling in both directions, through the pin and back.

## Honest trade-offs

Nobody's portfolio project is finished, and pretending otherwise isn't useful to anyone evaluating
this code:

- **The canvas renders on the main thread.** The scene's own maths is cheap, but rasterising hundreds of glow
  sprites is the real cost on weak GPUs — so the hero steps its own resolution down if it can't hold ~40 fps.
  A WebGL version would scale to far denser scenes if the effect ever needed it.
- **Pinning the hero for three screens is a showcase choice.** On a content-heavy page you'd shorten the section
  (it's one class, `h-[400svh]`) or drop the pin.
- **The scene is built once for the viewport it loads in.** Rotating a phone keeps the original field proportions;
  it still resizes and stays sharp.
- **The portfolio map is a coordinate plot, not a basemap** — the sites on a graticule, no coastlines. It keeps
  map data and tiles out of the page, at the cost of geographic context.
- **The inquiry form doesn't send anything.** Reconnecting it means replacing `handleSubmit` in
  `components/sections/ContactSection.tsx` with a call to a real endpoint.
- **There are no automated tests yet.** Verification so far has been type-checking, production builds, and a
  scripted headless-browser pass over every section at desktop and phone sizes.
