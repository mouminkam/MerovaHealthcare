'use client'

import { motion } from 'framer-motion'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  lineDrawVariant,
  defaultViewport 
} from '@/lib/animations'
import { CheckCircle } from 'lucide-react'

const cmoCapabilities = [
  { name: 'Oral Solid Dosage', capacity: '2B tablets/year' },
  { name: 'Sterile Injectables', capacity: '500M units/year' },
  { name: 'Topical Products', capacity: '100M units/year' },
  { name: 'Liquid Formulations', capacity: '200M bottles/year' },
]

const certifications = [
  'FDA Approved',
  'EU GMP Certified',
  'WHO Prequalified',
  'ISO 14001',
  'MHRA Inspected',
]

const services = [
  {
    title: 'Formulation Development',
    description: 'Full-scale formulation and process development capabilities for complex molecules.',
  },
  {
    title: 'Analytical Services',
    description: 'Comprehensive analytical method development, validation, and stability testing.',
  },
  {
    title: 'Scale-Up Manufacturing',
    description: 'Seamless technology transfer from lab to commercial scale production.',
  },
  {
    title: 'Packaging Solutions',
    description: 'Primary and secondary packaging with serialization and track-and-trace capabilities.',
  },
]

export function CMOShowcase() {
  return (
    <section 
      id="cmo"
      className="relative py-24 md:py-32 section-padding bg-slate-950 overflow-hidden"
      aria-labelledby="cmo-heading"
    >
      {/* Blueprint grid background */}
      <div className="absolute inset-0 opacity-[0.02]" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="blueprint-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="var(--coral)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative">
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
            CMO Capabilities
          </motion.span>
          
          <motion.h2 
            id="cmo-heading"
            variants={fadeUpVariant}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6 max-w-4xl"
          >
            World-Class Manufacturing for Global Partners
          </motion.h2>
          
          <motion.p 
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            Our integrated contract manufacturing network offers end-to-end pharmaceutical 
            production services with regulatory excellence across multiple dosage forms.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: SVG Blueprint illustration */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="relative"
          >
            <div className="aspect-square max-w-lg mx-auto">
              <svg viewBox="0 0 400 400" className="w-full h-full">
                {/* Factory outline */}
                <motion.rect
                  x="50" y="150" width="300" height="200"
                  fill="none" stroke="var(--coral)" strokeWidth="2"
                  variants={lineDrawVariant}
                />
                
                {/* Roof */}
                <motion.path
                  d="M 50 150 L 200 50 L 350 150"
                  fill="none" stroke="var(--coral)" strokeWidth="2"
                  variants={lineDrawVariant}
                />
                
                {/* Chimney */}
                <motion.rect
                  x="280" y="70" width="30" height="80"
                  fill="none" stroke="var(--coral)" strokeWidth="1.5"
                  variants={lineDrawVariant}
                />
                
                {/* Windows row 1 */}
                {[100, 170, 240, 310].map((x, i) => (
                  <motion.rect
                    key={`w1-${i}`}
                    x={x} y="180" width="30" height="40"
                    fill="var(--coral)" fillOpacity="0.1"
                    stroke="var(--coral)" strokeWidth="1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  />
                ))}
                
                {/* Windows row 2 */}
                {[100, 170, 240, 310].map((x, i) => (
                  <motion.rect
                    key={`w2-${i}`}
                    x={x} y="250" width="30" height="40"
                    fill="var(--coral)" fillOpacity="0.1"
                    stroke="var(--coral)" strokeWidth="1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                  />
                ))}
                
                {/* Door */}
                <motion.rect
                  x="175" y="290" width="50" height="60"
                  fill="var(--burgundy)" fillOpacity="0.2"
                  stroke="var(--coral)" strokeWidth="1.5"
                  variants={lineDrawVariant}
                />
                
                {/* Connection lines (representing network) */}
                <motion.path
                  d="M 200 350 L 200 380 M 100 380 L 300 380"
                  fill="none" stroke="var(--coral)" strokeWidth="1" strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 1 }}
                />
                
                {/* Nodes */}
                {[100, 200, 300].map((x, i) => (
                  <motion.circle
                    key={`node-${i}`}
                    cx={x} cy="380" r="5"
                    fill="var(--coral)"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.2 + i * 0.1 }}
                  />
                ))}
              </svg>
            </div>

            {/* Certifications */}
            <motion.div
              variants={staggerContainerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
              className="flex flex-wrap justify-center gap-3 mt-8"
            >
              {certifications.map((cert) => (
                <motion.span
                  key={cert}
                  variants={fadeUpVariant}
                  className="px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-sm text-slate-300"
                >
                  {cert}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Capabilities and services */}
          <div className="space-y-12">
            {/* Capacity cards */}
            <motion.div
              variants={staggerContainerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <motion.h3 
                variants={fadeUpVariant}
                className="font-display text-xl font-semibold text-slate-50 mb-6"
              >
                Production Capacity
              </motion.h3>
              
              <div className="grid grid-cols-2 gap-4">
                {cmoCapabilities.map((cap) => (
                  <motion.div
                    key={cap.name}
                    variants={fadeUpVariant}
                    className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/50"
                  >
                    <div className="font-display text-lg font-semibold text-coral mb-1">
                      {cap.capacity}
                    </div>
                    <div className="text-sm text-slate-400">
                      {cap.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Services */}
            <motion.div
              variants={staggerContainerVariant}
              initial="hidden"
              whileInView="visible"
              viewport={defaultViewport}
            >
              <motion.h3 
                variants={fadeUpVariant}
                className="font-display text-xl font-semibold text-slate-50 mb-6"
              >
                Full-Service Capabilities
              </motion.h3>
              
              <div className="space-y-4">
                {services.map((service) => (
                  <motion.div
                    key={service.title}
                    variants={fadeUpVariant}
                    className="flex gap-4"
                  >
                    <CheckCircle className="w-5 h-5 text-coral flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-medium text-slate-50 mb-1">
                        {service.title}
                      </h4>
                      <p className="text-sm text-slate-400">
                        {service.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
