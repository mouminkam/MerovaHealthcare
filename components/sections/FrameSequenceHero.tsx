'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const TOTAL_FRAMES = 189
const INITIAL_READY_FRAMES = 30
const BATCH_SIZE = 20
const FRAME_PATH = '/assets/frames/'

const headlineWords = [
  { text: 'Your health.', start: 0.3, accent: false },
  { text: 'One place.', start: 0.38, accent: false },
  { text: 'Finally.', start: 0.46, accent: true },
]

const clamp01 = (value: number) => Math.max(0, Math.min(1, value))

const fadeProgress = (progress: number, start: number, end: number) => {
  if (progress <= start) return 0
  if (progress >= end) return 1
  return clamp01((progress - start) / (end - start))
}

export function FrameSequenceHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const exitOverlayRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([])
  const frameImages = useRef<Array<HTMLImageElement | undefined>>([])
  const loadedFrames = useRef<Set<number>>(new Set())
  const pendingImages = useRef<HTMLImageElement[]>([])
  const initialFramesReadyRef = useRef(false)
  const currentFrameRef = useRef(0)
  const requestedFrameRef = useRef(0)
  const lastProgressRef = useRef(0)
  const drawRafRef = useRef<number | null>(null)
  const dimensionsRef = useRef({ width: 0, height: 0 })
  const [loadedCount, setLoadedCount] = useState(0)
  const [initialFramesReady, setInitialFramesReady] = useState(false)
  const [isStaticHero, setIsStaticHero] = useState(false)

  const getFrameSrc = useCallback((frameNumber: number) => {
    return `${FRAME_PATH}${String(frameNumber).padStart(4, '0')}.webp`
  }, [])

  const findDrawableFrame = useCallback((frameIndex: number) => {
    if (loadedFrames.current.has(frameIndex)) return frameIndex

    for (let offset = 1; offset < TOTAL_FRAMES; offset += 1) {
      const previous = frameIndex - offset
      const next = frameIndex + offset

      if (previous >= 0 && loadedFrames.current.has(previous)) return previous
      if (next < TOTAL_FRAMES && loadedFrames.current.has(next)) return next
    }

    return -1
  }, [])

  const drawFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const drawableIndex = findDrawableFrame(frameIndex)
    if (drawableIndex < 0) return

    const image = frameImages.current[drawableIndex]
    if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return

    const context = canvas.getContext('2d')
    if (!context) return

    const { width, height } = dimensionsRef.current
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    const x = (width - drawWidth) / 2
    const y = (height - drawHeight) / 2

    context.clearRect(0, 0, width, height)
    context.drawImage(image, x, y, drawWidth, drawHeight)
    currentFrameRef.current = drawableIndex
  }, [findDrawableFrame])

  const scheduleDraw = useCallback((frameIndex: number) => {
    requestedFrameRef.current = frameIndex

    if (drawRafRef.current !== null) return

    drawRafRef.current = window.requestAnimationFrame(() => {
      drawRafRef.current = null
      drawFrame(requestedFrameRef.current)
    })
  }, [drawFrame])

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = window.innerWidth
    const height = window.innerHeight
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
    const context = canvas.getContext('2d')

    dimensionsRef.current = { width, height }
    canvas.width = Math.floor(width * pixelRatio)
    canvas.height = Math.floor(height * pixelRatio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    context?.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    scheduleDraw(currentFrameRef.current)
  }, [scheduleDraw])

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 639px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const updateMode = () => {
      setIsStaticHero(mobileQuery.matches || reducedMotionQuery.matches)
    }

    updateMode()
    mobileQuery.addEventListener('change', updateMode)
    reducedMotionQuery.addEventListener('change', updateMode)

    return () => {
      mobileQuery.removeEventListener('change', updateMode)
      reducedMotionQuery.removeEventListener('change', updateMode)
    }
  }, [])

  useEffect(() => {
    const shouldUseStaticHero =
      isStaticHero ||
      window.matchMedia('(max-width: 639px)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (shouldUseStaticHero) return

    let cancelled = false

    const loadFrame = (frameNumber: number) => {
      return new Promise<void>((resolve) => {
        if (cancelled) {
          resolve()
          return
        }

        const frameIndex = frameNumber - 1
        const image = new Image()

        pendingImages.current.push(image)

        image.onload = () => {
          if (!cancelled) {
            frameImages.current[frameIndex] = image
            loadedFrames.current.add(frameIndex)
            setLoadedCount((count) => {
              const nextCount = count + 1
              if (nextCount >= INITIAL_READY_FRAMES && !initialFramesReadyRef.current) {
                initialFramesReadyRef.current = true
                setInitialFramesReady(true)
                scheduleDraw(Math.round(lastProgressRef.current * (TOTAL_FRAMES - 1)))
              }
              return nextCount
            })

            if (frameIndex === 0 || frameIndex === currentFrameRef.current) {
              scheduleDraw(currentFrameRef.current)
            }
          }

          resolve()
        }

        image.onerror = () => resolve()
        image.src = getFrameSrc(frameNumber)
      })
    }

    const loadInBatches = async () => {
      for (let start = 1; start <= TOTAL_FRAMES && !cancelled; start += BATCH_SIZE) {
        const end = Math.min(start + BATCH_SIZE - 1, TOTAL_FRAMES)
        const batch = []

        for (let frameNumber = start; frameNumber <= end; frameNumber += 1) {
          batch.push(loadFrame(frameNumber))
        }

        await Promise.all(batch)
      }
    }

    loadInBatches()

    return () => {
      cancelled = true

      pendingImages.current.forEach((image) => {
        image.onload = null
        image.onerror = null
        image.src = ''
      })

      pendingImages.current = []
    }
  }, [getFrameSrc, isStaticHero, scheduleDraw])

  useEffect(() => {
    if (isStaticHero) return

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => {
      window.removeEventListener('resize', updateCanvasSize)

      if (drawRafRef.current !== null) {
        window.cancelAnimationFrame(drawRafRef.current)
        drawRafRef.current = null
      }
    }
  }, [isStaticHero, updateCanvasSize])

  useEffect(() => {
    if (!containerRef.current || isStaticHero) return

    const context = gsap.context(() => {
      const setHeroProgress = (progress: number) => {
        lastProgressRef.current = progress
        const endDimming = fadeProgress(progress, 0.84, 1)
        const exitFade = 1 - fadeProgress(progress, 0.9, 1)

        gsap.set(exitOverlayRef.current, {
          autoAlpha: endDimming,
        })

        headlineWords.forEach((word, index) => {
          const element = wordRefs.current[index]
          if (!element) return

          const opacity = fadeProgress(progress, word.start, word.start + 0.08) * exitFade
          gsap.set(element, {
            autoAlpha: opacity,
            y: (1 - opacity) * 18,
          })
        })

        const subtextOpacity = fadeProgress(progress, 0.5, 0.7) * exitFade
        gsap.set(subtextRef.current, {
          autoAlpha: subtextOpacity,
          y: (1 - subtextOpacity) * 18,
        })

        const ctaOpacity = fadeProgress(progress, 0.75, 0.88) * exitFade
        gsap.set(ctasRef.current, {
          autoAlpha: ctaOpacity,
          y: (1 - ctaOpacity) * 18,
        })

        gsap.set(scrollIndicatorRef.current, {
          autoAlpha: progress < 0.08 ? 1 - progress / 0.08 : 0,
        })

        if (initialFramesReadyRef.current) {
          const frameIndex = Math.round(progress * (TOTAL_FRAMES - 1))
          scheduleDraw(frameIndex)
        }
      }

      gsap.set(wordRefs.current, { autoAlpha: 0, y: 18 })
      gsap.set([subtextRef.current, ctasRef.current], { autoAlpha: 0, y: 18 })
      gsap.set(exitOverlayRef.current, { autoAlpha: 0 })

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 4}`,
        pin: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => setHeroProgress(self.progress),
        onRefresh: (self) => setHeroProgress(self.progress),
      })

      ScrollTrigger.refresh()
    }, containerRef)

    return () => context.revert()
  }, [isStaticHero, scheduleDraw])

  if (isStaticHero) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-slate-950" aria-label="Hero section">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${getFrameSrc(100)})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/20" />
        <div className="relative z-10 flex min-h-screen flex-col justify-end px-6 pb-20 md:px-12 md:pb-28 lg:px-24">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-6xl"
          >
            <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white md:text-7xl">
              Your health. One place. <span className="text-coral">Finally.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-xl md:leading-8">
              Merova resolves the fragmented healthcare journey - for patients, providers, and the region.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="inline-flex items-center justify-center rounded-md bg-coral px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-coral-light" href="#platform">
                For Patients
              </a>
              <a className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-coral/60 hover:bg-white/10" href="#contact">
                For Providers
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-slate-950"
      aria-label="Hero section"
    >
      {!initialFramesReady && (
        <div className="fixed left-0 right-0 top-0 z-50 h-0.5 bg-white/5" aria-hidden="true">
          <div
            ref={progressRef}
            className="h-full origin-left bg-burgundy transition-transform duration-300"
            style={{ transform: `scaleX(${Math.min(loadedCount / INITIAL_READY_FRAMES, 1)})` }}
          />
        </div>
      )}

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-slate-950/10" aria-hidden="true" />
      <div
        ref={exitOverlayRef}
        className="pointer-events-none absolute inset-0 bg-slate-950"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-20 md:px-12 md:pb-28 lg:px-24">
        <div className="max-w-6xl">
          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[-0.03em] text-white md:text-7xl lg:text-8xl">
            {headlineWords.map((word, index) => (
              <span
                key={word.text}
                ref={(node) => {
                  wordRefs.current[index] = node
                }}
                className={`mr-[0.18em] inline-block will-change-transform ${word.accent ? 'text-coral' : ''}`}
                style={{ opacity: 0, transform: 'translateY(18px)' }}
              >
                {word.text}
              </span>
            ))}
          </h1>

          <p
            ref={subtextRef}
            className="mt-6 max-w-2xl text-base leading-7 text-slate-300 md:text-xl md:leading-8"
            style={{ opacity: 0, transform: 'translateY(18px)' }}
          >
            Merova resolves the fragmented healthcare journey - for patients, providers, and the region.
          </p>

          <div
            ref={ctasRef}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
            style={{ opacity: 0, transform: 'translateY(18px)' }}
          >
            <motion.a
              href="#platform"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-md bg-coral px-6 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-coral-light"
            >
              For Patients
            </motion.a>
            <motion.a
              href="#contact"
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center justify-center rounded-md border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-coral/60 hover:bg-white/10"
            >
              For Providers
            </motion.a>
          </div>
        </div>
      </div>

      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-400"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.12em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      </div>
    </section>
  )
}
