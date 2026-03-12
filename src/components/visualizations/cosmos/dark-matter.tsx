"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface DarkMatterVisualizationProps {
  isDark: boolean
}

export function DarkMatterVisualization({ isDark }: DarkMatterVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [darkMatterFraction, setDarkMatterFraction] = useState(85)
  const [showDarkMatter, setShowDarkMatter] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let bgGradient: CanvasGradient | null = null

    const resize = () => {
      setupCanvas(canvas, ctx)
      bgGradient = null
    }
    resize()
    window.addEventListener("resize", resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2
    const centerY = height / 2

    // Galaxy rotation curves
    const stars: Array<{
      angle: number
      radius: number
      size: number
      brightness: number
      isDark: boolean
    }> = []

    // Visible stars (concentrated in center)
    for (let i = 0; i < 150; i++) {
      const r = Math.pow(Math.random(), 0.5) * 60
      stars.push({
        angle: Math.random() * Math.PI * 2,
        radius: r,
        size: 1 + Math.random() * 1.5,
        brightness: 0.3 + Math.random() * 0.7,
        isDark: false,
      })
    }

    // Dark matter halo (extended distribution)
    for (let i = 0; i < 200; i++) {
      const r = 20 + Math.random() * 80
      stars.push({
        angle: Math.random() * Math.PI * 2,
        radius: r,
        size: 1 + Math.random(),
        brightness: 0,
        isDark: true,
      })
    }

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background - cached gradient
      if (!bgGradient) {
        bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 120)
        bgGradient.addColorStop(0, isDark ? "#0a0520" : "#1a1530")
        bgGradient.addColorStop(1, isDark ? "#050510" : "#0a0a20")
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Dark matter halo visualization
      if (showDarkMatter) {
        const dmGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100)
        dmGradient.addColorStop(0, `rgba(80, 40, 150, ${String(darkMatterFraction / 400)})`)
        dmGradient.addColorStop(0.5, `rgba(60, 30, 120, ${String(darkMatterFraction / 300)})`)
        dmGradient.addColorStop(1, "rgba(40, 20, 80, 0)")
        ctx.fillStyle = dmGradient
        ctx.beginPath()
        ctx.arc(centerX, centerY, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      // Update and draw stars
      stars.forEach((star) => {
        let angularSpeed
        if (star.isDark) {
          angularSpeed = 0.015 / Math.sqrt(1 + star.radius / 50)
        } else {
          const visibleContribution = (100 - darkMatterFraction) / 100
          const darkContribution = darkMatterFraction / 100
          const keplerian = 0.02 / Math.sqrt(Math.max(star.radius, 10) / 30)
          const flatCurve = 0.015
          angularSpeed = keplerian * visibleContribution + flatCurve * darkContribution
        }

        star.angle += angularSpeed

        const x = centerX + Math.cos(star.angle) * star.radius
        const y = centerY + Math.sin(star.angle) * star.radius * 0.4

        if (star.isDark && showDarkMatter) {
          ctx.fillStyle = `rgba(150, 100, 255, ${String(0.1 + Math.random() * 0.1)})`
          ctx.beginPath()
          ctx.arc(x, y, star.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (!star.isDark) {
          ctx.fillStyle = `rgba(255, 255, 200, ${String(star.brightness)})`
          ctx.beginPath()
          ctx.arc(x, y, star.size, 0, Math.PI * 2)
          ctx.fill()
        }
      })

      // Galaxy core glow
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 20)
      coreGradient.addColorStop(0, "rgba(255, 240, 200, 0.8)")
      coreGradient.addColorStop(0.5, "rgba(255, 200, 150, 0.3)")
      coreGradient.addColorStop(1, "rgba(255, 150, 100, 0)")
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2)
      ctx.fill()

      // Draw rotation curve graph
      const graphX = 10
      const graphY = height - 70
      const graphW = width - 20
      const graphH = 60

      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"
      ctx.fillRect(graphX, graphY, graphW, graphH)

      // Axis
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(graphX, graphY + graphH - 5)
      ctx.lineTo(graphX + graphW, graphY + graphH - 5)
      ctx.stroke()

      // Labels
      ctx.fillStyle = isDark ? "#888" : "#666"
      ctx.font = "8px sans-serif"
      ctx.fillText("r (distance)", graphX + graphW / 2, graphY + graphH - 1)
      ctx.save()
      ctx.translate(graphX + 3, graphY + graphH / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.fillText("v (velocity)", 0, 0)
      ctx.restore()

      // Keplerian curve (without dark matter)
      ctx.strokeStyle = "rgba(255, 100, 100, 0.5)"
      ctx.beginPath()
      for (let r = 5; r < graphW; r += 2) {
        const v = 30 / Math.sqrt(r / 10)
        const x = graphX + r
        const y = graphY + graphH - 5 - v
        if (r === 5) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Flat curve (with dark matter)
      ctx.strokeStyle = "rgba(100, 200, 255, 0.8)"
      ctx.beginPath()
      for (let r = 5; r < graphW; r += 2) {
        let v
        if (r < 30) {
          v = r * 0.8
        } else {
          v = 25 - (100 - darkMatterFraction) / 10
        }
        const x = graphX + r
        const y = graphY + graphH - 5 - v
        if (r === 5) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Legend
      ctx.font = "7px sans-serif"
      ctx.fillStyle = "rgba(255, 100, 100, 0.8)"
      ctx.fillText("Without DM", graphX + graphW - 60, graphY + 10)
      ctx.fillStyle = "rgba(100, 200, 255, 0.8)"
      ctx.fillText("With DM", graphX + graphW - 60, graphY + 20)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [darkMatterFraction, showDarkMatter, isDark])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded-lg"
        aria-label="Dark matter: galaxy rotation curves"
        role="img"
      />

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className={isDark ? "text-purple-400" : "text-purple-700"}>Dark matter fraction</span>
          <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
            {darkMatterFraction}%
          </span>
        </div>
        <Slider
          value={[darkMatterFraction]}
          onValueChange={(v) => {
            setDarkMatterFraction(v[0])
          }}
          min={0}
          max={95}
          step={5}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setShowDarkMatter(!showDarkMatter)
          }}
          variant="outline"
          size="sm"
          className={`flex-1 text-xs ${
            isDark ? "border-purple-500/50 text-purple-300" : "border-purple-500 text-purple-700"
          }`}
        >
          {showDarkMatter ? "👁️ Hide DM" : "👁️ Show DM"}
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`rounded p-2 border ${
            isDark
              ? "bg-purple-950/30 border-purple-500/20"
              : "bg-purple-50 border-purple-200"
          }`}
        >
          <div className={isDark ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}>
            Dark Matter
          </div>
          <div className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
            ~27% of Universe
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Does not emit light</div>
        </div>
        <div
          className={`rounded p-2 border ${
            isDark
              ? "bg-blue-950/30 border-blue-500/20"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className={isDark ? "text-blue-400 font-semibold" : "text-blue-700 font-semibold"}>
            Dark Energy
          </div>
          <div className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
            ~68% of Universe
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>
            Accelerates expansion
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark
            ? "bg-purple-900/20 border-purple-500/20"
            : "bg-purple-50 border-purple-200"
        }`}
      >
        <p className={isDark ? "text-gray-300" : "text-gray-700"}>
          <span className={isDark ? "text-purple-300" : "text-purple-700"}>Mystery:</span> Stars at
          the edge of galaxies rotate too fast! Without invisible mass, they would fly apart. This is
          evidence for dark matter.
        </p>
      </div>
    </div>
  )
}
