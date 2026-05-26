'use client'

import { motion } from 'framer-motion'
import { fadeUpVariant, staggerContainerVariant, defaultViewport } from '@/lib/animations'
import { Linkedin, Twitter } from 'lucide-react'

const footerLinks = {
  company: [
    { label: 'About', href: '#platform' },
    { label: 'Leadership', href: '#leadership' },
    { label: 'Portfolio', href: '#portfolio' },
    { label: 'Careers', href: '#' },
  ],
  investors: [
    { label: 'Thesis', href: '#thesis' },
    { label: 'Returns', href: '#returns' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Use', href: '#' },
    { label: 'Disclosures', href: '#' },
  ],
}

export function Footer() {
  return (
    <footer className="relative pt-16 pb-8 section-padding bg-slate-950 border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16"
        >
          {/* Brand column */}
          <motion.div 
            variants={fadeUpVariant}
            className="lg:col-span-2"
          >
            <a href="#" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-coral to-burgundy flex items-center justify-center">
                <span className="text-slate-50 font-display font-bold text-xl">M</span>
              </div>
              <div>
                <span className="font-display font-semibold text-xl text-slate-50">Merova</span>
                <span className="font-display font-normal text-xl text-slate-400 ml-1">Healthcare</span>
              </div>
            </a>
            
            <p className="text-slate-400 max-w-sm mb-6 leading-relaxed">
              Building the future of pharmaceutical manufacturing through strategic 
              acquisition, integration, and operational excellence.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a 
                href="#" 
                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-coral hover:bg-slate-800 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="p-2 rounded-lg bg-slate-800/50 text-slate-400 hover:text-coral hover:bg-slate-800 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Link columns */}
          <motion.div variants={fadeUpVariant}>
            <h4 className="font-medium text-slate-50 mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-coral transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="font-medium text-slate-50 mb-4">Investors</h4>
            <ul className="space-y-3">
              {footerLinks.investors.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-coral transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <h4 className="font-medium text-slate-50 mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-slate-400 hover:text-coral transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              &copy; {new Date().getFullYear()} Merova Healthcare Holding Ltd. All rights reserved.
            </p>
            
            <p className="text-sm text-slate-600">
              Zurich, Switzerland
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-8 border-t border-slate-800/30">
          <p className="text-xs text-slate-600 leading-relaxed">
            This website is for informational purposes only and does not constitute an offer to sell 
            or a solicitation of an offer to buy any securities. Past performance is not indicative 
            of future results. Investments involve risk and possible loss of principal capital.
          </p>
        </div>
      </div>
    </footer>
  )
}
