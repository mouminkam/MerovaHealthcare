'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  defaultViewport,
  easeOutExpo 
} from '@/lib/animations'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

interface PortfolioCompany {
  id: string
  name: string
  logo: string // Will be a monogram for now
  category: 'Generics' | 'CMO' | 'Specialty'
  location: string
  status: 'Active' | 'Integration' | 'Growth'
  description: string
  metrics: {
    revenue?: string
    employees?: string
    products?: string
    capacity?: string
  }
  year: number
}

const portfolioCompanies: PortfolioCompany[] = [
  {
    id: 'pharmatech',
    name: 'PharmaTech Industries',
    logo: 'PT',
    category: 'Generics',
    location: 'Mumbai, India',
    status: 'Active',
    description: 'Leading manufacturer of generic oral solid dosage forms with FDA-approved facilities and a portfolio of 120+ products.',
    metrics: {
      revenue: '$85M',
      employees: '850',
      products: '120+',
    },
    year: 2023,
  },
  {
    id: 'biomed-contract',
    name: 'BioMed Contract Manufacturing',
    logo: 'BC',
    category: 'CMO',
    location: 'Dublin, Ireland',
    status: 'Integration',
    description: 'EU-GMP certified contract manufacturer specializing in sterile injectables and complex formulations.',
    metrics: {
      revenue: '$120M',
      employees: '650',
      capacity: '500M units',
    },
    year: 2024,
  },
  {
    id: 'neurogen',
    name: 'NeuroGen Therapeutics',
    logo: 'NG',
    category: 'Specialty',
    location: 'Boston, USA',
    status: 'Growth',
    description: 'Specialty pharmaceutical company focused on CNS disorders with a pipeline of novel delivery systems.',
    metrics: {
      revenue: '$45M',
      products: '8',
      employees: '180',
    },
    year: 2024,
  },
  {
    id: 'generic-plus',
    name: 'Generic Plus Holdings',
    logo: 'G+',
    category: 'Generics',
    location: 'Hyderabad, India',
    status: 'Active',
    description: 'High-volume generics manufacturer with vertically integrated API production capabilities.',
    metrics: {
      revenue: '$95M',
      products: '200+',
      employees: '1,200',
    },
    year: 2023,
  },
  {
    id: 'sterile-solutions',
    name: 'Sterile Solutions GmbH',
    logo: 'SS',
    category: 'CMO',
    location: 'Frankfurt, Germany',
    status: 'Integration',
    description: 'Specialized CMO for parenteral products with state-of-the-art isolator technology.',
    metrics: {
      revenue: '$75M',
      employees: '420',
      capacity: '200M units',
    },
    year: 2025,
  },
]

const categoryColors = {
  Generics: 'bg-coral/10 text-coral',
  CMO: 'bg-burgundy/10 text-burgundy-light',
  Specialty: 'bg-slate-700/50 text-slate-300',
}

const statusColors = {
  Active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  Integration: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  Growth: 'bg-coral/10 text-coral border-coral/30',
}

export function Portfolio() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null)

  const activeCompany = portfolioCompanies[activeIndex]

  const handlePrevious = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev === 0 ? portfolioCompanies.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev === portfolioCompanies.length - 1 ? 0 : prev + 1))
  }

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext()
    }, 8000)

    return () => clearInterval(interval)
  }, [activeIndex])

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <section 
      id="portfolio"
      className="relative py-24 md:py-32 section-padding bg-slate-900"
      aria-labelledby="portfolio-heading"
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
            Portfolio Companies
          </motion.span>
          
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <motion.h2 
                id="portfolio-heading"
                variants={fadeUpVariant}
                className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-4"
              >
                Building a Global Platform
              </motion.h2>
              
              <motion.p 
                variants={fadeUpVariant}
                className="text-lg text-slate-400 max-w-xl"
              >
                Our portfolio spans three continents, integrating leading pharmaceutical 
                manufacturing capabilities across generics, CMO, and specialty segments.
              </motion.p>
            </div>

            {/* Navigation controls */}
            <motion.div 
              variants={fadeUpVariant}
              className="flex items-center gap-4"
            >
              <button
                onClick={handlePrevious}
                className="p-3 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-colors"
                aria-label="Previous company"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-colors"
                aria-label="Next company"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* Carousel */}
        <div ref={carouselRef} className="relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Company card */}
            <div className="relative h-[400px] md:h-[450px]">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activeCompany.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                  className="absolute inset-0"
                >
                  <div className="h-full p-8 lg:p-10 rounded-2xl bg-slate-800/50 border border-slate-700/50 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        {/* Logo monogram */}
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-coral to-burgundy flex items-center justify-center">
                          <span className="font-display font-bold text-xl text-slate-50">
                            {activeCompany.logo}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-display text-xl font-semibold text-slate-50">
                            {activeCompany.name}
                          </h3>
                          <p className="text-sm text-slate-400">{activeCompany.location}</p>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[activeCompany.status]}`}>
                        {activeCompany.status}
                      </span>
                    </div>

                    {/* Category badge */}
                    <span className={`inline-flex self-start px-3 py-1 rounded-full text-sm font-medium mb-4 ${categoryColors[activeCompany.category]}`}>
                      {activeCompany.category}
                    </span>

                    {/* Description */}
                    <p className="text-slate-300 leading-relaxed mb-auto">
                      {activeCompany.description}
                    </p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-slate-700/50">
                      {Object.entries(activeCompany.metrics).slice(0, 3).map(([key, value]) => (
                        <div key={key}>
                          <div className="font-display text-xl font-bold text-slate-50">
                            {value}
                          </div>
                          <div className="text-xs text-slate-500 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Company list */}
            <div className="space-y-3">
              {portfolioCompanies.map((company, index) => (
                <motion.button
                  key={company.id}
                  onClick={() => {
                    setDirection(index > activeIndex ? 1 : -1)
                    setActiveIndex(index)
                  }}
                  className={`
                    w-full text-left p-4 rounded-xl border transition-all duration-300
                    ${index === activeIndex 
                      ? 'bg-slate-800/80 border-coral/30' 
                      : 'bg-slate-800/30 border-slate-800/50 hover:bg-slate-800/50 hover:border-slate-700'
                    }
                  `}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center
                        ${index === activeIndex ? 'bg-coral/20' : 'bg-slate-700/50'}
                      `}>
                        <span className={`
                          font-display font-semibold text-sm
                          ${index === activeIndex ? 'text-coral' : 'text-slate-400'}
                        `}>
                          {company.logo}
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-medium ${index === activeIndex ? 'text-slate-50' : 'text-slate-300'}`}>
                          {company.name}
                        </h4>
                        <p className="text-sm text-slate-500">{company.category} · {company.year}</p>
                      </div>
                    </div>
                    
                    {index === activeIndex && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 rounded-full bg-coral"
                      />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-12 flex items-center gap-2">
          {portfolioCompanies.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1)
                setActiveIndex(index)
              }}
              className="flex-1 h-1 rounded-full overflow-hidden bg-slate-800"
              aria-label={`Go to company ${index + 1}`}
            >
              <motion.div
                className="h-full bg-coral"
                initial={{ width: 0 }}
                animate={{ width: index === activeIndex ? '100%' : index < activeIndex ? '100%' : '0%' }}
                transition={{ duration: index === activeIndex ? 8 : 0.3 }}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
