"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useVisualizationStore, selectWaveFunctionSettings } from "@/stores/visualization-store"
import { QueryParam } from "@/hooks/use-url-sync"

interface WaveFunctionVisualizationProps {
  isDark: boolean
}

export function WaveFunctionVisualization({ isDark }: WaveFunctionVisualizationProps) {
  const { quantumNumber, showProbability } = useVisualizationStore(selectWaveFunctionSettings)
  const { isPlaying, animationSpeed, setQuantumNumber, togglePlaying, setAnimationSpeed } =
    useVisualizationStore()
  const [particlePosition, setParticlePosition] = useState<number | null>(null)
  const [measurementMode, setMeasurementMode] = useState(false)

  const timeRef = useRef(0)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const n = QueryParam.getNumber("wf.n", quantumNumber)
    if (n !== quantumNumber) setQuantumNumber(n as 1 | 2 | 3 | 4 | 5)
    QueryParam.setNumber("wf.n", quantumNumber)
    QueryParam.setBoolean("wf.prob", showProbability)
  }, [quantumNumber, showProbability, setQuantumNumber])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed
      }
      const time = timeRef.current
      const isDarkMode = _isDark

      // Store canvas ref for click handler
      canvasRef.current = ctx.canvas

      const L = width * 0.8
      const offsetX = (width - L) / 2

      // Clear canvas
      ctx.fillStyle = isDarkMode ? "#0a0a1a" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      // Potential well
      ctx.strokeStyle = isDarkMode ? "rgba(100, 150, 255, 0.6)" : "rgba(50, 100, 200, 0.6)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(offsetX, 20)
      ctx.lineTo(offsetX, height - 20)
      ctx.lineTo(offsetX + L, height - 20)
      ctx.lineTo(offsetX + L, 20)
      ctx.stroke()

      // Well label
      ctx.fillStyle = isDarkMode ? "rgba(100, 150, 255, 0.6)" : "rgba(50, 100, 200, 0.6)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Infinite Potential Well", width / 2, 15)
      ctx.fillText("x=0", offsetX, height - 8)
      ctx.fillText("x=L", offsetX + L, height - 8)

      // Energy levels with proper physics
      const maxN = 5
      const energyHeight = (height - 60) / (maxN + 1)

      for (let i = 1; i <= maxN; i++) {
        const y = height - 30 - i * energyHeight

        ctx.strokeStyle =
          i === quantumNumber
            ? isDarkMode
              ? "rgba(255, 200, 100, 0.8)"
              : "rgba(255, 150, 50, 0.8)"
            : isDarkMode
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
              ? isDarkMode
                ? "#FFCC66"
                : "#FF9900"
              : isDarkMode
                ? "rgba(150, 150, 200, 0.5)"
                : "rgba(100, 100, 150, 0.5)"
          ctx.font = "9px sans-serif"
          ctx.textAlign = "right"
          ctx.fillText(`n=${String(i)}`, offsetX - 8, y + 4)
          ctx.fillText(`E${String(i)}`, offsetX + L + 25, y + 4)
        }
      }

      // Wave function ψ(x,t) with proper time evolution
      // ψ(x,t) = ψ(x) · e^(-iE_n*t/ℏ) = ψ(x) · cos(ω_n·t) where ω_n = E_n/ℏ
      // For visualization, we show Re[ψ(x,t)] = ψ(x) · cos(E_n·t/ℏ)
      const amplitude = energyHeight * 0.35
      const baseY = height - 30 - quantumNumber * energyHeight

      // Energy for this quantum number: E_n = n²π²ℏ²/2mL²
      // Angular frequency: ω_n = E_n/ℏ = n²π²ℏ/2mL²
      // For visualization, use scaled frequency
      const angularFrequency = quantumNumber * 2 // Scaled for visualization
      const phaseFactor = Math.cos(angularFrequency * time)

      // Draw wave function with time evolution
      ctx.beginPath()
      ctx.strokeStyle = isDarkMode ? "rgba(100, 200, 255, 0.9)" : "rgba(50, 150, 200, 0.9)"
      ctx.lineWidth = 2

      for (let px = 0; px <= L; px += 2) {
        const x = px / L
        // Spatial part: ψ_n(x) = √(2/L) · sin(nπx/L)
        const psi = Math.sin(quantumNumber * Math.PI * x)
        // Time evolution: multiply by cos(E_n*t/ℏ)
        const psiT = psi * phaseFactor
        const y = baseY - psiT * amplitude

        if (px === 0) ctx.moveTo(offsetX + px, y)
        else ctx.lineTo(offsetX + px, y)
      }
      ctx.stroke()

      // Probability density |ψ|² (time-independent for stationary states!)
      if (showProbability) {
        ctx.fillStyle = isDarkMode ? "rgba(255, 100, 150, 0.15)" : "rgba(255, 100, 150, 0.1)"
        ctx.beginPath()
        ctx.moveTo(offsetX, baseY)

        for (let px = 0; px <= L; px += 2) {
          const x = px / L
          // |ψ|² is time-independent for stationary states
          const probDensity = Math.pow(Math.sin(quantumNumber * Math.PI * x), 2)
          const y = baseY - probDensity * amplitude
          ctx.lineTo(offsetX + px, y)
        }
        ctx.lineTo(offsetX + L, baseY)
        ctx.closePath()
        ctx.fill()

        // Probability curve
        ctx.strokeStyle = isDarkMode ? "rgba(255, 100, 150, 0.7)" : "rgba(255, 100, 150, 0.6)"
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

      // Measurement - click to measure position
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
        ctx.fillText(
          `P = ${(probDensity * 100).toFixed(1)}%`,
          offsetX + particlePosition,
          baseY - 20
        )

        // Collapse indicator
        ctx.fillStyle = isDarkMode ? "rgba(255, 100, 100, 0.8)" : "rgba(200, 50, 50, 0.8)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Wave function collapsed!", width / 2, baseY - 40)
      }

      // Measurement mode indicator
      if (measurementMode) {
        ctx.fillStyle = isDarkMode ? "rgba(255, 200, 0, 0.3)" : "rgba(255, 150, 0, 0.3)"
        ctx.fillRect(0, 0, width, height)
        ctx.fillStyle = isDarkMode ? "#FFD700" : "#FFA500"
        ctx.font = "12px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("Click anywhere to measure position", width / 2, height / 2)
      }

      // Legend
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillStyle = isDarkMode ? "rgba(100, 200, 255, 0.9)" : "rgba(50, 150, 200, 0.9)"
      ctx.fillText("ψ(x) — wave function", 10, height - 45)
      if (showProbability) {
        ctx.fillStyle = isDarkMode ? "rgba(255, 100, 150, 0.9)" : "rgba(255, 100, 150, 0.9)"
        ctx.fillText("|ψ|² — probability density (time-independent)", 10, height - 32)
      }

      // Formula with proper physics
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(50, 50, 50, 0.7)"
      ctx.font = "11px monospace"
      ctx.textAlign = "center"
      ctx.fillText(
        `ψ_${String(quantumNumber)}(x,t) = √(2/L)·sin(${String(quantumNumber)}πx/L)·e^(-iE${String(quantumNumber)}t/ℏ)`,
        width / 2,
        30
      )
    },
    [quantumNumber, showProbability, isPlaying, animationSpeed, measurementMode, particlePosition]
  )

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!measurementMode) return

      const canvas = e.currentTarget
      const rect = canvas.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const width = canvas.offsetWidth

      // Convert click to position in the well
      const L = width * 0.8
      const offsetX = (width - L) / 2
      const relativeX = clickX - offsetX

      // Check if click is within the well
      if (relativeX >= 0 && relativeX <= L) {
        // Quantum measurement: collapse to position eigenstate
        // Probability of finding particle at position x is |ψ(x)|²
        const x = relativeX / L
        const probDensity = Math.pow(Math.sin(quantumNumber * Math.PI * x), 2)

        // Monte Carlo acceptance
        if (Math.random() < probDensity) {
          setParticlePosition(relativeX)
          setTimeout(() => {
            setParticlePosition(null)
          }, 2000)
        } else {
          // Particle not found at this position
          setParticlePosition(null)
        }
      }
    },
    [measurementMode, quantumNumber]
  )

  const measureParticle = () => {
    setMeasurementMode(!measurementMode)
    if (measurementMode) {
      setParticlePosition(null)
    }
  }

  return (
    <div className="space-y-4">
      <VisualizationCanvas
        draw={draw}
        isDark={isDark}
        className="h-[400px]"
        onClick={handleCanvasClick}
        style={{ cursor: measurementMode ? "crosshair" : "default" }}
      />
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
            className={`flex-1 text-xs ${
              measurementMode
                ? "bg-gradient-to-r from-yellow-600 to-orange-600 text-white"
                : "bg-gradient-to-r from-yellow-600 to-orange-600"
            }`}
          >
            {measurementMode ? "✋ Click to Measure" : "🎲 Measure Mode"}
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
        {measurementMode && (
          <p className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
            💡 Click on the canvas to measure the particle position. The probability of detection
            follows |ψ|² distribution.
          </p>
        )}
        <Button
          onClick={() => {
            const url = window.location.href
            void navigator.clipboard.writeText(url)
          }}
          variant="outline"
          size="sm"
          className="w-full mt-2"
        >
          🔗 Copy URL
        </Button>
      </div>
    </div>
  )
}
