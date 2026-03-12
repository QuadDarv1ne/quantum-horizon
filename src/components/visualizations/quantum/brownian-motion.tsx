/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface BrownianMotionVisualizationProps {
  isDark: boolean
}

export function BrownianMotionVisualization({ isDark }: BrownianMotionVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [particleCount, setParticleCount] = useState(5)
  const [temperature, setTemperature] = useState(300) // Kelvin
  const [showTrails, setShowTrails] = useState(true)

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

    // Large visible particles
    interface Particle {
      x: number
      y: number
      trail: Array<{ x: number; y: number }>
      color: string
    }

    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 100,
        y: height / 2 + (Math.random() - 0.5) * 50,
        trail: [],
        color: `hsl(${i * 60 + 200}, 70%, 60%)`,
      })
    }

    // Small water molecules (for visualization)
    const molecules: Array<{ x: number; y: number; vx: number; vy: number }> = []
    for (let i = 0; i < 200; i++) {
      molecules.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      })
    }

    // Speed based on temperature (simplified)
    const speedFactor = Math.sqrt(temperature / 300) * 2

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background - water
      ctx.fillStyle = isDark ? "rgba(20, 40, 80, 0.3)" : "rgba(200, 220, 255, 0.3)"
      ctx.fillRect(0, 0, width, height)

      // Update and draw molecules
      ctx.fillStyle = isDark ? "rgba(100, 150, 255, 0.4)" : "rgba(50, 100, 200, 0.4)"
      molecules.forEach((m) => {
        // Random walk
        m.vx += (Math.random() - 0.5) * speedFactor
        m.vy += (Math.random() - 0.5) * speedFactor

        // Limit speed
        const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy)
        if (speed > 3 * speedFactor) {
          m.vx = (m.vx / speed) * 3 * speedFactor
          m.vy = (m.vy / speed) * 3 * speedFactor
        }

        m.x += m.vx
        m.y += m.vy

        // Bounce off walls
        if (m.x < 0 || m.x > width) m.vx *= -1
        if (m.y < 0 || m.y > height) m.vy *= -1
        m.x = Math.max(0, Math.min(width, m.x))
        m.y = Math.max(0, Math.min(height, m.y))

        ctx.beginPath()
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update large particles
      particles.forEach((p) => {
        // Store trail
        if (showTrails) {
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 100) p.trail.shift()
        }

        // Brownian motion - random kicks from molecules
        let kickX = 0,
          kickY = 0
        molecules.forEach((m) => {
          const dx = p.x - m.x
          const dy = p.y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 20) {
            kickX += (dx / dist) * speedFactor * 0.3
            kickY += (dy / dist) * speedFactor * 0.3
          }
        })

        // Apply kick with damping
        p.x += kickX + (Math.random() - 0.5) * speedFactor * 0.5
        p.y += kickY + (Math.random() - 0.5) * speedFactor * 0.5

        // Keep in bounds
        p.x = Math.max(20, Math.min(width - 20, p.x))
        p.y = Math.max(20, Math.min(height - 20, p.y))

        // Draw trail
        if (showTrails && p.trail.length > 1) {
          ctx.strokeStyle = p.color.replace("60%)", "40%)")
          ctx.lineWidth = 1
          ctx.beginPath()
          p.trail.forEach((t, i) => {
            if (i === 0) ctx.moveTo(t.x, t.y)
            else ctx.lineTo(t.x, t.y)
          })
          ctx.stroke()
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, p.color.replace("60%)", "30%)"))
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Temperature indicator
      ctx.fillStyle = `rgba(255, ${String(200 - temperature / 5)}, ${String(100 - temperature / 10)}, 0.8)`
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`T = ${String(temperature)} K`, 10, 20)

      // Info
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.font = "9px sans-serif"
      ctx.fillText("H₂O molecules: 200", 10, height - 20)
      ctx.fillText(`Particles: ${particleCount}`, 10, height - 8)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [particleCount, temperature, showTrails, isDark])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded-lg"
        aria-label="Brownian motion: random particle movement"
        role="img"
      />

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-orange-400" : "text-orange-700"}>Temperature</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {temperature} K
            </span>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(v) => {
              setTemperature(v[0])
            }}
            min={100}
            max={1000}
            step={50}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>Particles</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {particleCount}
            </span>
          </div>
          <Slider
            value={[particleCount]}
            onValueChange={(v) => {
              setParticleCount(v[0])
            }}
            min={1}
            max={15}
            step={1}
          />
        </div>
      </div>

      <Button
        onClick={() => {
          setShowTrails(!showTrails)
        }}
        variant="outline"
        size="sm"
        className="w-full text-xs"
      >
        {showTrails ? "🔄 Hide trails" : "🔄 Show trails"}
      </Button>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`rounded p-2 border ${
            isDark ? "bg-blue-950/30 border-blue-500/20" : "bg-blue-50 border-blue-200"
          }`}
        >
          <div className={isDark ? "text-blue-400 font-semibold" : "text-blue-700 font-semibold"}>
            Brownian Motion
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Random particle motion</div>
        </div>
        <div
          className={`rounded p-2 border ${
            isDark ? "bg-orange-950/30 border-orange-500/20" : "bg-orange-50 border-orange-200"
          }`}
        >
          <div
            className={isDark ? "text-orange-400 font-semibold" : "text-orange-700 font-semibold"}
          >
            Brown, 1827
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Pollen in water</div>
        </div>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark ? "bg-blue-900/20 border-blue-500/20" : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className={isDark ? "text-blue-300 font-semibold" : "text-blue-700 font-semibold"}>
          🔬 Brownian Motion
        </div>
        <p className={isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          Large particles move randomly due to molecular collisions. Einstein (1905) explained this
          using molecular thermal energy: &lt;x²&gt; = 2Dt, where D is the diffusion coefficient.
        </p>
      </div>
    </div>
  )
}
