"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { latentHeat as _latentHeat, clapeyronClausius as _clapeyronClausius } from "@/lib/physics"
import { QueryParam } from "@/hooks/use-url-sync"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface PhaseTransitionVisualizationProps {
  isDark: boolean
}

type Phase = "solid" | "liquid" | "gas"

interface Molecule {
  x: number
  y: number
  vx: number
  vy: number
  phase: Phase
}

export function PhaseTransitionVisualization({
  isDark,
}: PhaseTransitionVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [temperature, setTemperature] = useState(() =>
    QueryParam.getNumber("phase.temp", 273)
  )
  const [pressure, setPressure] = useState(() =>
    QueryParam.getNumber("phase.pressure", 1)
  )
  const [moleculeCount, setMoleculeCount] = useState(() =>
    QueryParam.getNumber("phase.molecules", 80)
  )

  const moleculesRef = useRef<Molecule[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("phase.temp", temperature)
  }, [temperature])

  useEffect(() => {
    QueryParam.setNumber("phase.pressure", pressure)
  }, [pressure])

  useEffect(() => {
    QueryParam.setNumber("phase.molecules", moleculeCount)
  }, [moleculeCount])

  // Determine phase based on temperature and pressure
  const meltingPointAt1Atm = 273
  const boilingPointAt1Atm = 373
  
  const getPhase = useCallback((temp: number, press: number): Phase => {
    // Simplified phase diagram for water
    const _triplePointTemp = 273.16
    const _triplePointPress = 0.006
    const _criticalTemp = 647

    // Adjust melting/boiling points based on pressure (Clapeyron-Clausius approximation)
    const meltingPoint = meltingPointAt1Atm + (press - 1) * 0.01
    const boilingPoint = boilingPointAt1Atm + (press - 1) * 25

    if (temp < meltingPoint) return "solid"
    if (temp < boilingPoint) return "liquid"
    return "gas"
  }, [])

  const currentPhase = getPhase(temperature, pressure)

  // Initialize molecules
  useEffect(() => {
    const molecules: Molecule[] = []
    for (let i = 0; i < moleculeCount; i++) {
      molecules.push({
        x: Math.random(),
        y: Math.random(),
        vx: 0,
        vy: 0,
        phase: currentPhase,
      })
    }
    moleculesRef.current = molecules
  }, [moleculeCount, currentPhase])

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

      // Background with gradient based on temperature
      const tempRatio = (temperature - 200) / 500
      const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
      bgGradient.addColorStop(0, isDarkMode ? "#0a0a1a" : "#f0f4ff")
      bgGradient.addColorStop(
        1,
        tempRatio > 0.5
          ? isDarkMode ? "#1a0a0a" : "#fff0f0"
          : isDarkMode ? "#0a1a1a" : "#f0ffff"
      )
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      const margin = 50
      const containerWidth = width - margin * 2
      const containerHeight = height - margin * 2 - 60

      // Draw container
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#718096"
      ctx.lineWidth = 2
      ctx.strokeRect(margin, margin, containerWidth, containerHeight)

      // Phase-specific rendering
      const molecules = moleculesRef.current

      molecules.forEach((mol) => {
        // Update molecule based on phase
        if (mol.phase !== currentPhase) {
          mol.phase = currentPhase
          // Reposition based on new phase
          if (currentPhase === "solid") {
            mol.x = Math.random() * 0.9 + 0.05
            mol.y = Math.random() * 0.3 + 0.6
          } else if (currentPhase === "liquid") {
            mol.x = Math.random()
            mol.y = Math.random() * 0.5 + 0.4
          } else {
            mol.x = Math.random()
            mol.y = Math.random()
            mol.vx = (Math.random() - 0.5) * 0.05
            mol.vy = (Math.random() - 0.5) * 0.05
          }
        }

        // Physics based on phase
        if (currentPhase === "solid") {
          // Vibrational motion in lattice
          const baseX = margin + mol.x * containerWidth
          const baseY = margin + mol.y * containerHeight
          const vibration = Math.sin(timeRef.current * 10 + mol.x * 10) * 2
          mol.x = baseX + vibration
          mol.y = baseY + vibration

          // Draw lattice connections
          ctx.strokeStyle = isDarkMode ? "#4a5568" : "#cbd5e1"
          ctx.lineWidth = 0.5
          molecules.forEach((other, _i) => {
            const dx = mol.x - (margin + other.x * containerWidth)
            const dy = mol.y - (margin + other.y * containerHeight)
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 40 && dist > 0) {
              ctx.beginPath()
              ctx.moveTo(mol.x, mol.y)
              ctx.lineTo(margin + other.x * containerWidth, margin + other.y * containerHeight)
              ctx.stroke()
            }
          })
        } else if (currentPhase === "liquid") {
          // Flowing motion
          const speedMultiplier = Math.sqrt(temperature / 300) * 0.5
          mol.x += (Math.random() - 0.5) * speedMultiplier * delta * 0.02
          mol.y += (Math.random() - 0.5) * speedMultiplier * delta * 0.02

          // Keep in bottom half
          if (mol.y < 0.4) mol.y = 0.4 + Math.random() * 0.1
          if (mol.x < 0 || mol.x > 1) mol.x = Math.max(0, Math.min(1, mol.x))

          mol.x = margin + mol.x * containerWidth
          mol.y = margin + mol.y * containerHeight
        } else {
          // Gas - free motion
          const speedMultiplier = Math.sqrt(temperature / 300)
          mol.x += mol.vx * speedMultiplier * delta * 0.06
          mol.y += mol.vy * speedMultiplier * delta * 0.06

          // Bounce off walls
          if (mol.x <= 0 || mol.x >= 1) {
            mol.vx *= -1
            mol.x = Math.max(0.01, Math.min(0.99, mol.x))
          }
          if (mol.y <= 0 || mol.y >= 1) {
            mol.vy *= -1
            mol.y = Math.max(0.01, Math.min(0.99, mol.y))
          }

          mol.x = margin + mol.x * containerWidth
          mol.y = margin + mol.y * containerHeight
        }

        // Draw molecule
        const molTemp = currentPhase === "solid" ? 200 : currentPhase === "liquid" ? 300 : 500
        const hue = 200 - ((molTemp - 200) / 300) * 150
        ctx.fillStyle = `hsl(${String(hue)}, 70%, 55%)`
        ctx.beginPath()
        ctx.arc(mol.x, mol.y, currentPhase === "gas" ? 3 : 5, 0, Math.PI * 2)
        ctx.fill()

        // Velocity vectors for gas
        if (currentPhase === "gas") {
          ctx.strokeStyle = `hsla(${String(hue)}, 70%, 55%, 0.4)`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(mol.x, mol.y)
          ctx.lineTo(mol.x + mol.vx * 30, mol.y + mol.vy * 30)
          ctx.stroke()
        }
      })

      // Phase diagram (small)
      const diagramX = width - 180
      const diagramY = margin
      const diagramW = 160
      const diagramH = 120

      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(diagramX, diagramY, diagramW, diagramH)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(diagramX, diagramY, diagramW, diagramH)

      // Phase diagram axes
      ctx.strokeStyle = isDarkMode ? "#718096" : "#4a5568"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(diagramX + 30, diagramY + 20)
      ctx.lineTo(diagramX + 30, diagramY + diagramH - 20)
      ctx.lineTo(diagramX + diagramW - 20, diagramY + diagramH - 20)
      ctx.stroke()

      // Phase regions
      ctx.fillStyle = "rgba(59, 130, 246, 0.2)" // Solid - blue
      ctx.beginPath()
      ctx.moveTo(diagramX + 30, diagramY + diagramH - 20)
      ctx.lineTo(diagramX + 50, diagramY + 60)
      ctx.lineTo(diagramX + 30, diagramY + 60)
      ctx.fill()

      ctx.fillStyle = "rgba(34, 197, 94, 0.2)" // Liquid - green
      ctx.beginPath()
      ctx.moveTo(diagramX + 50, diagramY + 60)
      ctx.lineTo(diagramX + 80, diagramY + 30)
      ctx.lineTo(diagramX + 30, diagramY + 60)
      ctx.lineTo(diagramX + 30, diagramY + diagramH - 20)
      ctx.fill()

      ctx.fillStyle = "rgba(239, 68, 68, 0.2)" // Gas - red
      ctx.beginPath()
      ctx.moveTo(diagramX + 50, diagramY + 60)
      ctx.lineTo(diagramX + diagramW - 20, diagramY + diagramH - 20)
      ctx.lineTo(diagramX + diagramW - 20, diagramY + 30)
      ctx.lineTo(diagramX + 80, diagramY + 30)
      ctx.fill()

      // Current point
      const pointX = diagramX + 30 + ((pressure - 0.5) / 2) * (diagramW - 50)
      const pointY = diagramY + diagramH - 20 - ((temperature - 200) / 500) * (diagramH - 40)
      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.arc(pointX, pointY, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = "#fff"
      ctx.lineWidth = 1
      ctx.stroke()

      // Labels
      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Фазовая диаграмма", diagramX + diagramW / 2, diagramY + 15)

      ctx.font = "9px monospace"
      ctx.fillStyle = "#3b82f6"
      ctx.fillText("Тв", diagramX + 40, diagramY + 90)
      ctx.fillStyle = "#22c55e"
      ctx.fillText("Ж", diagramX + 55, diagramY + 70)
      ctx.fillStyle = "#ef4444"
      ctx.fillText("Г", diagramX + 120, diagramY + 50)

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(margin, height - 50, 280, 40)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(margin, height - 50, 280, 40)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 13px monospace"
      ctx.textAlign = "left"
      ctx.fillText(`Фаза: ${currentPhase === "solid" ? "Твёрдая" : currentPhase === "liquid" ? "Жидкая" : "Газ"}`, margin + 10, height - 28)

      // Phase transition info
      const transitionTemp = currentPhase === "solid" ? meltingPointAt1Atm : boilingPointAt1Atm
      ctx.font = "11px monospace"
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.fillText(
        `След. переход: ${String(transitionTemp)} K (${currentPhase === "solid" ? "плавление" : "испарение"})`,
        margin + 150,
        height - 28
      )
    },
    [temperature, pressure, currentPhase]
  )

  return (
    <div className="relative w-full h-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 items-end">
        <Card className="bg-background/90 backdrop-blur border-primary/20">
          <CardContent className="p-4 space-y-3 min-w-[340px]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Температура</span>
                <span className="text-sm text-muted-foreground">{temperature} K</span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={([v]) => setTemperature(v)}
                min={200}
                max={700}
                step={10}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Давление</span>
                <span className="text-sm text-muted-foreground">{pressure.toFixed(2)} атм</span>
              </div>
              <Slider
                value={[pressure]}
                onValueChange={([v]) => setPressure(v)}
                min={0.1}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Молекулы</span>
                <span className="text-sm text-muted-foreground">{moleculeCount}</span>
              </div>
              <Slider
                value={[moleculeCount]}
                onValueChange={([v]) => setMoleculeCount(v)}
                min={20}
                max={150}
                step={10}
                className="w-full"
              />
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
