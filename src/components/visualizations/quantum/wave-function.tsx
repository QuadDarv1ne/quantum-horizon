"use client"

import { useRef, useState } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useVisualizationStore, selectWaveFunctionSettings } from "@/stores/visualization-store"

interface WaveFunctionVisualizationProps {
  isDark: boolean
}

export function WaveFunctionVisualization({ isDark }: WaveFunctionVisualizationProps) {
  const { quantumNumber, showProbability } = useVisualizationStore(selectWaveFunctionSettings)
  const { isPlaying, animationSpeed, setQuantumNumber, togglePlaying, setAnimationSpeed } =
    useVisualizationStore()
  const [particlePosition, setParticlePosition] = useState<number | null>(null)

  const timeRef = useRef(0)

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    timeRef.current += 0.03 * animationSpeed
    const time = timeRef.current

    const L = width * 0.8
    const offsetX = (width - L) / 2

    // Clear canvas
    ctx.fillStyle = isDark ? "#0a0a1a" : "#f8fafc"
    ctx.fillRect(0, 0, width, height)

    // Potential well
    ctx.strokeStyle = isDark ? "rgba(100, 150, 255, 0.6)" : "rgba(50, 100, 200, 0.6)"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(offsetX, 20)
    ctx.lineTo(offsetX, height - 20)
    ctx.lineTo(offsetX + L, height - 20)
    ctx.lineTo(offsetX + L, 20)
    ctx.stroke()

    // Well label
    ctx.fillStyle = isDark ? "rgba(100, 150, 255, 0.6)" : "rgba(50, 100, 200, 0.6)"
    ctx.font = "10px sans-serif"
    ctx.textAlign = "center"
    ctx.fillText("Infinite Potential Well", width / 2, 15)
    ctx.fillText("x=0", offsetX, height - 8)
    ctx.fillText("x=L", offsetX + L, height - 8)

    // Energy levels
    const maxN = 5
    const energyHeight = (height - 60) / (maxN + 1)

    for (let i = 1; i <= maxN; i++) {
      const y = height - 30 - i * energyHeight

      ctx.strokeStyle =
        i === quantumNumber
          ? isDark
            ? "rgba(255, 200, 100, 0.8)"
            : "rgba(255, 150, 50, 0.8)"
          : isDark
            ? "rgba(100, 100, 150, 0.3)"
            : "rgba(150, 150, 200, 0.3)"
      ctx.lineWidth = i === quantumNumber ? 2 : 1
      ctx.setLineDash(i === quantumNumber ? [] : [3, 3])
      ctx.beginPath()
      ctx.moveTo(offsetX + 5, y)
      ctx.lineTo(offsetX + L - 5, y)
      ctx.stroke()
      ctx.setLineDash([])

      if (i <= 3) {
        ctx.fillStyle =
          i === quantumNumber
            ? isDark
              ? "#FFCC66"
              : "#FF9900"
            : isDark
              ? "rgba(150, 150, 200, 0.5)"
              : "rgba(100, 100, 150, 0.5)"
        ctx.font = "9px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(`n=${String(i)}`, offsetX - 8, y + 4)
        ctx.fillText(`E${String(i)}`, offsetX + L + 25, y + 4)
      }
    }

    // Wave function ψ(x)
    const amplitude = energyHeight * 0.35
    const baseY = height - 30 - quantumNumber * energyHeight

    // Draw wave function
    ctx.beginPath()
    ctx.strokeStyle = isDark ? "rgba(100, 200, 255, 0.9)" : "rgba(50, 150, 200, 0.9)"
    ctx.lineWidth = 2

    for (let px = 0; px <= L; px += 2) {
      const x = px / L
      const psi = Math.sin(quantumNumber * Math.PI * x) * Math.cos(time * quantumNumber * 0.5)
      const y = baseY - psi * amplitude

      if (px === 0) ctx.moveTo(offsetX + px, y)
      else ctx.lineTo(offsetX + px, y)
    }
    ctx.stroke()

    // Probability density |ψ|²
    if (showProbability) {
      ctx.fillStyle = isDark ? "rgba(255, 100, 150, 0.15)" : "rgba(255, 100, 150, 0.1)"
      ctx.beginPath()
      ctx.moveTo(offsetX, baseY)

      for (let px = 0; px <= L; px += 2) {
        const x = px / L
        const probDensity = Math.pow(Math.sin(quantumNumber * Math.PI * x), 2)
        const y = baseY - probDensity * amplitude
        ctx.lineTo(offsetX + px, y)
      }
      ctx.lineTo(offsetX + L, baseY)
      ctx.closePath()
      ctx.fill()

      // Probability curve
      ctx.strokeStyle = isDark ? "rgba(255, 100, 150, 0.7)" : "rgba(255, 100, 150, 0.6)"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let px = 0; px <= L; px += 2) {
        const x = px / L
        const probDensity = Math.pow(Math.sin(quantumNumber * Math.PI * x), 2)
        const y = baseY - probDensity * amplitude
        if (px === 0) ctx.moveTo(offsetX + px, y)
        else ctx.lineTo(offsetX + px, y)
      }
      ctx.stroke()
    }

    // Probability interpretation - measure particle
    if (particlePosition !== null) {
      const x = particlePosition / L
      const probDensity = Math.pow(Math.sin(quantumNumber * Math.PI * x), 2)

      ctx.beginPath()
      ctx.arc(offsetX + particlePosition, baseY, 8, 0, Math.PI * 2)
      ctx.fillStyle = "#FFD700"
      ctx.fill()
      ctx.strokeStyle = "#FFF"
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.fillStyle = "rgba(255, 215, 0, 0.8)"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`P = ${(probDensity * 100).toFixed(1)}%`, offsetX + particlePosition, baseY - 20)
    }

    // Legend
    ctx.font = "10px sans-serif"
    ctx.textAlign = "left"
    ctx.fillStyle = isDark ? "rgba(100, 200, 255, 0.9)" : "rgba(50, 150, 200, 0.9)"
    ctx.fillText("ψ(x) — wave function", 10, height - 45)
    if (showProbability) {
      ctx.fillStyle = isDark ? "rgba(255, 100, 150, 0.9)" : "rgba(255, 100, 150, 0.9)"
      ctx.fillText("|ψ|² — probability density", 10, height - 32)
    }

    // Formula
    ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(50, 50, 50, 0.7)"
    ctx.font = "11px monospace"
    ctx.textAlign = "center"
    ctx.fillText(
      `ψ_${String(quantumNumber)}(x) = √(2/L)·sin(${String(quantumNumber)}πx/L)`,
      width / 2,
      30
    )
  }

  const measureParticle = () => {
    const L = 100
    let random = Math.random()
    let position = 0

    for (let px = 0; px <= L; px++) {
      const x = px / L
      const prob = Math.pow(Math.sin(quantumNumber * Math.PI * x), 2)
      random -= prob / (L / 2)
      if (random <= 0) {
        position = px * 3
        break
      }
    }

    setParticlePosition(position)
    setTimeout(() => {
      setParticlePosition(null)
    }, 2000)
  }

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
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>Quantum number n</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {quantumNumber}
            </span>
          </div>
          <Slider
            value={[quantumNumber]}
            onValueChange={(v) => {
              setQuantumNumber(v[0])
            }}
            min={1}
            max={5}
            step={1}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              useVisualizationStore.getState().toggleShowProbability()
            }}
            variant="outline"
            size="sm"
            className={`flex-1 text-xs ${
              isDark ? "border-pink-500/50 text-pink-300" : "border-pink-500 text-pink-700"
            }`}
          >
            |ψ|²
          </Button>
          <Button
            onClick={measureParticle}
            size="sm"
            className="flex-1 text-xs bg-gradient-to-r from-yellow-600 to-orange-600"
          >
            🎲 Measure
          </Button>
        </div>
      </div>
      <div
        className={`rounded-lg p-3 border ${
          isDark
            ? "bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-500/20"
            : "bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200"
        }`}
      >
        <div className={`font-semibold mb-1 ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>
          📐 Schrödinger equation solution:
        </div>
        <div className={`font-mono text-center ${isDark ? "text-white" : "text-gray-900"}`}>
          E_n = n²π²ℏ² / 2mL²
        </div>
        <p className={`mt-2 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Energy is quantized! The particle cannot have zero energy (n≥1) — this is a fundamental
          difference from classical physics.
        </p>
      </div>
    </div>
  )
}
