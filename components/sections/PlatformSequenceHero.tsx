'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import {
  COMPANIES,
  HeroSceneRenderer,
  INDEPENDENT,
  TIMELINE,
  VERTICALS,
  buildScene,
  smoothstep,
} from '@/lib/hero-scene'

/**
 * Hero: a scroll-scrubbed sequence. The section is pinned (CSS sticky) for a
 * few screens of scrolling, and scroll position *is* the timeline — the same
 * mechanic as a frame-sequence hero, except every frame is rendered live from
 * lib/hero-scene.ts instead of being downloaded.
 */

const STAGES = [
  {
    title: 'Acquire',
    caption: 'We buy proven manufacturers — strong fundamentals, clean regulatory records, each one running on its own.',
  },
  {
    title: 'Integrate',
    caption: 'The ROVA framework connects procurement, manufacturing and distribution across every site.',
  },
  {
    title: 'Scale',
    caption: 'Shared platforms and services turn separate plants into one manufacturing powerhouse.',
  },
]

const LEGEND = [{ label: 'Independent', rgb: INDEPENDENT }, ...VERTICALS]

const rgb = (c: readonly number[]) => `rgb(${c.join(',')})`

function frameInsets(width: number) {
  return width >= 768 ? { top: 92, side: 16, bottom: 16 } : { top: 84, side: 12, bottom: 12 }
}

const ease = [0.16, 1, 0.3, 1] as const

