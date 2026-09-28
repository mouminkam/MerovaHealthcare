'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getLenis } from '@/lib/lenis'
import { easeOutExpo } from '@/lib/animations'
import { Logo } from '@/components/ui/Logo'

const navLinks = [
  { id: 'platform', label: 'Platform' },
  { id: 'thesis', label: 'Thesis' },
  { id: 'market', label: 'Market' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'returns', label: 'Returns' },
  { id: 'leadership', label: 'Leadership' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll-spy: the section crossing the middle of the viewport is "current".
  // Every section is watched — including ones without a nav link — so passing
  // through, say, the ROVA section clears the highlight instead of leaving a stale one.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === 'top' ? '' : entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('main section[id]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  // Lock scrolling (native and Lenis) while the mobile menu is open.
  useEffect(() => {
    const lenis = getLenis()
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      lenis?.stop()
    } else {
      document.body.style.overflow = ''
      lenis?.start()
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: easeOutExpo, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-4"
      >
        <nav
          aria-label="Primary"
          className={cn(
            'mx-auto flex max-w-7xl items-center justify-between rounded-full border py-2 pl-4 pr-2 transition-[background-color,border-color,box-shadow] duration-500',
            scrolled || menuOpen
              ? 'border-white/[0.08] bg-slate-950/70 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-xl'
              : 'border-transparent bg-transparent',
          )}
        >
          <a href="#" aria-label="Merova Healthcare — back to top" className="relative z-10 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral">
            <Logo />
          </a>

          <ul className="hidden items-center gap-0.5 lg:flex">
            {navLinks.map((link) => {
              const current = active === link.id
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={current ? 'true' : undefined}
                    className="relative isolate block rounded-full px-3.5 py-2 text-sm text-slate-400 transition-colors duration-300 hover:text-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral aria-[current=true]:text-slate-50"
                  >
                    {current ? (
                      <motion.span
                        layoutId="nav-current"
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                      />
                    ) : null}
                    {link.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contact"
              className="group hidden items-center gap-2 rounded-full bg-coral px-5 py-2.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-coral-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-light focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 sm:inline-flex"
            >
              Investor inquiry
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="relative z-10 rounded-full p-2.5 text-slate-100 transition-colors hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral lg:hidden"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-xl lg:hidden"
          >
            <motion.nav
              aria-label="Mobile"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
              className="flex h-full flex-col justify-center gap-1 px-8"
            >
              {[...navLinks, { id: 'contact', label: 'Contact' }].map((link) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } } }}
                  className={cn(
                    'font-display text-4xl font-bold tracking-[-0.03em] transition-colors hover:text-coral',
                    active === link.id ? 'text-slate-50' : 'text-slate-500',
                  )}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } } }}
                className="mt-10 inline-flex items-center justify-center gap-2 self-start rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-slate-950"
              >
                Investor inquiry
                <ArrowRight className="h-4 w-4" />
              </motion.a>
            </motion.nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
