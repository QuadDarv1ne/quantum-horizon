"use client"

import { useRef, useState, useCallback } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface SchrodingersCatVisualizationProps {
  isDark: boolean
}

type CatState = "alive" | "dead" | "superposition"

export function SchrodingersCatVisualization({ isDark }: SchrodingersCatVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [observationCount, setObservationCount] = useState(0)
  const [catState, setCatState] = useState<CatState>("superposition")
  const [isObserving, setIsObserving] = useState(false)

  const timeRef = useRef(0)
  const superpositionPhaseRef = useRef(0)

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const isDarkMode = _isDark
      const centerX = width / 2
      const centerY = height / 2

      // Update time
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed
        superpositionPhaseRef.current += (delta / 1000) * animationSpeed * 3
      }
      const time = timeRef.current
      const superpositionPhase = superpositionPhaseRef.current

      ctx.fillStyle = isDarkMode ? "#0a0a15" : "#1a1a2e"
      ctx.fillRect(0, 0, width, height)

      // Box
      const boxWidth = 120
      const boxHeight = 100
      const boxX = centerX - boxWidth / 2
      const boxY = centerY - boxHeight / 2 - 20

      ctx.strokeStyle = isDarkMode ? "rgba(100, 100, 150, 0.8)" : "rgba(150, 150, 200, 0.8)"
      ctx.lineWidth = 3
      ctx.strokeRect(boxX, boxY, boxWidth, boxHeight)

      // Question marks when in superposition
      if (catState === "superposition" && !isObserving) {
        ctx.fillStyle = `rgba(255, 200, 100, ${String(0.5 + Math.sin(superpositionPhase) * 0.3)})`
        ctx.font = "bold 48px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("?", centerX, centerY)

        ctx.strokeStyle = `rgba(150, 100, 255, ${String(0.3 + Math.sin(superpositionPhase) * 0.2)})`
        ctx.lineWidth = 1
        for (let i = 0; i < 5; i++) {
          ctx.beginPath()
          ctx.arc(
            centerX,
            centerY - 20,
            30 + i * 15 + Math.sin(superpositionPhase + i) * 5,
            0,
            Math.PI * 2
          )
          ctx.stroke()
        }

        ctx.globalAlpha = 0.3 + Math.sin(superpositionPhase) * 0.2
        ctx.fillStyle = "rgba(100, 255, 100, 0.3)"
        ctx.beginPath()
        ctx.ellipse(centerX - 20, centerY - 10, 15, 20, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "rgba(255, 100, 100, 0.3)"
        ctx.beginPath()
        ctx.ellipse(centerX + 20, centerY - 10, 15, 20, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1

        ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"
        ctx.font = "12px sans-serif"
        ctx.fillText("50% 🐱  50% 💀", centerX, centerY + 50)
      } else if (catState === "alive") {
        ctx.fillStyle = "#90EE90"
        ctx.beginPath()
        ctx.ellipse(centerX, centerY - 10, 25, 30, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(centerX - 20, centerY - 35)
        ctx.lineTo(centerX - 15, centerY - 50)
        ctx.lineTo(centerX - 5, centerY - 35)
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(centerX + 20, centerY - 35)
        ctx.lineTo(centerX + 15, centerY - 50)
        ctx.lineTo(centerX + 5, centerY - 35)
        ctx.fill()

        ctx.fillStyle = "#000"
        ctx.beginPath()
        ctx.arc(centerX - 8, centerY - 15, 3, 0, Math.PI * 2)
        ctx.arc(centerX + 8, centerY - 15, 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY - 5, 8, 0.2, Math.PI - 0.2)
        ctx.stroke()

        ctx.fillStyle = "#90EE90"
        ctx.font = "bold 14px sans-serif"
        ctx.fillText("😺 ALIVE!", centerX, centerY + 55)
      } else if (catState === "dead") {
        ctx.fillStyle = "#FFB6C1"
        ctx.beginPath()
        ctx.ellipse(centerX, centerY - 5, 30, 15, 0, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = "#000"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX - 12, centerY - 12)
        ctx.lineTo(centerX - 6, centerY - 6)
        ctx.moveTo(centerX - 12, centerY - 6)
        ctx.lineTo(centerX - 6, centerY - 12)
        ctx.moveTo(centerX + 6, centerY - 12)
        ctx.lineTo(centerX + 12, centerY - 6)
        ctx.moveTo(centerX + 6, centerY - 6)
        ctx.lineTo(centerX + 12, centerY - 12)
        ctx.stroke()

        ctx.fillStyle = "#FF6B6B"
        ctx.beginPath()
        ctx.ellipse(centerX + 5, centerY + 5, 5, 8, 0.2, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = "#FF6B6B"
        ctx.font = "bold 14px sans-serif"
        ctx.fillText("💀 DEAD", centerX, centerY + 55)
      }

      // Radioactive atom
      ctx.fillStyle = "rgba(0, 255, 150, 0.8)"
      ctx.beginPath()
      ctx.arc(boxX + 15, boxY + 25, 8 + Math.sin(time * 3) * 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = "rgba(0, 255, 150, 0.5)"
      ctx.lineWidth = 1
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.arc(boxX + 15, boxY + 25, 12 + i * 4, -0.5 + i * 2.1, 0.5 + i * 2.1)
        ctx.stroke()
      }

      ctx.fillStyle = "rgba(150, 0, 255, 0.6)"
      ctx.fillRect(boxX + boxWidth - 20, boxY + 15, 10, 25)
      ctx.fillStyle = "rgba(150, 0, 255, 0.8)"
      ctx.font = "8px sans-serif"
      ctx.fillText("☠️", boxX + boxWidth - 18, boxY + 32)

      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(255, 255, 255, 0.8)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Schrödinger's Box", centerX, boxY - 10)

      // Wave function representation
      ctx.strokeStyle = isDarkMode ? "rgba(100, 150, 255, 0.4)" : "rgba(80, 130, 235, 0.5)"
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let x = 0; x < width; x += 2) {
        const y =
          height - 30 + Math.sin(x * 0.05 + time * 2) * 10 * (catState === "superposition" ? 1 : 0)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    },
    [isPlaying, animationSpeed, catState, isObserving]
  )

  const observe = () => {
    setIsObserving(true)
    setTimeout(() => {
      const result = Math.random() < 0.5 ? "alive" : "dead"
      setCatState(result)
      setIsObserving(false)
      setObservationCount((c) => c + 1)
    }, 1000)
  }

  const reset = () => {
    setCatState("superposition")
  }

  return (
    <div className="space-y-4" role="region" aria-label="Schrödinger's cat visualization">
      <VisualizationCanvas
        draw={draw}
        isDark={isDark}
        className="h-[350px]"
        ariaLabel="Schrödinger's cat quantum superposition visualization"
      />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={setAnimationSpeed}
        isDark={isDark}
      />

      <div className="flex gap-2">
        <Button
          onClick={observe}
          disabled={isObserving || catState !== "superposition"}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          size="sm"
        >
          {isObserving ? "⏳ Observing..." : "👁️ Open Box"}
        </Button>
        <Button onClick={reset} variant="outline" size="sm" disabled={catState === "superposition"}>
          🔄 Reset
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`rounded border p-2 ${
            isDark ? "border-green-500/20 bg-green-950/30" : "border-green-200 bg-green-50"
          }`}
        >
          <div className={isDark ? "font-semibold text-green-400" : "font-semibold text-green-700"}>
            🐱 Alive
          </div>
          <div className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
            {observationCount > 0 ? Math.round(observationCount * 0.5) : "?"} times
          </div>
        </div>
        <div
          className={`rounded border p-2 ${
            isDark ? "border-red-500/20 bg-red-950/30" : "border-red-200 bg-red-50"
          }`}
        >
          <div className={isDark ? "font-semibold text-red-400" : "font-semibold text-red-700"}>
            💀 Dead
          </div>
          <div className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
            {observationCount > 0 ? observationCount - Math.round(observationCount * 0.5) : "?"}{" "}
            times
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-purple-500/20 bg-purple-900/20" : "border-purple-200 bg-purple-50"
        }`}
      >
        <div className={isDark ? "font-semibold text-purple-300" : "font-semibold text-purple-700"}>
          🐱 Schrödinger's Paradox (1935)
        </div>
        <p className={isDark ? "mt-1 text-gray-400" : "mt-1 text-gray-600"}>
          Until observed, the cat is in a superposition of alive and dead states. The act of
          measurement "collapses" the wave function into one definite state.
        </p>
      </div>
    </div>
  )
}
