'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  defaultViewport 
} from '@/lib/animations'
import { Mail, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react'

const inquiryTypes = [
  { id: 'investor', label: 'Investor Inquiry' },
  { id: 'partnership', label: 'Strategic Partnership' },
  { id: 'acquisition', label: 'Acquisition Opportunity' },
  { id: 'media', label: 'Media/Press' },
]

export function ContactSection() {
  const [selectedType, setSelectedType] = useState('investor')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    message: '',
  })

  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  // Demo build: nothing leaves the browser. The request is simulated so the
  // full sending → sent flow can be tried without a mail backend.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 900)
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', organization: '', message: '' })
    setStatus('idle')
  }

  return (
    <section 
      id="contact"
      className="relative py-24 md:py-32 section-padding bg-slate-900"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={staggerContainerVariant}
          >
            <motion.span 
              variants={fadeUpVariant}
              className="inline-block text-sm font-medium text-coral uppercase tracking-wider mb-4"
            >
              Get in Touch
            </motion.span>
            
            <motion.h2 
              id="contact-heading"
              variants={fadeUpVariant}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6"
            >
              Let&apos;s Build the Future Together
            </motion.h2>
            
            <motion.p 
              variants={fadeUpVariant}
              className="text-lg text-slate-400 mb-12 leading-relaxed"
            >
              Whether you&apos;re an investor seeking healthcare exposure, a strategic partner 
              exploring collaboration, or a company considering a transaction, we&apos;d like to hear from you.
            </motion.p>

            {/* Contact info */}
            <motion.div 
              variants={staggerContainerVariant}
              className="space-y-6"
            >
              <motion.div 
                variants={fadeUpVariant}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-50 mb-1">Email</h3>
                  <a 
                    href="mailto:investors@merova.test" 
                    className="text-slate-400 hover:text-coral transition-colors"
                  >
                    investors@merova.test
                  </a>
                </div>
              </motion.div>

              <motion.div 
                variants={fadeUpVariant}
                className="flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-coral" />
                </div>
                <div>
                  <h3 className="font-medium text-slate-50 mb-1">Headquarters</h3>
                  <p className="text-slate-400">
                    Zurich, Switzerland
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            variants={fadeUpVariant}
          >
            {status === 'sent' ? (
              <div
                role="status"
                className="flex h-full flex-col items-start justify-center gap-4 p-8 lg:p-10 rounded-2xl bg-slate-800/30 border border-slate-700/50"
              >
                <div className="w-12 h-12 rounded-xl bg-coral/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-coral" />
                </div>
                <h3 className="font-display text-2xl font-semibold text-slate-50">Inquiry sent</h3>
                <p className="text-slate-400 leading-relaxed">
                  Thanks{formData.name ? `, ${formData.name.split(' ')[0]}` : ''}. This is a demo, so nothing was
                  actually delivered — on the live site, the investor relations team replies within 2 business days.
                </p>
                <button
                  type="button"
                  onClick={resetForm}
                  className="mt-2 text-sm font-medium text-coral hover:text-coral-light transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
            <form
              onSubmit={handleSubmit}
              className="p-8 lg:p-10 rounded-2xl bg-slate-800/30 border border-slate-700/50"
            >
              {/* Inquiry type selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Inquiry Type
                </label>
                <div className="flex flex-wrap gap-2">
                  {inquiryTypes.map((type) => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setSelectedType(type.id)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
                        ${selectedType === type.id 
                          ? 'bg-coral text-slate-950' 
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                        }
                      `}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-slate-300 mb-2">
                    Organization *
                  </label>
                  <input
                    type="text"
                    id="organization"
                    required
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-colors"
                    placeholder="Investment Firm LLC"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700/50 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/50 transition-colors resize-none"
                    placeholder="Tell us about your interest in Merova..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={status === 'sending'}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg bg-coral text-slate-950 font-medium hover:bg-coral-light transition-colors disabled:opacity-60"
                >
                  {status === 'sending' ? 'Sending inquiry…' : 'Send Inquiry'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>

              <p className="mt-6 text-xs text-slate-500 text-center">
                By submitting this form, you agree to our privacy policy. 
                We&apos;ll respond within 2 business days.
              </p>
            </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
