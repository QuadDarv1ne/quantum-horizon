/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Slider } from "@/components/ui/slider"

interface WhiteHoleVisualizationProps {
  isDark: boolean
}

export function WhiteHoleVisualization({ isDark }: WhiteHoleVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [massSolar, setMassSolar] = useState(10)

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

    const centerX = canvas.offsetWidth / 2
    const centerY = canvas.offsetHeight / 2
    const baseRadius = 20 + massSolar * 1.2
    const eventHorizonRadius = Math.min(baseRadius, 55)

    const stars: Array<{ x: number; y: number; brightness: number }> = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        brightness: 0.3 + Math.random() * 0.7,
      })
    }

    // Outward flowing particles (opposite of black hole)
    const outflowParticles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      size: number
      color: string
    }> = []

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Background
      ctx.fillStyle = isDark ? "#f0f5ff" : "#e8f0ff"
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Background stars (dimmer due to bright background)
      stars.forEach((star) => {
        ctx.fillStyle = isDark
          ? `rgba(100, 100, 150, ${star.brightness * 0.2})`
          : `rgba(80, 80, 120, ${star.brightness * 0.3})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, 0.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Space-time grid (curved outward - opposite of black hole)
      ctx.strokeStyle = isDark ? "rgba(100, 150, 255, 0.15)" : "rgba(80, 130, 235, 0.2)"
      ctx.lineWidth = 0.5
      for (let i = -10; i <= 10; i++) {
        ctx.beginPath()
        for (let x = 0; x <= canvas.offsetWidth; x += 4) {
          const baseY = centerY + i * 16
          const dx = x - centerX
          const dy = baseY - centerY
          const dist = Math.sqrt(dx * dx + dy * dy)
          let warpedY = baseY
          if (dist > eventHorizonRadius && dist < 180) {
            const warpStrength = Math.pow(180 / dist, 2) * 8
            warpedY = baseY - (dy / dist) * warpStrength
          }
          if (x === 0) ctx.moveTo(x, warpedY)
          else ctx.lineTo(x, warpedY)
        }
        ctx.stroke()
      }

      // Outflow particles (matter being expelled)
      if (Math.random() < 0.15) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1 + Math.random() * 2
        outflowParticles.push({
          x: centerX + Math.cos(angle) * (eventHorizonRadius + 5),
          y: centerY + Math.sin(angle) * (eventHorizonRadius + 5),
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 1 + Math.random() * 2,
          color: `hsl(${200 + Math.random() * 60}, 80%, 70%)`,
        })
      }

      for (let i = outflowParticles.length - 1; i >= 0; i--) {
        const p = outflowParticles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.008
        if (
          p.life <= 0 ||
          p.x < 0 ||
          p.x > canvas.offsetWidth ||
          p.y < 0 ||
          p.y > canvas.offsetHeight
        ) {
          outflowParticles.splice(i, 1)
          continue
        }
        ctx.fillStyle = p.color.replace("70%", `${String(70 * p.life)}%`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2)
        ctx.fill()
      }

      // Light rays emanating outward
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.3
        const innerR = eventHorizonRadius + 5
        const outerR = eventHorizonRadius + 30 + Math.sin(time * 2 + i) * 10

        ctx.strokeStyle = isDark ? "rgba(255, 220, 100, 0.4)" : "rgba(255, 200, 80, 0.5)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX + Math.cos(angle) * innerR, centerY + Math.sin(angle) * innerR)
        ctx.lineTo(centerX + Math.cos(angle) * outerR, centerY + Math.sin(angle) * outerR)
        ctx.stroke()
      }

      // Glowing white core
      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        eventHorizonRadius
      )
      coreGradient.addColorStop(0, "#FFFFFF")
      coreGradient.addColorStop(0.3, "#F0F8FF")
      coreGradient.addColorStop(0.7, "#E0F0FF")
      coreGradient.addColorStop(1, "#C0E0FF")
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2)
      ctx.fill()

      // Outer glow
      const glowGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        eventHorizonRadius,
        centerX,
        centerY,
        eventHorizonRadius + 30
      )
      glowGradient.addColorStop(0, "rgba(200, 230, 255, 0.8)")
      glowGradient.addColorStop(1, "rgba(200, 230, 255, 0)")
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius + 30, 0, Math.PI * 2)
      ctx.fill()

      // Event horizon ring
      ctx.strokeStyle = isDark ? "rgba(100, 180, 255, 0.8)" : "rgba(80, 160, 235, 0.9)"
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(centerX, centerY, eventHorizonRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Label
      ctx.fillStyle = isDark ? "rgba(50, 50, 100, 0.8)" : "rgba(30, 30, 80, 0.9)"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("White Hole", centerX, canvas.offsetHeight - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [massSolar, isDark])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded-lg"
        aria-label="White hole: theoretical reverse of black hole"
        role="img"
      />

      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>Mass</span>
          <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
            {massSolar} M☉
          </span>
        </div>
        <Slider
          value={[massSolar]}
          onValueChange={(v) => {
            setMassSolar(v[0])
          }}
          min={1}
          max={50}
          step={1}
        />
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark ? "bg-cyan-900/20 border-cyan-500/20" : "bg-cyan-50 border-cyan-200"
        }`}
      >
        <div className={isDark ? "text-cyan-300 font-semibold" : "text-cyan-700 font-semibold"}>
          ⚪ What is a White Hole?
        </div>
        <p className={isDark ? "text-gray-300 mt-1" : "text-gray-700 mt-1"}>
          A theoretical object, the reverse of a black hole. Matter can only <strong>leave</strong>{" "}
          it, but cannot enter from outside. It exists only as a mathematical solution to Einstein's
          field equations, but has never been observed.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`rounded p-2 border ${
            isDark ? "bg-gray-800/50 border-gray-700" : "bg-gray-100 border-gray-300"
          }`}
        >
          <div className={isDark ? "text-red-400 font-semibold" : "text-red-600 font-semibold"}>
            🕳️ Black Hole
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>
            Everything enters, nothing escapes
          </div>
        </div>
        <div
          className={`rounded p-2 border ${
            isDark ? "bg-cyan-950/30 border-cyan-500/20" : "bg-cyan-50 border-cyan-200"
          }`}
        >
          <div className={isDark ? "text-cyan-400 font-semibold" : "text-cyan-700 font-semibold"}>
            ⚪ White Hole
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>
            Everything escapes, nothing enters
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark ? "bg-purple-900/20 border-purple-500/20" : "bg-purple-50 border-purple-200"
        }`}
      >
        <div className={isDark ? "text-purple-300 font-semibold" : "text-purple-700 font-semibold"}>
          🌌 Wormholes
        </div>
        <p className={isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          A black hole and white hole could be connected by an "Einstein-Rosen bridge" — a
          hypothetical tunnel through spacetime.
        </p>
      </div>
    </div>
  )
}
