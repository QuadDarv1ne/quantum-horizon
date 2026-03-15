"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { entropyChange, idealGasEntropy, averageKineticEnergy } from "@/lib/physics"
import { k_B } from "@/lib/constants"
import { QueryParam } from "@/hooks/use-url-sync"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface EntropyVisualizationProps {
  isDark: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  side: "left" | "right"
}

export function EntropyVisualization({ isDark }: EntropyVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [particleCount, setParticleCount] = useState(() =>
    QueryParam.getNumber("entropy.particles", 100)
  )
  const [temperature, setTemperature] = useState(() =>
    QueryParam.getNumber("entropy.temp", 300)
  )
  const [showBarrier, setShowBarrier] = useState(() =>
    QueryParam.getBoolean("entropy.barrier", true)
  )
  const [isMixed, setIsMixed] = useState(false)

  const particlesRef = useRef<Particle[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("entropy.particles", particleCount)
  }, [particleCount])

  useEffect(() => {
    QueryParam.setNumber("entropy.temp", temperature)
  }, [temperature])

  useEffect(() => {
    QueryParam.setBoolean("entropy.barrier", showBarrier)
  }, [showBarrier])

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * 0.5,
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        side: "left",
      })
    }
    particlesRef.current = particles
    setIsMixed(false)
  }, [particleCount])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      timeRef.current += delta * 0.001
      const isDarkMode = _isDark

      // Background
      ctx.fillStyle = isDarkMode ? "#0a0a1a" : "#f0f4ff"
      ctx.fillRect(0, 0, width, height)

      const margin = 40
      const boxWidth = width - margin * 2
      const boxHeight = height - margin * 2 - 80

      // Draw container box
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#718096"
      ctx.lineWidth = 2
      ctx.strokeRect(margin, margin, boxWidth, boxHeight)

      // Draw barrier
      if (showBarrier || !isMixed) {
        ctx.strokeStyle = "#ff6b35"
        ctx.lineWidth = 3
        ctx.beginPath()
        ctx.moveTo(margin + boxWidth / 2, margin)
        ctx.lineTo(margin + boxWidth / 2, margin + boxHeight)
        ctx.stroke()
      }

      // Update and draw particles
      const speedMultiplier = Math.sqrt(temperature / 300)
      particlesRef.current.forEach((particle, i) => {
        if (!showBarrier || isMixed) {
          // Remove barrier - particles can move freely
          particle.x += particle.vx * speedMultiplier * delta * 0.06
          particle.y += particle.vy * speedMultiplier * delta * 0.06

          // Bounce off walls
          if (particle.x <= 0 || particle.x >= 1) particle.vx *= -1
          if (particle.y <= 0 || particle.y >= 1) particle.vy *= -1

          // Keep in bounds
          particle.x = Math.max(0.01, Math.min(0.99, particle.x))
          particle.y = Math.max(0.01, Math.min(0.99, particle.y))
        } else {
          // With barrier - particles stay on their side
          particle.x += particle.vx * speedMultiplier * delta * 0.06
          particle.y += particle.vy * speedMultiplier * delta * 0.06

          if (particle.x <= 0 || particle.x >= 0.5) particle.vx *= -1
          if (particle.y <= 0 || particle.y >= 1) particle.vy *= -1

          particle.x = Math.max(0.01, Math.min(0.49, particle.x))
          particle.y = Math.max(0.01, Math.min(0.99, particle.y))
        }

        const px = margin + particle.x * boxWidth
        const py = margin + particle.y * boxHeight

        // Color based on velocity (temperature)
        const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
        const normalizedSpeed = Math.min(speed / 0.03, 1)
        const hue = 200 - normalizedSpeed * 150 // Blue (cold) to Red (hot)
        ctx.fillStyle = `hsl(${hue}, 70%, 55%)`

        ctx.beginPath()
        ctx.arc(px, py, 4, 0, Math.PI * 2)
        ctx.fill()

        // Velocity vector
        ctx.strokeStyle = `hsla(${hue}, 70%, 55%, 0.4)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(px, py)
        ctx.lineTo(px + particle.vx * boxWidth * 10, py + particle.vy * boxHeight * 10)
        ctx.stroke()
      })

      // Calculate entropy
      const leftParticles = particlesRef.current.filter((p) => p.x < 0.5).length
      const rightParticles = particlesRef.current.length - leftParticles
      const fraction = leftParticles / particlesRef.current.length
      const mixing = -fraction * Math.log2(fraction + 1e-10) - (1 - fraction) * Math.log2(1 - fraction + 1e-10)
      const maxMixing = 1 // Maximum when equally mixed

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(width - 240, margin, 220, 140)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(width - 240, margin, 220, 140)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 13px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Энтропия", width - 230, margin + 22)

      ctx.font = "11px monospace"
      ctx.fillText(`N = ${particleCount} частиц`, width - 230, margin + 42)
      ctx.fillText(`T = ${temperature} K`, width - 230, margin + 60)

      // Entropy value
      const entropy = mixing / maxMixing
      ctx.fillText(`S/S_max = ${entropy.toFixed(3)}`, width - 230, margin + 82)

      // State indicator
      const state = entropy > 0.9 ? "Максимальная" : entropy > 0.5 ? "Смешивание" : "Упорядочено"
      ctx.fillStyle = entropy > 0.9 ? "#22c55e" : entropy > 0.5 ? "#f59e0b" : "#ef4444"
      ctx.fillText(`Состояние: ${state}`, width - 230, margin + 102)

      // Average kinetic energy
      const avgKE = averageKineticEnergy(temperature)
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.fillText(
        `⟨E⟩ = ${(avgKE * 1e21).toFixed(2)} × 10⁻²¹ Дж`,
        width - 230,
        margin + 122
      )

      // Entropy bar
      const barWidth = 180
      const barHeight = 12
      const barX = width - 220
      const barY = margin + 125

      ctx.fillStyle = isDarkMode ? "#1e293b" : "#e2e8f0"
      ctx.fillRect(barX, barY, barWidth, barHeight)

      const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0)
      gradient.addColorStop(0, "#ef4444")
      gradient.addColorStop(0.5, "#f59e0b")
      gradient.addColorStop(1, "#22c55e")
      ctx.fillStyle = gradient
      ctx.fillRect(barX, barY, barWidth * entropy, barHeight)

      ctx.strokeStyle = isDarkMode ? "#475569" : "#cbd5e1"
      ctx.strokeRect(barX, barY, barWidth, barHeight)
    },
    [particleCount, temperature, showBarrier, isMixed]
  )

  return (
    <div className="relative w-full h-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 items-end">
        <Card className="bg-background/90 backdrop-blur border-primary/20">
          <CardContent className="p-4 space-y-3 min-w-[320px]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Частицы</span>
                <span className="text-sm text-muted-foreground">{particleCount}</span>
              </div>
              <Slider
                value={[particleCount]}
                onValueChange={([v]) => setParticleCount(v)}
                min={20}
                max={300}
                step={10}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Температура</span>
                <span className="text-sm text-muted-foreground">{temperature} K</span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={([v]) => setTemperature(v)}
                min={100}
                max={1000}
                step={50}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setShowBarrier(!showBarrier)
                  if (!showBarrier && !isMixed) {
                    // Reset particles to left side when barrier is shown
                    particlesRef.current.forEach((p) => {
                      p.x = Math.random() * 0.5
                      p.side = "left"
                    })
                    setIsMixed(false)
                  }
                }}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showBarrier ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Перегородка
              </button>
              <button
                onClick={() => {
                  setIsMixed(true)
                  setShowBarrier(false)
                }}
                className="px-3 py-1.5 rounded text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Убрать перегородку
              </button>
              <button
                onClick={() => {
                  setIsMixed(false)
                  setShowBarrier(true)
                  particlesRef.current.forEach((p) => {
                    p.x = Math.random() * 0.5
                    p.side = "left"
                  })
                }}
                className="px-3 py-1.5 rounded text-xs font-medium bg-muted hover:bg-muted/80"
              >
                Сброс
              </button>
            </div>
          </CardContent>
        </Card>
        <VisualizationControls
          isPlaying={isPlaying}
          animationSpeed={animationSpeed}
          onTogglePlay={togglePlaying}
          onSpeedChange={setAnimationSpeed}
          isDark={isDark}
        />
      </div>
    </div>
  )
}
