"use client"

import { useRef, useCallback } from "react"
import { setupCanvas, useCanvasAnimation } from "@/hooks/use-canvas-animation"

interface VisualizationCanvasProps {
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number, isDark: boolean) => void
  isDark: boolean
  className?: string
  fpsLimit?: number
  pauseWhenHidden?: boolean
  respectReducedMotion?: boolean
}

export function VisualizationCanvas({
  draw: drawFn,
  isDark,
  className,
  fpsLimit = 60,
  pauseWhenHidden = true,
  respectReducedMotion = true,
}: VisualizationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef({ width: 0, height: 0 })

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = container.getBoundingClientRect()

    // Проверка изменения размера
    if (sizeRef.current.width !== rect.width || sizeRef.current.height !== rect.height) {
      sizeRef.current = { width: rect.width, height: rect.height }
      setupCanvas(canvas, ctx)
    }

    drawFn(ctx, rect.width, rect.height, isDark)
  }, [drawFn, isDark])

  useCanvasAnimation(canvasRef, animate, {
    deps: [animate],
    fpsLimit,
    pauseWhenHidden,
    respectReducedMotion,
  })

  return (
    <div
      ref={containerRef}
      className={`relative ${className ?? ""}`}
      role="img"
      aria-live="polite"
      aria-atomic="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
        data-testid="visualization-canvas"
        aria-label="Interactive physics visualization"
        role="img"
      />
    </div>
  )
}
