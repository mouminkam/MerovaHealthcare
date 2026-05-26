'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'
import { easeOutExpo, fadeUpVariant, staggerContainerVariant } from '@/lib/animations'

const navLinks = [
  { label: 'Platform', href: '#platform' },
  { label: 'Thesis', href: '#thesis' },
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Leadership', href: '#leadership' },
  { label: 'Contact', href: '#contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOutExpo, delay: 0.2 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled 
            ? 'glass py-3' 
            : 'bg-transparent py-5'
        )}
      >
        <nav className="section-padding flex items-center justify-between">
          {/* Logo */}
          <a 
            href="#" 
            className="relative z-10 flex items-center gap-2"
            aria-label="Merova Healthcare - Home"
          >
            <div className="relative">
              {/* Logo mark */}
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral to-burgundy flex items-center justify-center">
                <span className="text-slate-50 font-display font-bold text-xl">M</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="font-display font-semibold text-xl text-slate-50">Merova</span>
              <span className="font-display font-normal text-xl text-slate-400 ml-1">Healthcare</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-coral transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-coral transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:block">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-coral text-slate-950 font-medium text-sm hover:bg-coral-light transition-colors duration-300"
            >
              Investor Inquiry
            </motion.a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden relative z-10 p-2 text-slate-100"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-950/98 backdrop-blur-xl lg:hidden"
          >
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerContainerVariant}
              className="h-full flex flex-col items-center justify-center gap-8"
            >
              {navLinks.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  variants={fadeUpVariant}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-3xl font-display font-medium text-slate-100 hover:text-coral transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              
              <motion.a
                href="#contact"
                variants={fadeUpVariant}
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-8 inline-flex items-center px-8 py-4 rounded-lg bg-coral text-slate-950 font-medium text-lg"
              >
                Investor Inquiry
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
