'use client'

import { motion } from 'framer-motion'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  defaultViewport 
} from '@/lib/animations'

const rovaFramework = [
  {
    letter: 'R',
    title: 'Rationalize',
    description: 'Streamline operations by eliminating redundancies, optimizing facility utilization, and standardizing processes across the portfolio.',
    items: ['Facility rationalization', 'Process standardization', 'Redundancy elimination'],
  },
  {
    letter: 'O',
    title: 'Optimize',
    description: 'Drive operational excellence through lean manufacturing, quality improvements, and continuous improvement programs.',
    items: ['Lean manufacturing', 'Quality systems', 'Continuous improvement'],
  },
  {
    letter: 'V',
    title: 'Value-Add',
    description: 'Create value through procurement synergies, shared services, and cross-selling opportunities across portfolio companies.',
    items: ['Procurement synergies', 'Shared services', 'Cross-selling'],
  },
  {
    letter: 'A',
    title: 'Accelerate',
    description: 'Accelerate growth through organic expansion, new market entry, and strategic product development initiatives.',
    items: ['Market expansion', 'Product development', 'Strategic initiatives'],
  },
]

export function ROVAFramework() {
  return (
    <section 
      id="rova"
      className="relative py-24 md:py-32 section-padding bg-slate-900"
      aria-labelledby="rova-heading"
    >
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full bg-coral/5 blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-burgundy/5 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
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
            Our Methodology
          </motion.span>
          
          <motion.h2 
            id="rova-heading"
            variants={fadeUpVariant}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6"
          >
            The <span className="text-gradient">ROVA</span> Framework
          </motion.h2>
          
          <motion.p 
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Our proprietary value creation methodology drives systematic operational 
            improvements across every portfolio company.
          </motion.p>
        </motion.div>

        {/* ROVA columns */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4"
        >
          {rovaFramework.map((item, index) => (
            <motion.div
              key={item.letter}
              variants={fadeUpVariant}
              className="relative"
            >
              <div className="h-full p-6 lg:p-8 rounded-2xl bg-slate-800/30 border border-slate-700/30 hover:border-slate-600/50 transition-colors duration-300">
                {/* Letter with drop animation */}
                <motion.div
                  initial={{ y: -50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: index * 0.15,
                    duration: 0.5,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  className="mb-6"
                >
                  <span className="font-display text-7xl lg:text-8xl font-bold text-gradient">
                    {item.letter}
                  </span>
                </motion.div>

                <h3 className="font-display text-xl font-semibold text-slate-50 mb-3">
                  {item.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {item.description}
                </p>

                {/* Key items */}
                <ul className="space-y-2">
                  {item.items.map((listItem, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.1 + i * 0.05 }}
                      className="flex items-center gap-2 text-sm text-slate-300"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-coral" />
                      {listItem}
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Connector line for desktop */}
              {index < rovaFramework.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-2 w-4 h-px bg-gradient-to-r from-slate-700 to-transparent" />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom visualization */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center">
              {rovaFramework.map((item, i) => (
                <motion.span
                  key={item.letter}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="font-display text-2xl font-bold text-gradient"
                >
                  {item.letter}
                </motion.span>
              ))}
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">Driving value at every stage</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
