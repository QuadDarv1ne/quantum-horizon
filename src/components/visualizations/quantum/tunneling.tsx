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

interface TunnelingVisualizationProps {
  isDark: boolean
}

export function TunnelingVisualization({ isDark }: TunnelingVisualizationProps) {
  const isPlaying = useVisualizationStore(selectIsPlaying)
  const animationSpeed = useVisualizationStore(selectAnimationSpeed)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [barrierHeight, setBarrierHeight] = useState(50)
  const [barrierWidth, setBarrierWidth] = useState(30)
  const [energy, setEnergy] = useState(30)

  const timeRef = useRef(0)

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
      const time = timeRef.current

      ctx.fillStyle = isDarkMode ? "#050510" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      const baseY = height * 0.6
      const waveAmplitude = 40

      // Energy level line
      const energyY = baseY - (energy / 100) * 80
      ctx.strokeStyle = isDarkMode ? "rgba(255, 200, 100, 0.5)" : "rgba(255, 150, 50, 0.5)"
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(0, energyY)
      ctx.lineTo(width, energyY)
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = isDarkMode ? "rgba(255, 200, 100, 0.7)" : "rgba(255, 150, 50, 0.7)"
      ctx.font = "10px sans-serif"
      ctx.fillText("E (particle energy)", 10, energyY - 5)

      // Potential barrier
      const barrierX = width * 0.35
      const barrierW = (barrierWidth / 100) * width * 0.4
      const barrierTop = baseY - (barrierHeight / 100) * 80

      ctx.fillStyle = isDarkMode ? "rgba(255, 100, 100, 0.3)" : "rgba(255, 100, 100, 0.2)"
      ctx.fillRect(barrierX, barrierTop, barrierW, baseY - barrierTop)
      ctx.strokeStyle = isDarkMode ? "rgba(255, 100, 100, 0.8)" : "rgba(255, 50, 50, 0.8)"
      ctx.lineWidth = 2
      ctx.strokeRect(barrierX, barrierTop, barrierW, baseY - barrierTop)

      ctx.fillStyle = isDarkMode ? "rgba(255, 100, 100, 0.8)" : "rgba(255, 50, 50, 0.8)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Barrier V₀", barrierX + barrierW / 2, barrierTop - 5)

      // Calculate transmission probability (simplified)
      const transmissionProb =
        energy < barrierHeight
          ? Math.exp(-2 * Math.sqrt((barrierHeight - energy) / 20) * (barrierWidth / 20))
          : 1 -
            Math.pow(
              (Math.sqrt(barrierHeight / energy) - 1) / (Math.sqrt(barrierHeight / energy) + 1),
              2
            )

      // Wave function
      const k1 = 0.15
      const k2Real =
        energy > barrierHeight
          ? k1 * Math.sqrt(energy / barrierHeight)
          : k1 * Math.sqrt((barrierHeight - energy) / 50)
      const isOscillating = energy > barrierHeight

      // Incoming wave (left of barrier)
      ctx.beginPath()
      ctx.strokeStyle = isDarkMode ? "#60A5FA" : "#2563EB"
      ctx.lineWidth = 2
      for (let x = 0; x < barrierX; x++) {
        const waveX = x - ((time * 80) % width)
        const psi = Math.sin(waveX * k1) * Math.exp(-Math.pow((x - barrierX + 50) / 100, 2))
        const y = energyY + psi * waveAmplitude
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Inside barrier
      ctx.beginPath()
      ctx.strokeStyle =
        energy > barrierHeight
          ? isDarkMode
            ? "#60A5FA"
            : "#2563EB"
          : isDarkMode
            ? "#F472B6"
            : "#DB2777"
      ctx.lineWidth = 2
      for (let x = barrierX; x < barrierX + barrierW; x++) {
        const relX = (x - barrierX) / barrierW
        let psi
        if (isOscillating) {
          psi = Math.sin(x * k2Real - time * 50) * (1 - relX * 0.3)
        } else {
          psi = Math.exp(-relX * barrierW * k2Real * 0.5) * Math.cos(x * k1 - time * 50)
        }
        const y = energyY + psi * waveAmplitude * 0.5
        if (x === barrierX) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Transmitted wave (right of barrier)
      ctx.beginPath()
      ctx.strokeStyle = isDarkMode ? "#4ADE80" : "#16A34A"
      ctx.lineWidth = 2
      const transmittedAmplitude = waveAmplitude * Math.sqrt(transmissionProb)
      for (let x = barrierX + barrierW; x < width; x++) {
        const waveX = x - ((time * 80) % width)
        const psi =
          ((Math.sin(waveX * k1) * transmittedAmplitude) / waveAmplitude) *
          Math.exp(-Math.pow((x - barrierX - barrierW - 30) / 150, 2))
        const y = energyY + psi * transmittedAmplitude
        if (x === barrierX + barrierW) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Probability display
      ctx.fillStyle = isDarkMode ? "#fff" : "#000"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(`Tunneling probability: ${(transmissionProb * 100).toFixed(1)}%`, width / 2, 25)

      // Labels
      ctx.font = "9px sans-serif"
      ctx.fillStyle = isDarkMode ? "#60A5FA" : "#2563EB"
      ctx.textAlign = "left"
      ctx.fillText("Incident wave", 10, baseY + 20)
      ctx.fillStyle = isDarkMode ? "#4ADE80" : "#16A34A"
      ctx.fillText("Transmitted wave", width - 120, baseY + 20)
    },
    [isPlaying, animationSpeed, barrierHeight, barrierWidth, energy]
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

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-yellow-400" : "text-yellow-700"}>E</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {energy}%
            </span>
          </div>
          <Slider
            value={[energy]}
            onValueChange={(v) => {
              setEnergy(v[0])
            }}
            min={10}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-red-400" : "text-red-700"}>V₀</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {barrierHeight}%
            </span>
          </div>
          <Slider
            value={[barrierHeight]}
            onValueChange={(v) => {
              setBarrierHeight(v[0])
            }}
            min={20}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-orange-400" : "text-orange-700"}>Width</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {barrierWidth}%
            </span>
          </div>
          <Slider
            value={[barrierWidth]}
            onValueChange={(v) => {
              setBarrierWidth(v[0])
            }}
            min={10}
            max={80}
            step={1}
          />
        </div>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-green-500/20 bg-green-900/20" : "border-green-200 bg-green-50"
        }`}
      >
        <p className={isDark ? "text-gray-300" : "text-gray-700"}>
          <span className={isDark ? "text-green-300" : "text-green-700"}>Tunnel effect:</span> A
          particle can pass through a barrier even if its energy is less than the barrier height!
          This is impossible in classical physics, but explains α-decay and the operation of
          tunneling microscopes.
        </p>
      </div>
    </div>
  )
}