export function PlatformSequenceHero() {
  const reduced = useReducedMotion() ?? false

  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const copyRef = useRef<HTMLDivElement>(null)
  const cueRef = useRef<HTMLDivElement>(null)
  const storyRef = useRef<HTMLDivElement>(null)
  const legendRef = useRef<HTMLUListElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const stageRefs = useRef<Array<HTMLLIElement | null>>([])
  const barRefs = useRef<Array<HTMLSpanElement | null>>([])
  const captionRefs = useRef<Array<HTMLParagraphElement | null>>([])
  const labelRefs = useRef<Array<HTMLDivElement | null>>([])

  useEffect(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const canvas = canvasRef.current
    const frame = frameRef.current
    const border = borderRef.current
    const copy = copyRef.current
    const cue = cueRef.current
    const story = storyRef.current
    const legend = legendRef.current
    const scrim = scrimRef.current
    if (!section || !viewport || !canvas || !frame || !border || !copy || !cue || !story || !legend || !scrim) return

    const width = viewport.clientWidth
    const scene = buildScene(width < 640 ? 420 : width < 1024 ? 560 : 760, viewport.clientHeight / width)
    const renderer = new HeroSceneRenderer(canvas, scene)
    let dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => renderer.resize(viewport.clientWidth, viewport.clientHeight, dpr)
    resize()

    if (reduced) {
      // One still frame: the fragmented field and the distant core, nothing moves.
      const still = () => {
        resize()
        renderer.render(0, 0)
      }
      still()
      canvas.style.opacity = '1'
      const ro = new ResizeObserver(still)
      ro.observe(viewport)
      return () => ro.disconnect()
    }

    const readProgress = () => {
      const rect = section.getBoundingClientRect()
      const span = rect.height - viewport.clientHeight
      return span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0
    }

    let activeStage = -1
    const labelSide = COMPANIES.map(() => '')

    const updateOverlay = (p: number) => {
      const vw = viewport.clientWidth
      const vh = viewport.clientHeight

      // The framed card opens to full bleed as you fly in.
      const open = smoothstep(0, 0.14, p)
      const inset = frameInsets(vw)
      const top = inset.top * (1 - open)
      const side = inset.side * (1 - open)
      const bottom = inset.bottom * (1 - open)
      const radius = 28 * (1 - open)
      frame.style.clipPath = `inset(${top}px ${side}px ${bottom}px ${side}px round ${radius}px)`
      border.style.top = `${top}px`
      border.style.left = `${side}px`
      border.style.right = `${side}px`
      border.style.bottom = `${bottom}px`
      border.style.borderRadius = `${radius}px`
      border.style.opacity = String(1 - open)

      // Intro copy steps aside once the story starts.
      const out = smoothstep(0, 0.055, p)
      copy.style.opacity = String(1 - out)
      copy.style.transform = `translate3d(0, ${-out * 48}px, 0)`
      copy.style.visibility = out > 0.99 ? 'hidden' : 'visible'
      cue.style.opacity = String(1 - smoothstep(0, 0.025, p))

      // Story UI: stage rail, captions, legend.
      const ui = String(smoothstep(0.05, 0.09, p))
      story.style.opacity = ui
      legend.style.opacity = ui
      scrim.style.opacity = ui
      const stage = p < TIMELINE.stages[1] ? 0 : p < TIMELINE.stages[2] ? 1 : 2
      if (stage !== activeStage) {
        activeStage = stage
        stageRefs.current.forEach((el, k) => el?.toggleAttribute('data-active', k === stage))
        captionRefs.current.forEach((el, k) => el?.toggleAttribute('data-active', k === stage))
      }
      barRefs.current.forEach((bar, k) => {
        if (!bar) return
        const s0 = TIMELINE.stages[k]
        const s1 = TIMELINE.stages[k + 1]
        bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (p - s0) / (s1 - s0)))})`
      })

      // Company labels ride along with their hub node for a moment after acquisition.
      COMPANIES.forEach((_, k) => {
        const el = labelRefs.current[k]
        if (!el) return
        const isl = scene.islands[k]
        const node = scene.companyHubs[k]
        const hold = TIMELINE.labelHold
        let o =
          smoothstep(isl.acquireAt, isl.acquireAt + 0.012, p) *
          (1 - smoothstep(isl.acquireAt + hold - 0.013, isl.acquireAt + hold, p)) *
          (1 - smoothstep(isl.integrateAt - 0.01, isl.integrateAt + 0.01, p))
        const x = renderer.px[node]
        const y = renderer.py[node]
        if (!renderer.front[node]) o = 0
        o *= smoothstep(1.0, 1.5, renderer.pz[node])
        // keep clear of the navbar and the story UI
        if (x < 16 || x > vw - 16 || y < 96 || y > vh - 210) o = 0
        el.style.opacity = String(o)
        if (o <= 0.001) return
        const labelOnLeft = x > vw / 2
        const sideName = labelOnLeft ? 'left' : 'right'
        if (sideName !== labelSide[k]) {
          labelSide[k] = sideName
          el.dataset.side = sideName
        }
        el.style.transform = labelOnLeft
          ? `translate3d(${x}px, ${y}px, 0) translate(-100%, -50%)`
          : `translate3d(${x}px, ${y}px, 0) translateY(-50%)`
      })
    }

    let progress = readProgress()
    let last = performance.now()
    const start = last
    let raf = 0
    let inView = true
    let shown = false
    let slowFrames = 0
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!inView || document.hidden) {
        last = now
        return
      }
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now

      const target = readProgress()
      progress += (target - progress) * (1 - Math.exp(-dt * 12))
      if (Math.abs(target - progress) < 0.0004) progress = target
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 2.5))
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 2.5))

      renderer.render(progress, (now - start) / 1000, pointer.x, pointer.y)
      updateOverlay(progress)
      if (!shown) {
        canvas.style.opacity = '1'
        shown = true
      }

      // Can't hold ~40fps? Trade pixels for frames, a quarter step at a time.
      if (dt > 0.026 && now - start > 1500) slowFrames++
      else slowFrames = Math.max(0, slowFrames - 1)
      if (slowFrames > 45 && dpr > 1) {
        dpr = Math.max(1, dpr - 0.25)
        resize()
        slowFrames = 0
      }
    }
    raf = requestAnimationFrame(tick)

    const io = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting
    })
    io.observe(section)
    const ro = new ResizeObserver(resize)
    ro.observe(viewport)

    const finePointer = window.matchMedia('(pointer: fine)').matches
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / viewport.clientWidth - 0.5) * 2
      pointer.ty = -(e.clientY / viewport.clientHeight - 0.5) * 2
    }
    if (finePointer) viewport.addEventListener('pointermove', onPointer)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      viewport.removeEventListener('pointermove', onPointer)
    }
  }, [reduced])

  const rise = (delay: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, ease, delay },
        }

  return (
    <section
      ref={sectionRef}
      id="top"
      aria-labelledby="hero-heading"
      className={reduced ? 'relative h-[100svh]' : 'relative h-[400svh]'}
    >
      <div ref={viewportRef} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* The scene, clipped to the card frame until you fly in. */}
        <div ref={frameRef} className="hero-frame absolute inset-0 overflow-hidden bg-slate-950">
          {/* First-paint glow where the core will be, before the canvas is up. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'radial-gradient(22% 18% at 50% 48%, rgba(201,70,102,0.22), rgba(123,31,53,0.06) 55%, transparent 80%)' }}
          />
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-1000"
          />
          <div
            ref={scrimRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0"
          />
        </div>
        <div
          ref={borderRef}
          aria-hidden="true"
          className="hero-frame-border pointer-events-none absolute rounded-[28px] border border-white/[0.08]"
        />

        {/* Intro copy */}
        <div
          ref={copyRef}
          className="absolute inset-x-0 top-0 z-10 flex flex-col items-center px-6 pt-[calc(84px+9vh)] text-center will-change-transform md:pt-[calc(92px+12vh)]"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(58% 55% at 50% 55%, rgba(10,11,16,0.85) 0%, rgba(10,11,16,0) 100%)' }}
          />
          <motion.p
            {...rise(0.1)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium tracking-wide text-slate-300 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-coral shadow-[0_0_10px_2px_rgba(232,146,124,0.6)]" />
            Healthcare manufacturing holding
          </motion.p>

          <motion.h1
            {...rise(0.2)}
            id="hero-heading"
            className="mt-7 font-display text-[clamp(2.25rem,6.6vw,6.25rem)] font-bold leading-[0.95] tracking-[-0.035em] text-slate-50"
          >
            Thousands of manufacturers.
            <br />
            <span className="text-coral">One platform.</span>
          </motion.h1>

          <motion.p
            {...rise(0.32)}
            className="mt-7 max-w-2xl text-base leading-7 text-slate-300 md:text-lg md:leading-8"
          >
            Merova acquires, integrates and scales pharmaceutical manufacturers across generics, contract
            manufacturing and specialty products.
          </motion.p>

          <motion.div {...rise(0.44)} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#platform"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-coral-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-light focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Explore the platform
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-slate-100 backdrop-blur-md transition-colors hover:border-coral/50 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Investor inquiry
            </a>
          </motion.div>
        </div>

        {!reduced && (
          <>
            {/* Portfolio companies, labelled at the moment they're acquired. */}
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
              {COMPANIES.map((company, k) => (
                <div
                  key={company.name}
                  ref={(node) => {
                    labelRefs.current[k] = node
                  }}
                  data-side="right"
                  className="absolute left-0 top-0 flex items-center opacity-0 will-change-transform data-[side=left]:flex-row-reverse"
                >
                  <span className="h-px w-6 shrink-0 bg-white/30" />
                  <div className="rounded-lg border border-white/10 bg-slate-950/80 px-3 py-2">
                    <p className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: rgb(VERTICALS[company.vertical].rgb) }} />
                      Acquired
                    </p>
                    <p className="mt-1 whitespace-nowrap text-sm font-semibold text-slate-50">{company.name}</p>
                    <p className="whitespace-nowrap text-xs text-slate-400">{company.meta}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stage rail: the order is the real sequence — acquire, then integrate, then scale. */}
            <div
              ref={storyRef}
              className="absolute inset-x-5 bottom-6 z-10 opacity-0 sm:inset-x-auto sm:bottom-9 sm:left-9 sm:w-[27rem]"
            >
              <ol className="grid grid-cols-3 gap-4">
                {STAGES.map((stage, k) => (
                  <li
                    key={stage.title}
                    ref={(node) => {
                      stageRefs.current[k] = node
                    }}
                    className="group"
                  >
                    <p className="flex items-baseline gap-2">
                      <span className="text-[11px] font-medium tabular-nums tracking-[0.14em] text-slate-500 transition-colors duration-500 group-data-[active]:text-coral">
                        0{k + 1}
                      </span>
                      <span className="font-display text-sm font-semibold text-slate-500 transition-colors duration-500 group-data-[active]:text-slate-50 sm:text-base">
                        {stage.title}
                      </span>
                    </p>
                    <span className="mt-2.5 block h-px overflow-hidden bg-white/10">
                      <span
                        ref={(node) => {
                          barRefs.current[k] = node
                        }}
                        className="block h-full origin-left bg-coral"
                      style={{ transform: 'scaleX(0)' }}
                      />
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-4 grid">
                {STAGES.map((stage, k) => (
                  <p
                    key={stage.title}
                    ref={(node) => {
                      captionRefs.current[k] = node
                    }}
                    className="text-sm leading-6 text-slate-300 opacity-0 transition-opacity duration-500 [grid-area:1/1] data-[active]:opacity-100"
                  >
                    {stage.caption}
                  </p>
                ))}
              </div>
            </div>

            {/* Colour key for the scene. */}
            <ul
              ref={legendRef}
              aria-label="Colour key"
              className="absolute bottom-9 right-9 z-10 hidden flex-col items-end gap-2 text-xs text-slate-400 opacity-0 md:flex"
            >
              {LEGEND.map((item) => (
                <li key={item.label} className="flex items-center gap-2">
                  {item.label}
                  <span className="h-2 w-2 rounded-full" style={{ background: rgb(item.rgb) }} />
                </li>
              ))}
            </ul>

            <div
              ref={cueRef}
              aria-hidden="true"
              className="pointer-events-none absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400"
            >
              Scroll
              <span className="relative block h-10 w-px overflow-hidden bg-white/10">
                <span className="hero-cue absolute inset-x-0 top-0 h-1/2 bg-coral" />
              </span>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
