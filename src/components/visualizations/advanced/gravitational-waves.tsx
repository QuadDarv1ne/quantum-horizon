/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface GravitationalWavesVisualizationProps {
  isDark: boolean
}

export function GravitationalWavesVisualization({ isDark }: GravitationalWavesVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mass1, setMass1] = useState(30)
  const [mass2, setMass2] = useState(30)
  const [distance, setDistance] = useState(50)
  const [timeScale, setTimeScale] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number

    const resize = () => {
      setupCanvas(canvas, ctx)
    }
    resize()
    window.addEventListener("resize", resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    let time = 0

    const animate = () => {
      if (isPlaying) {
        time += 0.016
        setTimeScale((t) => Math.min(100, t + 0.2))
      }
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = isDark ? "#050510" : "#f0f4ff"
      ctx.fillRect(0, 0, width, height)

      const gridSize = 20
      ctx.strokeStyle = isDark ? "rgba(60, 60, 150, 0.3)" : "rgba(60, 60, 150, 0.2)"
      ctx.lineWidth = 0.5

      const totalMass = mass1 + mass2
      const orbitalRadius = distance * 0.5
      const orbitalPeriod = Math.sqrt(Math.pow(orbitalRadius, 3)) * 10
      const orbitalAngle = time * (2 + timeScale / 20)

      const r1 = (orbitalRadius * mass2) / totalMass
      const r2 = (orbitalRadius * mass1) / totalMass
      const x1 = centerX - Math.cos(orbitalAngle) * r1
      const y1 = centerY - Math.sin(orbitalAngle) * r1
      const x2 = centerX + Math.cos(orbitalAngle) * r2
      const y2 = centerY + Math.sin(orbitalAngle) * r2

      const strain = ((mass1 * mass2) / (distance * distance)) * 0.001

      for (let i = -15; i <= 15; i++) {
        ctx.beginPath()
        for (let j = -15; j <= 15; j++) {
          const baseX = centerX + i * gridSize
          const baseY = centerY + j * gridSize

          const dist1 = Math.sqrt(Math.pow(baseX - x1, 2) + Math.pow(baseY - y1, 2))
          const dist2 = Math.sqrt(Math.pow(baseX - x2, 2) + Math.pow(baseY - y2, 2))

          const wave1 = (Math.sin(dist1 * 0.05 - time * 3) * strain * 2000) / (1 + dist1 * 0.02)
          const wave2 = (Math.sin(dist2 * 0.05 - time * 3) * strain * 2000) / (1 + dist2 * 0.02)

          const distortedX = baseX + wave1 + wave2
          const distortedY = baseY + wave1 + wave2

          if (j === -15) ctx.moveTo(distortedX, distortedY)
          else ctx.lineTo(distortedX, distortedY)
        }
        ctx.stroke()
      }

      for (let j = -15; j <= 15; j++) {
        ctx.beginPath()
        for (let i = -15; i <= 15; i++) {
          const baseX = centerX + i * gridSize
          const baseY = centerY + j * gridSize

          const dist1 = Math.sqrt(Math.pow(baseX - x1, 2) + Math.pow(baseY - y1, 2))
          const dist2 = Math.sqrt(Math.pow(baseX - x2, 2) + Math.pow(baseY - y2, 2))

          const wave1 = (Math.sin(dist1 * 0.05 - time * 3) * strain * 2000) / (1 + dist1 * 0.02)
          const wave2 = (Math.sin(dist2 * 0.05 - time * 3) * strain * 2000) / (1 + dist2 * 0.02)

          const distortedX = baseX + wave1 + wave2
          const distortedY = baseY + wave1 + wave2

          if (i === -15) ctx.moveTo(distortedX, distortedY)
          else ctx.lineTo(distortedX, distortedY)
        }
        ctx.stroke()
      }

      for (let r = 0; r < 8; r++) {
        const waveRadius = ((time * 60 + r * 30) % 200) + 50
        const alpha = 0.3 - waveRadius / 600
        if (alpha > 0) {
          ctx.strokeStyle = `rgba(100, 150, 255, ${String(alpha)})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(centerX, centerY, waveRadius, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      const size1 = 8 + mass1 * 0.3
      const size2 = 8 + mass2 * 0.3

      const gradient1 = ctx.createRadialGradient(x1, y1, 0, x1, y1, size1)
      gradient1.addColorStop(0, "#000")
      gradient1.addColorStop(0.8, "#000")
      gradient1.addColorStop(1, "rgba(255, 100, 50, 0.5)")
      ctx.fillStyle = gradient1
      ctx.beginPath()
      ctx.arc(x1, y1, size1, 0, Math.PI * 2)
      ctx.fill()

      const gradient2 = ctx.createRadialGradient(x2, y2, 0, x2, y2, size2)
      gradient2.addColorStop(0, "#000")
      gradient2.addColorStop(0.8, "#000")
      gradient2.addColorStop(1, "rgba(100, 150, 255, 0.5)")
      ctx.fillStyle = gradient2
      ctx.beginPath()
      ctx.arc(x2, y2, size2, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.2)"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(centerX, centerY, orbitalRadius, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`M₁ = ${mass1} M☉`, 10, 20)
      ctx.fillText(`M₂ = ${mass2} M☉`, 10, 35)
      ctx.fillText(`D = ${distance} км`, 10, 50)
      ctx.fillText(`h ≈ ${strain.toExponential(1)}`, 10, 65)

      const freq = (1 / orbitalPeriod) * 10
      ctx.fillStyle = isDark ? "rgba(100, 200, 255, 0.8)" : "rgba(0, 100, 150, 0.8)"
      ctx.fillText(`f ≈ ${freq.toFixed(1)} Гц`, 10, height - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [mass1, mass2, distance, isPlaying, timeScale, isDark])

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="h-56 w-full rounded-lg"
        aria-label="Гравитационные волны: рябь пространства-времени"
        role="img"
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-orange-400">M₁</span>
            <span className="font-mono text-white">{mass1} M☉</span>
          </div>
          <Slider
            value={[mass1]}
            onValueChange={(v) => {
              setMass1(v[0])
            }}
            min={5}
            max={50}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-blue-400">M₂</span>
            <span className="font-mono text-white">{mass2} M☉</span>
          </div>
          <Slider
            value={[mass2]}
            onValueChange={(v) => {
              setMass2(v[0])
            }}
            min={5}
            max={50}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-green-400">Расст.</span>
            <span className="font-mono text-white">{distance} км</span>
          </div>
          <Slider
            value={[distance]}
            onValueChange={(v) => {
              setDistance(v[0])
            }}
            min={20}
            max={100}
            step={5}
          />
        </div>
      </div>

      <Button
        onClick={() => {
          setIsPlaying(!isPlaying)
        }}
        variant="outline"
        size="sm"
        className="w-full text-xs"
      >
        {isPlaying ? "⏸️ Пауза" : "▶️ Играть"}
      </Button>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="rounded border border-purple-500/20 bg-purple-950/30 p-2">
          <div className="font-semibold text-purple-400">LIGO, 2015</div>
          <div className="text-gray-400">Первое обнаружение GW150914</div>
        </div>
        <div className="rounded border border-cyan-500/20 bg-cyan-950/30 p-2">
          <div className="font-semibold text-cyan-400">Деформация h</div>
          <div className="text-gray-400">~10⁻²¹ (безмерная)</div>
        </div>
      </div>

      <div className="rounded-lg border border-purple-500/20 bg-purple-900/20 p-2 text-xs">
        <div className="font-semibold text-purple-300">〰️ Гравитационные волны</div>
        <p className="mt-1 text-gray-400">
          Рябь пространства-времени от ускоренных масс. Объекты с ~30 M☉ сливаются за доли секунды,
          излучая больше энергии, чем все звёзды Вселенной вместе!
        </p>
      </div>
    </div>
  )
}
