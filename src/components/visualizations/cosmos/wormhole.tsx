"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { QueryParam } from "@/hooks/use-url-sync"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface WormholeVisualizationProps {
  isDark: boolean
}

interface Star {
  x: number
  y: number
  z: number
  brightness: number
}

export function WormholeVisualization({ isDark }: WormholeVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [wormholeRadius, setWormholeRadius] = useState(() =>
    QueryParam.getNumber("wormhole.radius", 1)
  )
  const [distance, setDistance] = useState(() =>
    QueryParam.getNumber("wormhole.distance", 5)
  )
  const [rotationSpeed, setRotationSpeed] = useState(() =>
    QueryParam.getNumber("wormhole.rotation", 0.5)
  )
  const [showGrid, setShowGrid] = useState(() =>
    QueryParam.getBoolean("wormhole.grid", true)
  )
  const [showStars, setShowStars] = useState(() =>
    QueryParam.getBoolean("wormhole.stars", true)
  )

  const starsRef = useRef<Star[]>([])
  const timeRef = useRef(0)
  const rotationRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("wormhole.radius", wormholeRadius)
  }, [wormholeRadius])

  useEffect(() => {
    QueryParam.setNumber("wormhole.distance", distance)
  }, [distance])

  useEffect(() => {
    QueryParam.setNumber("wormhole.rotation", rotationSpeed)
  }, [rotationSpeed])

  useEffect(() => {
    QueryParam.setBoolean("wormhole.grid", showGrid)
  }, [showGrid])

  useEffect(() => {
    QueryParam.setBoolean("wormhole.stars", showStars)
  }, [showStars])

  // Initialize stars
  useEffect(() => {
    const stars: Star[] = []
    for (let i = 0; i < 300; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 10 + Math.random() * 20
      stars.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        brightness: 0.3 + Math.random() * 0.7,
      })
    }
    starsRef.current = stars
  }, [])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      timeRef.current += delta * 0.001
      rotationRef.current += rotationSpeed * delta * 0.001
      const isDarkMode = _isDark

      // Background
      ctx.fillStyle = isDarkMode ? "#000005" : "#0a0a1a"
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2

      // Draw stars (background)
      if (showStars) {
        starsRef.current.forEach((star) => {
          // Rotate star field
          const cosR = Math.cos(rotationRef.current * 0.1)
          const sinR = Math.sin(rotationRef.current * 0.1)
          const x = star.x * cosR - star.z * sinR
          const z = star.x * sinR + star.z * cosR

          // Perspective projection
          const fov = 500
          const scale = fov / (fov + z + 15)
          const sx = centerX + x * scale * 20
          const sy = centerY + star.y * scale * 20

          // Twinkle effect
          const twinkle = 0.5 + 0.5 * Math.sin(timeRef.current * 3 + star.brightness * 10)
          const alpha = star.brightness * twinkle

          ctx.fillStyle = `rgba(255, 255, 255, ${String(alpha)})`
          ctx.beginPath()
          ctx.arc(sx, sy, scale * 1.5, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // Wormhole parameters
      const throatRadius = wormholeRadius * 30
      const mouthRadius = throatRadius * 2.5
      const length = distance * 40

      // Draw wormhole throat (Einstein-Rosen bridge visualization)
      const segments = 50
      const rings = 20

      for (let i = 0; i < segments; i++) {
        const t = i / segments // 0 to 1 along the wormhole
        const z = (t - 0.5) * length

        // Wormhole radius at this point (flaring at ends)
        const flare = 1 + 0.5 * Math.pow(Math.sin(t * Math.PI), 3)
        const radius = throatRadius * flare

        // Calculate ring position with perspective
        const perspective = 500 / (500 + z + distance * 20)
        const ringX = centerX
        const ringY = centerY + Math.sin(timeRef.current + t * Math.PI * 2) * 2
        const ringRadius = radius * perspective

        // Color gradient along wormhole
        const hue = 260 + t * 60 // Purple to blue
        const saturation = 70 + t * 20
        const lightness = 40 + t * 20
        const alpha = 0.3 + (1 - Math.abs(t - 0.5) * 2) * 0.5

        // Draw ring
        ctx.strokeStyle = `hsla(${String(hue)}, ${String(saturation)}%, ${String(lightness)}%, ${String(alpha)})`
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let j = 0; j <= rings; j++) {
          const angle = (j / rings) * Math.PI * 2 + timeRef.current * rotationSpeed
          const x = ringX + Math.cos(angle) * ringRadius
          const y = ringY + Math.sin(angle) * ringRadius * 0.3 // Elliptical due to perspective
          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.stroke()
      }

      // Draw event horizon glow at mouths
      const glowGradient1 = ctx.createRadialGradient(
        centerX - length / 4,
        centerY,
        throatRadius * 0.8,
        centerX - length / 4,
        centerY,
        mouthRadius * 1.5
      )
      glowGradient1.addColorStop(0, "rgba(147, 51, 234, 0.4)")
      glowGradient1.addColorStop(0.5, "rgba(147, 51, 234, 0.1)")
      glowGradient1.addColorStop(1, "rgba(147, 51, 234, 0)")
      ctx.fillStyle = glowGradient1
      ctx.beginPath()
      ctx.ellipse(
        centerX - length / 4,
        centerY,
        mouthRadius * 1.5,
        mouthRadius * 0.5,
        0, 0, Math.PI * 2
      )
      ctx.fill()

      const glowGradient2 = ctx.createRadialGradient(
        centerX + length / 4,
        centerY,
        throatRadius * 0.8,
        centerX + length / 4,
        centerY,
        mouthRadius * 1.5
      )
      glowGradient2.addColorStop(0, "rgba(59, 130, 246, 0.4)")
      glowGradient2.addColorStop(0.5, "rgba(59, 130, 246, 0.1)")
      glowGradient2.addColorStop(1, "rgba(59, 130, 246, 0)")
      ctx.fillStyle = glowGradient2
      ctx.beginPath()
      ctx.ellipse(
        centerX + length / 4,
        centerY,
        mouthRadius * 1.5,
        mouthRadius * 0.5,
        0, 0, Math.PI * 2
      )
      ctx.fill()

      // Space-time grid
      if (showGrid) {
        ctx.strokeStyle = "rgba(147, 51, 234, 0.2)"
        ctx.lineWidth = 0.5

        // Longitudinal lines
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + timeRef.current * rotationSpeed
          ctx.beginPath()
          for (let j = 0; j <= segments; j++) {
            const t = j / segments
            const z = (t - 0.5) * length
            const flare = 1 + 0.5 * Math.pow(Math.sin(t * Math.PI), 3)
            const radius = throatRadius * flare
            const perspective = 500 / (500 + z + distance * 20)
            const x = centerX + Math.cos(angle) * radius * perspective
            const y = centerY + Math.sin(angle) * radius * perspective * 0.3
            if (j === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }

      // Particles flowing through wormhole
      const particleCount = 30
      for (let i = 0; i < particleCount; i++) {
        const t = ((timeRef.current * 0.5 + i / particleCount) % 1)
        const z = (t - 0.5) * length
        const perspective = 500 / (500 + z + distance * 20)
        const x = centerX + Math.cos(timeRef.current * 2 + i) * throatRadius * perspective * 0.5
        const y = centerY + Math.sin(timeRef.current * 2 + i) * throatRadius * perspective * 0.3

        ctx.fillStyle = `hsla(${String(180 + t * 60)}, 80%, 60%, 0.8)`
        ctx.beginPath()
        ctx.arc(x, y, 2 * perspective, 0, Math.PI * 2)
        ctx.fill()

        // Trail
        ctx.strokeStyle = `hsla(${String(180 + t * 60)}, 80%, 60%, 0.3)`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, y)
        const trailT = t - 0.1
        if (trailT >= 0) {
          const trailZ = (trailT - 0.5) * length
          const trailPersp = 500 / (500 + trailZ + distance * 20)
          ctx.lineTo(
            centerX + Math.cos(timeRef.current * 2 + i) * throatRadius * trailPersp * 0.5,
            centerY + Math.sin(timeRef.current * 2 + i) * throatRadius * trailPersp * 0.3
          )
        }
        ctx.stroke()
      }

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(width - 240, 20, 220, 120)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(width - 240, 20, 220, 120)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 13px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Кротовая нора", width - 230, 42)

      ctx.font = "11px monospace"
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.fillText(`Радиус горла: ${wormholeRadius.toFixed(1)} × r_s`, width - 230, 62)
      ctx.fillText(`Длина: ${(distance * 1000).toFixed(0)} км`, width - 230, 80)
      ctx.fillText(`Вращение: ${(rotationSpeed * 100).toFixed(0)}%`, width - 230, 98)

      // Type indicator
      ctx.fillStyle = "#a855f7"
      ctx.font = "10px monospace"
      ctx.fillText("Тип: Мост Эйнштейна-Розена", width - 230, 118)

      // Exit/Entry labels
      ctx.font = "bold 12px monospace"
      ctx.textAlign = "center"
      ctx.fillStyle = "#9333ea"
      ctx.fillText("Вход", centerX - length / 4, centerY + mouthRadius + 30)
      ctx.fillStyle = "#3b82f6"
      ctx.fillText("Выход", centerX + length / 4, centerY + mouthRadius + 30)
    },
    [wormholeRadius, distance, rotationSpeed, showGrid, showStars]
  )

  return (
    <div className="relative w-full h-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 items-end">
        <Card className="bg-background/90 backdrop-blur border-primary/20">
          <CardContent className="p-4 space-y-3 min-w-[340px]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Радиус горла</span>
                <span className="text-sm text-muted-foreground">{wormholeRadius.toFixed(1)} × r_s</span>
              </div>
              <Slider
                value={[wormholeRadius]}
                onValueChange={([v]) => setWormholeRadius(v)}
                min={0.5}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Длина моста</span>
                <span className="text-sm text-muted-foreground">{distance.toFixed(1)} × 1000 км</span>
              </div>
              <Slider
                value={[distance]}
                onValueChange={([v]) => setDistance(v)}
                min={2}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Скорость вращения</span>
                <span className="text-sm text-muted-foreground">{(rotationSpeed * 100).toFixed(0)}%</span>
              </div>
              <Slider
                value={[rotationSpeed]}
                onValueChange={([v]) => setRotationSpeed(v)}
                min={0}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showGrid ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Сетка
              </button>
              <button
                onClick={() => setShowStars(!showStars)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showStars ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Звёзды
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
