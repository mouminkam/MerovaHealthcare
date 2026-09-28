'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { HEADQUARTERS, portfolioCompanies, type PortfolioCompany } from '@/lib/portfolio'
import { verticalColor } from '@/lib/verticals'
import { easeOutExpo, inView, reveal, revealGroup } from '@/lib/animations'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Exhibit } from '@/components/ui/Exhibit'

// ── Map projection ──────────────────────────────────────────────────────────
// Equirectangular crop from Boston to Hyderabad; longitude is squeezed ~0.9x
// so shapes stay sensible at these latitudes. Positions are the real sites.

const W = 720
const H = 330
const PAD = 22
const LON = [-80, 90] as const
const LAT = [10, 60] as const

function project([lat, lon]: readonly [number, number]) {
  return {
    x: PAD + ((lon - LON[0]) / (LON[1] - LON[0])) * (W - 2 * PAD),
    y: PAD + ((LAT[1] - lat) / (LAT[1] - LAT[0])) * (H - 2 * PAD),
  }
}

/** Where each site's label sits relative to its node, so nearby cities don't collide. */
const LABEL_OFFSET: Record<string, { dx: number; dy: number; anchor: 'start' | 'middle' | 'end' }> = {
  pharmatech: { dx: -12, dy: 4, anchor: 'end' },
  'generic-plus': { dx: 0, dy: 26, anchor: 'middle' },
  'biomed-contract': { dx: -12, dy: 4, anchor: 'end' },
  'sterile-solutions': { dx: 12, dy: -6, anchor: 'start' },
  neurogen: { dx: 0, dy: 24, anchor: 'middle' },
}

const STATUS_LABEL: Record<PortfolioCompany['status'], string> = {
  Active: 'Active',
  Integration: 'In integration',
  Growth: 'Growth',
}

const city = (c: PortfolioCompany) => c.location.split(',')[0]

