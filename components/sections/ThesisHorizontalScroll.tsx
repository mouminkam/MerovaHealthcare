'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { getLenis } from '@/lib/lenis'
import { easeOutExpo } from '@/lib/animations'
import { portfolioCompanies } from '@/lib/portfolio'
import { INDEPENDENT, VERTICAL_INDEX, VERTICALS, rgb } from '@/lib/verticals'
import { Eyebrow } from '@/components/ui/SectionHeader'

// ── Exhibits ────────────────────────────────────────────────────────────────

const grow = { initial: { scaleX: 0 }, whileInView: { scaleX: 1 }, viewport: { once: true, amount: 0.6 } }
const tick = 'font-mono text-[10px] uppercase tracking-[0.14em] fill-slate-500'

/** 150 dots, each ≈ 100 independent manufacturers. */
function FragmentationExhibit() {
  const cols = 25
  return (
    <svg viewBox="0 0 520 132" className="w-full" role="img" aria-label="150 dots, each representing about 100 independent manufacturers">
      {Array.from({ length: 150 }, (_, i) => (
        <motion.circle
          key={i}
          cx={10 + (i % cols) * 20.8}
          cy={12 + Math.floor(i / cols) * 21.6}
          r={3.1}
          fill={rgb(INDEPENDENT)}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: [0, 0.9, 0.55] }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: ((i * 37) % 150) / 150 }}
        />
      ))}
    </svg>
  )
}

/** Entry at 1x; the target value creation sits between 3x and 5x. */
function ConsolidationExhibit() {
  const x = (m: number) => 16 + (m / 6) * 488
  return (
    <svg viewBox="0 0 520 120" className="w-full" role="img" aria-label="Value scale: entry at 1x, target value creation between 3x and 5x">
      <line x1={x(0)} y1={70} x2={x(6)} y2={70} className="stroke-white/15" strokeWidth={1} />
      {[0, 1, 2, 3, 4, 5, 6].map((m) => (
        <g key={m}>
          <line x1={x(m)} y1={66} x2={x(m)} y2={74} className="stroke-white/25" strokeWidth={1} />
          <text x={x(m)} y={96} textAnchor="middle" className={tick}>
            {m}x
          </text>
        </g>
      ))}
      <motion.rect
        x={x(3)}
        y={58}
        width={x(5) - x(3)}
        height={24}
        rx={12}
        fill="var(--coral)"
        fillOpacity={0.9}
        style={{ transformOrigin: `${x(3)}px 70px` }}
        {...grow}
        transition={{ duration: 1, ease: easeOutExpo, delay: 0.2 }}
      />
      <text x={(x(3) + x(5)) / 2} y={44} textAnchor="middle" className="fill-slate-200 font-mono text-[11px] uppercase tracking-[0.14em]">
        Target
      </text>
      <circle cx={x(1)} cy={70} r={6} className="fill-slate-950" stroke={rgb(INDEPENDENT)} strokeWidth={2} />
      <text x={x(1)} y={44} textAnchor="middle" className={tick}>
        Entry
      </text>
      <motion.path
        d={`M ${x(1) + 10} 70 L ${x(3) - 8} 70`}
        stroke="var(--coral)"
        strokeWidth={1.5}
        strokeDasharray="3 4"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />
    </svg>
  )
}

/** Standalone cost base vs. after integration (25–40% lower). */
function IntegrationExhibit() {
  return (
    <div className="space-y-5" role="img" aria-label="Cost base after integration is 25 to 40 percent lower than standalone">
      <div>
        <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
          <span>Standalone cost base</span>
          <span>100%</span>
        </div>
        <motion.div className="h-6 origin-left rounded-full bg-white/[0.12]" {...grow} transition={{ duration: 1, ease: easeOutExpo }} />
      </div>
      <div>
        <div className="mb-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
          <span>After integration</span>
          <span className="text-coral">60–75%</span>
        </div>
        <div className="relative h-6">
          <motion.div
            className="absolute inset-y-0 left-0 origin-left rounded-full bg-coral"
            style={{ width: '60%' }}
            {...grow}
            transition={{ duration: 1, ease: easeOutExpo, delay: 0.25 }}
          />
          <motion.div
            className="absolute inset-y-0 origin-left rounded-r-full bg-coral/30"
            style={{ left: '60%', width: '15%' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.1 }}
          />
          <div className="absolute inset-y-0 left-[75%] right-0 rounded-r-full border border-dashed border-white/15" />
        </div>
      </div>
    </div>
  )
}

