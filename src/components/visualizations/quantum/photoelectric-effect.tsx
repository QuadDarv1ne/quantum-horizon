/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import { useRef, useState, useCallback } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface PhotoelectricEffectVisualizationProps {
  isDark: boolean
}

interface Photon {
  x: number
  y: number
  vx: number
  vy: number
  energy: number
}

interface Electron {
  x: number
  y: number
  vx: number
  vy: number
  life: number
}

export function PhotoelectricEffectVisualization({
  isDark,
}: PhotoelectricEffectVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [frequency, setFrequency] = useState(50)
  const [intensity, setIntensity] = useState(50)
  const [workFunction, setWorkFunction] = useState(2.5)

  const timeRef = useRef(0)
  const photonsRef = useRef<Photon[]>([])
  const electronsRef = useRef<Electron[]>([])
  const metalGradientRef = useRef<CanvasGradient | null>(null)

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const isDarkMode = _isDark
      const metalY = height * 0.6
      const metalHeight = height * 0.3

      // Update time
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed
      }
      const time = timeRef.current

      // Clear
      ctx.fillStyle = isDarkMode ? "#0a0a15" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      // Metal plate (cached gradient)
      if (!metalGradientRef.current) {
        const metalGradient = ctx.createLinearGradient(0, metalY, 0, height)
        metalGradient.addColorStop(0, isDarkMode ? "#4a4a6a" : "#9a9aba")
        metalGradient.addColorStop(0.5, isDarkMode ? "#3a3a5a" : "#8a8aaa")
        metalGradient.addColorStop(1, isDarkMode ? "#2a2a4a" : "#7a7a9a")
        metalGradientRef.current = metalGradient
      }
      ctx.fillStyle = metalGradientRef.current
      ctx.fillRect(50, metalY, width - 100, metalHeight)

      ctx.strokeStyle = isDarkMode ? "#6a6a8a" : "#aaaacc"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, metalY)
      ctx.lineTo(width - 50, metalY)
      ctx.stroke()

      ctx.fillStyle = isDarkMode ? "#888" : "#666"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Metal plate", width / 2, metalY + metalHeight / 2)

      // Light source
      ctx.fillStyle = isDarkMode ? "#FFD700" : "#FFA500"
      ctx.beginPath()
      ctx.arc(30, height * 0.3, 15, 0, Math.PI * 2)
      ctx.fill()

      // Light rays
      ctx.strokeStyle = `rgba(255, 200, 50, ${String(0.3 + intensity / 200)})`
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(45, height * 0.3 + (i - 2) * 8)
        ctx.lineTo(100, metalY - 10)
        ctx.stroke()
      }

      // Calculate photon energy
      const photonEnergy = (frequency / 100) * 6
      const canEmit = photonEnergy >= workFunction
      const kineticEnergy = Math.max(0, photonEnergy - workFunction)

      // Spawn photons
      if (Math.random() < intensity / 100) {
        photonsRef.current.push({
          x: 50,
          y: height * 0.3 + (Math.random() - 0.5) * 20,
          vx: 3 + Math.random(),
          vy: (metalY - height * 0.3) / 50 + (Math.random() - 0.5) * 0.5,
          energy: photonEnergy,
        })
      }

      // Update and draw photons
      for (let i = photonsRef.current.length - 1; i >= 0; i--) {
        const p = photonsRef.current[i]
        p.x += p.vx
        p.y += p.vy

        const wavelength = 30 - (frequency / 100) * 20
        ctx.strokeStyle = frequency > 50 ? `rgba(150, 50, 255, 0.8)` : `rgba(255, 200, 50, 0.8)`
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let dx = -15; dx <= 15; dx++) {
          const waveY = p.y + Math.sin(((dx + time * 20) / wavelength) * Math.PI * 2) * 5
          if (dx === -15) ctx.moveTo(p.x + dx, waveY)
          else ctx.lineTo(p.x + dx, waveY)
        }
        ctx.stroke()

        if (p.y >= metalY - 5) {
          if (canEmit && Math.random() < 0.7) {
            electronsRef.current.push({
              x: p.x,
              y: metalY - 5,
              vx: (Math.random() - 0.3) * 2,
              vy: -2 - kineticEnergy * 1.5 - Math.random() * 2,
              life: 1,
            })
          }
          photonsRef.current.splice(i, 1)
        }
      }

      // Update and draw electrons
      for (let i = electronsRef.current.length - 1; i >= 0; i--) {
        const e = electronsRef.current[i]
        e.x += e.vx
        e.y += e.vy
        e.vy += 0.02
        e.life -= 0.005

        if (e.life <= 0 || e.y > height) {
          electronsRef.current.splice(i, 1)
          continue
        }

        ctx.fillStyle = `rgba(100, 200, 255, ${String(e.life)})`
        ctx.beginPath()
        ctx.arc(e.x, e.y, 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = `rgba(100, 200, 255, ${String(e.life * 0.3)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(e.x, e.y)
        ctx.lineTo(e.x - e.vx * 5, e.y - e.vy * 5)
        ctx.stroke()
      }

      // Energy diagram
      const diagramX = width - 80
      const diagramY = 30
      const diagramH = 80

      ctx.strokeStyle = "rgba(255, 150, 100, 0.8)"
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(diagramX - 30, diagramY + diagramH * (1 - workFunction / 6))
      ctx.lineTo(diagramX + 30, diagramY + diagramH * (1 - workFunction / 6))
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "rgba(255, 150, 100, 0.8)"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(
        `W = ${workFunction} eV`,
        diagramX - 28,
        diagramY + diagramH * (1 - workFunction / 6) - 3
      )

      ctx.strokeStyle = frequency > 50 ? "rgba(150, 50, 255, 0.8)" : "rgba(255, 200, 50, 0.8)"
      ctx.beginPath()
      ctx.moveTo(diagramX - 30, diagramY + diagramH * (1 - photonEnergy / 6))
      ctx.lineTo(diagramX + 30, diagramY + diagramH * (1 - photonEnergy / 6))
      ctx.stroke()

      ctx.fillStyle = frequency > 50 ? "rgba(150, 50, 255, 0.8)" : "rgba(255, 200, 50, 0.8)"
      ctx.fillText(
        `hν = ${photonEnergy.toFixed(1)} eV`,
        diagramX - 28,
        diagramY + diagramH * (1 - photonEnergy / 6) - 3
      )

      ctx.fillStyle = isDarkMode ? "#888" : "#666"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Energy", diagramX, diagramY - 5)

      ctx.fillStyle = canEmit ? "#90EE90" : "#FF6B6B"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(canEmit ? "✓ Photoelectric effect!" : "✗ hν < W", 10, 20)

      if (canEmit) {
        ctx.fillStyle = canEmit ? (isDarkMode ? "#90EE90" : "#006400") : "#FF6B6B"
        ctx.font = "10px sans-serif"
        ctx.fillText(`E_kin = ${(kineticEnergy * 1.6e-19).toExponential(1)} J`, 10, 35)
      }
    },
    [isPlaying, animationSpeed, frequency, intensity, workFunction]
  )

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[350px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={setAnimationSpeed}
        isDark={isDark}
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-purple-400" : "text-purple-700"}>Frequency ν</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {(frequency * 0.8 + 400).toFixed(0)} THz
            </span>
          </div>
          <Slider
            value={[frequency]}
            onValueChange={(v) => {
              setFrequency(v[0])
            }}
            min={10}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-yellow-400" : "text-yellow-700"}>Intensity</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {intensity}%
            </span>
          </div>
          <Slider
            value={[intensity]}
            onValueChange={(v) => {
              setIntensity(v[0])
            }}
            min={10}
            max={100}
            step={5}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-orange-400" : "text-orange-700"}>Work function</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {workFunction} eV
            </span>
          </div>
          <Slider
            value={[workFunction * 10]}
            onValueChange={(v) => {
              setWorkFunction(v[0] / 10)
            }}
            min={10}
            max={50}
            step={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`rounded border p-2 ${
            isDark ? "border-purple-500/20 bg-purple-950/30" : "border-purple-200 bg-purple-50"
          }`}
        >
          <div
            className={isDark ? "font-semibold text-purple-400" : "font-semibold text-purple-700"}
          >
            Einstein equation
          </div>
          <div className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
            hν = W + E_kin
          </div>
        </div>
        <div
          className={`rounded border p-2 ${
            isDark ? "border-green-500/20 bg-green-950/30" : "border-green-200 bg-green-50"
          }`}
        >
          <div className={isDark ? "font-semibold text-green-400" : "font-semibold text-green-700"}>
            Kinetic energy
          </div>
          <div className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
            E = hν - W
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-yellow-500/20 bg-yellow-900/20" : "border-yellow-200 bg-yellow-50"
        }`}
      >
        <div className={isDark ? "font-semibold text-yellow-300" : "font-semibold text-yellow-700"}>
          ⚡ Photoelectric Effect (Einstein, 1905)
        </div>
        <p className={isDark ? "mt-1 text-gray-400" : "mt-1 text-gray-600"}>
          Light consists of quanta (photons). Electrons are emitted only if hν ≥ W. Intensity
          affects the number of electrons, not their energy!
        </p>
      </div>
    </div>
  )
}
