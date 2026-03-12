"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { useVisualizationStore } from "@/stores/visualization-store"
import { G, c, M_SUN } from "@/lib/constants"

interface BlackHoleVisualizationProps {
  isDark: boolean
}

interface GradientCache {
  gradient: CanvasGradient
  innerRadius: number
  outerRadius: number
}

export function BlackHoleVisualization({ isDark }: BlackHoleVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore()
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [mass, setMass] = useState(10)
  const [showAccretion, setShowAccretion] = useState(true)
  const [showHawking, setShowHawking] = useState(false)
  const [showDoppler, setShowDoppler] = useState(true)
  const [showLensing, setShowLensing] = useState(true)
  const rotationRef = useRef(0)
  const gradientCache = useRef<GradientCache | null>(null)
  const starsRef = useRef<Array<{ x: number; y: number; size: number }>>([])

  // Generate background stars once
  useEffect(() => {
    starsRef.current = Array.from({ length: 150 }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.5 + 0.5,
    }))
  }, [])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const centerX = width / 2
      const centerY = height / 2
      const isDarkMode = _isDark

      // Clear canvas
      ctx.fillStyle = isDarkMode ? "#000000" : "#0f172a"
      ctx.fillRect(0, 0, width, height)

      // Draw gravitationally lensed background stars
      if (showLensing) {
        drawLensedStars(ctx, centerX, centerY, eventHorizonRadius, starsRef.current)
      }

      // Schwarzschild radius: r_s = 2GM/c²
      const M = mass * M_SUN
      const r_s = (2 * G * M) / (c * c)
      const scale = 50 / r_s
      const eventHorizonRadius = 30 * scale

      // Update rotation
      if (isPlaying) {
        rotationRef.current += (delta / 1000) * animationSpeed
      }

      // Draw accretion disk with optimized gradient
      if (showAccretion) {
        drawAccretionDisk(
          ctx,
          centerX,
          centerY,
          eventHorizonRadius,
          rotationRef.current,
          gradientCache,
          showDoppler
        )
      }

      // Draw event horizon (black circle)
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2)
      ctx.fillStyle = "#000000"
      ctx.fill()

      // Draw photon sphere glow
      const photonGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        eventHorizonRadius,
        centerX,
        centerY,
        eventHorizonRadius * 1.5
      )
      photonGlow.addColorStop(0, "rgba(255, 255, 255, 0.3)")
      photonGlow.addColorStop(1, "rgba(255, 255, 255, 0)")
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius * 1.5, 0, Math.PI * 2)
      ctx.fillStyle = photonGlow
      ctx.fill()

      // Draw Hawking radiation
      if (showHawking) {
        drawHawkingRadiation(ctx, centerX, centerY, eventHorizonRadius, rotationRef.current)
      }

      // Labels
      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#ffffff"
      ctx.font = "14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Mass: ${mass.toFixed(1)} M☉`, centerX, height - 80)
      ctx.fillText(
        `Schwarzschild Radius: ${((r_s * scale) / 1000).toFixed(2)} km`,
        centerX,
        height - 55
      )

      // Formula
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#cbd5e1"
      ctx.font = "12px monospace"
      ctx.fillText("r_s = 2GM/c²", centerX, 30)
    },
    [mass, isPlaying, animationSpeed, showAccretion, showHawking, showDoppler, showLensing]
  )

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[400px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={() => {
          togglePlaying()
        }}
        onSpeedChange={(speed) => {
          setAnimationSpeed(speed)
        }}
        isDark={isDark}
      />
      <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800/50" : "bg-gray-100/50"}`}>
        <label className="block text-sm font-medium mb-2">
          Mass: {mass.toFixed(1)} Solar Masses
        </label>
        <input
          type="range"
          min="1"
          max="100"
          step="1"
          value={mass}
          onChange={(e) => {
            setMass(parseFloat(e.target.value))
          }}
          className="w-full"
        />
        <div className="flex gap-4 mt-3 flex-wrap">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showAccretion}
              onChange={(e) => {
                setShowAccretion(e.target.checked)
              }}
            />
            Accretion Disk
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showHawking}
              onChange={(e) => {
                setShowHawking(e.target.checked)
              }}
            />
            Hawking Radiation
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showDoppler}
              onChange={(e) => {
                setShowDoppler(e.target.checked)
              }}
            />
            Doppler Effect
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showLensing}
              onChange={(e) => {
                setShowLensing(e.target.checked)
              }}
            />
            Gravitational Lensing
          </label>
        </div>
      </div>
    </div>
  )
}

