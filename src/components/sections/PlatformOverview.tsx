'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { HeroSceneRenderer, buildScene } from '@/lib/hero-scene'
import { VERTICALS, rgb, type VerticalKey } from '@/lib/verticals'
import { portfolioCompanies } from '@/lib/portfolio'
import { inView, reveal, revealGroup } from '@/lib/animations'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Exhibit } from '@/components/ui/Exhibit'

const VERTICAL_COPY: Record<VerticalKey, { name: string; subtitle: string; description: string; metrics: { label: string; value: string }[] }> = {
  Generics: {
    name: 'Generics',
    subtitle: 'Cost-effective pharmaceutical production',
    description:
      'Manufacturing high-quality generic medications that provide affordable healthcare solutions while maintaining rigorous quality standards.',
    metrics: [
      { label: 'Products', value: '200+' },
      { label: 'Markets', value: '45' },
    ],
  },
  CMO: {
    name: 'CMO services',
    subtitle: 'Contract manufacturing excellence',
    description:
      'Full-service contract manufacturing organization capabilities, offering end-to-end pharmaceutical production for global partners.',
    metrics: [
      { label: 'Partners', value: '50+' },
      { label: 'Capacity', value: '2B units' },
    ],
  },
  Specialty: {
    name: 'Specialty products',
    subtitle: 'Advanced therapeutic solutions',
    description:
      'Developing and manufacturing specialty pharmaceuticals for complex therapeutic areas including oncology, neurology, and rare diseases.',
    metrics: [
      { label: 'Pipeline', value: '35' },
      { label: 'Approvals', value: '12' },
    ],
  },
}

/** The hero's finished sphere, redrawn small: one band lights up, the rest step back. */
function PlatformSphere({ focus }: { focus: number }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const focusRef = useRef(focus)
  const redrawRef = useRef<(() => void) | null>(null)
  const reduced = useReducedMotion() ?? false

  useEffect(() => {
    focusRef.current = focus
    if (reduced) redrawRef.current?.()
  }, [focus, reduced])

  useEffect(() => {
    const box = boxRef.current
    const canvas = canvasRef.current
    if (!box || !canvas) return

    const scene = buildScene(box.clientWidth < 480 ? 360 : 560, 1)
    const renderer = new HeroSceneRenderer(canvas, scene)
    renderer.centerY = 0.5
    renderer.zoom = 1.35
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => renderer.resize(box.clientWidth, box.clientHeight, dpr)
    resize()

    const emphasis = new Float32Array([1, 1, 1])
    const target = (k: number) => (focusRef.current < 0 ? 1 : k === focusRef.current ? 1.3 : 0.12)

    if (reduced) {
      const still = () => {
        for (let k = 0; k < 3; k++) emphasis[k] = target(k)
        renderer.render(1, 0, 0, 0, emphasis)
      }
      redrawRef.current = still
      still()
      canvas.style.opacity = '1'
      const ro = new ResizeObserver(() => {
        resize()
        still()
      })
      ro.observe(box)
      return () => ro.disconnect()
    }

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    let raf = 0
    let visible = false
    let last = performance.now()
    const start = last

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (!visible || document.hidden) {
        last = now
        return
      }
      const dt = Math.min(0.1, (now - last) / 1000)
      last = now
      const k8 = 1 - Math.exp(-dt * 8)
      for (let k = 0; k < 3; k++) emphasis[k] += (target(k) - emphasis[k]) * k8
      pointer.x += (pointer.tx - pointer.x) * (1 - Math.exp(-dt * 3))
      pointer.y += (pointer.ty - pointer.y) * (1 - Math.exp(-dt * 3))
      renderer.render(1, (now - start) / 1000 + 40, pointer.x, pointer.y, emphasis)
      canvas.style.opacity = '1'
    }
    raf = requestAnimationFrame(tick)

    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting
    })
    io.observe(box)
    const ro = new ResizeObserver(resize)
    ro.observe(box)
    const onPointer = (e: PointerEvent) => {
      const r = box.getBoundingClientRect()
      pointer.tx = ((e.clientX - r.left) / r.width - 0.5) * 2
      pointer.ty = -((e.clientY - r.top) / r.height - 0.5) * 2
    }
    const onLeave = () => {
      pointer.tx = 0
      pointer.ty = 0
    }
    box.addEventListener('pointermove', onPointer)
    box.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      box.removeEventListener('pointermove', onPointer)
      box.removeEventListener('pointerleave', onLeave)
    }
  }, [reduced])

  return (
    <div ref={boxRef} className="relative aspect-[6/5] w-full">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(34% 36% at 50% 50%, rgba(201,70,102,0.16), transparent 75%)' }}
      />
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700" />
    </div>
  )
}

