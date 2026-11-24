'use client'

import { Fragment, useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { inView, reveal, revealGroup } from '@/lib/animations'
import { Eyebrow } from '@/components/ui/SectionHeader'

const statement =
  'To transform pharmaceutical manufacturing through strategic consolidation, operational excellence, and unwavering commitment to quality and access.'

const pillars = [
  {
    label: 'Vision',
    text: 'To be the premier healthcare manufacturing platform, recognized for operational excellence, regulatory leadership, and sustainable value creation.',
  },
  {
    label: 'Mission',
    text: 'To build, integrate, and operate a world-class pharmaceutical manufacturing platform that delivers essential medicines to patients worldwide.',
  },
]

/** One word of the statement, brightening as the reader scrolls past it. */
function Word({ word, index, total, progress }: { word: string; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total
  const opacity = useTransform(progress, [start, start + 1.5 / total], [0.16, 1])
  return <motion.span style={{ opacity }}>{word}</motion.span>
}

export function MissionVision() {
  const statementRef = useRef<HTMLHeadingElement>(null)
  const reduced = useReducedMotion() ?? false
  const { scrollYProgress } = useScroll({ target: statementRef, offset: ['start 85%', 'end 45%'] })
  const words = statement.split(' ')

  return (
    <section id="mission" aria-labelledby="mission-heading" className="relative section-padding py-28 md:py-40">
      <div className="mx-auto max-w-7xl">
        <Eyebrow>Purpose</Eyebrow>
        <h2
          ref={statementRef}
          id="mission-heading"
          aria-label={statement}
          className="mt-8 max-w-5xl font-display text-[clamp(2rem,4.4vw,4rem)] font-bold leading-[1.08] tracking-[-0.035em] text-slate-50"
        >
          {reduced
            ? statement
            : words.map((word, i) => (
                <Fragment key={`${word}-${i}`}>
                  <Word word={word} index={i} total={words.length} progress={scrollYProgress} />
                  {i < words.length - 1 ? ' ' : null}
                </Fragment>
              ))}
        </h2>

        <motion.div
          variants={revealGroup}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-12"
        >
          <motion.p variants={reveal} className="text-lg leading-8 text-slate-400 lg:col-span-4">
            We believe that world-class pharmaceutical manufacturing should be efficient, accessible, and continuously improving —
            creating value for investors while advancing global health.
          </motion.p>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {pillars.map((p) => (
              <motion.div key={p.label} variants={reveal} className="border-t border-white/[0.12] pt-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-coral">{p.label}</p>
                <p className="mt-4 text-[15px] leading-7 text-slate-300">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
