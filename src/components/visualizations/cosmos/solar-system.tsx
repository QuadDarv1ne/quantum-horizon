"use client"

import { useCallback, useMemo, useRef, useState, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"
import { QueryParam } from "@/hooks/use-url-sync"

interface SolarSystemVisualizationProps {
  isDark: boolean
}

interface Planet {
  name: string
  nameEn: string
  distance: number
  period: number
  radius: number
  color: string
  moons: number
  rings?: boolean
}

interface StarPosition {
  x: number
  y: number
}

export function SolarSystemVisualization({ isDark }: SolarSystemVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [speed, setSpeed] = useState(1)
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  const timeRef = useRef(0)
  const bgGradientRef = useRef<CanvasGradient | null>(null)
  const sunGlowRef = useRef<CanvasGradient | null>(null)

  useEffect(() => {
    QueryParam.setNumber("ss.speed", speed)
  }, [speed])

  useEffect(() => {
    QueryParam.setNumber("ss.zoom", zoom)
  }, [zoom])

  useEffect(() => {
    QueryParam.setBoolean("ss.orbits", showOrbits)
  }, [showOrbits])

  useEffect(() => {
    QueryParam.setBoolean("ss.labels", showLabels)
  }, [showLabels])

  useEffect(() => {
    if (selectedPlanet) QueryParam.setString("ss.planet", selectedPlanet)
  }, [selectedPlanet])

  // Planet data (relative to Earth)
  const planets = useMemo<Planet[]>(
    () => [
      {
        name: "Меркурий",
        nameEn: "Mercury",
        distance: 0.39,
        period: 0.24,
        radius: 0.38,
        color: "#B5B5B5",
        moons: 0,
      },
      {
        name: "Венера",
        nameEn: "Venus",
        distance: 0.72,
        period: 0.62,
        radius: 0.95,
        color: "#E6C229",
        moons: 0,
      },
      {
        name: "Земля",
        nameEn: "Earth",
        distance: 1.0,
        period: 1.0,
        radius: 1.0,
        color: "#6B93D6",
        moons: 1,
      },
      {
        name: "Марс",
        nameEn: "Mars",
        distance: 1.52,
        period: 1.88,
        radius: 0.53,
        color: "#C1440E",
        moons: 2,
      },
      {
        name: "Юпитер",
        nameEn: "Jupiter",
        distance: 2.2,
        period: 11.86,
        radius: 2.5,
        color: "#D8CA9D",
        moons: 95,
      },
      {
        name: "Сатурн",
        nameEn: "Saturn",
        distance: 2.8,
        period: 29.46,
        radius: 2.2,
        color: "#F4D59E",
        moons: 146,
        rings: true,
      },
      {
        name: "Уран",
        nameEn: "Uranus",
        distance: 3.3,
        period: 84.01,
        radius: 1.6,
        color: "#D1E7E7",
        moons: 28,
      },
      {
        name: "Нептун",
        nameEn: "Neptune",
        distance: 3.7,
        period: 164.8,
        radius: 1.5,
        color: "#5B5DDF",
        moons: 16,
      },
    ],
    []
  )

  // Pre-calculate star positions once (optimization)
  const starPositions = useMemo<StarPosition[]>(
    () =>
      Array.from({ length: 100 }, (_, i) => ({
        x: Math.sin(i * 123.456) * 0.5 + 0.5,
        y: Math.cos(i * 789.012) * 0.5 + 0.5,
      })),
    []
  )

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      _delta: number
    ) => {
      const isDarkMode = _isDark
      const centerX = width / 2
      const centerY = height / 2

      timeRef.current += 0.01 * animationSpeed * speed
      const time = timeRef.current

      ctx.clearRect(0, 0, width, height)

      // Background - cached gradient
      if (!bgGradientRef.current) {
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, width / 2)
        gradient.addColorStop(0, isDarkMode ? "#0a0a20" : "#1a1a3e")
        gradient.addColorStop(1, isDarkMode ? "#000005" : "#0a0a1a")
        bgGradientRef.current = gradient
      }
      ctx.fillStyle = bgGradientRef.current
      ctx.fillRect(0, 0, width, height)

      // Stars - pre-calculated positions (no Math.sin/cos per frame)
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.3)"
      for (let i = 0; i < 100; i++) {
        const star = starPositions[i]
        const x = star.x * width
        const y = star.y * height
        const size = (Math.sin(time + i) * 0.5 + 0.5) * 1.5 + 0.5
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }

      const baseOrbitRadius = 25 * zoom

      // Draw orbits
      if (showOrbits) {
        planets.forEach((planet) => {
          const orbitRadius = baseOrbitRadius + planet.distance * 35 * zoom
          ctx.strokeStyle = isDarkMode ? "rgba(100, 150, 200, 0.2)" : "rgba(100, 150, 200, 0.3)"
          ctx.lineWidth = 1
          ctx.setLineDash([5, 5])
          ctx.beginPath()
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2)
          ctx.stroke()
          ctx.setLineDash([])
        })
      }

      // Draw Sun - cached glow
      const sunRadius = 15 * zoom
      if (!sunGlowRef.current) {
        const glow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, sunRadius * 3)
        glow.addColorStop(0, "#FFD700")
        glow.addColorStop(0.3, "#FFA500")
        glow.addColorStop(0.6, "rgba(255, 100, 0, 0.3)")
        glow.addColorStop(1, "rgba(255, 50, 0, 0)")
        sunGlowRef.current = glow
      }
      ctx.fillStyle = sunGlowRef.current
      ctx.beginPath()
      ctx.arc(centerX, centerY, sunRadius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Sun core
      const sunCore = ctx.createRadialGradient(
        centerX - 3,
        centerY - 3,
        0,
        centerX,
        centerY,
        sunRadius
      )
      sunCore.addColorStop(0, "#FFFACD")
      sunCore.addColorStop(0.5, "#FFD700")
      sunCore.addColorStop(1, "#FFA500")
      ctx.fillStyle = sunCore
      ctx.beginPath()
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2)
      ctx.fill()

      // Sun corona animation
      for (let i = 0; i < 12; i++) {
        const angle = time * 0.5 + (i * Math.PI) / 6
        const len = sunRadius + Math.sin(time * 3 + i * 2) * 5 + 5
        ctx.strokeStyle = `rgba(255, 200, 0, ${String(0.3 + Math.sin(time * 2 + i) * 0.2)})`
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(angle) * sunRadius, centerY + Math.sin(angle) * sunRadius)
        ctx.lineTo(centerX + Math.cos(angle) * len, centerY + Math.sin(angle) * len)
        ctx.stroke()
      }

      // Draw planets
      planets.forEach((planet) => {
        const orbitRadius = baseOrbitRadius + planet.distance * 35 * zoom
        const angle = time / planet.period
        const x = centerX + Math.cos(angle) * orbitRadius
        const y = centerY + Math.sin(angle) * orbitRadius
        const planetRadius = Math.max(3, planet.radius * 4 * zoom)

        // Planet glow when selected
        if (selectedPlanet === planet.nameEn) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, planetRadius * 3)
          glow.addColorStop(0, planet.color + "AA")
          glow.addColorStop(1, "rgba(0, 0, 0, 0)")
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, planetRadius * 3, 0, Math.PI * 2)
          ctx.fill()
        }

        // Saturn's rings
        if (planet.rings) {
          ctx.strokeStyle = "rgba(244, 213, 158, 0.6)"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.ellipse(x, y, planetRadius * 2, planetRadius * 0.5, Math.PI / 6, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Planet body
        const planetGradient = ctx.createRadialGradient(
          x - planetRadius * 0.3,
          y - planetRadius * 0.3,
          0,
          x,
          y,
          planetRadius
        )
        planetGradient.addColorStop(0, planet.color)
        planetGradient.addColorStop(1, "#333")
        ctx.fillStyle = planetGradient
        ctx.beginPath()
        ctx.arc(x, y, planetRadius, 0, Math.PI * 2)
        ctx.fill()

        // Moon for Earth
        if (planet.nameEn === "Earth") {
          const moonAngle = time * 12
          const moonX = x + Math.cos(moonAngle) * (planetRadius + 8)
          const moonY = y + Math.sin(moonAngle) * (planetRadius + 8)
          ctx.fillStyle = "#AAAAAA"
          ctx.beginPath()
          ctx.arc(moonX, moonY, 2, 0, Math.PI * 2)
          ctx.fill()
        }

        // Planet label
        if (showLabels) {
          ctx.fillStyle =
            selectedPlanet === planet.nameEn
              ? "#FFFFFF"
              : isDarkMode
                ? "rgba(255, 255, 255, 0.7)"
                : "rgba(255, 255, 255, 0.9)"
          ctx.font = `${selectedPlanet === planet.nameEn ? "bold " : ""}9px sans-serif`
          ctx.textAlign = "center"
          ctx.fillText(planet.name, x, y - planetRadius - 5)
        }
      })

      // Info panel for selected planet
      if (selectedPlanet) {
        const planet = planets.find((p) => p.nameEn === selectedPlanet)
        if (planet) {
          ctx.fillStyle = isDarkMode ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)"
          ctx.fillRect(10, height - 65, 130, 55)
          ctx.strokeStyle = planet.color
          ctx.lineWidth = 1
          ctx.strokeRect(10, height - 65, 130, 55)

          ctx.fillStyle = planet.color
          ctx.font = "bold 11px sans-serif"
          ctx.textAlign = "left"
          ctx.fillText(planet.name, 15, height - 50)

          ctx.fillStyle = isDarkMode ? "#AAAAAA" : "#555555"
          ctx.font = "9px sans-serif"
          ctx.fillText(`Орбита: ${String(planet.distance)} а.е.`, 15, height - 35)
          ctx.fillText(`Период: ${String(planet.period)} года`, 15, height - 32)
          ctx.fillText(`Спутники: ${String(planet.moons)}`, 15, height - 19)
        }
      }

      // Scale indicator
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText("Масштаб не сохранён", width - 10, height - 5)
    },
    [planets, starPositions, speed, showOrbits, showLabels, selectedPlanet, zoom, animationSpeed]
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

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-yellow-400">Скорость</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {speed.toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[speed]}
            onValueChange={(v) => {
              setSpeed(v[0])
            }}
            min={0.1}
            max={5}
            step={0.1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-blue-400">Масштаб</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {zoom.toFixed(1)}x
            </span>
          </div>
          <Slider
            value={[zoom]}
            onValueChange={(v) => {
              setZoom(v[0])
            }}
            min={0.5}
            max={2}
            step={0.1}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setShowOrbits(!showOrbits)
          }}
          variant={showOrbits ? "default" : "outline"}
          size="sm"
          className={`text-xs ${showOrbits ? "bg-blue-600" : ""}`}
        >
          🔵 Орбиты
        </Button>
        <Button
          onClick={() => {
            setShowLabels(!showLabels)
          }}
          variant={showLabels ? "default" : "outline"}
          size="sm"
          className={`text-xs ${showLabels ? "bg-purple-600" : ""}`}
        >
          🏷️ Названия
        </Button>
        {planets.slice(0, 4).map((planet) => (
          <Button
            key={planet.nameEn}
            onClick={() => {
              setSelectedPlanet(selectedPlanet === planet.nameEn ? null : planet.nameEn)
            }}
            variant={selectedPlanet === planet.nameEn ? "default" : "outline"}
            size="sm"
            className="text-xs"
            style={{
              borderColor: planet.color,
              color: selectedPlanet === planet.nameEn ? "white" : planet.color,
            }}
          >
            {planet.name}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-yellow-500/20 bg-yellow-900/20 p-2 text-xs">
        <div className="font-semibold text-yellow-300">🌍 Солнечная система</div>
        <p className={isDark ? "mt-1 text-gray-400" : "mt-1 text-gray-600"}>
          8 планет обращаются вокруг Солнца. Внутренние — каменистые (Меркурий, Венера, Земля,
          Марс), внешние — газовые гиганты (Юпитер, Сатурн, Уран, Нептун).
        </p>
        <p className="mt-1 text-cyan-400">
          Период обращения Земли = 1 год. Нептун делает оборот за ~165 лет!
        </p>
        <Button
          onClick={() => {
            const url = window.location.href
            void navigator.clipboard.writeText(url)
          }}
          variant="outline"
          size="sm"
          className="mt-2 w-full"
        >
          🔗 Copy URL
        </Button>
      </div>
    </div>
  )
}
