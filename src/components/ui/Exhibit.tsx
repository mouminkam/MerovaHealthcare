'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { inView, reveal } from '@/lib/animations'
import { cn } from '@/lib/utils'

/**
 * A framed figure in the hero-card style (28px radius, hairline border), with
 * an investor-memo caption: "Exhibit 2 · Addressable market".
 */
export function Exhibit({
  label,
  title,
  note,
  children,
  className,
}: {
  label?: string
  title: string
  note?: string
  children: ReactNode
  className?: string
}) {
  return (
    <motion.figure
      variants={reveal}
      initial="hidden"
      whileInView="visible"
      viewport={inView}
      className={cn('relative rounded-[28px] border border-white/[0.08] bg-white/[0.02] p-6 md:p-8', className)}
    >
      <figcaption className="mb-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1.5">
        <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {label ? <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-coral">{label}</span> : null}
          <span className="font-display text-base font-semibold text-slate-100">{title}</span>
        </span>
        {note ? <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-slate-500">{note}</span> : null}
      </figcaption>
      {children}
    </motion.figure>
  )
}
