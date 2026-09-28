'use client'

import { motion } from 'framer-motion'
import { easeOutExpo, inView, reveal, revealGroup } from '@/lib/animations'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Exhibit } from '@/components/ui/Exhibit'

const terms = [
  { label: 'Target IRR', value: '20%+', description: 'Net to investors' },
  { label: 'MOIC target', value: '2.5–3x', description: 'Multiple on invested capital' },
  { label: 'Hold period', value: '5–7 yrs', description: 'Expected investment horizon' },
  { label: 'Distributions', value: 'Annual', description: 'Dividend distributions begin Year 3' },
]

/** Operations is the largest lever — and the one Merova's ROVA framework owns — so it alone is coral. */
const levers = [
  { phase: 'Acquisition', share: 30, fill: 'rgba(255,255,255,0.16)', items: ['Entry multiple arbitrage', 'Distressed/carve-out opportunities', 'Off-market deal sourcing'] },
  { phase: 'Operations', share: 40, fill: 'var(--coral)', items: ['ROVA framework implementation', 'Procurement synergies', 'Manufacturing efficiency'] },
  { phase: 'Exit', share: 30, fill: 'rgba(255,255,255,0.3)', items: ['Platform premium', 'Strategic buyer interest', 'IPO optionality'] },
]

/** Phases on a 0–7 year axis; "Year 1–2" spans the start of year 1 to the end of year 2. */
const phases = [
  { label: 'Foundation', from: 0, to: 2, description: 'Initial acquisitions, integration planning' },
  { label: 'Integration', from: 1, to: 3, description: 'ROVA implementation, synergy capture' },
  { label: 'Optimization', from: 2, to: 5, description: 'Operational excellence, distributions begin' },
  { label: 'Harvest', from: 4, to: 7, description: 'Exit preparation, value realization' },
]

function ValueCreation() {
  return (
    <div>
      <div className="flex h-12 gap-1 overflow-hidden rounded-2xl" role="img" aria-label="Value creation: acquisition 30%, operations 40%, exit 30%">
        {levers.map((l, i) => (
          <motion.div
            key={l.phase}
            className="flex h-full origin-left items-center px-4"
            style={{ width: `${l.share}%`, background: l.fill }}
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease: easeOutExpo, delay: i * 0.15 }}
          >
            <span className={`font-display text-lg font-bold ${l.phase === 'Operations' ? 'text-slate-950' : 'text-slate-50'}`}>{l.share}%</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-7 grid grid-cols-3 gap-4">
        {levers.map((l) => (
          <div key={l.phase}>
            <p className={`font-mono text-[11px] uppercase tracking-[0.14em] ${l.phase === 'Operations' ? 'text-coral' : 'text-slate-300'}`}>{l.phase}</p>
            <ul className="mt-3 space-y-2">
              {l.items.map((item) => (
                <li key={item} className="text-sm leading-5 text-slate-400">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function Timeline() {
  const pct = (year: number) => `${(year / 7) * 100}%`
  return (
    <div role="img" aria-label="Investment timeline over seven years: foundation years 1–2, integration years 2–3, optimization years 3–5, harvest years 5–7; distributions begin in year 3">
      <div className="relative">
        {/* Distributions begin at the start of year 3 */}
        <div className="pointer-events-none absolute inset-y-0 z-10 border-l border-dashed border-coral/60" style={{ left: pct(2) }}>
          <span className="absolute -top-6 left-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.12em] text-coral">Distributions begin</span>
        </div>
        <ul className="space-y-3 pt-2">
          {phases.map((ph, i) => (
            <li key={ph.label} className="relative h-12">
              <motion.div
                className="absolute inset-y-0 flex origin-left flex-col justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] px-3"
                style={{ left: pct(ph.from), width: `calc(${pct(ph.to - ph.from)} - 4px)` }}
                initial={{ scaleX: 0, opacity: 0 }}
                whileInView={{ scaleX: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.1 + i * 0.12 }}
              >
                <span className="truncate text-sm font-medium text-slate-100">{ph.label}</span>
                <span className="hidden truncate text-[11px] text-slate-500 sm:block">{ph.description}</span>
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
      {/* Year axis */}
      <div className="relative mt-4 h-5 border-t border-white/10">
        {Array.from({ length: 8 }, (_, y) => (
          <span key={y} className="absolute top-2 -translate-x-1/2 font-mono text-[10px] text-slate-500" style={{ left: pct(y) }}>
            Y{y}
          </span>
        ))}
      </div>
      {/* Exit window: the 5–7 year hold */}
      <div className="relative mt-5 h-6">
        <div className="absolute top-0 h-2 rounded-b-md border border-t-0 border-white/20" style={{ left: pct(5), width: pct(2) }} />
        <span className="absolute top-3 font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400" style={{ left: pct(5) }}>
          Exit window
        </span>
      </div>
    </div>
  )
}

export function ReturnModel() {
  return (
    <section id="returns" aria-labelledby="returns-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="returns-heading"
          eyebrow="Return model"
          title={
            <>
              Where the returns
              <br />
              <span className="text-coral">come from.</span>
            </>
          }
          lede="Our dual-path return model combines operational improvements with strategic positioning to deliver attractive risk-adjusted returns."
        />

        <motion.dl
          variants={revealGroup}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-16 grid grid-cols-2 gap-y-10 border-y border-white/[0.08] py-10 lg:mt-20 lg:grid-cols-4 lg:divide-x lg:divide-white/[0.08]"
        >
          {terms.map((t) => (
            <motion.div key={t.label} variants={reveal} className="flex flex-col-reverse pr-6 lg:px-8 lg:first:pl-0">
              <dt className="mt-3">
                <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300">{t.label}</span>
                <span className="mt-1 block text-sm text-slate-500">{t.description}</span>
              </dt>
              <dd className="font-display text-[clamp(2rem,3.4vw,3rem)] font-bold leading-none tracking-[-0.04em] text-slate-50">{t.value}</dd>
            </motion.div>
          ))}
        </motion.dl>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <Exhibit label="Exhibit 6" title="Value creation by source" note="Share of total" className="lg:col-span-5">
            <ValueCreation />
          </Exhibit>
          <Exhibit label="Exhibit 7" title="Investment timeline" note="Years from investment" className="lg:col-span-7">
            <div className="pt-6">
              <Timeline />
            </div>
          </Exhibit>
        </div>
      </div>
    </section>
  )
}
