'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { easeOutExpo, inView, reveal, revealGroup } from '@/lib/animations'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { LogoMark } from '@/components/ui/Logo'

const inquiryTypes = [
  { id: 'investor', label: 'Investor inquiry' },
  { id: 'partnership', label: 'Strategic partnership' },
  { id: 'acquisition', label: 'Acquisition opportunity' },
  { id: 'media', label: 'Media & press' },
]

const details = [
  { label: 'Email', value: 'investors@merova.test', href: 'mailto:investors@merova.test' },
  { label: 'Headquarters', value: 'Zurich, Switzerland' },
  { label: 'Response time', value: 'Within 2 business days' },
]

const field =
  'w-full rounded-2xl border border-white/[0.1] bg-white/[0.03] px-4 py-3.5 text-slate-100 placeholder:text-slate-600 transition-colors focus:border-coral/60 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-coral/25'

export function ContactSection() {
  const [selectedType, setSelectedType] = useState('investor')
  const [formData, setFormData] = useState({ name: '', email: '', organization: '', message: '' })
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

  const update = (key: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData({ ...formData, [key]: e.target.value })

  return (
    <section id="contact" aria-labelledby="contact-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeader
            id="contact-heading"
            eyebrow="Contact"
            title={
              <>
                Talk to the
                <br />
                <span className="text-coral">Merova team.</span>
              </>
            }
            lede="Whether you're an investor seeking healthcare exposure, a strategic partner exploring collaboration, or a company considering a transaction, we'd like to hear from you."
            className="lg:block"
          />
          <motion.dl variants={revealGroup} initial="hidden" whileInView="visible" viewport={inView} className="mt-12">
            {details.map((d) => (
              <motion.div key={d.label} variants={reveal} className="flex flex-col-reverse border-t border-white/[0.08] py-5 last:border-b">
                <dd className="mt-1.5 text-lg text-slate-100">
                  {d.href ? (
                    <a href={d.href} className="transition-colors hover:text-coral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral">
                      {d.value}
                    </a>
                  ) : (
                    d.value
                  )}
                </dd>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">{d.label}</dt>
              </motion.div>
            ))}
          </motion.dl>
        </div>

        <motion.div variants={reveal} initial="hidden" whileInView="visible" viewport={inView} className="lg:col-span-7">
          <div className="relative overflow-hidden rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-6 md:p-10">
            <AnimatePresence mode="wait" initial={false}>
              {status === 'sent' ? (
                <motion.div
                  key="sent"
                  role="status"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                  className="flex min-h-[28rem] flex-col items-start justify-center"
                >
                  <LogoMark className="h-12 w-12" />
                  <h3 className="mt-8 font-display text-3xl font-bold tracking-[-0.03em] text-slate-50">Inquiry sent</h3>
                  <p className="mt-4 max-w-md leading-7 text-slate-400">
                    Thanks{formData.name ? `, ${formData.name.split(' ')[0]}` : ''}. This is a demo, so nothing was actually delivered — on
                    the live site, the investor relations team replies within 2 business days.
                  </p>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-coral transition-colors hover:text-coral-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral"
                  >
                    Send another inquiry
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.5, ease: easeOutExpo }}
                >
                  <fieldset>
                    <legend className="font-mono text-[11px] uppercase tracking-[0.16em] text-slate-500">I&apos;m getting in touch about</legend>
                    {/* native radios: arrow keys and form semantics for free, styled as pills */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {inquiryTypes.map((type) => {
                        const checked = selectedType === type.id
                        return (
                          <label key={type.id} className="cursor-pointer">
                            <input
                              type="radio"
                              name="inquiry-type"
                              value={type.id}
                              checked={checked}
                              onChange={() => setSelectedType(type.id)}
                              className="peer sr-only"
                            />
                            <span
                              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-coral ${
                                checked
                                  ? 'border-coral bg-coral text-slate-950'
                                  : 'border-white/[0.1] text-slate-300 hover:border-white/25 hover:text-slate-50'
                              }`}
                            >
                              {checked ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : null}
                              {type.label}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </fieldset>

                  <div className="mt-8 grid gap-5 md:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-300">Full name</span>
                      <input type="text" required autoComplete="name" value={formData.name} onChange={update('name')} className={field} placeholder="Jana Khoury" />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm text-slate-300">Work email</span>
                      <input type="email" required autoComplete="email" value={formData.email} onChange={update('email')} className={field} placeholder="jana@example.com" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm text-slate-300">Organization</span>
                      <input type="text" required autoComplete="organization" value={formData.organization} onChange={update('organization')} className={field} placeholder="Investment firm or company" />
                    </label>
                    <label className="block md:col-span-2">
                      <span className="mb-2 block text-sm text-slate-300">
                        Message <span className="text-slate-600">(optional)</span>
                      </span>
                      <textarea rows={4} value={formData.message} onChange={update('message')} className={`${field} resize-none`} placeholder="What would you like to discuss?" />
                    </label>
                  </div>

                  <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs leading-5 text-slate-500">By sending, you agree to our privacy policy.</p>
                    <button
                      type="submit"
                      disabled={status === 'sending'}
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-coral px-7 py-3.5 text-sm font-semibold text-slate-950 transition-colors hover:bg-coral-light disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-light focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                    >
                      {status === 'sending' ? 'Sending inquiry…' : 'Send inquiry'}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
