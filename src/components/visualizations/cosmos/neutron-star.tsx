/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
"use client"

import { useRef, useState, useCallback } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import {
  useVisualizationStore,
  selectIsPlaying,
  selectAnimationSpeed,
} from "@/stores/visualization-store"

interface NeutronStarVisualizationProps {
  isDark: boolean
}

export function NeutronStarVisualization({ isDark }: NeutronStarVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [rotationPeriod, setRotationPeriod] = useState(33)
  const [magneticTilt, setMagneticTilt] = useState(45)

  const timeRef = useRef(0)
  const starGradients = useRef<{
    coreGradient: CanvasGradient
    beamGradient1: CanvasGradient
    beamGradient2: CanvasGradient
  } | null>(null)

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
      const starRadius = 25

      // Update time
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed * (1000 / rotationPeriod) * 0.1
      }
      const time = timeRef.current
      const tiltRad = (magneticTilt * Math.PI) / 180

      // Clear
      ctx.fillStyle = isDarkMode ? "#020208" : "#0a0a1a"
      ctx.fillRect(0, 0, width, height)

      // Background stars - pre-calculated positions
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(i * 123.456) * 0.5 + 0.5) * width
        const y = (Math.cos(i * 789.012) * 0.5 + 0.5) * height
        ctx.fillStyle = isDarkMode
          ? `rgba(255, 255, 255, ${String(0.2 + (Math.sin(i) * 0.5 + 0.5) * 0.2)})`
          : `rgba(255, 255, 255, ${String(0.3 + (Math.sin(i) * 0.5 + 0.5) * 0.2)})`
        ctx.beginPath()
        ctx.arc(x, y, 0.5, 0, Math.PI * 2)
        ctx.fill()
      }

      // Cache gradients (optimization)
      if (!starGradients.current) {
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

        const beamGradient1 = ctx.createLinearGradient(0, 0, 0, -150)
        beamGradient1.addColorStop(0, "rgba(100, 200, 255, 0.9)")
        beamGradient1.addColorStop(0.5, "rgba(100, 150, 255, 0.4)")
        beamGradient1.addColorStop(1, "rgba(100, 100, 255, 0)")

        const beamGradient2 = ctx.createLinearGradient(0, 0, 0, 150)
        beamGradient2.addColorStop(0, "rgba(100, 200, 255, 0.9)")
        beamGradient2.addColorStop(0.5, "rgba(100, 150, 255, 0.4)")
        beamGradient2.addColorStop(1, "rgba(100, 100, 255, 0)")

        starGradients.current = { coreGradient, beamGradient1, beamGradient2 }
      }

      const { coreGradient, beamGradient1, beamGradient2 } = starGradients.current

      // Magnetic field lines
      ctx.strokeStyle = isDarkMode ? "rgba(100, 150, 255, 0.3)" : "rgba(80, 130, 235, 0.4)"
      ctx.lineWidth = 1
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2
        ctx.beginPath()
        for (let t = 0; t <= 1; t += 0.02) {
          const r = starRadius * (1 + t * 4)
          const fieldAngle = angle + Math.sin(t * Math.PI * 2) * 0.5
          const x = centerX + Math.cos(fieldAngle + time) * r * Math.cos(tiltRad)
          const y = centerY + Math.sin(fieldAngle + time) * r
          if (t === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }

      // Pulsar beams
      const beamLength = 150
      const beamWidth = 15

      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(time)
      ctx.rotate(tiltRad)

      // Beam 1
      ctx.fillStyle = beamGradient1
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-beamWidth, -beamLength)
      ctx.lineTo(beamWidth, -beamLength)
      ctx.closePath()
      ctx.fill()

      // Beam 2 (opposite)
      ctx.fillStyle = beamGradient2
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.lineTo(-beamWidth, beamLength)
      ctx.lineTo(beamWidth, beamLength)
      ctx.closePath()
      ctx.fill()

      ctx.restore()

      // Neutron star core
      ctx.fillStyle = coreGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius, 0, Math.PI * 2)
      ctx.fill()

      // Surface glow
      ctx.strokeStyle = isDarkMode ? "rgba(150, 200, 255, 0.6)" : "rgba(100, 150, 235, 0.8)"
      ctx.lineWidth = 3
      ctx.stroke()

      // Hot spots at magnetic poles
      const spotSize = 8
      ctx.fillStyle = "#FFFFFF"
      ctx.beginPath()
      ctx.arc(
        centerX + Math.cos(time + tiltRad) * starRadius * 0.7,
        centerY + Math.sin(time + tiltRad) * starRadius * 0.7,
        spotSize,
        0,
        Math.PI * 2
      )
      ctx.fill()
      ctx.beginPath()
      ctx.arc(
        centerX - Math.cos(time + tiltRad) * starRadius * 0.7,
        centerY - Math.sin(time + tiltRad) * starRadius * 0.7,
        spotSize,
        0,
        Math.PI * 2
      )
      ctx.fill()

      // Rotation indicator
      ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(200, 200, 200, 0.4)"
      ctx.lineWidth = 1
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius + 40, 0, Math.PI * 2)
      ctx.stroke()
      ctx.setLineDash([])

      // Arrow showing rotation direction
      const arrowAngle = time + Math.PI / 4
      ctx.beginPath()
      ctx.arc(centerX, centerY, starRadius + 40, arrowAngle, arrowAngle + 0.5)
      ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.5)" : "rgba(200, 200, 200, 0.6)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Labels
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(255, 255, 255, 0.9)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`P = ${String(rotationPeriod)} ms`, centerX, height - 15)
      ctx.fillText(`f = ${String((1000 / rotationPeriod).toFixed(1))} Hz`, centerX, height - 3)
    },
    [isPlaying, animationSpeed, rotationPeriod, magneticTilt]
  )

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[400px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={setAnimationSpeed}
        isDark={isDark}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>Period</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
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
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
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
          className={`rounded border p-2 ${
            isDark ? "border-cyan-500/20 bg-cyan-950/30" : "border-cyan-200 bg-cyan-50"
          }`}
        >
          <div className={isDark ? "font-semibold text-cyan-400" : "font-semibold text-cyan-700"}>
            Pulsar PSR J1748-2446ad
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>P = 1.4 ms (716 Hz)</div>
        </div>
        <div
          className={`rounded border p-2 ${
            isDark ? "border-purple-500/20 bg-purple-950/30" : "border-purple-200 bg-purple-50"
          }`}
        >
          <div
            className={isDark ? "font-semibold text-purple-400" : "font-semibold text-purple-700"}
          >
            Magnetar SGR 1806-20
          </div>
          <div className={isDark ? "text-gray-400" : "text-gray-600"}>B ~ 10¹⁵ G</div>
        </div>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-cyan-500/20 bg-cyan-900/20" : "border-cyan-200 bg-cyan-50"
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
