'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from '@/lib/gsap'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  defaultViewport 
} from '@/lib/animations'

const marketStats = [
  { value: 1.4, suffix: 'T', prefix: '$', label: 'Global Pharma Market', description: 'Total addressable market size by 2025' },
  { value: 680, suffix: 'B', prefix: '$', label: 'Generic Market', description: 'Generic pharmaceutical market value' },
  { value: 180, suffix: 'B', prefix: '$', label: 'CMO Market', description: 'Contract manufacturing opportunity' },
  { value: 8.2, suffix: '%', label: 'Annual Growth', description: 'CAGR through 2030' },
]

const marketDrivers = [
  'Aging global population driving healthcare demand',
  'Patent cliff creating generics opportunities',
  'Reshoring of pharmaceutical manufacturing',
  'Increasing regulatory complexity favoring scale',
  'Healthcare cost pressures driving efficiency',
]

interface AnimatedCounterProps {
  value: number
  prefix?: string
  suffix?: string
  duration?: number
}

function AnimatedCounter({ value, prefix = '', suffix = '', duration = 2 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const counterRef = useRef<HTMLSpanElement>(null)
  const isInView = useInView(counterRef, { once: true, amount: 0.5 })

  useEffect(() => {
    if (!isInView) return

    const obj = { val: 0 }
    
    gsap.to(obj, {
      val: value,
      duration: duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayValue(obj.val)
      },
    })
  }, [isInView, value, duration])

  const formatValue = (val: number) => {
    if (val >= 100) return Math.round(val).toLocaleString()
    if (val >= 10) return val.toFixed(1)
    return val.toFixed(1)
  }

  return (
    <span ref={counterRef}>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  )
}

export function MarketOpportunity() {
  return (
    <section 
      id="market"
      className="relative py-24 md:py-32 section-padding bg-slate-950 overflow-hidden"
      aria-labelledby="market-heading"
    >
      {/* Decorative SVG background - concentric circles */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
        <svg width="800" height="800" viewBox="0 0 800 800" fill="none">
          {[100, 200, 300, 400].map((r, i) => (
            <motion.circle
              key={r}
              cx="400"
              cy="400"
              r={r}
              stroke="currentColor"
              strokeWidth="1"
              className="text-coral"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: i * 0.2, ease: 'easeOut' }}
            />
          ))}
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
            Market Opportunity
          </motion.span>
          
          <motion.h2 
            id="market-heading"
            variants={fadeUpVariant}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6 max-w-3xl"
          >
            A Trillion-Dollar Opportunity in Healthcare Manufacturing
          </motion.h2>
          
          <motion.p 
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            The pharmaceutical manufacturing sector presents compelling investment opportunities 
            driven by demographic shifts, regulatory evolution, and market dynamics.
          </motion.p>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16 md:mb-24"
        >
          {marketStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUpVariant}
              className="p-6 lg:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50"
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-slate-50 mb-2">
                <AnimatedCounter 
                  value={stat.value} 
                  prefix={stat.prefix} 
                  suffix={stat.suffix} 
                />
              </div>
              <div className="font-medium text-coral mb-1">
                {stat.label}
              </div>
              <div className="text-sm text-slate-500">
                {stat.description}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Market drivers */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <motion.h3 
              variants={fadeUpVariant}
              className="font-display text-2xl md:text-3xl font-bold text-slate-50 mb-8"
            >
              Key Market Drivers
            </motion.h3>
            
            <ul className="space-y-4">
              {marketDrivers.map((driver, index) => (
                <motion.li
                  key={index}
                  variants={fadeUpVariant}
                  className="flex items-start gap-4"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-coral/10 flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-coral" />
                  </span>
                  <span className="text-slate-300 leading-relaxed">
                    {driver}
                  </span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Visual representation */}
          <motion.div
            variants={fadeUpVariant}
            className="relative aspect-square max-w-md mx-auto"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Animated concentric circles */}
              <svg viewBox="0 0 400 400" className="w-full h-full">
                <defs>
                  <linearGradient id="marketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--coral)" />
                    <stop offset="100%" stopColor="var(--burgundy)" />
                  </linearGradient>
                </defs>
                
                {/* Outer ring - Total market */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="180"
                  fill="none"
                  stroke="url(#marketGradient)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                  style={{ transformOrigin: 'center' }}
                />
                
                {/* Middle ring - Addressable */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="130"
                  fill="none"
                  stroke="var(--coral)"
                  strokeWidth="1"
                  opacity="0.5"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.5 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
                
                {/* Inner ring - Target */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="80"
                  fill="var(--coral)"
                  opacity="0.1"
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 0.1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                
                {/* Center dot */}
                <motion.circle
                  cx="200"
                  cy="200"
                  r="8"
                  fill="var(--coral)"
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                />
              </svg>
              
              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="font-display text-3xl font-bold text-slate-50">
                    $1.4T
                  </div>
                  <div className="text-sm text-slate-400">
                    Total Market
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Marquee ticker */}
        <div className="mt-16 md:mt-24 overflow-hidden">
          <div className="flex items-center gap-8 animate-marquee">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-8 shrink-0">
                {['Generics', 'CMO Services', 'Specialty Pharma', 'API Manufacturing', 'Biosimilars', 'Drug Delivery'].map((item, i) => (
                  <span 
                    key={`${setIndex}-${i}`} 
                    className="text-2xl md:text-3xl font-display font-medium text-slate-700 whitespace-nowrap"
                  >
                    {item} <span className="text-coral mx-4">·</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  )
}
