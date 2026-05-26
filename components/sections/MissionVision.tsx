'use client'

import { motion } from 'framer-motion'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  defaultViewport,
  easeOutExpo 
} from '@/lib/animations'

export function MissionVision() {
  return (
    <section 
      id="mission"
      className="relative py-24 md:py-40 section-padding bg-slate-950 overflow-hidden"
      aria-labelledby="mission-heading"
    >
      {/* Background SVG pattern */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 600"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Animated organic shapes */}
          <motion.ellipse
            cx="200"
            cy="300"
            rx="300"
            ry="200"
            fill="none"
            stroke="var(--coral)"
            strokeWidth="1"
            opacity="0.1"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: 360 }}
            transition={{ 
              pathLength: { duration: 3, ease: 'easeInOut' },
              rotate: { duration: 120, repeat: Infinity, ease: 'linear' }
            }}
            style={{ transformOrigin: '200px 300px' }}
          />
          
          <motion.ellipse
            cx="1000"
            cy="300"
            rx="250"
            ry="180"
            fill="none"
            stroke="var(--burgundy)"
            strokeWidth="1"
            opacity="0.1"
            initial={{ pathLength: 0, rotate: 0 }}
            animate={{ pathLength: 1, rotate: -360 }}
            transition={{ 
              pathLength: { duration: 3, delay: 0.5, ease: 'easeInOut' },
              rotate: { duration: 100, repeat: Infinity, ease: 'linear' }
            }}
            style={{ transformOrigin: '1000px 300px' }}
          />
          
          {/* Center convergence point */}
          <motion.circle
            cx="600"
            cy="300"
            r="100"
            fill="var(--coral)"
            opacity="0.03"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="text-center"
        >
          {/* Mission label */}
          <motion.span 
            variants={fadeUpVariant}
            className="inline-block text-sm font-medium text-coral uppercase tracking-wider mb-8"
          >
            Our Purpose
          </motion.span>

          {/* Main statement */}
          <motion.h2 
            id="mission-heading"
            variants={fadeUpVariant}
            className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-50 leading-tight mb-8"
          >
            To transform pharmaceutical manufacturing through{' '}
            <span className="text-gradient">strategic consolidation</span>,{' '}
            operational excellence, and{' '}
            <span className="text-gradient">unwavering commitment</span>{' '}
            to quality and access.
          </motion.h2>

          {/* Supporting text */}
          <motion.p 
            variants={fadeUpVariant}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            We believe that world-class pharmaceutical manufacturing should be efficient, 
            accessible, and continuously improving—creating value for investors while 
            advancing global health.
          </motion.p>

          {/* Vision/Mission boxes */}
          <motion.div 
            variants={staggerContainerVariant}
            className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
          >
            <motion.div
              variants={fadeUpVariant}
              className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-50 mb-3">
                Our Vision
              </h3>
              <p className="text-slate-400 leading-relaxed">
                To be the premier healthcare manufacturing platform, recognized for 
                operational excellence, regulatory leadership, and sustainable value creation.
              </p>
            </motion.div>

            <motion.div
              variants={fadeUpVariant}
              className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-burgundy/10 flex items-center justify-center mb-4">
                <span className="text-2xl">🧭</span>
              </div>
              <h3 className="font-display text-xl font-semibold text-slate-50 mb-3">
                Our Mission
              </h3>
              <p className="text-slate-400 leading-relaxed">
                To build, integrate, and operate a world-class pharmaceutical manufacturing 
                platform that delivers essential medicines to patients worldwide.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
