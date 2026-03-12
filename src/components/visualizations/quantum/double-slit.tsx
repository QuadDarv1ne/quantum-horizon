"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface DoubleSlitVisualizationProps {
  isDark: boolean
}

export function DoubleSlitVisualization({ isDark }: DoubleSlitVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [slitSeparation, setSlitSeparation] = useState(40)
  const [slitWidth, setSlitWidth] = useState(8)
  const [wavelength, setWavelength] = useState(15)
  const [showParticles, setShowParticles] = useState(false)
  const [showWave, setShowWave] = useState(true)
  const particleHitsRef = useRef<number[]>(new Array(100).fill(0))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let bgGradient: CanvasGradient | null = null

    const resize = () => {
      setupCanvas(canvas, ctx)
      bgGradient = null
    }
    resize()
    window.addEventListener("resize", resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const slitX = width * 0.3
    const screenX = width * 0.85
    const centerY = height / 2

    let time = 0
    const particles: Array<{
      x: number
      y: number
      targetY: number
      speed: number
      phase: number
    }> = []

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background - cached gradient
      if (!bgGradient) {
        bgGradient = ctx.createLinearGradient(0, 0, width, height)
        bgGradient.addColorStop(0, isDark ? "#050510" : "#f0f4ff")
        bgGradient.addColorStop(1, isDark ? "#0a0a1a" : "#e8efff")
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Wave visualization from source
      if (showWave && !showParticles) {
        ctx.strokeStyle = isDark ? "rgba(100, 150, 255, 0.3)" : "rgba(50, 100, 200, 0.3)"
        ctx.lineWidth = 1
        for (let r = 0; r < 200; r += 10) {
          const waveR = (r + time * 50) % 200
          ctx.beginPath()
          ctx.arc(30, centerY, waveR, -Math.PI / 2.5, Math.PI / 2.5)
          ctx.stroke()
        }
      }

      // Source
      ctx.fillStyle = isDark ? "#FFD700" : "#FFA500"
      ctx.beginPath()
      ctx.arc(30, centerY, 8, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = isDark ? "#FFD70080" : "#FFA50080"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Source", 30, centerY + 25)

      // Barrier with slits
      ctx.fillStyle = isDark ? "#333" : "#ccc"
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
      ctx.fillStyle = isDark ? "#888" : "#666"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Slit 1", slitX + 8, centerY - slitSeparation / 2)
      ctx.fillText("Slit 2", slitX + 8, centerY + slitSeparation / 2)

      // Wave after slits
      if (showWave) {
        // Interference pattern calculation
        for (let y = 20; y < height - 20; y++) {
          const dy = y - centerY
          // Path difference from two slits
          const d1 = Math.sqrt(Math.pow(slitSeparation / 2, 2) + Math.pow(dy, 2))
          const d2 = Math.sqrt(Math.pow(-slitSeparation / 2, 2) + Math.pow(dy, 2))
          const pathDiff = d1 - d2
          const phase = (pathDiff / wavelength) * 2 * Math.PI
          const intensity = Math.pow(Math.cos(phase / 2), 2)

          // Draw interference pattern on screen
          const alpha = intensity * 0.8
          ctx.fillStyle = `rgba(100, 200, 255, ${alpha})`
          ctx.fillRect(screenX - 3, y, 6, 1)

          // Wave propagation
          if (!showParticles) {
            for (let x = slitX + 10; x < screenX - 10; x += 5) {
              const progress = (x - slitX) / (screenX - slitX)
              const waveIntensity = Math.sin(phase + time * 3 - progress * 10) * 0.5 + 0.5
              ctx.fillStyle = `rgba(100, 150, 255, ${waveIntensity * intensity * 0.15})`
              ctx.beginPath()
              ctx.arc(x, y, 2, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      }

      // Particle mode
      if (showParticles) {
        // Spawn particles
        if (Math.random() < 0.3 && particles.length < 100) {
          // Quantum interference - particle goes through both slits probabilistically
          const targetY = centerY + (Math.random() - 0.5) * height * 0.8
          particles.push({
            x: 30,
            y: centerY,
            targetY: targetY,
            speed: 2 + Math.random(),
            phase: Math.random() * Math.PI * 2,
          })
        }

        // Update and draw particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i]
          p.x += p.speed

          if (p.x < slitX) {
            // Moving towards slits
            ctx.fillStyle = isDark ? "#FFD700" : "#FFA500"
            ctx.beginPath()
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
            ctx.fill()
          } else if (p.x < screenX) {
            // After slits - quantum behavior
            ctx.fillStyle = isDark ? "rgba(100, 200, 255, 0.8)" : "rgba(50, 150, 200, 0.8)"
            ctx.beginPath()
            ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Hit screen - record position based on interference
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
            particles.splice(i, 1)
          }
        }

        // Draw hit pattern
        for (let i = 0; i < 100; i++) {
          const hits = particleHitsRef.current[i]
          if (hits > 0) {
            const intensity = Math.min(hits / 20, 1)
            ctx.fillStyle = `rgba(100, 200, 255, ${intensity})`
            ctx.fillRect(screenX - 3, (i / 100) * height, 6, height / 100)
          }
        }
      }

      // Detection screen
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(screenX, 10)
      ctx.lineTo(screenX, height - 10)
      ctx.stroke()
      ctx.fillStyle = isDark ? "#888" : "#666"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Screen", screenX, height - 5)

      // Legend
      ctx.fillStyle = isDark ? "#888" : "#666"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("d = " + slitSeparation + " (slit separation)", 10, height - 35)
      ctx.fillText("λ = " + wavelength + " (wavelength)", 10, height - 22)
      ctx.fillText("a = " + slitWidth + " (slit width)", 10, height - 9)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [slitSeparation, slitWidth, wavelength, showParticles, showWave, isDark])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded-lg"
        aria-label="Double-slit experiment: wave-particle duality"
        role="img"
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-blue-400" : "text-blue-700"}>d (slits)</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
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
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
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
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
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
            particleHitsRef.current = new Array(100).fill(0)
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
            particleHitsRef.current = new Array(100).fill(0)
          }}
          variant={showParticles ? "default" : "outline"}
          size="sm"
          className="flex-1 text-xs"
        >
          ⚡ Particles
        </Button>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark
            ? "bg-blue-900/20 border-blue-500/20"
            : "bg-blue-50 border-blue-200"
        }`}
      >
        <p className={isDark ? "text-gray-300" : "text-gray-700"}>
          <span className={isDark ? "text-blue-300" : "text-blue-700"}>Double-slit experiment:</span> Even
          individual particles create an interference pattern! This demonstrates wave-particle
          duality — matter behaves as both a particle and a wave.
        </p>
      </div>
    </div>
  )
}
