"use client"

import { useRef, useState, useCallback } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  useVisualizationStore,
  selectIsPlaying,
  selectAnimationSpeed,
} from "@/stores/visualization-store"

interface QuantumEntanglementVisualizationProps {
  isDark: boolean
}

export function QuantumEntanglementVisualization({
  isDark,
}: QuantumEntanglementVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [entanglementStrength, setEntanglementStrength] = useState(80)
  const [measuredParticle, setMeasuredParticle] = useState<"left" | "right" | null>(null)
  const [leftState, setLeftState] = useState<"superposition" | "up" | "down">("superposition")
  const [rightState, setRightState] = useState<"superposition" | "up" | "down">("superposition")

  const timeRef = useRef(0)

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const isDarkMode = _isDark
      const leftX = width * 0.25
      const rightX = width * 0.75
      const centerY = height / 2

      // Update time
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed
      }
      const time = timeRef.current

      ctx.fillStyle = isDarkMode ? "#0a0a15" : "#f5f3ff"
      ctx.fillRect(0, 0, width, height)

      // Entanglement wave
      if (leftState === "superposition" && rightState === "superposition") {
        ctx.strokeStyle = `rgba(150, 100, 255, ${String((entanglementStrength / 100) * 0.5)})`
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let x = leftX + 40; x < rightX - 40; x += 2) {
          const progress = (x - leftX) / (rightX - leftX)
          const waveY =
            Math.sin(progress * Math.PI * 4 + time * 3) * 20 * (entanglementStrength / 100)
          const y = centerY + waveY
          if (x === leftX + 40) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        for (let i = 0; i < 10; i++) {
          const progress = (time * 0.5 + i * 0.1) % 1
          const x = leftX + 40 + progress * (rightX - leftX - 80)
          const y =
            centerY +
            Math.sin(progress * Math.PI * 4 + time * 3) * 20 * (entanglementStrength / 100)

          ctx.fillStyle = `rgba(150, 100, 255, ${String(0.5 + Math.sin(time * 5 + i) * 0.3)})`
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      const drawParticle = (x: number, state: "superposition" | "up" | "down", label: string) => {
        const radius = 30

        const gradient = ctx.createRadialGradient(x, centerY, 0, x, centerY, radius + 20)
        if (state === "superposition") {
          gradient.addColorStop(0, "rgba(150, 100, 255, 0.3)")
          gradient.addColorStop(1, "rgba(150, 100, 255, 0)")
        } else if (state === "up") {
          gradient.addColorStop(0, "rgba(100, 255, 150, 0.3)")
          gradient.addColorStop(1, "rgba(100, 255, 150, 0)")
        } else {
          gradient.addColorStop(0, "rgba(255, 100, 150, 0.3)")
          gradient.addColorStop(1, "rgba(255, 100, 150, 0)")
        }
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, centerY, radius + 20, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(x, centerY, radius, 0, Math.PI * 2)

        if (state === "superposition") {
          ctx.fillStyle = `rgba(100, 80, 200, ${String(0.7 + Math.sin(time * 3) * 0.2)})`
          ctx.fill()

          ctx.strokeStyle = "rgba(100, 255, 150, 0.6)"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, centerY - 8, 10, 0, Math.PI * 2)
          ctx.stroke()
          ctx.strokeStyle = "rgba(255, 100, 150, 0.6)"
          ctx.beginPath()
          ctx.arc(x, centerY + 8, 10, 0, Math.PI * 2)
          ctx.stroke()

          ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
          ctx.font = "bold 20px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText("?", x, centerY + 7)
        } else if (state === "up") {
          ctx.fillStyle = "rgba(100, 200, 150, 0.8)"
          ctx.fill()

          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x, centerY + 10)
          ctx.lineTo(x, centerY - 10)
          ctx.moveTo(x - 8, centerY - 2)
          ctx.lineTo(x, centerY - 10)
          ctx.lineTo(x + 8, centerY - 2)
          ctx.stroke()

          ctx.fillStyle = "#90EE90"
          ctx.font = "bold 12px sans-serif"
          ctx.fillText("↑", x, centerY + 25)
        } else {
          ctx.fillStyle = "rgba(200, 100, 150, 0.8)"
          ctx.fill()

          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.moveTo(x, centerY - 10)
          ctx.lineTo(x, centerY + 10)
          ctx.moveTo(x - 8, centerY + 2)
          ctx.lineTo(x, centerY + 10)
          ctx.lineTo(x + 8, centerY + 2)
          ctx.stroke()

          ctx.fillStyle = "#FF9999"
          ctx.font = "bold 12px sans-serif"
          ctx.fillText("↓", x, centerY + 25)
        }

        ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(label, x, centerY + 50)
      }

      drawParticle(leftX, leftState, "Частица A")
      drawParticle(rightX, rightState, "Частица B")

      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Запутанность: ${String(entanglementStrength)}%`, width / 2, 20)

      if (measuredParticle) {
        ctx.fillStyle = isDarkMode ? "rgba(255, 200, 100, 0.8)" : "rgba(200, 150, 0, 0.8)"
        ctx.fillText(`Измерена частица: ${measuredParticle === "left" ? "A" : "B"}`, width / 2, 35)
      }

      ctx.fillStyle = isDarkMode ? "rgba(100, 200, 255, 0.7)" : "rgba(0, 100, 150, 0.7)"
      ctx.font = "11px monospace"
      ctx.fillText("|Ψ⟩ = (|↑↑⟩ + |↓↓⟩) / √2", width / 2, height - 15)
    },
    [isPlaying, animationSpeed, entanglementStrength, leftState, rightState, measuredParticle]
  )

  const measureLeft = () => {
    const result = Math.random() < 0.5 ? "up" : "down"
    setLeftState(result)
    setRightState(result === "up" ? "up" : "down")
    setMeasuredParticle("left")
  }

  const measureRight = () => {
    const result = Math.random() < 0.5 ? "up" : "down"
    setRightState(result)
    setLeftState(result === "up" ? "up" : "down")
    setMeasuredParticle("right")
  }

  const reset = () => {
    setLeftState("superposition")
    setRightState("superposition")
    setMeasuredParticle(null)
  }

  return (
    <div className="space-y-3">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[200px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={setAnimationSpeed}
        isDark={isDark}
      />

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-purple-400">Сила запутанности</span>
          <span className="font-mono text-white">{entanglementStrength}%</span>
        </div>
        <Slider
          value={[entanglementStrength]}
          onValueChange={(v) => {
            setEntanglementStrength(v[0])
          }}
          min={0}
          max={100}
          step={5}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={measureLeft}
          disabled={leftState !== "superposition"}
          className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 text-xs"
          size="sm"
        >
          🔍 Измерить A
        </Button>
        <Button
          onClick={measureRight}
          disabled={rightState !== "superposition"}
          className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-xs"
          size="sm"
        >
          🔍 Измерить B
        </Button>
        <Button
          onClick={reset}
          variant="outline"
          size="sm"
          disabled={leftState === "superposition"}
        >
          🔄
        </Button>
      </div>

      <div className="rounded-lg border border-purple-500/20 bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-2 text-xs">
        <div className="font-semibold text-purple-300">🔗 "Жуткое дальнодействие" (Эйнштейн)</div>
        <p className="mt-1 text-gray-400">
          При измерении одной частицы другая мгновенно принимает то же состояние, независимо от
          расстояния! Нарушает принцип локальности.
        </p>
      </div>
    </div>
  )
}
