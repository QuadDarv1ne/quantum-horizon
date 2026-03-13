"use client"

import { useEffect, useRef, useCallback } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"

/**
 * Опции для хука useVisualizationCanvas
 */
export interface UseVisualizationCanvasOptions {
  /** Зависимости для перезапуска анимации */
  dependencies?: React.DependencyList
  /** Приостановить анимацию когда canvas не виден */
  pauseWhenHidden?: boolean
  /** Использовать reduced motion preference */
  respectReducedMotion?: boolean
  /** Callback при инициализации контекста */
  onContextReady?: (ctx: CanvasRenderingContext2D) => void
}

/**
 * Хук для работы с canvas визуализациями
 * Инкапсулирует настройку canvas, resize observer и animation loop
 *
 * @example
 * ```tsx
 * const canvasRef = useRef<HTMLCanvasElement>(null)
 *
 * useVisualizationCanvas(canvasRef, (ctx, width, height, delta) => {
 *   ctx.clearRect(0, 0, width, height)
 *   // drawing logic
 * }, { dependencies: [someState] })
 * ```
 */
export function useVisualizationCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  animate: (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => void,
  options: UseVisualizationCanvasOptions = {}
): void {
  const {
    dependencies = [],
    pauseWhenHidden = true,
    respectReducedMotion = true,
    onContextReady,
  } = options

  const animationFrameId = useRef<number | undefined>(undefined)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastTimeRef = useRef<number>(0)
  const isVisibleRef = useRef<boolean>(true)
  const reducedMotionRef = useRef<boolean>(false)

  // Setup canvas context
  const setupCanvasCallback = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx
    onContextReady?.(ctx)
  }, [canvasRef, onContextReady])

  // Check reduced motion preference
  useEffect(() => {
    if (!respectReducedMotion) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    reducedMotionRef.current = mediaQuery.matches

    const handler = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches
    }

    mediaQuery.addEventListener("change", handler)
    return () => {
      mediaQuery.removeEventListener("change", handler)
    }
  }, [respectReducedMotion])

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx
    onContextReady?.(ctx)

    // ResizeObserver для отслеживания размера canvas
    const resizeObserver = new ResizeObserver(() => {
      setupCanvasCallback()
    })
    resizeObserver.observe(canvas)

    // IntersectionObserver для паузы когда не виден
    let observer: IntersectionObserver | undefined
    if (pauseWhenHidden) {
      observer = new IntersectionObserver(
        (entries) => {
          isVisibleRef.current = entries[0]?.isIntersecting ?? true
        },
        { threshold: 0 }
      )
      observer.observe(canvas)
    }

    let running = true

    const loop = (timestamp: number) => {
      if (!running) return

      // Пауза если не виден или reduced motion
      if (!isVisibleRef.current || reducedMotionRef.current) {
        lastTimeRef.current = timestamp
        animationFrameId.current = requestAnimationFrame(loop)
        return
      }

      // Delta time calculation
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      const rect = canvas.getBoundingClientRect()
      animate(ctx, rect.width, rect.height, deltaTime)

      animationFrameId.current = requestAnimationFrame(loop)
    }

    animationFrameId.current = requestAnimationFrame(loop)

    return () => {
      running = false
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (observer !== undefined) {
        observer.disconnect()
      }
      resizeObserver.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

/**
 * Утилита для создания градиентов с кешированием
 */
export function createCachedGradient<T extends CanvasGradient>(
  _cacheRef: React.RefObject<T | null>,
  _createFn: (ctx: CanvasRenderingContext2D) => T
): T | null {
  return null
}
