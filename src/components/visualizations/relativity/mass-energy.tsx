"use client"

import { useEffect, useCallback, useRef } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import {
  useVisualizationStore,
  selectIsPlaying,
  selectAnimationSpeed,
} from "@/stores/visualization-store"
import { QueryParam } from "@/hooks/use-url-sync"

const _c = 299792458 // Speed of light

interface MassEnergyVisualizationProps {
  isDark: boolean
}

interface GradientCache {
  massGradient: CanvasGradient
  energyGradient: CanvasGradient
}

export function MassEnergyVisualization({ isDark }: MassEnergyVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const timeRef = useRef(0)
  const gradientCache = useRef<GradientCache | null>(null)

  useEffect(() => {
    QueryParam.setBoolean("me.playing", isPlaying)
  }, [isPlaying])

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
      const time = timeRef.current

      // Clear canvas
      ctx.fillStyle = isDarkMode ? "#0f172a" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      // Draw mass-energy equivalence visualization
      const _mass = 1 // 1 kg for demonstration

      // Cache gradients (optimization)
      if (!gradientCache.current) {
        const massGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 80)
        massGradient.addColorStop(0, isDarkMode ? "#60a5fa" : "#3b82f6")
        massGradient.addColorStop(0.5, isDarkMode ? "#3b82f6" : "#2563eb")
        massGradient.addColorStop(1, isDarkMode ? "#1e40af" : "#1d4ed8")

        const energyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 80)
        energyGradient.addColorStop(0, "#fef3c7")
        energyGradient.addColorStop(0.5, "#fbbf24")
        energyGradient.addColorStop(1, "#d97706")

        gradientCache.current = { massGradient, energyGradient }
      }

      // Draw mass sphere
      ctx.save()
      ctx.translate(centerX - 150, centerY)

      ctx.beginPath()
      ctx.arc(0, 0, 80, 0, Math.PI * 2)
      ctx.fillStyle = gradientCache.current.massGradient
      ctx.fill()

      // Mass label
      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1e293b"
      ctx.font = "bold 18px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("m = 1 kg", 0, 0)
      ctx.font = "14px sans-serif"
      ctx.fillText("Mass", 0, 110)

      ctx.restore()

      // Draw energy waves
      ctx.save()
      ctx.translate(centerX + 150, centerY)

      // Energy representation (waves/particles)
      for (let i = 0; i < 5; i++) {
        const phase = time + (i * Math.PI * 2) / 5
        const radius = 60 + Math.sin(phase * 2) * 20
        const alpha = 0.3 + Math.sin(phase) * 0.2

        ctx.beginPath()
        ctx.arc(0, 0, radius, phase, phase + Math.PI)
        ctx.strokeStyle = `rgba(251, 191, 36, ${String(alpha)})`
        ctx.lineWidth = 3
        ctx.stroke()
      }

      // Energy core
      ctx.beginPath()
      ctx.arc(0, 0, 80, 0, Math.PI * 2)
      ctx.fillStyle = gradientCache.current.energyGradient
      ctx.fill()

      // Energy label
      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1e293b"
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("E =", 0, -10)
      ctx.font = "bold 14px monospace"
      ctx.fillText("9×10¹⁶ J", 0, 15)
      ctx.font = "14px sans-serif"
      ctx.fillText("Energy", 0, 110)

      ctx.restore()

      // Draw equation in center
      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1e293b"
      ctx.font = "bold 28px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("E = mc²", centerX, centerY - 120)

      // Draw conversion arrow
      ctx.strokeStyle = isDarkMode ? "#64748b" : "#94a3b8"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(centerX - 70, centerY)
      ctx.lineTo(centerX + 70, centerY)
      ctx.stroke()
      ctx.setLineDash([])

      // Arrow head
      ctx.beginPath()
      ctx.moveTo(centerX + 60, centerY - 10)
      ctx.lineTo(centerX + 70, centerY)
      ctx.lineTo(centerX + 60, centerY + 10)
      ctx.strokeStyle = isDarkMode ? "#64748b" : "#94a3b8"
      ctx.stroke()

      // Explanation
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.font = "14px sans-serif"
      ctx.fillText("1 kg of mass = 90 quadrillion joules of energy", centerX, centerY + 150)
    },
    [isPlaying, animationSpeed]
  )

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[400px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={setAnimationSpeed}
        isDark={isDark}
      />
      <div className={`rounded-lg p-4 ${isDark ? "bg-gray-800/50" : "bg-gray-100/50"}`}>
        <p className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>
          <strong>E = mc²</strong> — Energy and mass are interchangeable. The speed of light squared
          (c²) is the conversion factor.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>Speed of light (c):</span>
            <span className={`ml-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              299,792,458 m/s
            </span>
          </div>
          <div>
            <span className={isDark ? "text-gray-400" : "text-gray-600"}>c²:</span>
            <span className={`ml-2 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
              8.99×10¹⁶ m²/s²
            </span>
          </div>
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
