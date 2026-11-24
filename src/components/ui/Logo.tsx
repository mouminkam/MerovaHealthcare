'use client'

import { useId } from 'react'
import { cn } from '@/lib/utils'

/**
 * The Merova mark: the hero's platform sphere reduced to seven nodes — a
 * flat-top geodesic hexagon banded exactly like the sphere (Specialty peach on
 * top, Generics coral in the middle, CMO burgundy at the bottom) around a core.
 */

const R = 11
const C = 16
// Flat-top hexagon, listed top-left clockwise, so bands pair up: top, middle, bottom.
const NODES = [240, 300, 0, 60, 120, 180].map((deg) => {
  const a = (deg * Math.PI) / 180
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) }
})
const BAND_FILL = ['var(--specialty)', 'var(--specialty)', 'var(--generics)', 'var(--cmo)', 'var(--cmo)', 'var(--generics)']

export function LogoMark({ className, title }: { className?: string; title?: string }) {
  const uid = useId().replace(/:/g, '')
  const stroke = `logo-stroke-${uid}`
  const core = `logo-core-${uid}`

  return (
    <svg
      viewBox="0 0 32 32"
      className={cn('h-8 w-8 shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      <defs>
        <linearGradient id={stroke} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--specialty)" />
          <stop offset="0.5" stopColor="var(--generics)" />
          <stop offset="1" stopColor="var(--cmo)" />
        </linearGradient>
        <radialGradient id={core}>
          <stop offset="0" stopColor="#fff1ea" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="var(--generics)" stopOpacity="0.45" />
          <stop offset="1" stopColor="var(--cmo)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={C} cy={C} r="14.6" fill="none" stroke="white" strokeOpacity="0.1" strokeWidth="0.8" />
      <circle cx={C} cy={C} r="7.5" fill={`url(#${core})`} />
      <g stroke={`url(#${stroke})`} strokeWidth="1.1" strokeOpacity="0.85" fill="none">
        <polygon points={NODES.map((n) => `${n.x.toFixed(2)},${n.y.toFixed(2)}`).join(' ')} />
        {NODES.map((n, i) => (
          <line key={i} x1={C} y1={C} x2={n.x.toFixed(2)} y2={n.y.toFixed(2)} />
        ))}
      </g>
      {NODES.map((n, i) => (
        <circle key={i} cx={n.x.toFixed(2)} cy={n.y.toFixed(2)} r="1.9" fill={BAND_FILL[i]} />
      ))}
      <circle cx={C} cy={C} r="2.2" fill="#fff4ee" />
    </svg>
  )
}

export function Logo({ className, markClassName }: { className?: string; markClassName?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark className={markClassName} />
      <span className="font-display text-[1.05rem] leading-none tracking-[-0.01em]">
        <span className="font-semibold text-slate-50">Merova</span>
        <span className="hidden text-slate-400 sm:inline"> Healthcare</span>
      </span>
    </span>
  )
}
