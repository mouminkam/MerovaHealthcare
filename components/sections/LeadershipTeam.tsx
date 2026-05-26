'use client'

import { motion } from 'framer-motion'
import { 
  fadeUpVariant, 
  staggerContainerVariant,
  cardHoverVariant,
  defaultViewport 
} from '@/lib/animations'
import { Linkedin } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  bio: string
  initials: string
  linkedin?: string
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Alexander Reinholt',
    role: 'Chairman & CEO',
    initials: 'AR',
    bio: '25+ years in pharmaceutical M&A and operations. Former McKinsey Partner, led $5B+ in healthcare transactions.',
    linkedin: '#',
  },
  {
    name: 'Sarah Chen',
    role: 'Chief Investment Officer',
    initials: 'SC',
    bio: 'Previously at Blackstone Healthcare, managed $2B healthcare portfolio. Stanford MBA, Johns Hopkins MPH.',
    linkedin: '#',
  },
  {
    name: 'Dr. Raj Patel',
    role: 'Chief Operating Officer',
    initials: 'RP',
    bio: 'Former SVP Operations at Teva. Led manufacturing integration for 15+ facilities across 3 continents.',
    linkedin: '#',
  },
  {
    name: 'Maria Kowalski',
    role: 'Chief Financial Officer',
    initials: 'MK',
    bio: '20 years in healthcare finance. Former CFO at Actavis, led financial integration of $10B+ acquisitions.',
    linkedin: '#',
  },
  {
    name: 'Dr. James Morrison',
    role: 'Chief Scientific Officer',
    initials: 'JM',
    bio: 'PhD Pharmaceutical Sciences. 50+ FDA approvals, built R&D organizations at Mylan and Sandoz.',
    linkedin: '#',
  },
  {
    name: 'Lisa Nakamura',
    role: 'Chief Regulatory Officer',
    initials: 'LN',
    bio: 'Former FDA reviewer. 18 years regulatory affairs experience across US, EU, and emerging markets.',
    linkedin: '#',
  },
]

const advisoryBoard = [
  { name: 'Prof. Henrik Strom', role: 'Former CEO, Novo Nordisk', initials: 'HS' },
  { name: 'Dr. Catherine Wells', role: 'Former FDA Commissioner', initials: 'CW' },
  { name: 'Marcus Thompson', role: 'Former Partner, KKR Healthcare', initials: 'MT' },
]

export function LeadershipTeam() {
  return (
    <section 
      id="leadership"
      className="relative py-24 md:py-32 section-padding bg-slate-950"
      aria-labelledby="leadership-heading"
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
            Leadership
          </motion.span>
          
          <motion.h2 
            id="leadership-heading"
            variants={fadeUpVariant}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-slate-50 mb-6"
          >
            Experienced Operators.<br />
            <span className="text-gradient">Proven Track Record.</span>
          </motion.h2>
          
          <motion.p 
            variants={fadeUpVariant}
            className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed"
          >
            Our leadership team brings decades of pharmaceutical manufacturing, M&A, 
            and operational excellence experience from leading global organizations.
          </motion.p>
        </motion.div>

        {/* Executive team grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16 md:mb-24"
        >
          {teamMembers.map((member) => (
            <motion.article
              key={member.name}
              variants={fadeUpVariant}
              initial="rest"
              whileHover="hover"
              className="group"
            >
              <motion.div
                variants={cardHoverVariant}
                className="h-full p-6 lg:p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700/50 transition-colors duration-300"
              >
                <div className="flex items-start justify-between mb-6">
                  {/* Avatar monogram */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-coral to-burgundy flex items-center justify-center">
                    <span className="font-display font-bold text-xl text-slate-50">
                      {member.initials}
                    </span>
                  </div>
                  
                  {member.linkedin && (
                    <a 
                      href={member.linkedin}
                      className="p-2 rounded-lg text-slate-500 hover:text-coral hover:bg-slate-800/50 transition-colors"
                      aria-label={`${member.name} LinkedIn profile`}
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}
                </div>

                <h3 className="font-display text-xl font-semibold text-slate-50 mb-1">
                  {member.name}
                </h3>
                
                <p className="text-sm font-medium text-coral mb-4">
                  {member.role}
                </p>
                
                <p className="text-slate-400 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </motion.div>
            </motion.article>
          ))}
        </motion.div>

        {/* Advisory board */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={defaultViewport}
          variants={staggerContainerVariant}
        >
          <motion.h3 
            variants={fadeUpVariant}
            className="font-display text-2xl font-semibold text-slate-50 mb-8 text-center"
          >
            Advisory Board
          </motion.h3>
          
          <motion.div 
            variants={staggerContainerVariant}
            className="flex flex-wrap justify-center gap-6"
          >
            {advisoryBoard.map((advisor) => (
              <motion.div
                key={advisor.name}
                variants={fadeUpVariant}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800/50"
              >
                <div className="w-12 h-12 rounded-full bg-slate-700/50 flex items-center justify-center">
                  <span className="font-display font-semibold text-slate-300">
                    {advisor.initials}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-slate-50">{advisor.name}</div>
                  <div className="text-sm text-slate-500">{advisor.role}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
