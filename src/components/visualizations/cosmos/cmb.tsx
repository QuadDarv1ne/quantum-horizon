"use client"

import { useEffect, useRef, useState } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface CMBVisualizationProps {
  isDark: boolean
}

export function CMBVisualization({ isDark }: CMBVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [temperature, setTemperature] = useState(2.725) // Current CMB temperature in K
  const [showGalaxies, setShowGalaxies] = useState(true)

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

    // Generate CMB-like noise pattern
    const generateCMBNoise = (x: number, y: number, time: number): number => {
      const scale = 0.05
      let noise = 0
      noise += Math.sin(x * scale + time * 0.1) * Math.cos(y * scale)
      noise += Math.sin((x + y) * scale * 0.7 + time * 0.15) * 0.5
      noise += Math.cos(x * scale * 1.3 - y * scale * 0.8 + time * 0.05) * 0.3
      noise += Math.sin((x - y) * scale * 2.1 + time * 0.2) * 0.2
      return (noise + 1) / 2 // Normalize to 0-1
    }

    let time = 0

    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, width, height)

      // Draw CMB temperature map
      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const noise = generateCMBNoise(x, y, time)

          // Temperature fluctuation (±0.0001 K around 2.725 K)
          // const tempFluctuation = (noise - 0.5) * 0.0002 (for reference)

          // Color mapping: blue (cold) -> white -> red (hot)
          let r, g, b
          if (noise < 0.5) {
            // Cold regions - blue
            const t = noise * 2
            r = Math.floor(t * 100)
            g = Math.floor(t * 150 + 50)
            b = Math.floor(200 + t * 55)
          } else {
            // Hot regions - red/yellow
            const t = (noise - 0.5) * 2
            r = Math.floor(200 + t * 55)
            g = Math.floor(150 - t * 50)
            b = Math.floor(200 - t * 150)
          }

          const idx = (y * width + x) * 4
          data[idx] = r
          data[idx + 1] = g
          data[idx + 2] = b
          data[idx + 3] = 255
        }
      }
      ctx.putImageData(imageData, 0, 0)

      // Draw galaxy formations overlay
      if (showGalaxies) {
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.6)"
        for (let i = 0; i < 30; i++) {
          const angle = (i / 30) * Math.PI * 2 + time * 0.1
          const radius = 50 + Math.sin(i * 3 + time) * 30
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius

          ctx.beginPath()
          ctx.arc(x, y, 2 + Math.sin(time + i) * 1, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Temperature scale
      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.8)"
      ctx.fillRect(width - 35, 20, 25, 150)

      const gradient = ctx.createLinearGradient(0, 20, 0, 170)
      gradient.addColorStop(0, "#FF6666")
      gradient.addColorStop(0.5, "#FFFFFF")
      gradient.addColorStop(1, "#6666FF")
      ctx.fillStyle = gradient
      ctx.fillRect(width - 32, 22, 19, 146)

      ctx.fillStyle = isDark ? "#FFF" : "#333"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("+0.1mK", width - 55, 28)
      ctx.fillText("0", width - 55, 95)
      ctx.fillText("-0.1mK", width - 55, 168)

      // Info overlay
      ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.85)"
      ctx.fillRect(5, height - 55, 180, 50)

      ctx.fillStyle = isDark ? "#FFFFFF" : "#333333"
      ctx.font = "bold 10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`🌌 T = ${temperature.toFixed(3)} K`, 10, height - 40)
      ctx.font = "9px sans-serif"
      ctx.fillStyle = isDark ? "#AAAAAA" : "#555555"
      ctx.fillText("Возраст: ~380 000 лет после БВ", 10, height - 25)
      ctx.fillText("ΔT/T ≈ 10⁻⁵ (флуктуации)", 10, height - 12)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [temperature, showGalaxies, isDark])

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="h-56 w-full rounded-lg"
        aria-label="Эквивалентность массы и энергии: калькулятор E=mc²"
        role="img"
        aria-live="polite"
        aria-atomic="true"
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-red-400">T (K)</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {temperature.toFixed(3)}
            </span>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(v) => {
              setTemperature(v[0])
            }}
            min={2.7}
            max={3.0}
            step={0.001}
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setShowGalaxies(!showGalaxies)
            }}
            variant={showGalaxies ? "default" : "outline"}
            size="sm"
            className="flex-1 text-xs"
          >
            🌌 Галактики
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-blue-500/20 bg-blue-900/20 p-3 text-xs">
        <div className="mb-1 font-semibold text-blue-300">🌌 Реликтовое излучение (CMB)</div>
        <p className={isDark ? "text-gray-400" : "text-gray-600"}>
          Космический микроволновый фон — это свет, испущенный ~380 000 лет после Большого взрыва,
          когда Вселенная стала прозрачной. Температура 2.725 K с флуктуациями ~10⁻⁵.
        </p>
        <p className="mt-1 text-cyan-400">
          Изучено спутниками COBE, WMAP, Planck — подтверждает теорию Большого взрыва!
        </p>
      </div>
    </div>
  )
}
