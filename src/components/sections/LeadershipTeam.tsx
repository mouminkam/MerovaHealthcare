'use client'

import { motion } from 'framer-motion'
import { inView, reveal, revealGroup } from '@/lib/animations'
import { SectionHeader } from '@/components/ui/SectionHeader'

interface TeamMember {
  name: string
  role: string
  bio: string
  initials: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Alexander Reinholt',
    role: 'Chairman & CEO',
    initials: 'AR',
    bio: '25+ years in pharmaceutical M&A and operations. Former strategy-consulting partner who led $5B+ in healthcare transactions.',
  },
  {
    name: 'Sarah Chen',
    role: 'Chief Investment Officer',
    initials: 'SC',
    bio: 'Previously managed a $2B healthcare portfolio at a global private-equity firm. MBA and MPH.',
  },
  {
    name: 'Dr. Raj Patel',
    role: 'Chief Operating Officer',
    initials: 'RP',
    bio: 'Former SVP Operations at a top-10 generics manufacturer. Led manufacturing integration for 15+ facilities across 3 continents.',
  },
  {
    name: 'Maria Kowalski',
    role: 'Chief Financial Officer',
    initials: 'MK',
    bio: '20 years in healthcare finance. Former CFO of a multinational specialty-pharma group; led financial integration of $10B+ in acquisitions.',
  },
  {
    name: 'Dr. James Morrison',
    role: 'Chief Scientific Officer',
    initials: 'JM',
    bio: 'PhD Pharmaceutical Sciences. 50+ product approvals; built R&D organizations at two global generics companies.',
  },
  {
    name: 'Lisa Nakamura',
    role: 'Chief Regulatory Officer',
    initials: 'LN',
    bio: 'Former drug-agency reviewer. 18 years of regulatory affairs experience across the US, EU and emerging markets.',
  },
]

const advisoryBoard = [
  { name: 'Prof. Henrik Strom', role: 'Former CEO, Nordic biopharma group', initials: 'HS' },
  { name: 'Dr. Catherine Wells', role: 'Former senior drug regulator', initials: 'CW' },
  { name: 'Marcus Thompson', role: 'Former partner, healthcare private equity', initials: 'MT' },
]

/** Initials inside a ring banded like the platform sphere. */
function Monogram({ initials, size = 'lg' }: { initials: string; size?: 'lg' | 'sm' }) {
  const box = size === 'lg' ? 'h-14 w-14 text-base' : 'h-11 w-11 text-sm'
  return (
    <span aria-hidden="true" className={`shrink-0 rounded-full bg-gradient-to-b from-specialty via-coral to-cmo p-px ${box}`}>
      <span className="flex h-full w-full items-center justify-center rounded-full bg-slate-950 font-display font-bold tracking-[-0.02em] text-slate-100">
        {initials}
      </span>
    </span>
  )
}

export function LeadershipTeam() {
  return (
    <section id="leadership" aria-labelledby="leadership-heading" className="relative section-padding py-28 md:py-36">
      <div className="mx-auto max-w-7xl">
        <SectionHeader
          id="leadership-heading"
          eyebrow="Leadership"
          title={
            <>
              Operators who have
              <br />
              <span className="text-coral">done this before.</span>
            </>
          }
          lede="Our leadership team brings decades of pharmaceutical manufacturing, M&A, and operational excellence experience from leading global organizations."
        />

        <motion.ul
          variants={revealGroup}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
          className="mt-16 grid gap-x-10 md:grid-cols-2 lg:mt-20 lg:grid-cols-3"
        >
          {teamMembers.map((m) => (
            <motion.li key={m.name} variants={reveal} className="border-t border-white/[0.08] py-9">
              <div className="flex items-center gap-4">
                <Monogram initials={m.initials} />
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold tracking-[-0.02em] text-slate-50">{m.name}</h3>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-coral">{m.role}</p>
                </div>
              </div>
              <p className="mt-5 text-[15px] leading-7 text-slate-400">{m.bio}</p>
            </motion.li>
          ))}
        </motion.ul>

        <motion.div variants={revealGroup} initial="hidden" whileInView="visible" viewport={inView} className="mt-14 lg:mt-20">
          <motion.p variants={reveal} className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
            Advisory board
          </motion.p>
          <ul className="mt-6 grid gap-4 md:grid-cols-3">
            {advisoryBoard.map((a) => (
              <motion.li
                key={a.name}
                variants={reveal}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5"
              >
                <Monogram initials={a.initials} size="sm" />
                <div className="min-w-0">
                  <p className="font-medium text-slate-100">{a.name}</p>
                  <p className="mt-0.5 text-sm text-slate-500">{a.role}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}
