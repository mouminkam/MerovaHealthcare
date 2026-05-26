'use client'

import Lenis from 'lenis'
import { gsap, ScrollTrigger } from './gsap'

let lenisInstance: Lenis | null = null
let tickerCallback: ((time: number) => void) | null = null

export function initLenis(): Lenis {
  if (lenisInstance) return lenisInstance
  
  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    touchMultiplier: 2,
  })

  // Sync Lenis with GSAP ScrollTrigger
  lenisInstance.on('scroll', ScrollTrigger.update)
  
  tickerCallback = (time) => {
    lenisInstance?.raf(time * 1000)
  }

  gsap.ticker.add(tickerCallback)
  
  gsap.ticker.lagSmoothing(0)
  requestAnimationFrame(() => ScrollTrigger.refresh())
  
  return lenisInstance
}

export function destroyLenis(): void {
  if (lenisInstance) {
    lenisInstance.destroy()
    lenisInstance = null
  }

  if (tickerCallback) {
    gsap.ticker.remove(tickerCallback)
    tickerCallback = null
  }
}

export function getLenis(): Lenis | null {
  return lenisInstance
}
