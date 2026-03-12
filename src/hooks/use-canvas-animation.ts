/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { useEffect, useRef, useCallback } from "react"

/**
 * Настройка canvas для HiDPI/Retina дисплеев
 */
export function setupCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr

  ctx.resetTransform()
  ctx.scale(dpr, dpr)
}

/**
 * Опции для useCanvasAnimation
 */
export interface CanvasAnimationOptions {
  /** Зависимости для перезапуска анимации */
  deps?: React.DependencyList
  /** FPS лимит (0 = без лимита) */
  fpsLimit?: number
  /** Приостановить анимацию когда не виден */
  pauseWhenHidden?: boolean
  /** Использовать reduced motion */
  respectReducedMotion?: boolean
}

/**
 * Хук для анимации canvas с оптимизацией производительности
 */
export function useCanvasAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  animate: (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => void,
  options: CanvasAnimationOptions = {}
): void {
  const { deps = [], fpsLimit = 60, pauseWhenHidden = true, respectReducedMotion = true } = options

  const animationFrameId = useRef<number | undefined>(undefined)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastTimeRef = useRef<number>(0)
  const accumulatorRef = useRef<number>(0)
  const isVisibleRef = useRef<boolean>(true)
  const reducedMotionRef = useRef<boolean>(false)
  const rafIntervalRef = useRef<number>(1000 / fpsLimit)

  const setupCanvasCallback = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx
  }, [canvasRef])

  useEffect(() => {
    // Проверка reduced motion
    if (respectReducedMotion) {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
      reducedMotionRef.current = mediaQuery.matches

      const handler = (e: MediaQueryListEvent) => {
        reducedMotionRef.current = e.matches
      }
      mediaQuery.addEventListener("change", handler)
      return (): void => {
        mediaQuery.removeEventListener("change", handler)
      }
    }
  }, [respectReducedMotion])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx

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

    const handleResize = () => {
      setupCanvasCallback()
    }

    window.addEventListener("resize", handleResize)

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

      // FPS limiting
      if (fpsLimit > 0) {
        accumulatorRef.current += deltaTime
        if (accumulatorRef.current < rafIntervalRef.current) {
          animationFrameId.current = requestAnimationFrame(loop)
          return
        }
        accumulatorRef.current = 0
      }

      const rect = canvas.getBoundingClientRect()
      animate(ctx, rect.width, rect.height, deltaTime)

      animationFrameId.current = requestAnimationFrame(loop)
    }

    animationFrameId.current = requestAnimationFrame(loop)

    return (): void => {
      running = false
      window.removeEventListener("resize", handleResize)
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current)
      }
      if (observer !== undefined) {
        observer.disconnect()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}

/**
 * Хук для анимации с фиксированным шагом времени (fixed timestep)
 */
export function useFixedTimestepCanvasAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  update: (ctx: CanvasRenderingContext2D, width: number, height: number, dt: number) => void,
  timestep: number = 1 / 60,
  deps: React.DependencyList = []
): void {
  const animationFrameId = useRef<number | undefined>(undefined)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const lastTimeRef = useRef<number>(0)
  const accumulatorRef = useRef<number>(0)

  const setupCanvasCallback = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx
  }, [canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx

    const handleResize = () => {
      setupCanvasCallback()
    }

    window.addEventListener("resize", handleResize)

    let running = true

    const loop = (timestamp: number) => {
      if (!running) return

      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = (timestamp - lastTimeRef.current) / 1000
      lastTimeRef.current = timestamp

      accumulatorRef.current += deltaTime

      // Fixed timestep update
      while (accumulatorRef.current >= timestep) {
        const rect = canvas.getBoundingClientRect()
        update(ctx, rect.width, rect.height, timestep)
        accumulatorRef.current -= timestep
      }

      animationFrameId.current = requestAnimationFrame(loop)
    }

    animationFrameId.current = requestAnimationFrame(loop)

    return (): void => {
      running = false
      window.removeEventListener("resize", handleResize)
      if (animationFrameId.current !== undefined) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
