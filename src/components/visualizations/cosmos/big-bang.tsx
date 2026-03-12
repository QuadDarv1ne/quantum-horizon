"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface BigBangVisualizationProps {
  isDark: boolean
}

export function BigBangVisualization({ isDark }: BigBangVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [expansionSpeed, setExpansionSpeed] = useState(50)
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

    // Particles representing matter/galaxies
    const particles: Array<{
      angle: number
      distance: number
      baseDistance: number
      size: number
      color: string
      type: "galaxy" | "particle" | "photon"
    }> = []

    // Initialize particles
    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2
      const baseDist = 5 + Math.random() * 100
      particles.push({
        angle,
        distance: baseDist,
        baseDistance: baseDist,
        size: 1 + Math.random() * 2,
        color: `hsl(${200 + Math.random() * 60}, 70%, ${60 + Math.random() * 30}%)`,
        type: Math.random() < 0.3 ? "galaxy" : Math.random() < 0.5 ? "photon" : "particle",
      })
    }

    let time = 0

    const animate = () => {
      if (isPlaying) {
        time += 0.016
      }
      ctx.clearRect(0, 0, width, height)

      // Background - cosmic microwave radiation
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 200)
      const temp = Math.max(0, 3000 - timeScale * 30)
      const bgAlpha = Math.min(0.3, timeScale * 0.01)
      bgGradient.addColorStop(0, `rgba(255, ${String(100 + temp / 20)}, ${String(50 + temp / 30)}, ${String(bgAlpha)})`)
      bgGradient.addColorStop(0.5, `rgba(100, 50, 150, ${String(bgAlpha * 0.5)})`)
      bgGradient.addColorStop(1, isDark ? "rgba(5, 5, 20, 1)" : "rgba(10, 10, 30, 1)")
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Expansion factor based on time and speed
      const expansionFactor = 1 + (timeScale / 100) * (expansionSpeed / 50) * 3

      // Draw particles
      particles.forEach((p) => {
        const expandedDist = p.baseDistance * expansionFactor

        // Add some wobble
        const wobble = Math.sin(time * 2 + p.angle) * 2
        const x = centerX + Math.cos(p.angle) * (expandedDist + wobble)
        const y = centerY + Math.sin(p.angle) * (expandedDist + wobble)

        if (expandedDist < Math.max(width, height)) {
          if (p.type === "galaxy") {
            // Galaxy spiral
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(x, y, p.size * 2, 0, Math.PI * 2)
            ctx.fill()

            // Spiral arms
            ctx.strokeStyle = p.color.replace("70%", "50%")
            ctx.lineWidth = 0.5
            for (let arm = 0; arm < 2; arm++) {
              ctx.beginPath()
              for (let t = 0; t < 20; t++) {
                const armAngle = p.angle + arm * Math.PI + t * 0.3
                const armDist = p.size * 2 + t * 0.5
                const ax = x + Math.cos(armAngle) * armDist
                const ay = y + Math.sin(armAngle) * armDist
                if (t === 0) ctx.moveTo(ax, ay)
                else ctx.lineTo(ax, ay)
              }
              ctx.stroke()
            }
          } else if (p.type === "photon") {
            // Photon - faster, smaller
            ctx.fillStyle = `rgba(255, 255, 200, ${String(0.5 + Math.sin(time * 5 + p.angle) * 0.3)})`
            ctx.beginPath()
            ctx.arc(x, y, p.size * 0.5, 0, Math.PI * 2)
            ctx.fill()
          } else {
            // Regular particle
            ctx.fillStyle = p.color
            ctx.beginPath()
            ctx.arc(x, y, p.size, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      })

      // Central singularity / early universe glow
      if (timeScale < 30) {
        const singularityGlow = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          50 - timeScale
        )
        singularityGlow.addColorStop(0, `rgba(255, 255, 200, ${String(1 - timeScale / 30)})`)
        singularityGlow.addColorStop(0.5, `rgba(255, 150, 50, ${String(0.5 - timeScale / 60)})`)
        singularityGlow.addColorStop(1, "rgba(255, 50, 0, 0)")
        ctx.fillStyle = singularityGlow
        ctx.beginPath()
        ctx.arc(centerX, centerY, 50 - timeScale, 0, Math.PI * 2)
        ctx.fill()
      }

      // Time scale indicator
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"

      let eraText = ""
      if (timeScale < 5) eraText = "t < 10⁻⁴³ s (Planck epoch)"
      else if (timeScale < 15) eraText = "t ~ 10⁻³⁵ s (Inflation)"
      else if (timeScale < 30) eraText = "t ~ 1 s (Quark-gluon plasma)"
      else if (timeScale < 50) eraText = "t ~ 3 min (Nucleosynthesis)"
      else if (timeScale < 70) eraText = "t ~ 380,000 yrs (Recombination)"
      else eraText = "t ~ 13.8 billion yrs (Now)"

      ctx.fillText(eraText, 10, 20)
      ctx.fillText(`Radius: ${(expansionFactor * 100).toFixed(0)} billion light years`, 10, 35)

      // Scale factor
      ctx.fillStyle = isDark ? "rgba(100, 200, 255, 0.8)" : "rgba(50, 150, 235, 0.9)"
      ctx.fillText(`a(t) = ${expansionFactor.toFixed(2)}`, 10, height - 10)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [expansionSpeed, timeScale, isPlaying, isDark])

  useEffect(() => {
    if (!isPlaying) return
    const interval = setInterval(() => {
      setTimeScale((t) => Math.min(100, t + 0.5))
    }, 50)
    return () => {
      clearInterval(interval)
    }
  }, [isPlaying])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded-lg"
        aria-label="Big Bang: expansion of the Universe"
        role="img"
      />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>Expansion speed</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {expansionSpeed}%
            </span>
          </div>
          <Slider
            value={[expansionSpeed]}
            onValueChange={(v) => {
              setExpansionSpeed(v[0])
            }}
            min={10}
            max={100}
            step={5}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-yellow-400" : "text-yellow-700"}>Time</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {timeScale.toFixed(0)}%
            </span>
          </div>
          <Slider
            value={[timeScale]}
            onValueChange={(v) => {
              setTimeScale(v[0])
            }}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setIsPlaying(!isPlaying)
          }}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          {isPlaying ? "⏸️ Pause" : "▶️ Play"}
        </Button>
        <Button
          onClick={() => {
            setTimeScale(0)
          }}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          🔄 Reset
        </Button>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark
            ? "bg-orange-900/20 border-orange-500/20"
            : "bg-orange-50 border-orange-200"
        }`}
      >
        <div className={isDark ? "text-orange-300 font-semibold" : "text-orange-700 font-semibold"}>
          💥 Big Bang (13.8 billion years ago)
        </div>
        <p className={isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          The Universe was born from a singularity. Hubble's Law: v = H₀·d — galaxies recede at a
          speed proportional to their distance.
        </p>
      </div>
    </div>
  )
}
