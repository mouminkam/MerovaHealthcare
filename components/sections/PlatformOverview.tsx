'use client'

import { motion } from 'framer-motion'
import {
  fadeUpVariant,
  staggerContainerVariant,
  cardHoverVariant,
  defaultViewport
} from '@/lib/animations'
import { Factory, Pill, Microscope } from 'lucide-react'

const verticals = [
  {
    icon: Pill,
    title: 'Generics',
    subtitle: 'Cost-effective pharmaceutical production',
    description: 'Manufacturing high-quality generic medications that provide affordable healthcare solutions while maintaining rigorous quality standards.',
    metrics: [
      { label: 'Products', value: '200+' },
      { label: 'Markets', value: '45' },
    ],
    accentColor: 'coral',
  },
  {
    icon: Factory,
    title: 'CMO Services',
    subtitle: 'Contract manufacturing excellence',
    description: 'Full-service contract manufacturing organization capabilities, offering end-to-end pharmaceutical production for global partners.',
    metrics: [
      { label: 'Partners', value: '50+' },
      { label: 'Capacity', value: '2B units' },
    ],
    accentColor: 'burgundy',
  },
  {
    icon: Microscope,
    title: 'Specialty Products',
    subtitle: 'Advanced therapeutic solutions',
    description: 'Developing and manufacturing specialty pharmaceuticals for complex therapeutic areas including oncology, neurology, and rare diseases.',
    metrics: [
      { label: 'Pipeline', value: '35' },
      { label: 'Approvals', value: '12' },
    ],
    accentColor: 'coral',
  },
]

export function PlatformOverview() {
  return (
    <section
      id="platform"
      className="relative -mt-px overflow-hidden  pt-20 pb-24 md:pt-24 md:pb-32 section-padding"
      aria-labelledby="platform-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[48rem]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-10 h-[28rem] w-[48rem] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(232, 146, 124, 0.08) 0%, rgba(123, 31, 53, 0.08) 36%, transparent 72%)',
        }}
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/5 via-slate-950/20 to-slate-950" aria-hidden="true" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="text-center mb-16 md:mb-24"
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-block text-sm font-medium text-coral uppercase tracking-wider mb-4"
          >
            Our Platform
          </motion.span>

          <motion.h2
            id="platform-heading"
            variants={fadeUpVariant}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6"
          >
            Three Verticals.<br />
            <span className="text-gradient">One Vision.</span>
          </motion.h2>

          <motion.p
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Merova unifies pharmaceutical manufacturing across generics, contract services,
            and specialty products to create an integrated healthcare platform.
          </motion.p>
        </motion.div>

        {/* Vertical cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
        >
          {verticals.map((vertical, index) => (
            <motion.article
              key={vertical.title}
              variants={fadeUpVariant}
              initial="rest"
              whileHover="hover"
              className="group relative"
            >
              <motion.div
                variants={cardHoverVariant}
                className="relative h-full p-8 lg:p-10 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors duration-300 overflow-hidden"
              >
                {/* Gradient accent */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${vertical.accentColor === 'coral'
                    ? 'from-coral/80 to-coral-light/50'
                    : 'from-burgundy/80 to-burgundy-light/50'
                    }`}
                />

                {/* Icon */}
                <div className={`
                  inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6
                  ${vertical.accentColor === 'coral' ? 'bg-coral/10' : 'bg-burgundy/10'}
                `}>
                  <vertical.icon className={`
                    w-7 h-7 
                    ${vertical.accentColor === 'coral' ? 'text-coral' : 'text-burgundy-light'}
                  `} />
                </div>

                {/* Content */}
                <h3 className="font-display text-2xl font-semibold text-slate-50 mb-2">
                  {vertical.title}
                </h3>

                <p className="text-sm text-coral mb-4">
                  {vertical.subtitle}
                </p>

                <p className="text-slate-400 leading-relaxed mb-8">
                  {vertical.description}
                </p>

                {/* Metrics */}
                <div className="flex gap-8 pt-6 border-t border-slate-800/50">
                  {vertical.metrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="font-display text-2xl font-bold text-slate-50">
                        {metric.value}
                      </div>
                      <div className="text-sm text-slate-500">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className={`
                    absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 blur-3xl
                    ${vertical.accentColor === 'coral' ? 'bg-coral/10' : 'bg-burgundy/10'}
                  `} />
                </div>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
