'use client'

import { useEffect } from 'react'
import { initLenis, destroyLenis } from '@/lib/lenis'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    if (!prefersReducedMotion) {
      initLenis()
    }

    return () => {
      destroyLenis()
    }
  }, [])

  return <>{children}</>
}
