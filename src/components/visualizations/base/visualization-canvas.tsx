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
  onKeyDown?: (e: React.KeyboardEvent<HTMLCanvasElement>) => void
  style?: React.CSSProperties
  ariaLabel?: string
  ariaDescription?: string
  tabIndex?: number
}

export function VisualizationCanvas({
  draw: drawFn,
  isDark,
  className,
  fpsLimit = 60,
  pauseWhenHidden = true,
  respectReducedMotion = true,
  onClick,
  onKeyDown,
  style,
  ariaLabel = "Interactive physics visualization",
  ariaDescription,
  tabIndex = 0,
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
      aria-live="polite"
      aria-atomic="true"
      aria-label={ariaLabel}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full"
        style={{ display: "block", outline: "none", ...style }}
        data-testid="visualization-canvas"
        aria-label={ariaLabel}
        aria-description={ariaDescription}
        role="img"
        tabIndex={tabIndex}
        onClick={onClick}
        onKeyDown={onKeyDown}
        aria-keyshortcuts="Space Enter ArrowUp ArrowDown ArrowLeft ArrowRight"
      />
    </div>
  )
}
