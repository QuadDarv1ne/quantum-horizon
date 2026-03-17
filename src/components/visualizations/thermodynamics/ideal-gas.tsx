"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { idealGasLaw, rmsVelocity, averageKineticEnergy } from "@/lib/physics"
import { k_B, N_A } from "@/lib/constants"
import { QueryParam } from "@/hooks/use-url-sync"
import {
  useVisualizationStore,
  selectIsPlaying,
  selectAnimationSpeed,
} from "@/stores/visualization-store"

interface IdealGasVisualizationProps {
  isDark: boolean
}

interface Molecule {
  x: number
  y: number
  vx: number
  vy: number
  vz: number
}

export function IdealGasVisualization({ isDark }: IdealGasVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [pressure, setPressure] = useState(() => QueryParam.getNumber("gas.pressure", 1))
  const [volume, setVolume] = useState(() => QueryParam.getNumber("gas.volume", 1))
  const [temperature, setTemperature] = useState(() => QueryParam.getNumber("gas.temp", 300))
  const [moles, setMoles] = useState(() => QueryParam.getNumber("gas.moles", 1))
  const [showVelocities, setShowVelocities] = useState(() =>
    QueryParam.getBoolean("gas.velocities", true)
  )
  const [showCollisions, setShowCollisions] = useState(() =>
    QueryParam.getBoolean("gas.collisions", false)
  )

  const moleculesRef = useRef<Molecule[]>([])
  const collisionsRef = useRef<Array<{ x: number; y: number; time: number }>>([])
  const timeRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("gas.pressure", pressure)
  }, [pressure])

  useEffect(() => {
    QueryParam.setNumber("gas.volume", volume)
  }, [volume])

  useEffect(() => {
    QueryParam.setNumber("gas.temp", temperature)
  }, [temperature])

  useEffect(() => {
    QueryParam.setNumber("gas.moles", moles)
  }, [moles])

  useEffect(() => {
    QueryParam.setBoolean("gas.velocities", showVelocities)
  }, [showVelocities])

  useEffect(() => {
    QueryParam.setBoolean("gas.collisions", showCollisions)
  }, [showCollisions])

  // Initialize molecules based on moles (scaled for visualization)
  useEffect(() => {
    const moleculeCount = Math.min(Math.floor(moles * 30), 150)
    const molecules: Molecule[] = []
    for (let i = 0; i < moleculeCount; i++) {
      const speed = Math.sqrt((3 * k_B * temperature) / (28e-3 / N_A))
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      molecules.push({
        x: Math.random(),
        y: Math.random(),
        vx: speed * Math.sin(phi) * Math.cos(theta) * 0.001,
        vy: speed * Math.sin(phi) * Math.sin(theta) * 0.001,
        vz: speed * Math.cos(phi) * 0.001,
      })
    }
    moleculesRef.current = molecules
  }, [moles, temperature])

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

      const margin = 60
      const containerWidth = (width - margin * 2) * volume
      const containerHeight = height - margin * 2 - 80
      const containerX = margin + (width - margin * 2 - containerWidth) / 2
      const containerY = margin

      // Draw container (piston visualization)
      ctx.fillStyle = isDarkMode ? "#1e293b" : "#e2e8f0"
      ctx.fillRect(containerX, containerY, containerWidth, containerHeight)

      // Container walls
      ctx.strokeStyle = isDarkMode ? "#475569" : "#64748b"
      ctx.lineWidth = 3
      ctx.strokeRect(containerX, containerY, containerWidth, containerHeight)

      // Piston head (movable top)
      ctx.fillStyle = "#64748b"
      ctx.fillRect(containerX - 5, containerY - 10, containerWidth + 10, 10)

      // Pressure indicator on piston
      ctx.fillStyle = "#f59e0b"
      ctx.fillRect(containerX + containerWidth / 2 - 3, containerY - 25, 6, 15)

      // Update and draw molecules
      const molecules = moleculesRef.current
      const speedMultiplier = Math.sqrt(temperature / 300)

      molecules.forEach((mol, _i) => {
        // Update position
        mol.x += mol.vx * speedMultiplier * delta * 0.00006
        mol.y += mol.vy * speedMultiplier * delta * 0.00006

        // Normalize to container
        const normX = ((mol.x % 1) + 1) % 1
        const normY = ((mol.y % 1) + 1) % 1

        // Check wall collisions
        let collided = false
        if (normX <= 0 || normX >= 1) {
          mol.vx *= -1
          collided = true
        }
        if (normY <= 0 || normY >= 1) {
          mol.vy *= -1
          collided = true
        }

        if (collided && showCollisions) {
          const px = containerX + normX * containerWidth
          const py = containerY + normY * containerHeight
          collisionsRef.current.push({ x: px, y: py, time: timeRef.current })
        }

        // Draw molecule
        const molX = containerX + normX * containerWidth
        const molY = containerY + normY * containerHeight

        // Color based on speed
        const speed = Math.sqrt(mol.vx * mol.vx + mol.vy * mol.vy)
        const avgSpeed = Math.sqrt((3 * k_B * temperature) / (28e-3 / N_A)) * 0.001
        const speedRatio = speed / avgSpeed
        const hue = 200 - Math.min(speedRatio, 1.5) * 120
        ctx.fillStyle = `hsl(${String(hue)}, 70%, 55%)`

        ctx.beginPath()
        ctx.arc(molX, molY, 4, 0, Math.PI * 2)
        ctx.fill()

        // Velocity vector
        if (showVelocities) {
          ctx.strokeStyle = `hsla(${String(hue)}, 70%, 55%, 0.5)`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(molX, molY)
          ctx.lineTo(molX + mol.vx * 50, molY + mol.vy * 50)
          ctx.stroke()
        }
      })

      // Draw collision effects
      collisionsRef.current = collisionsRef.current.filter((c) => {
        const age = timeRef.current - c.time
        if (age > 0.5) return false
        const alpha = 1 - age / 0.5
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha.toFixed(2)})`
        ctx.beginPath()
        ctx.arc(c.x, c.y, 8 * alpha, 0, Math.PI * 2)
        ctx.fill()
        return true
      })

      // PV = nRT verification
      const result = idealGasLaw(pressure * 101325, volume * 0.0224, moles, temperature)

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(width - 260, margin, 240, 180)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(width - 260, margin, 240, 180)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 13px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Идеальный газ", width - 250, margin + 22)

      ctx.font = "11px monospace"
      ctx.fillText(`PV = nRT`, width - 250, margin + 42)
      ctx.fillText(`n = ${moles.toFixed(2)} моль`, width - 250, margin + 60)
      ctx.fillText(`T = ${temperature.toFixed(0)} K`, width - 250, margin + 78)
      ctx.fillText(`P = ${pressure.toFixed(2)} атм`, width - 250, margin + 96)
      ctx.fillText(`V = ${volume.toFixed(2)} × 22.4 л`, width - 250, margin + 114)

      // Equation check
      ctx.fillStyle = result.matches ? "#22c55e" : "#ef4444"
      ctx.font = "bold 11px monospace"
      ctx.fillText(
        result.matches ? "✓ Уравнение выполняется" : "✗ Дисбаланс",
        width - 250,
        margin + 138
      )

      // RMS velocity
      const vRms = rmsVelocity(temperature, 28e-3 / N_A)
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.font = "10px monospace"
      ctx.fillText(`v_rms = ${(vRms / 100).toFixed(0)} м/с`, width - 250, margin + 158)

      // Average kinetic energy
      const avgKE = averageKineticEnergy(temperature)
      ctx.fillText(`⟨E⟩ = ${(avgKE * 1e21).toFixed(2)} × 10⁻²¹ Дж`, width - 250, margin + 172)

      // Maxwell-Boltzmann distribution sketch
      const distX = margin
      const distY = height - 70
      const distW = 200
      const distH = 50

      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.9)" : "rgba(255, 255, 255, 0.9)"
      ctx.fillRect(distX, distY, distW, distH)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(distX, distY, distW, distH)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "10px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Распределение Максвелла-Больцмана", distX + distW / 2, distY + 12)

      // Draw distribution curve
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      for (let i = 0; i < distW; i++) {
        const v = (i / distW) * 3
        const mpv = Math.sqrt((2 * k_B * temperature) / (28e-3 / N_A)) * 0.001
        const x = distX + i
        const y = distY + distH - 10 - Math.exp(-Math.pow(v - mpv * 100, 2) / (mpv * 50)) * 35
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    },
    [pressure, volume, temperature, moles, showVelocities, showCollisions]
  )

  return (
    <div className="relative h-full w-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-end gap-4">
        <Card className="bg-background/90 border-primary/20 backdrop-blur">
          <CardContent className="min-w-[360px] space-y-3 p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Давление</span>
                <span className="text-muted-foreground text-sm">{pressure.toFixed(2)} атм</span>
              </div>
              <Slider
                value={[pressure]}
                onValueChange={([v]) => {
                  setPressure(v)
                }}
                min={0.1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Объём</span>
                <span className="text-muted-foreground text-sm">{volume.toFixed(2)} × V₀</span>
              </div>
              <Slider
                value={[volume]}
                onValueChange={([v]) => {
                  setVolume(v)
                }}
                min={0.3}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Температура</span>
                <span className="text-muted-foreground text-sm">{temperature} K</span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={([v]) => {
                  setTemperature(v)
                }}
                min={100}
                max={600}
                step={20}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Количество</span>
                <span className="text-muted-foreground text-sm">{moles.toFixed(2)} моль</span>
              </div>
              <Slider
                value={[moles]}
                onValueChange={([v]) => {
                  setMoles(v)
                }}
                min={0.5}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowVelocities(!showVelocities)
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  showVelocities
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Скорости
              </button>
              <button
                onClick={() => {
                  setShowCollisions(!showCollisions)
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  showCollisions
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Столкновения
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
