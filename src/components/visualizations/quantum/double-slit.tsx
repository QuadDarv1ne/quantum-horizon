/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { useRef, useState, useCallback } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  useVisualizationStore,
  selectIsPlaying,
  selectAnimationSpeed,
} from "@/stores/visualization-store"

interface DoubleSlitVisualizationProps {
  isDark: boolean
}

interface Particle {
  x: number
  y: number
  targetY: number
  speed: number
  phase: number
}

export function DoubleSlitVisualization({ isDark }: DoubleSlitVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [slitSeparation, setSlitSeparation] = useState(40)
  const [slitWidth, setSlitWidth] = useState(8)
  const [wavelength, setWavelength] = useState(15)
  const [showParticles, setShowParticles] = useState(false)
  const [showWave, setShowWave] = useState(true)

  const particleHitsRef = useRef<number[]>(new Array(100).fill(0))
  const particlesRef = useRef<Particle[]>([])
  const timeRef = useRef(0)
  const bgGradientRef = useRef<CanvasGradient | null>(null)

  // Reset particle hits when switching modes
  const resetParticleHits = useCallback(() => {
    particleHitsRef.current = new Array(100).fill(0)
    particlesRef.current = []
  }, [])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const isDarkMode = _isDark
      const slitX = width * 0.3
      const screenX = width * 0.85
      const centerY = height / 2

      timeRef.current += (delta / 1000) * animationSpeed
      const time = timeRef.current

      // Limit particles array to prevent memory leak
      if (particlesRef.current.length > 200) {
        particlesRef.current.splice(0, particlesRef.current.length - 100)
      }

      ctx.clearRect(0, 0, width, height)

      // Background - cached gradient
      if (!bgGradientRef.current) {
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, isDarkMode ? "#050510" : "#f0f4ff")
        gradient.addColorStop(1, isDarkMode ? "#0a0a1a" : "#e8efff")
        bgGradientRef.current = gradient
      }
      ctx.fillStyle = bgGradientRef.current
      ctx.fillRect(0, 0, width, height)

      // Wave visualization from source
      if (showWave && !showParticles) {
        ctx.strokeStyle = isDarkMode ? "rgba(100, 150, 255, 0.3)" : "rgba(50, 100, 200, 0.3)"
        ctx.lineWidth = 1
        for (let r = 0; r < 200; r += 10) {
          const waveR = (r + time * 50) % 200
          ctx.beginPath()
          ctx.arc(30, centerY, waveR, -Math.PI / 2.5, Math.PI / 2.5)
          ctx.stroke()
        }
      }

      // Source
      ctx.fillStyle = isDarkMode ? "#FFD700" : "#FFA500"
      ctx.beginPath()
      ctx.arc(30, centerY, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = isDarkMode ? "#FFD70080" : "#FFA50080"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Source", 30, centerY + 25)

      // Barrier with slits
      ctx.fillStyle = isDarkMode ? "#333" : "#ccc"
      ctx.fillRect(slitX - 4, 0, 8, centerY - slitSeparation / 2 - slitWidth / 2)
      ctx.fillRect(
        slitX - 4,
        centerY - slitSeparation / 2 + slitWidth / 2,
        8,
        slitSeparation - slitWidth
      )
      ctx.fillRect(
        slitX - 4,
        centerY + slitSeparation / 2 + slitWidth / 2,
        8,
        height - centerY - slitSeparation / 2 - slitWidth / 2
      )

      // Slit labels
      ctx.fillStyle = isDarkMode ? "#888" : "#666"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Slit 1", slitX + 8, centerY - slitSeparation / 2)
      ctx.fillText("Slit 2", slitX + 8, centerY + slitSeparation / 2)

      // Wave after slits
      if (showWave) {
        // Interference pattern calculation
        for (let y = 20; y < height - 20; y++) {
          const dy = y - centerY
          const d1 = Math.sqrt(Math.pow(slitSeparation / 2, 2) + Math.pow(dy, 2))
          const d2 = Math.sqrt(Math.pow(-slitSeparation / 2, 2) + Math.pow(dy, 2))
          const pathDiff = d1 - d2
          const phase = (pathDiff / wavelength) * 2 * Math.PI
          const intensity = Math.pow(Math.cos(phase / 2), 2)

          // Draw interference pattern on screen
          const alpha = intensity * 0.8
          ctx.fillStyle = `rgba(100, 200, 255, ${String(alpha)})`
          ctx.fillRect(screenX - 3, y, 6, 1)

          // Wave propagation
          if (!showParticles) {
            for (let x = slitX + 10; x < screenX - 10; x += 5) {
              const progress = (x - slitX) / (screenX - slitX)
              const waveIntensity = Math.sin(phase + time * 3 - progress * 10) * 0.5 + 0.5
              ctx.fillStyle = `rgba(100, 150, 255, ${String(waveIntensity * intensity * 0.15)})`
              ctx.beginPath()
              ctx.arc(x, y, 2, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      // Particle mode
      if (showParticles) {
        // Spawn particles with limit
        if (Math.random() < 0.3 && particlesRef.current.length < 100) {
          const targetY = centerY + (Math.random() - 0.5) * height * 0.8
          particlesRef.current.push({
            x: 30,
            y: centerY,
            targetY: targetY,
            speed: 2 + Math.random(),
            phase: Math.random() * Math.PI * 2,
          })
        }

        // Update and draw particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const p = particlesRef.current[i]
          p.x += p.speed

          if (p.x < slitX) {
            ctx.fillStyle = isDarkMode ? "#FFD700" : "#FFA500"
            ctx.beginPath()
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
            ctx.fill()
          } else if (p.x < screenX) {
            ctx.fillStyle = isDarkMode ? "rgba(100, 200, 255, 0.8)" : "rgba(50, 150, 200, 0.8)"
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            const dy = p.targetY - centerY
            const d1 = Math.sqrt(Math.pow(slitSeparation / 2, 2) + Math.pow(dy, 2))
            const d2 = Math.sqrt(Math.pow(-slitSeparation / 2, 2) + Math.pow(dy, 2))
            const pathDiff = d1 - d2
            const phase = (pathDiff / wavelength) * 2 * Math.PI
            const probability = Math.pow(Math.cos(phase / 2), 2)

            if (Math.random() < probability) {
              const hitY = Math.floor((p.targetY / height) * 100)
              if (hitY >= 0 && hitY < 100) {
                particleHitsRef.current[hitY]++
              }
            }
            particlesRef.current.splice(i, 1)
          }
        }

        // Draw hit pattern
        for (let i = 0; i < 100; i++) {
          const hits = particleHitsRef.current[i]
          if (hits > 0) {
            const intensity = Math.min(hits / 20, 1)
            ctx.fillStyle = `rgba(100, 200, 255, ${String(intensity)})`
            ctx.fillRect(screenX - 3, (i / 100) * height, 6, height / 100)
          }
        }
      }

      // Detection screen
      ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(screenX, 10)
      ctx.lineTo(screenX, height - 10)
      ctx.stroke()
      ctx.fillStyle = isDarkMode ? "#888" : "#666"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Screen", screenX, height - 5)

      // Legend
      ctx.fillStyle = isDarkMode ? "#888" : "#666"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`d = ${String(slitSeparation)} (slit separation)`, 10, height - 35)
      ctx.fillText(`λ = ${String(wavelength)} (wavelength)`, 10, height - 22)
      ctx.fillText(`a = ${String(slitWidth)} (slit width)`, 10, height - 9)
    },
    [slitSeparation, slitWidth, wavelength, showParticles, showWave, animationSpeed]
  )

  const handleReset = useCallback(() => {
    resetParticleHits()
  }, [resetParticleHits])

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[350px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={setAnimationSpeed}
        isDark={isDark}
        onReset={handleReset}
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-blue-400" : "text-blue-700"}>d (slits)</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {slitSeparation}
            </span>
          </div>
          <Slider
            value={[slitSeparation]}
            onValueChange={(v) => {
              setSlitSeparation(v[0])
            }}
            min={15}
            max={80}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-green-400" : "text-green-700"}>λ (wave)</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {wavelength}
            </span>
          </div>
          <Slider
            value={[wavelength]}
            onValueChange={(v) => {
              setWavelength(v[0])
            }}
            min={5}
            max={30}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-yellow-400" : "text-yellow-700"}>a (width)</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {slitWidth}
            </span>
          </div>
          <Slider
            value={[slitWidth]}
            onValueChange={(v) => {
              setSlitWidth(v[0])
            }}
            min={3}
            max={20}
            step={1}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setShowWave(true)
            setShowParticles(false)
            resetParticleHits()
          }}
          variant={showWave && !showParticles ? "default" : "outline"}
          size="sm"
          className="flex-1 text-xs"
        >
          🌊 Wave
        </Button>
        <Button
          onClick={() => {
            setShowParticles(true)
            setShowWave(true)
            resetParticleHits()
          }}
          variant={showParticles ? "default" : "outline"}
          size="sm"
          className="flex-1 text-xs"
        >
          ⚡ Particles
        </Button>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-blue-500/20 bg-blue-900/20" : "border-blue-200 bg-blue-50"
        }`}
      >
        <p className={isDark ? "text-gray-300" : "text-gray-700"}>
          <span className={isDark ? "text-blue-300" : "text-blue-700"}>
            Double-slit experiment:
          </span>{" "}
          Even individual particles create an interference pattern! This demonstrates wave-particle
          duality — matter behaves as both a particle and a wave.
        </p>
      </div>
    </div>
  )
}
