'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { SectionHeader } from '@/components/ui/SectionHeader'

/** The four steps, in the order they're applied to every company. */
const steps = [
  {
    letter: 'R',
    title: 'Rationalize',
    description:
      'Streamline operations by eliminating redundancies, optimizing facility utilization, and standardizing processes across the portfolio.',
    items: ['Facility rationalization', 'Process standardization', 'Redundancy elimination'],
  },
  {
    letter: 'O',
    title: 'Optimize',
    description:
      'Drive operational excellence through lean manufacturing, quality improvements, and continuous improvement programs.',
    items: ['Lean manufacturing', 'Quality systems', 'Continuous improvement'],
  },
  {
    letter: 'V',
    title: 'Value-add',
    description:
      'Create value through procurement synergies, shared services, and cross-selling opportunities across portfolio companies.',
    items: ['Procurement synergies', 'Shared services', 'Cross-selling'],
  },
  {
    letter: 'A',
    title: 'Accelerate',
    description:
      'Accelerate growth through organic expansion, new market entry, and strategic product development initiatives.',
    items: ['Market expansion', 'Product development', 'Strategic initiatives'],
  },
]

function Step({ step, index, progress, reduced }: { step: (typeof steps)[number]; index: number; progress: MotionValue<number>; reduced: boolean }) {
  const n = steps.length
  // each letter fills during its quarter of the scroll, left to right
  const fill = useTransform(progress, [index / n, (index + 1) / n], [0, 100])
  const clipPath = useTransform(fill, (f) => `inset(0 ${100 - f}% 0 0)`)
  const content = useTransform(progress, [index / n, (index + 0.7) / n], [0.35, 1])

  return (
    <li className="grid grid-cols-[auto_1fr] items-start gap-x-6 border-t border-white/[0.08] pt-8 lg:block lg:border-t-0 lg:pt-0">
      <span
        aria-hidden="true"
        className="relative block font-display text-[clamp(4.5rem,14vw,14rem)] font-extrabold leading-[0.8]"
      >
        <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.22)]">{step.letter}</span>
        <motion.span className="absolute inset-0 text-coral" style={reduced ? undefined : { clipPath }}>
          {step.letter}
        </motion.span>
      </span>
      <motion.div style={reduced ? undefined : { opacity: content }} className="lg:mt-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-slate-500">
          <span className="text-coral">0{index + 1}</span> / 0{n}
        </p>
        <h3 className="mt-2 font-display text-2xl font-bold tracking-[-0.02em] text-slate-50">{step.title}</h3>
        <p className="mt-3 text-[15px] leading-7 text-slate-400">{step.description}</p>
        <ul className="mt-5 space-y-2">
          {step.items.map((item) => (
            <li key={item} className="flex items-center gap-2.5 text-sm text-slate-300">
              <span aria-hidden="true" className="h-1 w-1 rounded-full bg-coral" />
              {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </li>
  )
}

export function ROVAFramework() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 80%', 'end 60%'] })

  return (
    <section id="rova" aria-labelledby="rova-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="rova-heading"
          eyebrow="Operating model"
          title={
            <>
              How we run
              <br />
              <span className="text-coral">what we buy.</span>
            </>
          }
          lede="ROVA is our proprietary value creation methodology — four steps, applied in the same order to every portfolio company."
        />

        <ol ref={listRef} aria-label="The ROVA framework" className="mt-16 grid gap-10 lg:mt-20 lg:grid-cols-4 lg:gap-8">
          {steps.map((step, i) => (
            <Step key={step.letter} step={step} index={i} progress={scrollYProgress} reduced={reduced} />
          ))}
        </ol>
      </div>
    </section>
  )
}
