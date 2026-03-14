"use client"

import { useState, useCallback, useRef } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"
import { h_bar } from "@/lib/constants"

interface UncertaintyVisualizationProps {
  isDark: boolean
}

export function UncertaintyVisualization({ isDark }: UncertaintyVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [deltaX, setDeltaX] = useState(50)
  const timeRef = useRef(0)
  const particleCache = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

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
      const isDarkMode = _isDark

      // Update time for animation
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed
      }

      // Clear canvas
      ctx.fillStyle = isDarkMode ? "#0f172a" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      // Heisenberg uncertainty: Δx · Δp ≥ ℏ/2
      const minDeltaP = h_bar / (2 * deltaX * 1e-10) // Convert to SI units for display

      // Draw position uncertainty region
      ctx.fillStyle = isDarkMode ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"
      ctx.fillRect(centerX - deltaX / 2, centerY - 100, deltaX, 200)

      // Position uncertainty boundaries
      ctx.strokeStyle = isDarkMode ? "#3b82f6" : "#2563eb"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX - deltaX / 2, centerY - 100)
      ctx.lineTo(centerX - deltaX / 2, centerY + 100)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(centerX + deltaX / 2, centerY - 100)
      ctx.lineTo(centerX + deltaX / 2, centerY + 100)
      ctx.stroke()
      ctx.setLineDash([])

      // Position label
      ctx.fillStyle = isDarkMode ? "#60a5fa" : "#2563eb"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Δx (position uncertainty)", centerX, centerY + 130)
      ctx.fillText(`Δx = ${(deltaX * 1e-10).toExponential(2)} m`, centerX, centerY + 150)

      // Draw momentum uncertainty as horizontal band
      const deltaPHeight = 80 / (deltaX / 50) // Inverse relationship
      ctx.fillStyle = isDarkMode ? "rgba(251, 191, 36, 0.3)" : "rgba(251, 191, 36, 0.2)"
      ctx.fillRect(centerX - 150, centerY - deltaPHeight / 2, 300, deltaPHeight)

      // Momentum uncertainty boundaries
      ctx.strokeStyle = isDarkMode ? "#fbbf24" : "#d97706"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX - 150, centerY - deltaPHeight / 2)
      ctx.lineTo(centerX + 150, centerY - deltaPHeight / 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(centerX - 150, centerY + deltaPHeight / 2)
      ctx.lineTo(centerX + 150, centerY + deltaPHeight / 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Momentum label
      ctx.fillStyle = isDarkMode ? "#fcd34d" : "#d97706"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Δp (momentum uncertainty)", centerX, centerY - 130)
      ctx.fillText(`Δp ≥ ${minDeltaP.toExponential(2)} kg·m/s`, centerX, centerY - 155)

      // Draw particle as fuzzy circle with smooth jitter
      const jitterX = Math.sin(timeRef.current * 3) * 0.5 + Math.cos(timeRef.current * 7) * 0.3
      const jitterY = Math.cos(timeRef.current * 5) * 0.5 + Math.sin(timeRef.current * 11) * 0.3

      particleCache.current = {
        x: centerX + jitterX * deltaX * 0.5,
        y: centerY + jitterY * deltaPHeight * 0.3,
      }

      const gradient = ctx.createRadialGradient(
        particleCache.current.x,
        particleCache.current.y,
        0,
        particleCache.current.x,
        particleCache.current.y,
        30
      )
      gradient.addColorStop(0, isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)")
      gradient.addColorStop(0.5, isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)")
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(particleCache.current.x, particleCache.current.y, 30, 0, Math.PI * 2)
      ctx.fill()

      // Formula
      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1e293b"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Δx · Δp ≥ ℏ/2", centerX, 30)
      ctx.fillText(
        `Product: ${(deltaX * 1e-10 * minDeltaP).toExponential(2)} ≥ ${(h_bar / 2).toExponential(2)}`,
        centerX,
        55
      )
    },
    [isPlaying, animationSpeed, deltaX]
  )

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
      <div className={`rounded-lg p-4 ${isDark ? "bg-gray-800/50" : "bg-gray-100/50"}`}>
        <label className="mb-2 block text-sm font-medium">
          Position Uncertainty (Δx): {(deltaX * 1e-10).toExponential(2)} m
        </label>
        <input
          type="range"
          min="20"
          max="150"
          step="1"
          value={deltaX}
          onChange={(e) => {
            setDeltaX(parseFloat(e.target.value))
          }}
          className="w-full"
        />
        <div className="mt-1 flex justify-between text-xs text-gray-500">
          <span>Small Δx</span>
          <span>Large Δx</span>
        </div>
        <p className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          As Δx increases, Δp decreases (and vice versa)
        </p>
      </div>
    </div>
  )
}