function PortfolioMap({ focusId, onFocus }: { focusId: string; onFocus: (id: string) => void }) {
  const reduced = useReducedMotion() ?? false
  const hq = project(HEADQUARTERS.coordinates)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Portfolio sites plotted by latitude and longitude, each connected to the Zurich headquarters">
      <defs>
        <filter id="portfolio-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      {/* Graticule */}
      {[-75, -60, -45, -30, -15, 0, 15, 30, 45, 60, 75, 90].map((lon) => {
        const { x } = project([0, lon])
        return <line key={`m${lon}`} x1={x} y1={PAD} x2={x} y2={H - PAD} className="stroke-white/[0.05]" />
      })}
      {[20, 30, 40, 50].map((lat) => {
        const { y } = project([lat, 0])
        return (
          <g key={`p${lat}`}>
            <line x1={PAD} y1={y} x2={W - PAD} y2={y} className="stroke-white/[0.05]" />
            <text x={PAD + 4} y={y - 5} className="fill-slate-600 font-mono text-[9px]">
              {lat}°N
            </text>
          </g>
        )
      })}
      {[-60, -30, 0, 30, 60].map((lon) => {
        const { x } = project([0, lon])
        return (
          <text key={`l${lon}`} x={x + 4} y={H - PAD - 6} className="fill-slate-600 font-mono text-[9px]">
            {lon === 0 ? '0°' : `${Math.abs(lon)}°${lon < 0 ? 'W' : 'E'}`}
          </text>
        )
      })}

      {/* Arcs from headquarters */}
      {portfolioCompanies.map((c, i) => {
        const p = project(c.coordinates)
        const mx = (hq.x + p.x) / 2
        const my = (hq.y + p.y) / 2
        const dist = Math.hypot(p.x - hq.x, p.y - hq.y)
        const d = `M ${hq.x} ${hq.y} Q ${mx} ${my - dist * 0.28} ${p.x} ${p.y}`
        const lit = focusId === c.id
        const color = verticalColor(c.category)
        return (
          <g key={c.id}>
            {lit ? <path d={d} fill="none" stroke={color} strokeWidth={5} opacity={0.35} filter="url(#portfolio-glow)" /> : null}
            {/* the lit link carries a flow of pulses from headquarters out to the site */}
            {lit ? <path d={d} fill="none" stroke="#fff4ee" strokeWidth={1.6} strokeLinecap="round" className="portfolio-flow" /> : null}
            <motion.path
              d={d}
              fill="none"
              stroke={color}
              strokeWidth={lit ? 1.8 : 1.1}
              strokeOpacity={lit ? 1 : 0.4}
              strokeLinecap="round"
              className="transition-[stroke-opacity,stroke-width] duration-300"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.2, ease: easeOutExpo, delay: 0.3 + i * 0.12 }}
            />
          </g>
        )
      })}

      {/* Headquarters */}
      <circle cx={hq.x} cy={hq.y} r={7} fill="none" className="stroke-slate-200" strokeWidth={1.2} />
      <circle cx={hq.x} cy={hq.y} r={2.4} className="fill-slate-100" />
      <text x={hq.x - 12} y={hq.y + 18} textAnchor="end" className="fill-slate-300 font-mono text-[10px] uppercase tracking-[0.12em]">
        Zurich · HQ
      </text>

      {/* Sites */}
      {portfolioCompanies.map((c) => {
        const p = project(c.coordinates)
        const lit = focusId === c.id
        const color = verticalColor(c.category)
        const label = LABEL_OFFSET[c.id] ?? { dx: 10, dy: 4, anchor: 'start' as const }
        return (
          <g key={c.id} className="cursor-pointer" onMouseEnter={() => onFocus(c.id)} onClick={() => onFocus(c.id)}>
            {lit && !reduced ? (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={6}
                fill="none"
                stroke={color}
                strokeWidth={1}
                initial={{ r: 6, opacity: 0.9 }}
                animate={{ r: 18, opacity: 0 }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            ) : null}
            <circle cx={p.x} cy={p.y} r={lit ? 11 : 8} fill={verticalColor(c.category, 0.3)} filter="url(#portfolio-glow)" />
            <circle cx={p.x} cy={p.y} r={lit ? 6.5 : 5} fill={color} />
            <circle cx={p.x} cy={p.y} r={14} fill="transparent" />
            <text
              x={p.x + label.dx}
              y={p.y + label.dy}
              textAnchor={label.anchor}
              className={`font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${lit ? 'fill-slate-50' : 'fill-slate-400'}`}
            >
              {city(c)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function Portfolio() {
  const [openId, setOpenId] = useState(portfolioCompanies[0].id)
  const [hoverId, setHoverId] = useState<string | null>(null)
  const focusId = hoverId ?? openId

  return (
    <section id="portfolio" aria-labelledby="portfolio-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="portfolio-heading"
          eyebrow="Portfolio"
          title={
            <>
              Five companies.
              <br />
              <span className="text-coral">Three continents. One platform.</span>
            </>
          }
          lede="Our portfolio spans three continents, integrating leading pharmaceutical manufacturing capabilities across generics, CMO, and specialty segments."
        />

        <div className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="lg:sticky lg:top-28">
              <Exhibit label="Exhibit 4" title="Portfolio sites" note="Plotted by latitude & longitude">
                <div onMouseLeave={() => setHoverId(null)}>
                  <PortfolioMap focusId={focusId} onFocus={(id) => setHoverId(id)} />
                </div>
              </Exhibit>
            </div>
          </div>

          <motion.ul
            variants={revealGroup}
            initial="hidden"
            whileInView="visible"
            viewport={inView}
            className="lg:col-span-5"
            onMouseLeave={() => setHoverId(null)}
          >
            {portfolioCompanies.map((c) => {
              const open = openId === c.id
              const color = verticalColor(c.category)
              return (
                <motion.li key={c.id} variants={reveal} className="border-t border-white/[0.08] last:border-b">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`company-${c.id}`}
                    onClick={() => setOpenId(c.id)}
                    onMouseEnter={() => setHoverId(c.id)}
                    onFocus={() => setHoverId(c.id)}
                    onBlur={() => setHoverId(null)}
                    className="group flex w-full items-center gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-coral"
                  >
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 shrink-0 rounded-full transition-shadow duration-500"
                      style={{ background: color, boxShadow: focusId === c.id ? `0 0 14px 3px ${verticalColor(c.category, 0.5)}` : 'none' }}
                    />
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate font-display text-lg font-semibold tracking-[-0.01em] transition-colors md:text-xl ${
                          focusId === c.id ? 'text-slate-50' : 'text-slate-300'
                        }`}
                      >
                        {c.name}
                      </span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">
                        {c.category} · {city(c)} · {c.year}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${open ? 'rotate-180 text-slate-200' : ''}`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open ? (
                      <motion.div
                        id={`company-${c.id}`}
                        key="details"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: easeOutExpo }}
                        className="overflow-hidden"
                      >
                        <div className="pb-7 pl-[1.625rem]">
                          <p className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-300">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.status === 'Integration' ? 'var(--coral)' : c.status === 'Growth' ? 'var(--specialty)' : 'var(--independent)' }} />
                            {STATUS_LABEL[c.status]}
                          </p>
                          <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-300">{c.description}</p>
                          <dl className="mt-5 flex flex-wrap gap-x-10 gap-y-4">
                            {Object.entries(c.metrics).map(([key, value]) => (
                              <div key={key} className="flex flex-col-reverse">
                                <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-slate-500">{key}</dt>
                                <dd className="font-display text-xl font-bold tracking-[-0.02em] text-slate-50">{value}</dd>
                              </div>
                            ))}
                          </dl>
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.li>
              )
            })}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
