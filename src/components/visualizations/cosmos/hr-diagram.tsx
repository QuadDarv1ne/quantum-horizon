/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"

interface HRDiagramVisualizationProps {
  isDark: boolean
}

interface Star {
  name: string
  temp: number
  luminosity: number
  type: string
  color: string
  size: number
}

export function HRDiagramVisualization({ isDark }: HRDiagramVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedStar, setSelectedStar] = useState<Star | null>(null)

  const stars: Star[] = [
    { name: "Sun", temp: 5778, luminosity: 1, type: "G2V", color: "#FFF4E0", size: 4 },
    { name: "Sirius A", temp: 9940, luminosity: 25, type: "A1V", color: "#CAD7FF", size: 6 },
    {
      name: "Betelgeuse",
      temp: 3600,
      luminosity: 90000,
      type: "M1Ia",
      color: "#FF6B35",
      size: 12,
    },
    { name: "Rigel", temp: 12100, luminosity: 120000, type: "B8Ia", color: "#AABFFF", size: 10 },
    { name: "Proxima", temp: 3042, luminosity: 0.0017, type: "M5Ve", color: "#FF9966", size: 3 },
    { name: "Vega", temp: 9602, luminosity: 40, type: "A0V", color: "#CAD7FF", size: 6 },
    { name: "Arcturus", temp: 4286, luminosity: 170, type: "K1.5III", color: "#FFB380", size: 8 },
    { name: "White Dwarf", temp: 15000, luminosity: 0.001, type: "DA", color: "#E0E8FF", size: 2 },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let _animationFrameId: number

    const resize = () => {
      setupCanvas(canvas, ctx)
      draw()
    }

    const draw = () => {
      const width = canvas.offsetWidth
      const height = canvas.offsetHeight
      const padding = { left: 50, right: 20, top: 20, bottom: 40 }
      const plotWidth = width - padding.left - padding.right
      const plotHeight = height - padding.top - padding.bottom

      // Clear
      ctx.fillStyle = isDark ? "#050510" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      // Grid
      ctx.strokeStyle = isDark ? "rgba(100, 100, 150, 0.1)" : "rgba(100, 100, 150, 0.2)"
      ctx.lineWidth = 0.5
      for (let i = 0; i <= 10; i++) {
        const x = padding.left + (i / 10) * plotWidth
        const y = padding.top + (i / 10) * plotHeight
        ctx.beginPath()
        ctx.moveTo(x, padding.top)
        ctx.lineTo(x, height - padding.bottom)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(padding.left, y)
        ctx.lineTo(width - padding.right, y)
        ctx.stroke()
      }

      // Main sequence band
      ctx.fillStyle = isDark ? "rgba(100, 150, 255, 0.1)" : "rgba(100, 150, 255, 0.15)"
      ctx.beginPath()
      ctx.moveTo(padding.left, padding.top + plotHeight * 0.8)
      ctx.quadraticCurveTo(
        padding.left + plotWidth * 0.5,
        padding.top + plotHeight * 0.4,
        width - padding.right,
        padding.top + plotHeight * 0.2
      )
      ctx.lineTo(width - padding.right, padding.top + plotHeight * 0.4)
      ctx.quadraticCurveTo(
        padding.left + plotWidth * 0.5,
        padding.top + plotHeight * 0.6,
        padding.left,
        padding.top + plotHeight * 0.95
      )
      ctx.closePath()
      ctx.fill()

      // Regions labels
      ctx.font = "9px sans-serif"
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.textAlign = "center"
      ctx.fillText("Main", padding.left + plotWidth * 0.3, padding.top + plotHeight * 0.55)
      ctx.fillText("Sequence", padding.left + plotWidth * 0.3, padding.top + plotHeight * 0.65)

      ctx.fillText("Giants", padding.left + plotWidth * 0.2, padding.top + plotHeight * 0.2)
      ctx.fillText("Supergiants", padding.left + plotWidth * 0.15, padding.top + plotHeight * 0.08)
      ctx.fillText("White Dwarfs", padding.left + plotWidth * 0.85, padding.top + plotHeight * 0.85)

      // Axes labels
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
      ctx.font = "10px sans-serif"

      // Temperature (reversed)
      ctx.textAlign = "center"
      ctx.fillText("Temperature (K)", width / 2, height - 8)
      ctx.font = "8px sans-serif"
      ctx.fillText("40000", padding.left + 15, height - 25)
      ctx.fillText("10000", padding.left + plotWidth * 0.5, height - 25)
      ctx.fillText("3000", width - padding.right - 15, height - 25)

      // Luminosity
      ctx.save()
      ctx.translate(12, height / 2)
      ctx.rotate(-Math.PI / 2)
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Luminosity (L☉)", 0, 0)
      ctx.restore()

      ctx.font = "8px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText("10⁶", padding.left - 5, padding.top + 15)
      ctx.fillText("1", padding.left - 5, padding.top + plotHeight * 0.5)
      ctx.fillText("10⁻⁴", padding.left - 5, height - padding.bottom - 5)

      // Draw stars - cache gradients
      const starGradients = new Map<string, CanvasGradient>()
      stars.forEach((star) => {
        // Temperature to x (log scale, reversed)
        const logTemp = Math.log10(star.temp)
        const x = padding.left + plotWidth * (1 - (logTemp - 3.5) / 1.6)

        // Luminosity to y (log scale)
        const logLum = Math.log10(star.luminosity)
        const y = padding.top + plotHeight * (1 - (logLum + 4) / 10)

        // Glow - cache by star name
        let gradient = starGradients.get(star.name)
        if (!gradient) {
          gradient = ctx.createRadialGradient(x, y, 0, x, y, star.size * 3)
          gradient.addColorStop(0, star.color)
          gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
          starGradients.set(star.name, gradient)
        }
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, star.size * 3, 0, Math.PI * 2)
        ctx.fill()

        // Star
        ctx.beginPath()
        ctx.arc(x, y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = star.color
        ctx.fill()
      })

      // Sun marker with label
      const sunLogTemp = Math.log10(5778)
      const sunX = padding.left + plotWidth * (1 - (sunLogTemp - 3.5) / 1.6)
      const sunLogLum = Math.log10(1)
      const sunY = padding.top + plotHeight * (1 - (sunLogLum + 4) / 10)

      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(sunX, sunY, 12, 0, Math.PI * 2)
      ctx.stroke()

      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("☉ Sun", sunX + 15, sunY + 3)
    }

    resize()
    window.addEventListener("resize", resize)

    return () => {
      window.removeEventListener("resize", resize)
    }
  }, [isDark])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="h-[400px] w-full rounded-lg"
        aria-label="Hertzsprung-Russell diagram: stellar classification"
        role="img"
      />

      <div className="grid grid-cols-4 gap-1 text-[10px]">
        {stars.slice(0, 4).map((star) => (
          <div
            key={star.name}
            className={`cursor-pointer rounded p-1.5 text-center transition-colors ${
              isDark ? "bg-gray-800/50 hover:bg-gray-700/50" : "bg-gray-200/50 hover:bg-gray-300/50"
            }`}
            onClick={() => {
              setSelectedStar(star)
            }}
          >
            <div className="font-semibold" style={{ color: star.color }}>
              {star.name}
            </div>
            <div className={isDark ? "text-gray-500" : "text-gray-600"}>{star.type}</div>
          </div>
        ))}
      </div>

      {selectedStar && (
        <div
          className={`rounded-lg border p-3 ${
            isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-300 bg-gray-100"
          }`}
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="font-bold" style={{ color: selectedStar.color }}>
              {selectedStar.name}
            </span>
            <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              {selectedStar.type}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className={isDark ? "text-gray-500" : "text-gray-600"}>T:</span>{" "}
              {selectedStar.temp.toLocaleString()} K
            </div>
            <div>
              <span className={isDark ? "text-gray-500" : "text-gray-600"}>L:</span>{" "}
              {selectedStar.luminosity.toLocaleString()} L☉
            </div>
          </div>
        </div>
      )}

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-blue-500/20 bg-blue-900/20" : "border-blue-200 bg-blue-50"
        }`}
      >
        <p className={isDark ? "text-gray-300" : "text-gray-700"}>
          <span className={isDark ? "text-blue-300" : "text-blue-700"}>H-R Diagram:</span> Shows
          stellar evolution. 90% of stars are on the main sequence, where they burn hydrogen.
        </p>
      </div>
    </div>
  )
}
