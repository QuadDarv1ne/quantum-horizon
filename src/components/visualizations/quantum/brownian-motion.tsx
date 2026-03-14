/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface BrownianMotionVisualizationProps {
  isDark: boolean
}

interface Particle {
  x: number
  y: number
  trail: Array<{ x: number; y: number }>
  color: string
}

interface Molecule {
  x: number
  y: number
  vx: number
  vy: number
}

export function BrownianMotionVisualization({ isDark }: BrownianMotionVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [particleCount, setParticleCount] = useState(5)
  const [temperature, setTemperature] = useState(300)
  const [showTrails, setShowTrails] = useState(true)

  const timeRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const moleculesRef = useRef<Molecule[]>([])
  const prevParticleCountRef = useRef(5)
  const prevTemperatureRef = useRef(300)

  // Initialize particles and molecules
  useEffect(() => {
    if (prevParticleCountRef.current !== particleCount) {
      particlesRef.current = []
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: 100 + (Math.random() - 0.5) * 100,
          y: 150 + (Math.random() - 0.5) * 50,
          trail: [],
          color: `hsl(${i * 60 + 200}, 70%, 60%)`,
        })
      }
      prevParticleCountRef.current = particleCount
    }
    if (prevTemperatureRef.current !== temperature) {
      moleculesRef.current = []
      for (let i = 0; i < 200; i++) {
        moleculesRef.current.push({
          x: Math.random() * 200,
          y: Math.random() * 300,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
        })
      }
      prevTemperatureRef.current = temperature
    }
  }, [particleCount, temperature])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      const isDarkMode = _isDark

      // Update time
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed
      }

      const speedFactor = Math.sqrt(temperature / 300) * 2

      // Background
      ctx.fillStyle = isDarkMode ? "rgba(20, 40, 80, 0.3)" : "rgba(200, 220, 255, 0.3)"
      ctx.fillRect(0, 0, width, height)

      // Update and draw molecules
      ctx.fillStyle = isDarkMode ? "rgba(100, 150, 255, 0.4)" : "rgba(50, 100, 200, 0.4)"
      moleculesRef.current.forEach((m) => {
        m.vx += (Math.random() - 0.5) * speedFactor
        m.vy += (Math.random() - 0.5) * speedFactor

        const speed = Math.sqrt(m.vx * m.vx + m.vy * m.vy)
        if (speed > 3 * speedFactor) {
          m.vx = (m.vx / speed) * 3 * speedFactor
          m.vy = (m.vy / speed) * 3 * speedFactor
        }

        m.x += m.vx
        m.y += m.vy

        if (m.x < 0 || m.x > width) m.vx *= -1
        if (m.y < 0 || m.y > height) m.vy *= -1
        m.x = Math.max(0, Math.min(width, m.x))
        m.y = Math.max(0, Math.min(height, m.y))

        ctx.beginPath()
        ctx.arc(m.x, m.y, 1.5, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update large particles
      particlesRef.current.forEach((p) => {
        if (showTrails) {
          p.trail.push({ x: p.x, y: p.y })
          if (p.trail.length > 100) p.trail.shift()
        }

        let kickX = 0,
          kickY = 0
        moleculesRef.current.forEach((m) => {
          const dx = p.x - m.x
          const dy = p.y - m.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 20) {
            kickX += (dx / dist) * speedFactor * 0.3
            kickY += (dy / dist) * speedFactor * 0.3
          }
        })

        p.x += kickX + (Math.random() - 0.5) * speedFactor * 0.5
        p.y += kickY + (Math.random() - 0.5) * speedFactor * 0.5

        p.x = Math.max(20, Math.min(width - 20, p.x))
        p.y = Math.max(20, Math.min(height - 20, p.y))

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

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10)
        gradient.addColorStop(0, p.color)
        gradient.addColorStop(1, p.color.replace("60%)", "30%)"))
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"
        ctx.lineWidth = 1
        ctx.stroke()
      })

      ctx.fillStyle = `rgba(255, ${String(200 - temperature / 5)}, ${String(100 - temperature / 10)}, 0.8)`
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`T = ${String(temperature)} K`, 10, 20)

      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.font = "9px sans-serif"
      ctx.fillText("H₂O molecules: 200", 10, height - 20)
      ctx.fillText(`Particles: ${particleCount}`, 10, height - 8)
    },
    [isPlaying, animationSpeed, temperature, particleCount, showTrails]
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

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-orange-400" : "text-orange-700"}>Temperature</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
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
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
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
          className={`rounded border p-2 ${
            isDark ? "border-blue-500/20 bg-blue-950/30" : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className={isDark ? "font-semibold text-blue-400" : "font-semibold text-blue-700"}>
            Brownian Motion
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Random particle motion</div>
        </div>
        <div
          className={`rounded border p-2 ${
            isDark ? "border-orange-500/20 bg-orange-950/30" : "border-orange-200 bg-orange-50"
          }`}
        >
          <div
            className={isDark ? "font-semibold text-orange-400" : "font-semibold text-orange-700"}
          >
            Brown, 1827
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>Pollen in water</div>
        </div>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-blue-500/20 bg-blue-900/20" : "border-blue-200 bg-blue-50"
        }`}
      >
        <div className={isDark ? "font-semibold text-blue-300" : "font-semibold text-blue-700"}>
          🔬 Brownian Motion
        </div>
        <p className={isDark ? "mt-1 text-gray-400" : "mt-1 text-gray-600"}>
          Large particles move randomly due to molecular collisions. Einstein (1905) explained this
          using molecular thermal energy: &lt;x²&gt; = 2Dt, where D is the diffusion coefficient.
        </p>
      </div>
    </div>
  )
}
