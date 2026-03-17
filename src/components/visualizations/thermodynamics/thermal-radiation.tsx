"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { plancksLaw, wiensDisplacementLaw, stefanBoltzmannLaw } from "@/lib/physics"
import { QueryParam } from "@/hooks/use-url-sync"
import {
  useVisualizationStore,
  selectIsPlaying,
  selectAnimationSpeed,
} from "@/stores/visualization-store"

interface ThermalRadiationVisualizationProps {
  isDark: boolean
}

export function ThermalRadiationVisualization({ isDark }: ThermalRadiationVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [temperature, setTemperature] = useState(() => QueryParam.getNumber("therm.temp", 5000))
  const [showWien, setShowWien] = useState(() => QueryParam.getBoolean("therm.wien", true))
  const [showPhotons, setShowPhotons] = useState(() => QueryParam.getBoolean("therm.photons", true))

  useEffect(() => {
    QueryParam.setNumber("therm.temp", temperature)
  }, [temperature])

  useEffect(() => {
    QueryParam.setBoolean("therm.wien", showWien)
  }, [showWien])

  useEffect(() => {
    QueryParam.setBoolean("therm.photons", showPhotons)
  }, [showPhotons])

  // Photon particles for animation
  const photonsRef = useRef<
    Array<{ x: number; y: number; vx: number; vy: number; wavelength: number }>
  >([])

  useEffect(() => {
    photonsRef.current = Array.from({ length: 50 }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      wavelength: wiensDisplacementLaw(temperature) * (0.5 + Math.random()),
    }))
  }, [temperature])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const isDarkMode = _isDark

      // Background
      ctx.fillStyle = isDarkMode ? "#0a0a1a" : "#f0f4ff"
      ctx.fillRect(0, 0, width, height)

      // Graph area
      const graphLeft = 60
      const graphRight = width - 20
      const graphTop = 40
      const graphBottom = height - 60
      const graphWidth = graphRight - graphLeft
      const graphHeight = graphBottom - graphTop

      // Draw axes
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#718096"
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(graphLeft, graphTop)
      ctx.lineTo(graphLeft, graphBottom)
      ctx.lineTo(graphRight, graphBottom)
      ctx.stroke()

      // Labels
      ctx.fillStyle = isDarkMode ? "#a0aec0" : "#4a5568"
      ctx.font = "12px monospace"
      ctx.textAlign = "center"
      ctx.fillText("λ (длина волны)", graphLeft + graphWidth / 2, graphBottom + 20)
      ctx.save()
      ctx.translate(20, graphTop + graphHeight / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText("B(λ,T) (интенсивность)", 0, 0)
      ctx.restore()

      // Draw Planck's law curves for different temperatures
      const wavelengths = Array.from({ length: 200 }, (_, i) => {
        const minWavelength = 100e-9
        const maxWavelength = 3000e-9
        return minWavelength + (i / 199) * (maxWavelength - minWavelength)
      })

      const intensities = wavelengths.map((w) => plancksLaw(w, temperature))
      const maxIntensity = Math.max(...intensities)

      // Draw curve
      ctx.beginPath()
      ctx.strokeStyle = "#ff6b35"
      ctx.lineWidth = 2.5
      wavelengths.forEach((w, i) => {
        const x = graphLeft + (i / 199) * graphWidth
        const y = graphBottom - (intensities[i] / maxIntensity) * graphHeight * 0.9
        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Fill area under curve
      ctx.lineTo(graphLeft + graphWidth, graphBottom)
      ctx.lineTo(graphLeft, graphBottom)
      ctx.closePath()
      const gradient = ctx.createLinearGradient(0, graphTop, 0, graphBottom)
      gradient.addColorStop(0, "rgba(255, 107, 53, 0.4)")
      gradient.addColorStop(1, "rgba(255, 107, 53, 0.05)")
      ctx.fillStyle = gradient
      ctx.fill()

      // Wien's displacement law marker
      if (showWien) {
        const lambdaMax = wiensDisplacementLaw(temperature)
        const lambdaMaxIndex = wavelengths.findIndex((w) => w >= lambdaMax)
        if (lambdaMaxIndex !== -1) {
          const x = graphLeft + (lambdaMaxIndex / 199) * graphWidth
          const y = graphBottom - (intensities[lambdaMaxIndex] / maxIntensity) * graphHeight * 0.9

          ctx.strokeStyle = "#00d9ff"
          ctx.lineWidth = 1.5
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.moveTo(x, graphBottom)
          ctx.lineTo(x, y)
          ctx.stroke()
          ctx.setLineDash([])

          ctx.fillStyle = "#00d9ff"
          ctx.font = "bold 11px monospace"
          ctx.fillText(`λ_max`, x, graphBottom + 15)
          ctx.fillText(`${(lambdaMax * 1e9).toFixed(0)} нм`, x, y - 10)
        }
      }

      // Animated photons
      if (showPhotons) {
        photonsRef.current.forEach((photon) => {
          photon.x += photon.vx * delta * 0.06
          photon.y += photon.vy * delta * 0.06

          if (photon.x < 0 || photon.x > 1) photon.vx *= -1
          if (photon.y < 0 || photon.y > 1) photon.vy *= -1

          const px = graphLeft + photon.x * graphWidth
          const py = graphTop + photon.y * graphHeight * 0.7

          // Color based on wavelength
          const hue = ((photon.wavelength - 380e-9) / (750e-9 - 380e-9)) * 270
          ctx.fillStyle = `hsla(${String(hue)}, 80%, 60%, 0.8)`
          ctx.beginPath()
          ctx.arc(px, py, 3, 0, Math.PI * 2)
          ctx.fill()

          // Glow effect
          ctx.shadowColor = `hsla(${String(hue)}, 80%, 60%, 0.6)`
          ctx.shadowBlur = 10
          ctx.fill()
          ctx.shadowBlur = 0
        })
      }

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.9)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(width - 220, 20, 200, 100)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(width - 220, 20, 200, 100)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 12px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Тепловое излучение", width - 210, 40)

      ctx.font = "11px monospace"
      ctx.fillText(`T = ${temperature.toFixed(0)} K`, width - 210, 60)

      const lambdaMax = wiensDisplacementLaw(temperature)
      ctx.fillText(`λ_max = ${(lambdaMax * 1e9).toFixed(0)} нм`, width - 210, 78)

      const totalPower = stefanBoltzmannLaw(1, temperature)
      ctx.fillText(`P = ${totalPower.toExponential(2)} Вт/м²`, width - 210, 96)

      // Color temperature indicator
      const tempColor =
        temperature < 3000
          ? "#ff4500"
          : temperature < 5000
            ? "#ffd700"
            : temperature < 7000
              ? "#fffacd"
              : "#87ceeb"
      ctx.fillStyle = tempColor
      ctx.beginPath()
      ctx.arc(width - 30, 45, 12, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = isDarkMode ? "#fff" : "#000"
      ctx.lineWidth = 1
      ctx.stroke()
    },
    [temperature, showWien, showPhotons]
  )

  return (
    <div className="relative h-full w-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-end gap-4">
        <Card className="bg-background/90 border-primary/20 backdrop-blur">
          <CardContent className="min-w-[280px] space-y-3 p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Температура</span>
                <span className="text-muted-foreground text-sm">
                  {temperature.toLocaleString()} K
                </span>
              </div>
              <Slider
                value={[temperature]}
                onValueChange={([v]) => {
                  setTemperature(v)
                }}
                min={1000}
                max={15000}
                step={100}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowWien(!showWien)
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  showWien ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                λ_max (Вина)
              </button>
              <button
                onClick={() => {
                  setShowPhotons(!showPhotons)
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  showPhotons ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Фотоны
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