/** The portfolio's revenue today, stacked by company, against the $1B target. */
function ScaleExhibit() {
  const companies = [...portfolioCompanies]
    .sort((a, b) => a.year - b.year)
    .map((c) => ({ name: c.name, value: Number((c.metrics.revenue ?? '0').replace(/[^0-9.]/g, '')), color: VERTICALS[VERTICAL_INDEX[c.category]].rgb }))
  const total = companies.reduce((s, c) => s + c.value, 0)
  const scale = (v: number) => (v / 1000) * 100
  let offset = 0
  return (
    <div role="img" aria-label={`Portfolio revenue today is $${total}M against a $1B target`}>
      <div className="mb-3 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">
        <span>
          Today <span className="text-slate-200">${total}M</span>
        </span>
        <span>
          Target <span className="text-coral">$1B+</span>
        </span>
      </div>
      <div className="relative h-7 rounded-full border border-dashed border-white/15">
        {companies.map((c, i) => {
          const left = offset
          offset += scale(c.value)
          return (
            <motion.div
              key={c.name}
              className="absolute inset-y-0 origin-left first:rounded-l-full"
              style={{ left: `${left}%`, width: `calc(${scale(c.value)}% - 2px)`, background: rgb(c.color) }}
              {...grow}
              transition={{ duration: 0.7, ease: easeOutExpo, delay: 0.15 + i * 0.12 }}
            />
          )
        })}
      </div>
      <div className="mt-2 flex justify-between font-mono text-[10px] text-slate-600">
        {['$0', '$250M', '$500M', '$750M', '$1B'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs text-slate-400 sm:grid-cols-3">
        {companies.map((c) => (
          <li key={c.name} className="flex items-center gap-2">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: rgb(c.color) }} />
            <span className="truncate">{c.name}</span>
            <span className="font-mono text-slate-500">${c.value}M</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/** $1 compounding at a 20% IRR — lands on the 2.5–3x MOIC target across the hold period. */
function ReturnsExhibit() {
  const X = (t: number) => 40 + (t / 7) * 460
  const Y = (m: number) => 190 - ((m - 1) / 3) * 160
  const pts = Array.from({ length: 8 }, (_, t) => ({ t, m: Math.pow(1.2, t) }))
  const path = pts.map((p, i) => `${i ? 'L' : 'M'} ${X(p.t).toFixed(1)} ${Y(p.m).toFixed(1)}`).join(' ')
  return (
    <svg viewBox="0 0 520 220" className="max-h-56 w-full" role="img" aria-label="Growth of 1x at 20% a year: about 2.5x by year 5 and 3.6x by year 7">
      <rect x={X(0)} y={Y(3)} width={X(7) - X(0)} height={Y(2.5) - Y(3)} fill="var(--coral)" fillOpacity={0.08} />
      <text x={X(0) + 8} y={Y(3) + 14} className={tick}>
        MOIC target 2.5–3x
      </text>
      {[1, 2, 3, 4].map((m) => (
        <g key={m}>
          <line x1={X(0)} y1={Y(m)} x2={X(7)} y2={Y(m)} className="stroke-white/[0.06]" />
          <text x={X(0) - 10} y={Y(m) + 3} textAnchor="end" className={tick}>
            {m}x
          </text>
        </g>
      ))}
      {pts.map((p) => (
        <text key={p.t} x={X(p.t)} y={212} textAnchor="middle" className={tick}>
          Y{p.t}
        </text>
      ))}
      <motion.path
        d={path}
        fill="none"
        stroke="var(--coral)"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1.4, ease: easeOutExpo }}
      />
      {[5, 7].map((t) => (
        <g key={t}>
          <circle cx={X(t)} cy={Y(Math.pow(1.2, t))} r={4.5} fill="var(--coral)" />
          <text x={X(t)} y={Y(Math.pow(1.2, t)) - 12} textAnchor="middle" className="fill-slate-200 font-mono text-[11px]">
            {Math.pow(1.2, t).toFixed(1)}x
          </text>
        </g>
      ))}
    </svg>
  )
}

// ── Content ─────────────────────────────────────────────────────────────────

interface Slide {
  id: string
  /** Label in the step rail. */
  short: string
  title: string
  subtitle: string
  content: string
  stat: { value: string; label: string }
  exhibit: ReactNode
  caption: string
}

const slides: Slide[] = [
  {
    id: 'fragmentation',
    short: 'Fragmentation',
    title: 'Market fragmentation',
    subtitle: 'The problem',
    content:
      'The pharmaceutical manufacturing landscape is highly fragmented with thousands of small to mid-sized facilities operating in isolation, leading to inefficiencies, quality inconsistencies, and untapped potential.',
    stat: { value: '15,000+', label: 'Fragmented manufacturers globally' },
    exhibit: <FragmentationExhibit />,
    caption: 'Each dot ≈ 100 independent manufacturers',
  },
  {
    id: 'consolidation',
    short: 'Consolidation',
    title: 'Strategic consolidation',
    subtitle: 'Our approach',
    content:
      'Merova identifies undervalued pharmaceutical manufacturing assets with strong fundamentals, regulatory compliance, and growth potential for strategic acquisition and integration.',
    stat: { value: '3–5x', label: 'Value creation potential' },
    exhibit: <ConsolidationExhibit />,
    caption: 'Multiple of entry value',
  },
  {
    id: 'integration',
    short: 'Integration',
    title: 'Operational integration',
    subtitle: 'The process',
    content:
      'Post-acquisition, we implement our proprietary ROVA framework to optimize operations, achieve synergies across procurement, manufacturing, and distribution networks.',
    stat: { value: '25–40%', label: 'Operational efficiency gains' },
    exhibit: <IntegrationExhibit />,
    caption: 'Cost base, indexed to standalone',
  },
  {
    id: 'scale',
    short: 'Scale',
    title: 'Platform scale',
    subtitle: 'The outcome',
    content:
      'Unified technology platforms, shared services, and cross-selling opportunities create a healthcare manufacturing powerhouse with sustainable competitive advantages.',
    stat: { value: '$1B+', label: 'Combined revenue target' },
    exhibit: <ScaleExhibit />,
    caption: 'Annual revenue by portfolio company',
  },
  {
    id: 'returns',
    short: 'Returns',
    title: 'Superior returns',
    subtitle: 'The result',
    content:
      'Our buy-and-build strategy delivers attractive risk-adjusted returns through operational improvements, multiple expansion, and strategic growth initiatives.',
    stat: { value: '20%+', label: 'Target IRR' },
    exhibit: <ReturnsExhibit />,
    caption: 'Multiple of invested capital at a 20% IRR',
  },
]

function Panel({ slide, index }: { slide: Slide; index: number }) {
  return (
    <div className="mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-5">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
          <span className="text-coral">0{index + 1}</span> / 0{slides.length} · {slide.subtitle}
        </p>
        <h3 className="mt-5 font-display text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-slate-50">
          {slide.title}
        </h3>
        <p className="mt-6 max-w-md text-base leading-7 text-slate-300 md:text-lg md:leading-8">{slide.content}</p>
      </div>
      <figure className="rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-6 md:p-9 lg:col-span-7">
        <p className="font-display text-[clamp(3.5rem,7vw,6.5rem)] font-bold leading-none tracking-[-0.045em] text-coral">
          {slide.stat.value}
        </p>
        <p className="mt-3 text-slate-400">{slide.stat.label}</p>
        <div className="mt-10">{slide.exhibit}</div>
        <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{slide.caption}</figcaption>
      </figure>
    </div>
  )
}

export function ThesisHorizontalScroll() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const barRefs = useRef<Array<HTMLSpanElement | null>>([])
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([])
  const triggerRef = useRef<ScrollTrigger | null>(null)
  // Horizontal, pinned storytelling on large screens with motion allowed; a plain stack otherwise.
  const [horizontal, setHorizontal] = useState(false)

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)')
    const update = () => setHorizontal(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!horizontal || !sectionRef.current || !trackRef.current) return
    const track = trackRef.current
    const last = slides.length - 1

    const setRail = (p: number) => {
      const pos = p * last
      const active = Math.round(pos)
      barRefs.current.forEach((bar, i) => {
        if (bar) bar.style.transform = `scaleX(${Math.min(1, Math.max(0, pos - i + 1))})`
      })
      stepRefs.current.forEach((step, i) => step?.toggleAttribute('data-active', i === active))
    }

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: { snapTo: 1 / last, duration: { min: 0.2, max: 0.45 }, delay: 0.08, ease: 'power2.inOut' },
          onUpdate: (self) => setRail(self.progress),
          onRefresh: (self) => {
            triggerRef.current = self
            setRail(self.progress)
          },
        },
      })
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, sectionRef)

    return () => {
      triggerRef.current = null
      ctx.revert()
    }
  }, [horizontal])

  const goTo = (i: number) => {
    const st = triggerRef.current
    if (!st) return
    const y = st.start + ((st.end - st.start) * i) / (slides.length - 1)
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(y, { duration: 1.1 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section ref={sectionRef} id="thesis" aria-labelledby="thesis-heading" className="relative overflow-hidden">
      <div className={horizontal ? 'absolute inset-x-0 top-0 z-20 section-padding pt-28' : 'section-padding pt-28 md:pt-36'}>
        <div className="mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-8">
          <div>
            <Eyebrow>Investment thesis</Eyebrow>
            <h2
              id="thesis-heading"
              className="mt-5 font-display text-[clamp(2rem,2.8vw,2.625rem)] font-bold leading-[1.05] tracking-[-0.035em] text-slate-50"
            >
              From fragmentation <span className="text-coral">to returns.</span>
            </h2>
          </div>
          {horizontal ? (
            <ol className="grid w-[31rem] shrink-0 grid-cols-5 gap-3" aria-label="Thesis steps">
              {slides.map((slide, i) => (
                <li key={slide.id}>
                  <button
                    type="button"
                    ref={(node) => {
                      stepRefs.current[i] = node
                    }}
                    onClick={() => goTo(i)}
                    className="group block w-full text-left focus-visible:outline-none"
                  >
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-slate-600 transition-colors group-hover:text-slate-300 group-data-[active]:text-coral">
                      0{i + 1}
                    </span>
                    <span className="mt-1 block truncate text-xs text-slate-500 transition-colors group-hover:text-slate-200 group-focus-visible:text-slate-50 group-data-[active]:text-slate-50">
                      {slide.short}
                    </span>
                    <span className="mt-2 block h-px overflow-hidden bg-white/10">
                      <span
                        ref={(node) => {
                          barRefs.current[i] = node
                        }}
                        className="block h-full origin-left bg-coral"
                      style={{ transform: 'scaleX(0)' }}
                      />
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      </div>

      {horizontal ? (
        <div ref={trackRef} className="flex h-screen w-max items-center">
          {slides.map((slide, i) => (
            <div key={slide.id} className="flex h-full w-screen shrink-0 items-center section-padding pb-8 pt-56">
              <Panel slide={slide} index={i} />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-24 section-padding pb-28 pt-16 md:space-y-32 md:pb-36">
          {slides.map((slide, i) => (
            <Panel key={slide.id} slide={slide} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
