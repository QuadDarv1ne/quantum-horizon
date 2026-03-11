"use client"

import { useState } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { useVisualizationStore } from "@/stores/visualization-store"

const c = 299792458 // Speed of light

interface LengthContractionVisualizationProps {
  isDark: boolean
}

export function LengthContractionVisualization({ isDark }: LengthContractionVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore()
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [velocity, setVelocity] = useState(0.5)

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2

    // Clear canvas
    ctx.fillStyle = isDark ? "#0f172a" : "#f8fafc"
    ctx.fillRect(0, 0, width, height)

    // Lorentz factor
    const gamma = 1 / Math.sqrt(1 - velocity * velocity)
    const properLength = 200
    const contractedLength = properLength / gamma

    // Draw stationary ruler (observer frame)
    ctx.save()
    ctx.translate(centerX - 150, centerY - 80)

    ctx.fillStyle = isDark ? "#64748b" : "#475569"
    ctx.fillRect(0, 0, properLength, 20)

    // Ruler marks
    ctx.strokeStyle = isDark ? "#e2e8f0" : "#1e293b"
    ctx.lineWidth = 1
    for (let i = 0; i <= properLength; i += 20) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 20)
      ctx.stroke()
    }

    ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Observer (rest)", properLength / 2, 40)

    ctx.restore()

    // Draw moving ruler (moving frame)
    ctx.save()
    ctx.translate(centerX - 150, centerY + 50)

    // Moving ruler with contraction
    const xPos = (properLength - contractedLength) / 2
    ctx.fillStyle = isDark ? "#3b82f6" : "#2563eb"
    ctx.fillRect(xPos, 0, contractedLength, 20)

    // Ruler marks (contracted)
    ctx.strokeStyle = isDark ? "#bfdbfe" : "#1e40af"
    ctx.lineWidth = 1
    const contractedStep = 20 / gamma
    for (let i = 0; i <= gamma; i++) {
      const x = xPos + i * contractedStep
      if (x <= xPos + contractedLength) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, 20)
        ctx.stroke()
      }
    }

    ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`Moving (v = ${(velocity * 100).toFixed(0)}% c)`, properLength / 2, 40)

    ctx.restore()

    // Draw velocity indicator
    ctx.strokeStyle = isDark ? "#64748b" : "#94a3b8"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(centerX - 100, centerY + 120)
    ctx.lineTo(centerX + 100, centerY + 120)
    ctx.stroke()

    // Arrow
    ctx.beginPath()
    ctx.moveTo(centerX + 90, centerY + 115)
    ctx.lineTo(centerX + 100, centerY + 120)
    ctx.lineTo(centerX + 90, centerY + 125)
    ctx.fillStyle = isDark ? "#64748b" : "#94a3b8"
    ctx.fill()

    ctx.fillStyle = isDark ? "#94a3b8" : "#64748b"
    ctx.font = "12px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText(`v = ${(velocity * 100).toFixed(0)}% c`, centerX, centerY + 145)

    // Formula
    ctx.fillStyle = isDark ? "#e2e8f0" : "#1e293b"
    ctx.font = "14px monospace"
    ctx.textAlign = "center"
    ctx.fillText(
      `L = L₀ / γ = ${properLength} / ${gamma.toFixed(2)} = ${contractedLength.toFixed(1)}`,
      centerX,
      30
    )
    ctx.fillText(`γ = 1/√(1 - v²/c²) = ${gamma.toFixed(4)}`, centerX, 50)
  }

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[400px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={() => {
          togglePlaying()
        }}
        onSpeedChange={(speed) => {
          setAnimationSpeed(speed)
        }}
        isDark={isDark}
      />
      <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-100/50"}`}>
        <label className="block text-sm font-medium mb-2">
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
        <div className="flex justify-between text-xs mt-1 text-gray-500">
          <span>0%</span>
          <span>99%</span>
        </div>
      </div>
    </div>
  )
}