function drawAccretionDisk(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  innerRadius: number,
  rotation: number,
  gradientCache: React.RefObject<GradientCache | null>,
  showDoppler: boolean
) {
  const outerRadius = innerRadius * 3

  // Мемоизация градиента с проверкой изменения параметров
  if (
    !gradientCache.current?.gradient ||
    gradientCache.current.innerRadius !== innerRadius ||
    gradientCache.current.outerRadius !== outerRadius
  ) {
    const gradient = ctx.createLinearGradient(-outerRadius, 0, outerRadius, 0)
    gradient.addColorStop(0, "rgba(251, 191, 36, 0)")
    gradient.addColorStop(0.5, "rgba(251, 191, 36, 0.6)")
    gradient.addColorStop(1, "rgba(251, 191, 36, 0)")
    gradientCache.current = { gradient, innerRadius, outerRadius }
  }

  const gradientToUse = gradientCache.current.gradient

  for (let i = 0; i < 3; i++) {
    const radius = innerRadius + (outerRadius - innerRadius) * (i / 3)
    const speed = 1 - i * 0.2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(rotation * speed)

    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)

    // Doppler beaming effect - one side brighter due to relativistic motion
    if (showDoppler) {
      // Create asymmetric gradient for Doppler effect
      const dopplerGradient = ctx.createLinearGradient(-radius, -radius, radius, radius)
      dopplerGradient.addColorStop(0, "rgba(255, 200, 100, 0.8)") // Approaching side (brighter)
      dopplerGradient.addColorStop(0.3, "rgba(251, 191, 36, 0.4)")
      dopplerGradient.addColorStop(0.5, "rgba(251, 191, 36, 0.3)")
      dopplerGradient.addColorStop(0.7, "rgba(200, 100, 50, 0.3)") // Receding side (dimmer)
      dopplerGradient.addColorStop(1, "rgba(150, 50, 20, 0.2)")
      ctx.strokeStyle = dopplerGradient
    } else {
      ctx.strokeStyle = gradientToUse
    }

    ctx.lineWidth = (outerRadius - innerRadius) / 3
    ctx.stroke()

    ctx.restore()
  }
}

function drawHawkingRadiation(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  rotation: number
) {
  const particleCount = 20

  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2 + rotation
    const distance = radius + Math.sin(rotation * 2 + i) * 20

    const x = centerX + Math.cos(angle) * distance
    const y = centerY + Math.sin(angle) * distance

    ctx.beginPath()
    ctx.arc(x, y, 2, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(139, 92, 246, 0.8)"
    ctx.fill()
  }
}

function drawLensedStars(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  blackHoleRadius: number,
  stars: Array<{ x: number; y: number; size: number }>
) {
  const lensingRadius = blackHoleRadius * 2.5

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
  for (const star of stars) {
    const starX = star.x * ctx.canvas.width
    const starY = star.y * ctx.canvas.height

    const dx = starX - centerX
    const dy = starY - centerY
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance < blackHoleRadius) continue

    const bendFactor = Math.max(0, 1 - distance / (lensingRadius * 2))
    const bendAmount = bendFactor * blackHoleRadius * 0.5

    const angle = Math.atan2(dy, dx)
    const lensedX = centerX + Math.cos(angle) * (distance + bendAmount)
    const lensedY = centerY + Math.sin(angle) * (distance + bendAmount)

    const stretchedSize = star.size * (1 + bendFactor * 0.5)

    ctx.beginPath()
    ctx.arc(lensedX, lensedY, stretchedSize, 0, Math.PI * 2)
    ctx.fill()
  }

  const photonRingGradient = ctx.createRadialGradient(
    centerX,
    centerY,
    blackHoleRadius * 1.2,
    centerX,
    centerY,
    lensingRadius
  )
  photonRingGradient.addColorStop(0, "rgba(255, 255, 255, 0.15)")
  photonRingGradient.addColorStop(0.5, "rgba(255, 255, 255, 0.05)")
  photonRingGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

  ctx.fillStyle = photonRingGradient
  ctx.beginPath()
  ctx.arc(centerX, centerY, lensingRadius, 0, Math.PI * 2)
  ctx.fill()
}
