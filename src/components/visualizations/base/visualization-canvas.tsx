"use client"

import { useRef, useEffect, useCallback } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"

interface VisualizationCanvasProps {
  draw: (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    isDark: boolean,
  ) => void
  isDark: boolean
  className?: string
}

export function VisualizationCanvas({
  draw: drawFn,
  isDark,
  className,
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
    if (
      sizeRef.current.width !== rect.width ||
      sizeRef.current.height !== rect.height
    ) {
      sizeRef.current = { width: rect.width, height: rect.height }
      setupCanvas(canvas, rect.width, rect.height)
    }

    drawFn(ctx, rect.width, rect.height, isDark)
  }, [drawFn, isDark])

  useEffect(() => {
    let animationId: number

    const loop = () => {
      animate()
      animationId = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [animate])

  return (
    <div ref={containerRef} className={`relative ${className ?? ""}`} role="img" aria-live="polite" aria-atomic="true">
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
