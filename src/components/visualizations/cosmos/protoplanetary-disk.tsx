"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { QueryParam } from "@/hooks/use-url-sync"
import {
  useVisualizationStore,
  selectIsPlaying,
  selectAnimationSpeed,
} from "@/stores/visualization-store"

interface ProtoplanetaryDiskVisualizationProps {
  isDark: boolean
}

interface DiskParticle {
  angle: number
  radius: number
  speed: number
  size: number
  type: "dust" | "gas" | "planetesimal"
  brightness: number
}

interface Planetesimal {
  angle: number
  radius: number
  mass: number
  cleared: boolean
}

export function ProtoplanetaryDiskVisualization({ isDark }: ProtoplanetaryDiskVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [starAge, setStarAge] = useState(() => QueryParam.getNumber("disk.age", 1))
  const [diskMass, setDiskMass] = useState(() => QueryParam.getNumber("disk.mass", 1))
  const [viewAngle, setViewAngle] = useState(() => QueryParam.getNumber("disk.angle", 30))
  const [showPlanets, setShowPlanets] = useState(() => QueryParam.getBoolean("disk.planets", true))
  const [showGas, setShowGas] = useState(() => QueryParam.getBoolean("disk.gas", true))
  const [showDust, setShowDust] = useState(() => QueryParam.getBoolean("disk.dust", true))

  const diskParticlesRef = useRef<DiskParticle[]>([])
  const planetesimalsRef = useRef<Planetesimal[]>([])
  const timeRef = useRef(0)
  const rotationRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("disk.age", starAge)
  }, [starAge])

  useEffect(() => {
    QueryParam.setNumber("disk.mass", diskMass)
  }, [diskMass])

  useEffect(() => {
    QueryParam.setNumber("disk.angle", viewAngle)
  }, [viewAngle])

  useEffect(() => {
    QueryParam.setBoolean("disk.planets", showPlanets)
  }, [showPlanets])

  useEffect(() => {
    QueryParam.setBoolean("disk.gas", showGas)
  }, [showGas])

  useEffect(() => {
    QueryParam.setBoolean("disk.dust", showDust)
  }, [showDust])

  // Initialize disk
  useEffect(() => {
    const particles: DiskParticle[] = []
    const totalParticles = 800 * diskMass

    for (let i = 0; i < totalParticles; i++) {
      const radius = 20 + Math.pow(Math.random(), 0.5) * 200
      const typeRoll = Math.random()
      let type: "dust" | "gas" | "planetesimal" = "dust"
      if (typeRoll > 0.7) type = "gas"
      else if (typeRoll > 0.95 && starAge > 2) type = "planetesimal"

      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: 0.002 * Math.sqrt(50 / radius),
        size:
          type === "gas"
            ? 2 + Math.random() * 3
            : type === "planetesimal"
              ? 4 + Math.random() * 4
              : 1 + Math.random() * 2,
        brightness: 0.4 + Math.random() * 0.6,
        type,
      })
    }
    diskParticlesRef.current = particles

    // Initialize planetesimals
    const planetesimals: Planetesimal[] = []
    const numPlanetesimals = Math.floor(3 + starAge * 2)
    for (let i = 0; i < numPlanetesimals; i++) {
      planetesimals.push({
        angle: Math.random() * Math.PI * 2,
        radius: 50 + Math.random() * 120,
        mass: 0.5 + Math.random() * 2,
        cleared: false,
      })
    }
    planetesimalsRef.current = planetesimals
  }, [starAge, diskMass])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      timeRef.current += delta * 0.001
      rotationRef.current += delta * 0.0003
      const isDarkMode = _isDark

      // Background with nebula
      ctx.fillStyle = isDarkMode ? "#050510" : "#0a0a20"
      ctx.fillRect(0, 0, width, height)

      // Background nebula glow
      const nebulaGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        350
      )
      nebulaGradient.addColorStop(0, "rgba(100, 50, 150, 0.15)")
      nebulaGradient.addColorStop(0.4, "rgba(50, 100, 150, 0.08)")
      nebulaGradient.addColorStop(0.7, "rgba(50, 150, 100, 0.04)")
      nebulaGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = nebulaGradient
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const starRadius = 15
      const diskInnerRadius = 25
      const diskOuterRadius = 220

      // View angle
      const tiltRad = (viewAngle * Math.PI) / 180
      const foreshortening = Math.cos(tiltRad)

      // Draw central star (young stellar object)
      const starTemperature = 6000 - starAge * 500
      const starHue = Math.max(0, 60 - (starTemperature - 3000) / 100)
      const starGradient = ctx.createRadialGradient(
        centerX - 2,
        centerY - 2,
        0,
        centerX,
        centerY,
        starRadius * 2.5
      )
      starGradient.addColorStop(0, "#fff")
      starGradient.addColorStop(0.2, `hsl(${String(starHue)}, 90%, 70%)`)
      starGradient.addColorStop(0.5, `hsla(${String(starHue)}, 90%, 50%, 0.5)`)
      starGradient.addColorStop(1, "rgba(255, 200, 100, 0)")
      ctx.fillStyle = starGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius * 2.5, 0, Math.PI * 2)
      ctx.fill()

      // Star core
      ctx.fillStyle = `hsl(${String(starHue)}, 90%, 80%)`
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw disk layers
      if (showGas || showDust) {
        // Gas layer (bottom)
        if (showGas) {
          const gasGradient = ctx.createRadialGradient(
            centerX,
            centerY,
            diskInnerRadius,
            centerX,
            centerY,
            diskOuterRadius
          )
          gasGradient.addColorStop(0, "rgba(50, 100, 200, 0)")
          gasGradient.addColorStop(0.2, "rgba(50, 100, 200, 0.15)")
          gasGradient.addColorStop(0.5, "rgba(50, 150, 200, 0.08)")
          gasGradient.addColorStop(0.8, "rgba(50, 200, 150, 0.03)")
          gasGradient.addColorStop(1, "rgba(50, 200, 150, 0)")
          ctx.fillStyle = gasGradient
          ctx.beginPath()
          ctx.ellipse(
            centerX,
            centerY,
            diskOuterRadius,
            diskOuterRadius * foreshortening,
            0,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }

        // Update and draw particles
        diskParticlesRef.current.forEach((p) => {
          // Skip if type not shown
          if (p.type === "gas" && !showGas) return
          if (p.type === "dust" && !showDust) return
          if (p.type === "planetesimal" && !showPlanets) return

          p.angle += p.speed * delta * 0.06 * (1 + starAge * 0.1)

          // Spiral arm effect
          const spiralOffset = Math.sin(p.angle * 3 + timeRef.current) * 2

          const x = centerX + Math.cos(p.angle) * p.radius + spiralOffset
          const y = centerY + Math.sin(p.angle) * p.radius * foreshortening

          // Color based on type and radius
          let color: string
          if (p.type === "gas") {
            const hue = 180 + (p.radius / diskOuterRadius) * 60
            color = `hsla(${hue.toFixed(0)}, 60%, 60%, ${(p.brightness * 0.5).toFixed(2)})`
          } else if (p.type === "planetesimal") {
            color = `hsla(30, 70%, ${(50 + p.brightness * 20).toFixed(0)}%, ${p.brightness.toFixed(2)})`
          } else {
            // Dust
            const hue = 30 + (1 - p.radius / diskOuterRadius) * 30
            color = `hsla(${hue.toFixed(0)}, 70%, ${(50 + p.brightness * 20).toFixed(0)}%, ${(p.brightness * 0.8).toFixed(2)})`
          }

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })

        // Draw spiral density waves
        ctx.strokeStyle = "rgba(255, 200, 100, 0.15)"
        ctx.lineWidth = 1
        for (let i = 0; i < 4; i++) {
          const spiralStart = (i / 4) * Math.PI * 2 + rotationRef.current
          ctx.beginPath()
          for (let r = diskInnerRadius; r < diskOuterRadius; r += 5) {
            const angle = spiralStart + r * 0.02
            const x = centerX + Math.cos(angle) * r
            const y = centerY + Math.sin(angle) * r * foreshortening
            if (r === diskInnerRadius) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }

      // Draw planetesimals/protoplanets
      if (showPlanets && starAge > 1) {
        planetesimalsRef.current.forEach((p) => {
          p.angle += 0.001 * Math.sqrt(50 / p.radius) * delta * 0.06

          const x = centerX + Math.cos(p.angle) * p.radius
          const y = centerY + Math.sin(p.angle) * p.radius * foreshortening

          // Planet size based on mass and age
          const planetSize = 3 + p.mass * (starAge / 5)

          // Planet color based on distance (ice vs rock)
          const hue = p.radius > 100 ? 200 : 30
          const saturation = p.radius > 100 ? 60 : 50
          const lightness = p.radius > 100 ? 70 : 50

          ctx.fillStyle = `hsl(${String(hue)}, ${String(saturation)}%, ${String(lightness)}%)`
          ctx.beginPath()
          ctx.arc(x, y, planetSize, 0, Math.PI * 2)
          ctx.fill()

          // Atmosphere glow for outer planets
          if (p.radius > 100) {
            const atmosphereGradient = ctx.createRadialGradient(
              x,
              y,
              planetSize,
              x,
              y,
              planetSize * 2
            )
            atmosphereGradient.addColorStop(0, "rgba(100, 150, 255, 0.3)")
            atmosphereGradient.addColorStop(1, "rgba(100, 150, 255, 0)")
            ctx.fillStyle = atmosphereGradient
            ctx.beginPath()
            ctx.arc(x, y, planetSize * 2, 0, Math.PI * 2)
            ctx.fill()
          }

          // Orbital path
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.ellipse(centerX, centerY, p.radius, p.radius * foreshortening, 0, 0, Math.PI * 2)
          ctx.stroke()
        })
      }

      // Draw gaps (where planets have cleared material)
      if (showPlanets && starAge > 2) {
        planetesimalsRef.current.forEach((p) => {
          const gapGradient = ctx.createRadialGradient(
            centerX,
            centerY,
            p.radius - 15,
            centerX,
            centerY,
            p.radius + 15
          )
          gapGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
          gapGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.3)")
          gapGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          ctx.fillStyle = gapGradient
          ctx.beginPath()
          ctx.ellipse(
            centerX,
            centerY,
            p.radius + 15,
            (p.radius + 15) * foreshortening,
            0,
            0,
            Math.PI * 2
          )
          ctx.fill()
        })
      }

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(width - 260, 20, 240, 160)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(width - 260, 20, 240, 160)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 13px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Протопланетный диск", width - 250, 42)

      ctx.font = "11px monospace"
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.fillText(`Возраст: ${starAge.toFixed(1)} млн лет`, width - 250, 62)
      ctx.fillText(`Масса диска: ${diskMass.toFixed(1)} × M_J`, width - 250, 80)
      ctx.fillText(`Угол обзора: ${viewAngle.toFixed(0)}°`, width - 250, 98)

      // Evolution stage
      const stage = starAge < 1 ? "Класс 0/I" : starAge < 3 ? "Класс II" : "Класс III"
      ctx.fillStyle = starAge < 1 ? "#ef4444" : starAge < 3 ? "#f59e0b" : "#22c55e"
      ctx.fillText(`Этап: ${stage}`, width - 250, 118)

      // Planet count
      const planetCount = planetesimalsRef.current.length
      ctx.fillStyle = isDarkMode ? "#64748b" : "#94a3b8"
      ctx.fillText("Протопланет: " + String(planetCount), width - 250, 138)

      // Disk temperature at different radii
      const innerTemp = 1500 - starAge * 100
      const outerTemp = 50 - starAge * 5
      ctx.font = "10px monospace"
      ctx.fillText("T(внутр): ~" + Math.max(500, innerTemp).toFixed(0) + "K", width - 250, 155)
      ctx.fillText("T(внеш): ~" + Math.max(10, outerTemp).toFixed(0) + "K", width - 250, 168)

      // Evolution progress bar
      const barWidth = 200
      const barHeight = 8
      const barX = width - 250
      const barY = 180
      ctx.fillStyle = isDarkMode ? "#1e293b" : "#e2e8f0"
      ctx.fillRect(barX, barY, barWidth, barHeight)
      const progress = Math.min(1, starAge / 10)
      ctx.fillStyle = progress < 0.3 ? "#ef4444" : progress < 0.6 ? "#f59e0b" : "#22c55e"
      ctx.fillRect(barX, barY, barWidth * progress, barHeight)
      ctx.strokeStyle = isDarkMode ? "#475569" : "#cbd5e1"
      ctx.strokeRect(barX, barY, barWidth, barHeight)
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.font = "9px monospace"
      ctx.textAlign = "center"
      ctx.fillText("Эволюция к планетной системе", barX + barWidth / 2, barY + 22)
    },
    [starAge, diskMass, viewAngle, showPlanets, showGas, showDust]
  )

  return (
    <div className="relative h-full w-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute right-4 bottom-4 left-4 flex flex-wrap items-end gap-4">
        <Card className="bg-background/90 border-primary/20 backdrop-blur">
          <CardContent className="min-w-[360px] space-y-3 p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Возраст звезды</span>
                <span className="text-muted-foreground text-sm">{starAge.toFixed(1)} млн лет</span>
              </div>
              <Slider
                value={[starAge]}
                onValueChange={([v]) => {
                  setStarAge(v)
                }}
                min={0.1}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Масса диска</span>
                <span className="text-muted-foreground text-sm">{diskMass.toFixed(1)} × M_J</span>
              </div>
              <Slider
                value={[diskMass]}
                onValueChange={([v]) => {
                  setDiskMass(v)
                }}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Угол обзора</span>
                <span className="text-muted-foreground text-sm">{viewAngle.toFixed(0)}°</span>
              </div>
              <Slider
                value={[viewAngle]}
                onValueChange={([v]) => {
                  setViewAngle(v)
                }}
                min={0}
                max={80}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setShowPlanets(!showPlanets)
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  showPlanets ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Планеты
              </button>
              <button
                onClick={() => {
                  setShowGas(!showGas)
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  showGas ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Газ
              </button>
              <button
                onClick={() => {
                  setShowDust(!showDust)
                }}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  showDust ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Пыль
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
