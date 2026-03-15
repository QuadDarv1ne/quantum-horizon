"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { carnotEfficiency, isothermalWork, adiabaticWork } from "@/lib/physics"
import { QueryParam } from "@/hooks/use-url-sync"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface CarnotEngineVisualizationProps {
  isDark: boolean
}

interface EngineState {
  volume: number
  pressure: number
  temperature: number
  phase: number // 0-3 for the 4 phases
}

export function CarnotEngineVisualization({ isDark }: CarnotEngineVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [tempHot, setTempHot] = useState(() =>
    QueryParam.getNumber("carnot.tempHot", 500)
  )
  const [tempCold, setTempCold] = useState(() =>
    QueryParam.getNumber("carnot.tempCold", 300)
  )
  const [compressionRatio, setCompressionRatio] = useState(() =>
    QueryParam.getNumber("carnot.compression", 3)
  )
  const [isRunning, setIsRunning] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)

  const engineStateRef = useRef<EngineState>({
    volume: 1,
    pressure: 1,
    temperature: tempCold,
    phase: 0,
  })
  const timeRef = useRef(0)
  const animationRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("carnot.tempHot", tempHot)
  }, [tempHot])

  useEffect(() => {
    QueryParam.setNumber("carnot.tempCold", tempCold)
  }, [tempCold])

  useEffect(() => {
    QueryParam.setNumber("carnot.compression", compressionRatio)
  }, [compressionRatio])

  // Animation loop
  useEffect(() => {
    if (!isRunning) return

    const animate = () => {
      animationRef.current += 0.02
      const progress = (animationRef.current % 4) 

      const state = engineStateRef.current
      const gamma = 1.4 // For diatomic gas
      const V1 = 1
      const V2 = compressionRatio
      const V3 = V2 * Math.pow(tempHot / tempCold, 1 / (gamma - 1))
      const V4 = V1 * Math.pow(tempHot / tempCold, 1 / (gamma - 1))

      if (progress < 1) {
        // Phase 1: Isothermal expansion (hot reservoir)
        const t = progress
        state.volume = V1 + t * (V2 - V1)
        state.temperature = tempHot
        state.pressure = (state.temperature / tempHot) / state.volume
        state.phase = 0
      } else if (progress < 2) {
        // Phase 2: Adiabatic expansion
        const t = progress - 1
        state.volume = V2 * Math.pow(Math.pow(V3 / V2, t), 1)
        state.temperature = tempHot * Math.pow(V2 / state.volume, gamma - 1)
        state.pressure = Math.pow(1 / state.volume, gamma)
        state.phase = 1
      } else if (progress < 3) {
        // Phase 3: Isothermal compression (cold reservoir)
        const t = progress - 2
        state.volume = V3 - t * (V3 - V4)
        state.temperature = tempCold
        state.pressure = (state.temperature / tempCold) / state.volume
        state.phase = 2
      } else {
        // Phase 4: Adiabatic compression
        const t = progress - 3
        state.volume = V4 * Math.pow(Math.pow(V1 / V4, t), 1)
        state.temperature = tempCold * Math.pow(V4 / state.volume, gamma - 1)
        state.pressure = Math.pow(1 / state.volume, gamma)
        state.phase = 3
      }

      setCurrentPhase(state.phase)
      animationRef.current = progress
    }

    const intervalId = setInterval(animate, 50)
    return () => clearInterval(intervalId)
  }, [isRunning, tempHot, tempCold, compressionRatio])

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

      const margin = 50
      const diagramWidth = width - margin * 2 - 280
      const diagramHeight = height - margin * 2 - 60
      const diagramX = margin
      const diagramY = margin

      // Draw PV diagram background
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(diagramX, diagramY, diagramWidth, diagramHeight)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(diagramX, diagramY, diagramWidth, diagramHeight)

      // Axes
      ctx.strokeStyle = isDarkMode ? "#718096" : "#4a5568"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(diagramX + 50, diagramY + 20)
      ctx.lineTo(diagramX + 50, diagramY + diagramHeight - 30)
      ctx.lineTo(diagramX + diagramWidth - 20, diagramY + diagramHeight - 30)
      ctx.stroke()

      // Labels
      ctx.fillStyle = isDarkMode ? "#a0aec0" : "#4a5568"
      ctx.font = "11px monospace"
      ctx.textAlign = "center"
      ctx.fillText("V (объём)", diagramX + diagramWidth / 2, diagramY + diagramHeight - 10)
      ctx.save()
      ctx.translate(diagramX + 20, diagramY + diagramHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText("P (давление)", 0, 0)
      ctx.restore()

      // Draw Carnot cycle
      const gamma = 1.4
      const V1 = 1
      const V2 = compressionRatio
      const V3 = V2 * Math.pow(tempHot / tempCold, 1 / (gamma - 1))
      const V4 = V1 * Math.pow(tempHot / tempCold, 1 / (gamma - 1))
      const P1 = tempHot / V1
      const P2 = tempHot / V2
      const P3 = tempCold / V3
      const P4 = tempCold / V4

      const scaleX = (diagramWidth - 80) / (V3 - V1 + 0.5)
      const scaleY = (diagramHeight - 60) / (P1 - P3 + 0.5)

      const toScreenX = (v: number) => diagramX + 50 + (v - V1) * scaleX
      const toScreenY = (p: number) => diagramY + diagramHeight - 30 - (p - P3) * scaleY

      // Isotherms (dashed)
      ctx.strokeStyle = isDarkMode ? "rgba(59, 130, 246, 0.3)" : "rgba(59, 130, 246, 0.2)"
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      
      // Hot isotherm
      ctx.beginPath()
      for (let v = V1; v <= V2 * 1.5; v += 0.1) {
        const p = tempHot / v
        const x = toScreenX(v)
        const y = toScreenY(p)
        if (v === V1) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Cold isotherm
      ctx.beginPath()
      for (let v = V4 * 0.5; v <= V3; v += 0.1) {
        const p = tempCold / v
        const x = toScreenX(v)
        const y = toScreenY(p)
        if (v === V4 * 0.5) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
      ctx.setLineDash([])

      // Carnot cycle path
      ctx.strokeStyle = "#ef4444"
      ctx.lineWidth = 2.5
      ctx.beginPath()
      
      // 1->2: Isothermal expansion
      ctx.moveTo(toScreenX(V1), toScreenY(P1))
      for (let v = V1; v <= V2; v += 0.05) {
        ctx.lineTo(toScreenX(v), toScreenY(tempHot / v))
      }
      
      // 2->3: Adiabatic expansion
      for (let v = V2; v <= V3; v += 0.05) {
        const p = tempHot * Math.pow(V2 / v, gamma) / v
        ctx.lineTo(toScreenX(v), toScreenY(p))
      }
      
      // 3->4: Isothermal compression
      for (let v = V3; v >= V4; v -= 0.05) {
        ctx.lineTo(toScreenX(v), toScreenY(tempCold / v))
      }
      
      // 4->1: Adiabatic compression
      for (let v = V4; v >= V1; v -= 0.05) {
        const p = tempCold * Math.pow(V4 / v, gamma) / v
        ctx.lineTo(toScreenX(v), toScreenY(p))
      }
      
      ctx.closePath()
      ctx.stroke()

      // Fill cycle area
      ctx.fillStyle = "rgba(239, 68, 68, 0.2)"
      ctx.fill()

      // Current position indicator
      if (isRunning) {
        const state = engineStateRef.current
        const cx = toScreenX(state.volume)
        const cy = toScreenY(state.pressure)

        ctx.fillStyle = "#f59e0b"
        ctx.beginPath()
        ctx.arc(cx, cy, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = "#fff"
        ctx.lineWidth = 2
        ctx.stroke()

        // Pulse effect
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.5 - (timeRef.current % 1) * 0.5})`
        ctx.beginPath()
        ctx.arc(cx, cy, 8 + (timeRef.current % 1) * 8, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Corner labels
      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 10px monospace"
      ctx.textAlign = "center"
      ctx.fillText("1", toScreenX(V1), toScreenY(P1) - 10)
      ctx.fillText("2", toScreenX(V2), toScreenY(P2) - 10)
      ctx.fillText("3", toScreenX(V3), toScreenY(P3) + 15)
      ctx.fillText("4", toScreenX(V4), toScreenY(P4) + 15)

      // Phase labels
      ctx.font = "9px monospace"
      ctx.fillStyle = "#3b82f6"
      ctx.fillText("Изотерма", toScreenX((V1 + V2) / 2), toScreenY(tempHot / ((V1 + V2) / 2)) - 15)
      ctx.fillStyle = "#22c55e"
      ctx.fillText("Адиабата", toScreenX((V2 + V3) / 2) + 30, toScreenY(tempHot * Math.pow(V2 / ((V2 + V3) / 2), gamma) / ((V2 + V3) / 2)) - 15)
      ctx.fillStyle = "#3b82f6"
      ctx.fillText("Изотерма", toScreenX((V3 + V4) / 2), toScreenY(tempCold / ((V3 + V4) / 2)) + 20)
      ctx.fillStyle = "#22c55e"
      ctx.fillText("Адиабата", toScreenX((V4 + V1) / 2) - 30, toScreenY(tempCold * Math.pow(V4 / ((V4 + V1) / 2), gamma) / ((V4 + V1) / 2)) + 20)

      // Engine visualization (right side)
      const engineX = diagramX + diagramWidth + 40
      const engineY = diagramY + 50
      const engineSize = 120

      // Hot reservoir
      ctx.fillStyle = "#ef4444"
      ctx.beginPath()
      ctx.arc(engineX + engineSize / 2, engineY, 40, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = isDarkMode ? "#fff" : "#000"
      ctx.font = "bold 11px monospace"
      ctx.textAlign = "center"
      ctx.fillText(`T_h`, engineX + engineSize / 2, engineY - 5)
      ctx.font = "10px monospace"
      ctx.fillText(`${tempHot}K`, engineX + engineSize / 2, engineY + 12)

      // Cold reservoir
      ctx.fillStyle = "#3b82f6"
      ctx.beginPath()
      ctx.arc(engineX + engineSize / 2, engineY + engineSize, 40, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = isDarkMode ? "#fff" : "#000"
      ctx.fillText(`T_c`, engineX + engineSize / 2, engineY + engineSize - 5)
      ctx.fillText(`${tempCold}K`, engineX + engineSize / 2, engineY + engineSize + 12)

      // Engine (circle in middle)
      ctx.fillStyle = "#f59e0b"
      ctx.beginPath()
      ctx.arc(engineX + engineSize / 2, engineY + engineSize / 2, 25, 0, Math.PI * 2)
      ctx.fill()

      // Heat flow arrows
      if (isRunning) {
        const arrowPhase = currentPhase
        ctx.strokeStyle = "#f59e0b"
        ctx.lineWidth = 3
        ctx.beginPath()
        
        if (arrowPhase === 0) {
          // Heat from hot reservoir
          ctx.moveTo(engineX + engineSize / 2, engineY + 45)
          ctx.lineTo(engineX + engineSize / 2, engineY + engineSize / 2 - 30)
        } else if (arrowPhase === 1) {
          // Work output
          ctx.arc(engineX + engineSize / 2, engineY + engineSize / 2, 35, -Math.PI / 2, Math.PI / 2)
        } else if (arrowPhase === 2) {
          // Heat to cold reservoir
          ctx.moveTo(engineX + engineSize / 2, engineY + engineSize / 2 + 30)
          ctx.lineTo(engineX + engineSize / 2, engineY + engineSize - 45)
        } else {
          // Compression
          ctx.arc(engineX + engineSize / 2, engineY + engineSize / 2, 35, Math.PI / 2, -Math.PI / 2)
        }
        ctx.stroke()

        // Arrow head
        ctx.fillStyle = "#f59e0b"
        ctx.beginPath()
        if (arrowPhase === 0) {
          ctx.moveTo(engineX + engineSize / 2 - 5, engineY + engineSize / 2 - 20)
          ctx.lineTo(engineX + engineSize / 2 + 5, engineY + engineSize / 2 - 20)
          ctx.lineTo(engineX + engineSize / 2, engineY + engineSize / 2 - 30)
        } else if (arrowPhase === 2) {
          ctx.moveTo(engineX + engineSize / 2 - 5, engineY + engineSize - 35)
          ctx.lineTo(engineX + engineSize / 2 + 5, engineY + engineSize - 35)
          ctx.lineTo(engineX + engineSize / 2, engineY + engineSize - 25)
        }
        ctx.fill()
      }

      // Efficiency panel
      const efficiency = carnotEfficiency(tempCold, tempHot)
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(engineX - 20, engineY + engineSize + 30, 200, 100)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(engineX - 20, engineY + engineSize + 30, 200, 100)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 12px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Эффективность Карно", engineX - 10, engineY + engineSize + 50)

      ctx.font = "11px monospace"
      ctx.fillText(`η = 1 - T_c/T_h`, engineX - 10, engineY + engineSize + 70)
      ctx.fillText(`η = ${efficiency.toFixed(3)} (${(efficiency * 100).toFixed(1)}%)`, engineX - 10, engineY + engineSize + 90)

      // Efficiency bar
      const barWidth = 160
      const barHeight = 10
      const barX = engineX - 10
      const barY = engineY + engineSize + 105
      ctx.fillStyle = isDarkMode ? "#1e293b" : "#e2e8f0"
      ctx.fillRect(barX, barY, barWidth, barHeight)
      ctx.fillStyle = efficiency > 0.4 ? "#22c55e" : efficiency > 0.2 ? "#f59e0b" : "#ef4444"
      ctx.fillRect(barX, barY, barWidth * efficiency, barHeight)
      ctx.strokeStyle = isDarkMode ? "#475569" : "#cbd5e1"
      ctx.strokeRect(barX, barY, barWidth, barHeight)
    },
    [tempHot, tempCold, compressionRatio, isRunning, currentPhase]
  )

  return (
    <div className="relative w-full h-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 items-end">
        <Card className="bg-background/90 backdrop-blur border-primary/20">
          <CardContent className="p-4 space-y-3 min-w-[340px]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">T_гор (нагреватель)</span>
                <span className="text-sm text-muted-foreground">{tempHot} K</span>
              </div>
              <Slider
                value={[tempHot]}
                onValueChange={([v]) => setTempHot(v)}
                min={350}
                max={800}
                step={25}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">T_хол (охладитель)</span>
                <span className="text-sm text-muted-foreground">{tempCold} K</span>
              </div>
              <Slider
                value={[tempCold]}
                onValueChange={([v]) => setTempCold(v)}
                min={200}
                max={tempHot - 50}
                step={25}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Степень сжатия</span>
                <span className="text-sm text-muted-foreground">{compressionRatio}×</span>
              </div>
              <Slider
                value={[compressionRatio]}
                onValueChange={([v]) => setCompressionRatio(v)}
                min={2}
                max={5}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                  isRunning ? "bg-red-500 text-white hover:bg-red-600" : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isRunning ? "Стоп" : "Старт"}
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
