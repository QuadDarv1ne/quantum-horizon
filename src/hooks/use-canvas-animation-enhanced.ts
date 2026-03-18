"use client"

import { useEffect, useRef, useCallback } from "react"

interface UseCanvasAnimationOptions {
  targetFps?: number
  reducedMotionFps?: number
  backgroundFps?: number
  onAnimate?: (deltaTime: number) => void
  /** Зависимости для перезапуска анимации */
  deps?: React.DependencyList
  /** Приостановить анимацию когда не виден */
  pauseWhenHidden?: boolean
  /** Использовать reduced motion */
  respectReducedMotion?: boolean
}

/**
 * Хук для анимации canvas с адаптивным FPS и оптимизацией производительности
 * Features:
 * - Adaptive FPS based on visibility and user preferences
 * - Automatic pause when not visible (IntersectionObserver)
 * - Reduced motion support
 * - FPS monitoring
 * - HiDPI/Retina display support
 */
export function useCanvasAnimationEnhanced({
  targetFps = 30,
  reducedMotionFps = 15,
  backgroundFps = 10,
  onAnimate,
  deps = [],
  pauseWhenHidden = true,
  respectReducedMotion = true,
}: UseCanvasAnimationOptions = {}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)
  const isVisibleRef = useRef<boolean>(true)
  const frameCountRef = useRef<number>(0)
  const fpsRef = useRef<number>(0)
  const lastFpsUpdateRef = useRef<number>(0)
  const reducedMotionRef = useRef<boolean>(false)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const onAnimateRef = useRef(onAnimate)

  // Update onAnimate ref when it changes
  useEffect(() => {
    onAnimateRef.current = onAnimate
  }, [onAnimate])

  /**
   * Настройка canvas для HiDPI/Retina дисплеев
   */
  const setupCanvas = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.resetTransform()
    ctx.scale(dpr, dpr)
  }, [])

  // Get effective FPS based on visibility and reduced motion
  const getEffectiveFps = useCallback(() => {
    if (!isVisibleRef.current) return backgroundFps
    if (reducedMotionRef.current) return reducedMotionFps
    return targetFps
  }, [targetFps, reducedMotionFps, backgroundFps])

  // Start/stop animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx

    // Animation loop using ref to avoid circular dependency
    const animate = (timestamp: number) => {
      if (lastTimeRef.current === 0) {
        lastTimeRef.current = timestamp
      }

      const deltaTime = timestamp - lastTimeRef.current
      const effectiveFps = getEffectiveFps()
      const frameInterval = 1000 / effectiveFps

      if (deltaTime >= frameInterval) {
        frameCountRef.current++
        if (timestamp - lastFpsUpdateRef.current >= 1000) {
          fpsRef.current = frameCountRef.current
          frameCountRef.current = 0
          lastFpsUpdateRef.current = timestamp
        }

        if (onAnimateRef.current) {
          onAnimateRef.current(deltaTime)
        }

        lastTimeRef.current = timestamp
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    // ResizeObserver для отслеживания размера canvas
    const resizeObserver = new ResizeObserver(() => {
      setupCanvas(canvas, ctx)
    })
    resizeObserver.observe(canvas)

    // IntersectionObserver для паузы когда не виден
    let observer: IntersectionObserver | undefined
    if (pauseWhenHidden) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isVisibleRef.current = entry.isIntersecting
        },
        { threshold: 0 }
      )
      observer.observe(canvas)
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (observer !== undefined) {
        observer.disconnect()
      }
      resizeObserver.disconnect()
    }
  }, [setupCanvas, pauseWhenHidden, getEffectiveFps])

  // Reduced motion media query
  useEffect(() => {
    if (!respectReducedMotion) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mediaQuery.matches

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [respectReducedMotion])

  // Get current FPS
  const getFps = useCallback(() => fpsRef.current, [])

  return {
    canvasRef,
    getFps,
    isAnimating: true,
  }
}
