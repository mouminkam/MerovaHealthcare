'use client'

import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { fadeUpVariant, defaultViewport } from '@/lib/animations'

const thesisSlides = [
  {
    id: 'fragmentation',
    number: '01',
    title: 'Market Fragmentation',
    subtitle: 'The Problem',
    content: 'The pharmaceutical manufacturing landscape is highly fragmented with thousands of small to mid-sized facilities operating in isolation, leading to inefficiencies, quality inconsistencies, and untapped potential.',
    stat: { value: '15,000+', label: 'Fragmented manufacturers globally' },
  },
  {
    id: 'consolidation',
    number: '02',
    title: 'Strategic Consolidation',
    subtitle: 'Our Approach',
    content: 'Merova identifies undervalued pharmaceutical manufacturing assets with strong fundamentals, regulatory compliance, and growth potential for strategic acquisition and integration.',
    stat: { value: '3-5x', label: 'Value creation potential' },
  },
  {
    id: 'integration',
    number: '03',
    title: 'Operational Integration',
    subtitle: 'The Process',
    content: 'Post-acquisition, we implement our proprietary ROVA framework to optimize operations, achieve synergies across procurement, manufacturing, and distribution networks.',
    stat: { value: '25-40%', label: 'Operational efficiency gains' },
  },
  {
    id: 'scale',
    number: '04',
    title: 'Platform Scale',
    subtitle: 'The Outcome',
    content: 'Unified technology platforms, shared services, and cross-selling opportunities create a healthcare manufacturing powerhouse with sustainable competitive advantages.',
    stat: { value: '$1B+', label: 'Combined revenue target' },
  },
  {
    id: 'returns',
    number: '05',
    title: 'Superior Returns',
    subtitle: 'The Result',
    content: 'Our buy-and-build strategy delivers attractive risk-adjusted returns through operational improvements, multiple expansion, and strategic growth initiatives.',
    stat: { value: '20%+', label: 'Target IRR' },
  },
]

// overview panel + 5 detail slides
const PANEL_COUNT = thesisSlides.length + 1

export function ThesisHorizontalScroll() {
  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !trackRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const track = trackRef.current
      if (!track) return

      const getScrollDistance = () => {
        const panels = track.querySelectorAll<HTMLElement>('[data-thesis-panel]')
        const finalPanel = panels[panels.length - 1]

        return Math.max(
          0,
          finalPanel ? finalPanel.offsetLeft : track.offsetWidth - window.innerWidth
        )
      }

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${getScrollDistance()}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          invalidateOnRefresh: true,
          ...(prefersReducedMotion
            ? {}
            : {
                snap: {
                  snapTo: 1 / (PANEL_COUNT - 1),
                  duration: { min: 0.15, max: 0.35 },
                  delay: 0.05,
                  ease: 'power2.inOut',
                },
              }),
        },
      })

      requestAnimationFrame(() => ScrollTrigger.refresh())
    }, containerRef)

    const onResize = () => ScrollTrigger.refresh()
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [])

  return (
    <section 
      id="thesis"
      ref={containerRef}
      className="relative overflow-hidden bg-[#111117]"
      aria-labelledby="thesis-heading"
    >
      {/* Section header (fixed during scroll) */}
      <div className="absolute top-0 left-0 right-0 z-20 section-padding pt-24 pb-0">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={fadeUpVariant}
        >
          <span className="text-sm font-medium text-coral uppercase tracking-wider">
            Investment Thesis
          </span>
          <h2 
            id="thesis-heading"
            className="mt-3 font-display text-4xl font-bold leading-tight text-slate-50 md:text-5xl lg:text-6xl"
          >
            Our Strategic Vision
          </h2>
        </motion.div>
      </div>

      {/* Horizontal scroll track */}
      <div 
        ref={trackRef}
        className="flex h-screen items-center"
        style={{ width: 'fit-content' }}
      >
        <div
          data-thesis-panel
          className="flex h-full w-screen flex-shrink-0 items-center section-padding pt-52 md:pt-56"
        >
          <div className="mx-auto w-full max-w-[90rem]">
            <div className="grid gap-6 md:grid-cols-5 lg:gap-8">
              {thesisSlides.map((slide) => (
                <div
                  key={slide.id}
                  className="flex min-h-56 flex-col rounded-[8px] border border-white/10 bg-white/[0.075] p-5 shadow-2xl shadow-black/20 lg:min-h-60 lg:p-6"
                >
                  <div className="font-display text-3xl font-bold leading-none text-coral/35">
                    {slide.number}
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-coral">
                    {slide.subtitle}
                  </p>
                  <h4 className="mt-2 break-words font-display text-lg font-bold leading-snug text-slate-50 lg:text-xl">
                    {slide.title}
                  </h4>
                  <div className="mt-auto pt-4">
                    <p className="font-display text-sm font-semibold text-slate-300">
                      {slide.stat.value}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500">
                      {slide.stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {thesisSlides.map((slide, index) => (
          <div
            key={slide.id}
            data-thesis-panel
            className="flex h-full w-screen flex-shrink-0 items-center section-padding pt-52 md:pt-56"
          >
            <div className="mx-auto w-full max-w-[86rem]">
              <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 xl:gap-20">
                {/* Content */}
                <div className="min-w-0">
                  <div className="mb-8 grid gap-4 md:grid-cols-[5.5rem_1fr] md:gap-6 lg:grid-cols-[6.5rem_1fr]">
                    <span className="font-display text-6xl font-bold leading-none text-coral/25 md:text-7xl">
                      {slide.number}
                    </span>
                    <div className="min-w-0">
                      <span className="text-xs font-semibold uppercase tracking-wider text-coral md:text-sm">
                        {slide.subtitle}
                      </span>
                      <h3 className="mt-2 max-w-xl break-words font-display text-3xl font-bold leading-tight text-slate-50 md:text-4xl lg:text-5xl">
                        {slide.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="max-w-prose text-base leading-relaxed text-slate-300 md:text-lg">
                    {slide.content}
                  </p>

                  {/* Progress dots */}
                  <div className="mt-10 flex gap-2.5" role="tablist" aria-label="Thesis progress">
                    {thesisSlides.map((_, i) => (
                      <div
                        key={i}
                        role="presentation"
                        className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${
                          i === index ? 'bg-coral' : 'bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Stat card */}
                <div className="relative min-w-0">
                  <div className="flex min-h-64 items-center justify-center rounded-[8px] border border-white/10 bg-slate-950/35 p-8 text-center shadow-2xl shadow-black/25 md:min-h-72 lg:min-h-80 lg:p-12">
                    <div className="max-w-xs">
                      <div className="mb-4 font-display text-5xl font-bold leading-none text-gradient md:text-6xl lg:text-7xl">
                        {slide.stat.value}
                      </div>
                      <div className="text-sm leading-relaxed text-slate-400 md:text-base">
                        {slide.stat.label}
                      </div>
                    </div>
                  </div>
                  
                  {/* Decorative element */}
                  <div className="absolute -z-10 top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2">
                    <div className="h-full w-full rotate-3 rounded-[8px] border border-coral/20" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111117] to-transparent" />
    </section>
  )
}
