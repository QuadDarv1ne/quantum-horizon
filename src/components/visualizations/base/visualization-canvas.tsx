"use client"

import { useRef, useCallback } from "react"
import { setupCanvas, useCanvasAnimation } from "@/hooks/use-canvas-animation"

interface VisualizationCanvasProps {
  draw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    isDark: boolean,
    delta: number
  ) => void
  isDark: boolean
  className?: string
  fpsLimit?: number
  pauseWhenHidden?: boolean
  respectReducedMotion?: boolean
  onClick?: (e: React.MouseEvent<HTMLCanvasElement>) => void
  style?: React.CSSProperties
}

export function VisualizationCanvas({
  draw: drawFn,
  isDark,
  className,
  fpsLimit = 60,
  pauseWhenHidden = true,
  respectReducedMotion = true,
  onClick,
  style,
}: VisualizationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sizeRef = useRef({ width: 0, height: 0 })

  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
      const canvas = canvasRef.current
      const container = containerRef.current
      if (!canvas || !container) return

      const rect = container.getBoundingClientRect()

      // Проверка изменения размера
      if (sizeRef.current.width !== rect.width || sizeRef.current.height !== rect.height) {
        sizeRef.current = { width: rect.width, height: rect.height }
        setupCanvas(canvas, ctx)
      }

      drawFn(ctx, rect.width, rect.height, isDark, delta)
    },
    [drawFn, isDark]
  )

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
        style={{ display: "block", ...style }}
        data-testid="visualization-canvas"
        aria-label="Interactive physics visualization"
        role="img"
        onClick={onClick}
      />
    </div>
  )
}
