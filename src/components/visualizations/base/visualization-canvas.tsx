"use client"

import { useRef, useCallback } from "react"
import { useCanvasAnimation } from "@/hooks/use-canvas-animation"

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

  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
      const container = containerRef.current
      if (!container) return

      drawFn(ctx, width, height, isDark, delta)
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
        className="h-full w-full"
        style={{ display: "block", ...style }}
        data-testid="visualization-canvas"
        aria-label="Interactive physics visualization"
        role="img"
        onClick={onClick}
      />
    </div>
  )
}
