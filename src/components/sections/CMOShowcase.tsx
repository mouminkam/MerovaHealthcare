'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { easeOutExpo, inView, reveal, revealGroup } from '@/lib/animations'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Exhibit } from '@/components/ui/Exhibit'

/** Annual capacity in units, largest first — bars share one linear scale. */
const capacity = [
  { name: 'Oral solid dosage', units: 2_000_000_000, display: '2B', unit: 'tablets / year' },
  { name: 'Sterile injectables', units: 500_000_000, display: '500M', unit: 'units / year' },
  { name: 'Liquid formulations', units: 200_000_000, display: '200M', unit: 'bottles / year' },
  { name: 'Topical products', units: 100_000_000, display: '100M', unit: 'units / year' },
]

const certifications = ['FDA Approved', 'EU GMP Certified', 'WHO Prequalified', 'ISO 14001', 'MHRA Inspected']

/** The development path a partner's product takes, in order. */
const services = [
  { title: 'Formulation development', description: 'Full-scale formulation and process development capabilities for complex molecules.' },
  { title: 'Analytical services', description: 'Comprehensive analytical method development, validation, and stability testing.' },
  { title: 'Scale-up manufacturing', description: 'Seamless technology transfer from lab to commercial scale production.' },
  { title: 'Packaging solutions', description: 'Primary and secondary packaging with serialization and track-and-trace capabilities.' },
]

function CapacityBars() {
  const max = capacity[0].units
  return (
    <div role="img" aria-label="Annual capacity: oral solid dosage 2 billion tablets, sterile injectables 500 million units, liquid formulations 200 million bottles, topical products 100 million units">
      <ul className="space-y-6">
        {capacity.map((c, i) => (
          <li key={c.name}>
            <div className="mb-2.5 flex items-baseline justify-between gap-4">
              <span className="text-sm text-slate-200">{c.name}</span>
              <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-slate-500">
                <span className="text-slate-100">{c.display}</span> {c.unit}
              </span>
            </div>
            <div className="h-3 rounded-full bg-white/[0.05]">
              <motion.div
                className="h-full origin-left rounded-full"
                style={{
                  width: `${Math.max(1.5, (c.units / max) * 100)}%`,
                  background: 'linear-gradient(90deg, var(--burgundy), var(--cmo))',
                  boxShadow: '0 0 18px rgba(201,70,102,0.35)',
                }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 1.1, ease: easeOutExpo, delay: 0.1 + i * 0.1 }}
              />
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-between font-mono text-[10px] text-slate-600">
        {['0', '0.5B', '1B', '1.5B', '2B'].map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}

export function CMOShowcase() {
  return (
    <section id="cmo" aria-labelledby="cmo-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="cmo-heading"
          eyebrow="CMO capabilities"
          eyebrowColor="var(--cmo)"
          title={
            <>
              Contract manufacturing,
              <br />
              <span className="text-coral">at commercial scale.</span>
            </>
          }
          lede="Our integrated contract manufacturing network offers end-to-end pharmaceutical production services with regulatory excellence across multiple dosage forms."
        />

        <div className="mt-16 grid gap-6 lg:mt-20 lg:grid-cols-12">
          <Exhibit label="Exhibit 5" title="Annual capacity by dosage form" note="One linear scale" className="lg:col-span-7">
            <CapacityBars />
          </Exhibit>

          <Exhibit title="Inspected and certified" className="lg:col-span-5">
            <ul>
              {certifications.map((cert) => (
                <li key={cert} className="flex items-center justify-between gap-4 border-t border-white/[0.06] py-4 first:border-t-0 first:pt-0">
                  <span className="text-slate-200">{cert}</span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-cmo/40 bg-cmo/10">
                    <Check aria-hidden="true" className="h-3.5 w-3.5 text-cmo" />
                  </span>
                </li>
              ))}
            </ul>
          </Exhibit>
        </div>

        <motion.div variants={revealGroup} initial="hidden" whileInView="visible" viewport={inView} className="mt-20 lg:mt-28">
          <motion.h3 variants={reveal} className="font-display text-2xl font-bold tracking-[-0.02em] text-slate-50">
            From formulation to finished pack
          </motion.h3>
          <ol className="relative mt-10 grid gap-10 md:grid-cols-4 md:gap-8">
            {/* the path the product travels, drawn left to right */}
            <motion.span
              aria-hidden="true"
              className="absolute left-[7px] top-2 hidden h-px origin-left bg-gradient-to-r from-cmo via-coral to-specialty md:block"
              // ends on the last node's centre: one column (25% − ¾ of the 2rem gap) minus half a node
              style={{ right: 'calc(25% - 1.5rem - 7.5px)' }}
              variants={{ hidden: { scaleX: 0 }, visible: { scaleX: 1, transition: { duration: 1.4, ease: easeOutExpo } } }}
            />
            {services.map((s, i) => (
              <motion.li key={s.title} variants={reveal} className="relative">
                <span className="relative z-10 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-cmo bg-slate-950">
                  <span className="h-[5px] w-[5px] rounded-full bg-cmo" />
                </span>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">
                  <span className="text-coral">0{i + 1}</span> / 04
                </p>
                <h4 className="mt-2 font-display text-lg font-semibold tracking-[-0.01em] text-slate-50">{s.title}</h4>
                <p className="mt-2 text-sm leading-6 text-slate-400">{s.description}</p>
              </motion.li>
            ))}
          </ol>
        </motion.div>
      </div>
    </section>
  )
}
