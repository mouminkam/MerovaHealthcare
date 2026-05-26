'use client'

import { motion } from 'framer-motion'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  lineDrawVariant,
  defaultViewport 
} from '@/lib/animations'

const returnMetrics = [
  { label: 'Target IRR', value: '20%+', description: 'Net to investors' },
  { label: 'MOIC Target', value: '2.5-3x', description: 'Multiple on invested capital' },
  { label: 'Hold Period', value: '5-7 years', description: 'Expected investment horizon' },
  { label: 'Distributions', value: 'Annual', description: 'Dividend distributions begin Year 3' },
]

const valueCreationLevers = [
  {
    phase: 'Acquisition',
    percentage: '30%',
    items: ['Entry multiple arbitrage', 'Distressed/carve-out opportunities', 'Off-market deal sourcing'],
  },
  {
    phase: 'Operations',
    percentage: '40%',
    items: ['ROVA framework implementation', 'Procurement synergies', 'Manufacturing efficiency'],
  },
  {
    phase: 'Exit',
    percentage: '30%',
    items: ['Platform premium', 'Strategic buyer interest', 'IPO optionality'],
  },
]

const timelineEvents = [
  { year: 'Year 1-2', label: 'Foundation', description: 'Initial acquisitions, integration planning' },
  { year: 'Year 2-3', label: 'Integration', description: 'ROVA implementation, synergy capture' },
  { year: 'Year 3-5', label: 'Optimization', description: 'Operational excellence, distributions begin' },
  { year: 'Year 5-7', label: 'Harvest', description: 'Exit preparation, value realization' },
]

export function ReturnModel() {
  return (
    <section 
      id="returns"
      className="relative py-24 md:py-32 section-padding bg-slate-900 overflow-hidden"
      aria-labelledby="returns-heading"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="mb-16 md:mb-24"
        >
          <motion.span 
            variants={fadeUpVariant}
            className="inline-block text-sm font-medium text-coral uppercase tracking-wider mb-4"
          >
            Return Model
          </motion.span>
          
          <motion.h2 
            id="returns-heading"
            variants={fadeUpVariant}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6"
          >
            Value Creation Through<br />
            <span className="text-gradient">Operational Excellence</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            Our dual-path return model combines operational improvements with strategic 
            positioning to deliver attractive risk-adjusted returns.
          </motion.p>
        </motion.div>

        {/* Key metrics */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 md:mb-24"
        >
          {returnMetrics.map((metric) => (
            <motion.div
              key={metric.label}
              variants={fadeUpVariant}
              className="p-6 lg:p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-center"
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient mb-2">
                {metric.value}
              </div>
              <div className="font-medium text-slate-50 mb-1">
                {metric.label}
              </div>
              <div className="text-sm text-slate-500">
                {metric.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Value creation visualization */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainerVariant}
          >
            <motion.h3 
              variants={fadeUpVariant}
              className="font-display text-2xl font-semibold text-slate-50 mb-8"
            >
              Value Creation Levers
            </motion.h3>

            <div className="space-y-6">
              {valueCreationLevers.map((lever, index) => (
                <motion.div
                  key={lever.phase}
                  variants={fadeUpVariant}
                  className="relative"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-coral/20 to-burgundy/20 flex items-center justify-center border border-coral/20">
                      <span className="font-display text-xl font-bold text-coral">
                        {lever.percentage}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-display text-lg font-semibold text-slate-50">
                        {lever.phase}
                      </h4>
                      <p className="text-sm text-slate-400">Value contribution</p>
                    </div>
                  </div>
                  
                  <div className="ml-20 space-y-2">
                    {lever.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-coral/60" />
                        {item}
                      </div>
                    ))}
                  </div>

                  {/* Connector line */}
                  {index < valueCreationLevers.length - 1 && (
                    <div className="absolute left-8 top-20 w-px h-8 bg-slate-700" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Timeline visualization */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainerVariant}
          >
            <motion.h3 
              variants={fadeUpVariant}
              className="font-display text-2xl font-semibold text-slate-50 mb-8"
            >
              Investment Timeline
            </motion.h3>

            {/* SVG Timeline */}
            <div className="relative">
              <svg viewBox="0 0 400 300" className="w-full">
                {/* Timeline base line */}
                <motion.path
                  d="M 50 250 L 350 250"
                  stroke="var(--slate-700)"
                  strokeWidth="2"
                  fill="none"
                  variants={lineDrawVariant}
                />

                {/* Progress curve */}
                <motion.path
                  d="M 50 200 C 100 200, 120 150, 175 120 C 230 90, 270 60, 350 40"
                  stroke="url(#timelineGradient)"
                  strokeWidth="3"
                  fill="none"
                  variants={lineDrawVariant}
                />

                {/* Gradient definition */}
                <defs>
                  <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--coral)" />
                    <stop offset="100%" stopColor="var(--burgundy)" />
                  </linearGradient>
                </defs>

                {/* Timeline points */}
                {timelineEvents.map((event, i) => {
                  const x = 50 + (i * 100)
                  const curveY = 200 - (i * 50)
                  
                  return (
                    <g key={event.year}>
                      {/* Vertical line to curve */}
                      <motion.line
                        x1={x} y1="250" x2={x} y2={curveY}
                        stroke="var(--slate-700)"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.2 }}
                      />
                      
                      {/* Point on curve */}
                      <motion.circle
                        cx={x} cy={curveY}
                        r="6"
                        fill="var(--coral)"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.7 + i * 0.2 }}
                      />
                      
                      {/* Point on base */}
                      <motion.circle
                        cx={x} cy="250"
                        r="4"
                        fill="var(--slate-600)"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.6 + i * 0.2 }}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Timeline labels */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {timelineEvents.map((event, i) => (
                  <motion.div
                    key={event.year}
                    className="text-center"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                  >
                    <div className="text-sm font-medium text-coral mb-1">
                      {event.year}
                    </div>
                    <div className="text-xs font-medium text-slate-50">
                      {event.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {event.description}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
