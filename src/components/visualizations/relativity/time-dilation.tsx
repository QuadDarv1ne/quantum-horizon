"use client"

import { useRef, useEffect, useCallback } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { useVisualizationStore } from "@/stores/visualization-store"
import { QueryParam } from "@/hooks/use-url-sync"
import { c } from "@/lib/constants"

interface TimeDilationVisualizationProps {
  isDark: boolean
}

export function TimeDilationVisualization({ isDark }: TimeDilationVisualizationProps) {
  const velocity = useVisualizationStore((state) => state.timeDilation.velocity)
  const showClock = useVisualizationStore((state) => state.timeDilation.showClock)
  const isPlaying = useVisualizationStore((state) => state.isPlaying)
  const animationSpeed = useVisualizationStore((state) => state.animationSpeed)
  const { setVelocity, togglePlaying } = useVisualizationStore()

  const timeOffset = useRef(0)

  useEffect(() => {
    const v = QueryParam.getNumber("td.velocity", velocity)
    if (v !== velocity) setVelocity(Math.min(Math.max(v, 0.1), 0.99))
    QueryParam.setNumber("td.velocity", velocity)
    QueryParam.setBoolean("td.clock", showClock)
  }, [velocity, showClock, setVelocity])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const centerX = width / 2
      const centerY = height / 2
      const isDark = _isDark

      // Clear canvas
      ctx.fillStyle = isDark ? "#0f172a" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      // Calculate time dilation factor (Lorentz factor)
      const _v = velocity * c
      const gamma = 1 / Math.sqrt(1 - velocity * velocity)

      // Update animation
      if (isPlaying) {
        timeOffset.current += (delta / 1000) * animationSpeed
      }

      // Draw stationary frame (observer)
      ctx.save()
      ctx.translate(centerX - 150, centerY)

      // Stationary clock
      if (showClock) {
        drawClock(ctx, 0, 0, 80, timeOffset.current, isDark)
        ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b"
        ctx.font = "14px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Observer", 0, 110)
        ctx.fillText("t", 0, -110)
      }

      ctx.restore()

      // Draw moving frame (spaceship)
      ctx.save()
      ctx.translate(centerX + 150, centerY)

      // Length contraction visualization
      const contractedLength = 100 / gamma
      const xPos = Math.sin(timeOffset.current * 0.5) * 50

      // Spaceship body
      ctx.fillStyle = isDark ? "#3b82f6" : "#2563eb"
      ctx.beginPath()
      ctx.ellipse(xPos, 0, contractedLength, 30, 0, 0, Math.PI * 2)
      ctx.fill()

      // Moving clock
      if (showClock) {
        const dilatedTime = timeOffset.current / gamma
        drawClock(ctx, xPos, -60, 50, dilatedTime, isDark)
      }

      // Velocity indicator
      ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`v = ${(velocity * 100).toFixed(0)}% c`, xPos, 110)
      ctx.fillText(`gamma = ${gamma.toFixed(2)}`, xPos, -110)

      ctx.restore()

      // Draw formula
      ctx.fillStyle = isDark ? "#94a3b8" : "#64748b"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Delta t' = Delta t / gamma", centerX, 30)
      ctx.fillText(`gamma = 1/sqrt(1 - v²/c²) = ${gamma.toFixed(4)}`, centerX, 55)
    },
    [isPlaying, animationSpeed, velocity, showClock]
  )

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[400px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={(speed) => {
          useVisualizationStore.getState().setAnimationSpeed(speed)
        }}
        onReset={() => {
          useVisualizationStore.getState().resetSettings()
        }}
        isDark={isDark}
      />
      <div className={`rounded-lg p-4 ${isDark ? "bg-gray-800/50" : "bg-gray-100/50"}`}>
        <label className="mb-2 block text-sm font-medium">
          Velocity: {(velocity * 100).toFixed(0)}% c
        </label>
        <input
          type="range"
          min="0"
          max="0.99"
          step="0.01"
          value={velocity}
          onChange={(e) => {
            setVelocity(parseFloat(e.target.value))
          }}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>0%</span>
          <span>99%</span>
        </div>
        <Button
          onClick={() => {
            const url = window.location.href
            void navigator.clipboard.writeText(url)
          }}
          variant="outline"
          size="sm"
          className="mt-2 w-full"
        >
          🔗 Copy URL
        </Button>
      </div>
    </div>
  )
}

function drawClock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  time: number,
  isDark: boolean
) {
  ctx.save()
  ctx.translate(x, y)

  // Clock face
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.fillStyle = isDark ? "#1e293b" : "#ffffff"
  ctx.fill()
  ctx.strokeStyle = isDark ? "#475569" : "#cbd5e1"
  ctx.lineWidth = 2
  ctx.stroke()

  // Hour marks
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6 - Math.PI / 2
    const inner = radius * 0.85
    const outer = radius * 0.95
    ctx.beginPath()
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner)
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer)
    ctx.stroke()
  }

  // Hour hand
  const hourAngle = ((time % 12) * Math.PI) / 6 - Math.PI / 2
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(Math.cos(hourAngle) * radius * 0.5, Math.sin(hourAngle) * radius * 0.5)
  ctx.strokeStyle = isDark ? "#e2e8f0" : "#1e293b"
  ctx.lineWidth = 3
  ctx.stroke()

  // Minute hand
  const minuteAngle = ((time % 1) * 12 * Math.PI) / 6 - Math.PI / 2
  ctx.beginPath()
  ctx.moveTo(0, 0)
  ctx.lineTo(Math.cos(minuteAngle) * radius * 0.7, Math.sin(minuteAngle) * radius * 0.7)
  ctx.strokeStyle = isDark ? "#94a3b8" : "#64748b"
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.restore()
}
