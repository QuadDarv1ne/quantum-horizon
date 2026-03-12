/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Slider } from "@/components/ui/slider"

interface NeutronStarVisualizationProps {
  isDark: boolean
}

export function NeutronStarVisualization({ isDark }: NeutronStarVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [rotationPeriod, setRotationPeriod] = useState(33) // milliseconds
  const [magneticTilt, setMagneticTilt] = useState(45)

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
    const starRadius = 25

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Background
      ctx.fillStyle = isDark ? "#020208" : "#0a0a1a"
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Background stars
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(i * 123.456) * 0.5 + 0.5) * canvas.offsetWidth
        const y = (Math.cos(i * 789.012) * 0.5 + 0.5) * canvas.offsetHeight
        ctx.fillStyle = isDark
          ? `rgba(255, 255, 255, ${String(0.2 + Math.random() * 0.2)})`
          : `rgba(255, 255, 255, ${String(0.3 + Math.random() * 0.2)})`
        ctx.beginPath()
        ctx.arc(x, y, 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      const rotationAngle = time * (1000 / rotationPeriod) * 0.1
      const tiltRad = (magneticTilt * Math.PI) / 180

      // Magnetic field lines
      ctx.strokeStyle = isDark ? "rgba(100, 150, 255, 0.3)" : "rgba(80, 130, 235, 0.4)"
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        ctx.beginPath()
        for (let t = 0; t <= 1; t += 0.02) {
          const r = starRadius * (1 + t * 4)
          const fieldAngle = angle + Math.sin(t * Math.PI * 2) * 0.5
          const x = centerX + Math.cos(fieldAngle + rotationAngle) * r * Math.cos(tiltRad)
          const y = centerY + Math.sin(fieldAngle + rotationAngle) * r
          if (t === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Pulsar beams
      const beamLength = 150
      const beamWidth = 15

      // Beam 1
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotationAngle)
      ctx.rotate(tiltRad)

      const beamGradient1 = ctx.createLinearGradient(0, 0, 0, -beamLength)
      beamGradient1.addColorStop(0, "rgba(100, 200, 255, 0.9)")
      beamGradient1.addColorStop(0.5, "rgba(100, 150, 255, 0.4)")
      beamGradient1.addColorStop(1, "rgba(100, 100, 255, 0)")

      ctx.fillStyle = beamGradient1
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-beamWidth, -beamLength)
      ctx.lineTo(beamWidth, -beamLength)
      ctx.closePath()
      ctx.fill()

      // Beam 2 (opposite)
      const beamGradient2 = ctx.createLinearGradient(0, 0, 0, beamLength)
      beamGradient2.addColorStop(0, "rgba(100, 200, 255, 0.9)")
      beamGradient2.addColorStop(0.5, "rgba(100, 150, 255, 0.4)")
      beamGradient2.addColorStop(1, "rgba(100, 100, 255, 0)")

      ctx.fillStyle = beamGradient2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-beamWidth, beamLength)
      ctx.lineTo(beamWidth, beamLength)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // Neutron star core
      const coreGradient = ctx.createRadialGradient(
        centerX - 5,
        centerY - 5,
        0,
        centerX,
        centerY,
        starRadius
      )
      coreGradient.addColorStop(0, "#FFFFFF")
      coreGradient.addColorStop(0.3, "#E0E8FF")
      coreGradient.addColorStop(0.7, "#8090C0")
      coreGradient.addColorStop(1, "#4050A0")
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2)
      ctx.fill()

      // Surface glow
      ctx.strokeStyle = isDark ? "rgba(150, 200, 255, 0.6)" : "rgba(100, 150, 235, 0.8)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Hot spots at magnetic poles
      const spotSize = 8
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.arc(
        centerX + Math.cos(rotationAngle + tiltRad) * starRadius * 0.7,
        centerY + Math.sin(rotationAngle + tiltRad) * starRadius * 0.7,
        spotSize,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.beginPath()
      ctx.arc(
        centerX - Math.cos(rotationAngle + tiltRad) * starRadius * 0.7,
        centerY - Math.sin(rotationAngle + tiltRad) * starRadius * 0.7,
        spotSize,
        0,
        Math.PI * 2
      )
      ctx.fill()

      // Rotation indicator
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(200, 200, 200, 0.4)"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius + 40, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Arrow showing rotation direction
      const arrowAngle = rotationAngle + Math.PI / 4
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius + 40, arrowAngle, arrowAngle + 0.5)
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(200, 200, 200, 0.6)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Labels
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`P = ${String(rotationPeriod)} ms`, centerX, canvas.offsetHeight - 15)
      ctx.fillText(
        `f = ${String((1000 / rotationPeriod).toFixed(1))} Hz`,
        centerX,
        canvas.offsetHeight - 3
      )

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [rotationPeriod, magneticTilt, isDark])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[400px] rounded-lg"
        aria-label="Neutron star: rotating pulsar with magnetic field"
        role="img"
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>Period</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {rotationPeriod} ms
            </span>
          </div>
          <Slider
            value={[rotationPeriod]}
            onValueChange={(v) => {
              setRotationPeriod(v[0])
            }}
            min={1}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-blue-400" : "text-blue-700"}>Axis tilt</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {magneticTilt}°
            </span>
          </div>
          <Slider
            value={[magneticTilt]}
            onValueChange={(v) => {
              setMagneticTilt(v[0])
            }}
            min={0}
            max={90}
            step={1}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div
          className={`rounded p-2 border ${
            isDark ? "bg-cyan-950/30 border-cyan-500/20" : "bg-cyan-50 border-cyan-200"
          }`}
        >
          <div className={isDark ? "text-cyan-400 font-semibold" : "text-cyan-700 font-semibold"}>
            Pulsar PSR J1748-2446ad
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>P = 1.4 ms (716 Hz)</div>
        </div>
        <div
          className={`rounded p-2 border ${
            isDark ? "bg-purple-950/30 border-purple-500/20" : "bg-purple-50 border-purple-200"
          }`}
        >
          <div
            className={isDark ? "text-purple-400 font-semibold" : "text-purple-700 font-semibold"}
          >
            Magnetar SGR 1806-20
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>B ~ 10¹⁵ G</div>
        </div>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark ? "bg-cyan-900/20 border-cyan-500/20" : "bg-cyan-50 border-cyan-200"
        }`}
      >
        <p className={isDark ? "text-gray-300" : "text-gray-700"}>
          <span className={isDark ? "text-cyan-300" : "text-cyan-700"}>Neutron Star:</span>{" "}
          Supernova remnant with mass ~1.4-2 M☉ and radius ~10 km. Density ~10¹⁴ g/cm³ — a teaspoon
          weighs a billion tons!
        </p>
      </div>
    </div>
  )
}