export function PlatformOverview() {
  const [hovered, setHovered] = useState(-1)
  const [locked, setLocked] = useState(-1)
  const focus = locked >= 0 ? locked : hovered

  return (
    <section id="platform" aria-labelledby="platform-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="platform-heading"
          eyebrow="The platform"
          title={
            <>
              Three verticals.
              <br />
              <span className="text-coral">One operating platform.</span>
            </>
          }
          lede="Merova unifies pharmaceutical manufacturing across generics, contract services and specialty products — three businesses, one shared platform underneath."
        />

        <div className="mt-16 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-14">
          <div className="lg:order-2 lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <Exhibit label="Exhibit 1" title="The platform, by vertical" note="Hover a vertical">
                <PlatformSphere focus={focus} />
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Verticals">
                  {VERTICALS.map((v, k) => (
                    <li key={v.key}>
                      <button
                        type="button"
                        aria-pressed={locked === k}
                        onMouseEnter={() => setHovered(k)}
                        onMouseLeave={() => setHovered(-1)}
                        onFocus={() => setHovered(k)}
                        onBlur={() => setHovered(-1)}
                        onClick={() => setLocked((current) => (current === k ? -1 : k))}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-white/25 hover:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral aria-pressed:border-white/30 aria-pressed:bg-white/[0.06] aria-pressed:text-slate-50"
                      >
                        <span className="h-2 w-2 rounded-full" style={{ background: rgb(v.rgb) }} />
                        {v.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </Exhibit>
            </div>
          </div>

          <motion.ol
            variants={revealGroup}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="lg:order-1 lg:col-span-5"
          >
            {VERTICALS.map((v, k) => {
              const copy = VERTICAL_COPY[v.key]
              const companies = portfolioCompanies.filter((c) => c.category === v.key)
              const dimmed = focus >= 0 && focus !== k
              return (
                <motion.li key={v.key} variants={reveal}>
                  <button
                    type="button"
                    aria-pressed={locked === k}
                    onMouseEnter={() => setHovered(k)}
                    onMouseLeave={() => setHovered(-1)}
                    onFocus={() => setHovered(k)}
                    onBlur={() => setHovered(-1)}
                    onClick={() => setLocked((current) => (current === k ? -1 : k))}
                    className="group relative block w-full border-t border-white/[0.08] py-8 pl-6 text-left transition-opacity duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-coral"
                    style={{ opacity: dimmed ? 0.45 : 1 }}
                  >
                    {/* the band's colour runs down the edge of the row that's lit */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-y-8 left-0 w-px origin-top transition-transform duration-500"
                      style={{ background: rgb(v.rgb), transform: `scaleY(${focus === k ? 1 : 0.25})` }}
                    />
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="h-2.5 w-2.5 rounded-full transition-shadow duration-500"
                          style={{
                            background: rgb(v.rgb),
                            boxShadow: focus === k ? `0 0 14px 3px ${rgb(v.rgb, 0.55)}` : 'none',
                          }}
                        />
                        <span className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-50 md:text-[1.75rem]">
                          {copy.name}
                        </span>
                      </span>
                      <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                        {companies.length} {companies.length === 1 ? 'company' : 'companies'}
                      </span>
                    </span>
                    <span className="mt-2 block text-sm text-slate-400">{copy.subtitle}</span>
                    <span className="mt-4 block max-w-md text-[15px] leading-7 text-slate-300">{copy.description}</span>
                    <span className="mt-6 flex gap-10">
                      {copy.metrics.map((m) => (
                        <span key={m.label}>
                          <span className="block font-display text-2xl font-bold tracking-[-0.02em] text-slate-50">{m.value}</span>
                          <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{m.label}</span>
                        </span>
                      ))}
                    </span>
                    <span className="mt-6 block text-xs leading-5 text-slate-500">
                      <span className="font-mono uppercase tracking-[0.14em]">Portfolio</span>
                      <span className="mx-2 text-slate-700">/</span>
                      {companies.map((c) => c.name).join(', ')}
                    </span>
                  </button>
                </motion.li>
              )
            })}
          </motion.ol>
        </div>
      </div>
    </section>
  )
}
