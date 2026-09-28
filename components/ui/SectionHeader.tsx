'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { inView, reveal, revealGroup } from '@/lib/animations'
import { cn } from '@/lib/utils'

/** Small mono label with a glowing node — the same dot the hero badge uses. */
export function Eyebrow({ children, color = 'var(--coral)', className }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <p className={cn('inline-flex items-center gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400', className)}>
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 10px 2px color-mix(in oklab, ${color} 55%, transparent)` }}
      />
      {children}
    </p>
  )
}

interface SectionHeaderProps {
  id: string
  eyebrow: string
  eyebrowColor?: string
  title: ReactNode
  lede?: ReactNode
  /** Optional content for the right-hand column (a key, a figure, a control). */
  aside?: ReactNode
  className?: string
}

export function SectionHeader({ id, eyebrow, eyebrowColor, title, lede, aside, className }: SectionHeaderProps) {
  return (
    <motion.header
      variants={revealGroup}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      className={cn('grid gap-8 lg:grid-cols-12 lg:items-end', className)}
    >
      <div className="lg:col-span-8">
        <motion.div variants={reveal}>
          <Eyebrow color={eyebrowColor}>{eyebrow}</Eyebrow>
        </motion.div>
        <motion.h2
          variants={reveal}
          id={id}
          className="mt-6 font-display text-[clamp(2.25rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-[-0.035em] text-slate-50"
        >
          {title}
        </motion.h2>
        {lede ? (
          <motion.p variants={reveal} className="mt-6 max-w-2xl text-base leading-7 text-slate-400 md:text-lg md:leading-8">
            {lede}
          </motion.p>
        ) : null}
      </div>
      {aside ? (
        <motion.div variants={reveal} className="lg:col-span-4 lg:justify-self-end">
          {aside}
        </motion.div>
      ) : null}
    </motion.header>
  )
}
