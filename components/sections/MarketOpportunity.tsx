'use client'

import { motion } from 'framer-motion'
import { easeOutExpo, inView, reveal, revealGroup } from '@/lib/animations'
import { INDEPENDENT, VERTICALS, rgb } from '@/lib/verticals'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Exhibit } from '@/components/ui/Exhibit'

const MARKETS = [
  { label: 'Global pharma', value: 1400, display: '$1.4T', note: 'Total addressable market by 2025', color: INDEPENDENT, outline: true },
  { label: 'Generics', value: 680, display: '$680B', note: 'Generic pharmaceutical market value', color: VERTICALS[0].rgb, outline: false },
  { label: 'CMO', value: 180, display: '$180B', note: 'Contract manufacturing opportunity', color: VERTICALS[1].rgb, outline: false },
]

const CAGR = 0.082
const START_YEAR = 2025
const START_VALUE = 1.4 // $T

const drivers = [
  'Aging global population driving healthcare demand',
  'Patent cliff creating generics opportunities',
  'Reshoring of pharmaceutical manufacturing',
  'Increasing regulatory complexity favoring scale',
  'Healthcare cost pressures driving efficiency',
]

/** Circles with area proportional to value, standing on one baseline. */
function MarketCircles() {
  const R = 128
  const base = 282
  const centers = [150, 388, 540]
  return (
    <svg viewBox="0 0 640 300" className="w-full" role="img" aria-label="Market size: global pharma $1.4 trillion, generics $680 billion, CMO $180 billion">
      <line x1={10} y1={base} x2={630} y2={base} className="stroke-white/10" />
      {MARKETS.map((m, i) => {
        const r = R * Math.sqrt(m.value / MARKETS[0].value)
        const cx = centers[i]
        const cy = base - r
        return (
          <motion.g
            key={m.label}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.15 + i * 0.18 }}
            style={{ transformOrigin: `${cx}px ${base}px` }}
          >
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill={m.outline ? rgb(m.color, 0.06) : rgb(m.color, 0.9)}
              stroke={rgb(m.color, m.outline ? 0.5 : 1)}
              strokeWidth={1}
              strokeDasharray={m.outline ? '3 4' : undefined}
            />
            <text
              x={cx}
              y={cy + (i === 2 ? 6 : 10)}
              textAnchor="middle"
              className="font-display font-bold"
              style={{ fontSize: i === 2 ? 17 : i === 1 ? 28 : 34, letterSpacing: '-0.02em' }}
              fill={m.outline ? '#f1f2f4' : '#12060a'}
            >
              {m.display}
            </text>
          </motion.g>
        )
      })}
    </svg>
  )
}

/** The 8.2% CAGR carried forward to 2030. */
function GrowthLine() {
  const years = Array.from({ length: 6 }, (_, i) => START_YEAR + i)
  const values = years.map((_, i) => START_VALUE * Math.pow(1 + CAGR, i))
  const X = (i: number) => 24 + (i / 5) * 432
  const Y = (v: number) => 150 - ((v - 1.2) / 1.0) * 130
  const line = values.map((v, i) => `${i ? 'L' : 'M'} ${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ')
  const area = `${line} L ${X(5)} 160 L ${X(0)} 160 Z`
  return (
    <svg viewBox="0 0 480 186" className="w-full" role="img" aria-label={`At ${CAGR * 100}% a year the market grows from $1.4T in 2025 to about $${values[5].toFixed(1)}T in 2030`}>
      <defs>
        <linearGradient id="market-growth-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--coral)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--coral)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={area}
        fill="url(#market-growth-fill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1, delay: 0.6 }}
      />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--coral)"
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 1.3, ease: easeOutExpo }}
      />
      {[0, 5].map((i) => (
        <g key={i}>
          <circle cx={X(i)} cy={Y(values[i])} r={4} fill="var(--coral)" />
          <text x={X(i)} y={Y(values[i]) - 12} textAnchor={i ? 'end' : 'start'} className="fill-slate-100 font-mono text-[12px]">
            ${values[i].toFixed(1)}T
          </text>
        </g>
      ))}
      {years.map((y, i) => (
        <text key={y} x={X(i)} y={180} textAnchor="middle" className="fill-slate-500 font-mono text-[10px]">
          {y}
        </text>
      ))}
    </svg>
  )
}

export function MarketOpportunity() {
  return (
    <section id="market" aria-labelledby="market-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="market-heading"
          eyebrow="Market opportunity"
          title={
            <>
              A $1.4 trillion market.
              <br />
              <span className="text-coral">Still run plant by plant.</span>
            </>
          }
          lede="Demographics, patent expiries and reshoring keep growing demand for pharmaceutical manufacturing — while the supply side stays fragmented."
        />

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12">
          <Exhibit label="Exhibit 2" title="Market size" note="Circle area ∝ value" className="lg:col-span-7">
            <MarketCircles />
            <ul className="mt-8 grid gap-5 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
              {MARKETS.map((m) => (
                <li key={m.label}>
                  <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-300">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={m.outline ? { border: `1px dashed ${rgb(m.color)}` } : { background: rgb(m.color) }}
                    />
                    {m.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{m.note}</p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-5 text-slate-600">
              CMO is a services market, shown for scale — not as a slice of pharma sales.
            </p>
          </Exhibit>

          <Exhibit label="Exhibit 3" title="Market growth" note="Implied at 8.2% CAGR" className="flex flex-col lg:col-span-5">
            <p className="font-display text-[clamp(3rem,5vw,4.5rem)] font-bold leading-none tracking-[-0.045em] text-coral">8.2%</p>
            <p className="mt-3 text-slate-400">Annual growth, through 2030</p>
            <div className="mt-auto pt-10">
              <GrowthLine />
            </div>
          </Exhibit>
        </div>

        <motion.div
          variants={revealGroup}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12"
        >
          <motion.h3 variants={reveal} className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-50 lg:col-span-4">
            What&apos;s driving demand
          </motion.h3>
          <ul className="lg:col-span-8">
            {drivers.map((driver) => (
              <motion.li
                key={driver}
                variants={reveal}
                className="flex items-center gap-4 border-t border-white/[0.08] py-5 text-base text-slate-300 last:border-b md:text-lg"
              >
                <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-coral" />
                {driver}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
