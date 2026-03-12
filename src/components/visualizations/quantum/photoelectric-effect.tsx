"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Slider } from "@/components/ui/slider"

interface PhotoelectricEffectVisualizationProps {
  isDark: boolean
}

export function PhotoelectricEffectVisualization({ isDark }: PhotoelectricEffectVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [frequency, setFrequency] = useState(50) // as % of threshold
  const [intensity, setIntensity] = useState(50)
  const [workFunction, setWorkFunction] = useState(2.5) // eV

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

    // Metal surface
    const metalY = height * 0.6
    const metalHeight = height * 0.3

    // Photons
    const photons: Array<{ x: number; y: number; vx: number; vy: number; energy: number }> = []
    // Electrons
    const electrons: Array<{ x: number; y: number; vx: number; vy: number; life: number }> = []

    // Calculate photon energy based on frequency
    const photonEnergy = (frequency / 100) * 6 // eV (simplified)
    const canEmit = photonEnergy >= workFunction
    const kineticEnergy = Math.max(0, photonEnergy - workFunction)

    let time = 0

    const animate = () => {
      time += 0.016
      ctx.clearRect(0, 0, width, height)

      // Background
      ctx.fillStyle = isDark ? "#0a0a15" : "#f8fafc"
      ctx.fillRect(0, 0, width, height)

      // Metal plate
      const metalGradient = ctx.createLinearGradient(0, metalY, 0, height)
      metalGradient.addColorStop(0, isDark ? "#4a4a6a" : "#9a9aba")
      metalGradient.addColorStop(0.5, isDark ? "#3a3a5a" : "#8a8aaa")
      metalGradient.addColorStop(1, isDark ? "#2a2a4a" : "#7a7a9a")
      ctx.fillStyle = metalGradient
      ctx.fillRect(50, metalY, width - 100, metalHeight)

      // Metal surface highlight
      ctx.strokeStyle = isDark ? "#6a6a8a" : "#aaaacc"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(50, metalY)
      ctx.lineTo(width - 50, metalY)
      ctx.stroke()

      // Metal label
      ctx.fillStyle = isDark ? "#888" : "#666"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Metal plate", width / 2, metalY + metalHeight / 2)

      // Light source
      ctx.fillStyle = isDark ? "#FFD700" : "#FFA500"
      ctx.beginPath()
      ctx.arc(30, height * 0.3, 15, 0, Math.PI * 2)
      ctx.fill()

      // Light rays
      ctx.strokeStyle = `rgba(255, 200, 50, ${String(0.3 + intensity / 200)})`
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(45, height * 0.3 + (i - 2) * 8)
        ctx.lineTo(100, metalY - 10)
        ctx.stroke()
      }

      // Spawn photons based on intensity
      if (Math.random() < intensity / 100) {
        photons.push({
          x: 50,
          y: height * 0.3 + (Math.random() - 0.5) * 20,
          vx: 3 + Math.random(),
          vy: (metalY - height * 0.3) / 50 + (Math.random() - 0.5) * 0.5,
          energy: photonEnergy,
        })
      }

      // Update and draw photons
      for (let i = photons.length - 1; i >= 0; i--) {
        const p = photons[i]
        p.x += p.vx
        p.y += p.vy

        // Draw photon as wave packet
        const wavelength = 30 - (frequency / 100) * 20
        ctx.strokeStyle =
          frequency > 50
            ? `rgba(150, 50, 255, 0.8)` // UV
            : `rgba(255, 200, 50, 0.8)` // Visible
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let dx = -15; dx <= 15; dx++) {
          const waveY = p.y + Math.sin(((dx + time * 20) / wavelength) * Math.PI * 2) * 5
          if (dx === -15) ctx.moveTo(p.x + dx, waveY)
          else ctx.lineTo(p.x + dx, waveY)
        }
        ctx.stroke()

        // Check collision with metal
        if (p.y >= metalY - 5) {
          // Emit electron if energy > work function
          if (canEmit && Math.random() < 0.7) {
            const eVx = (Math.random() - 0.3) * 2
            const eVy = -2 - kineticEnergy * 1.5 - Math.random() * 2
            electrons.push({
              x: p.x,
              y: metalY - 5,
              vx: eVx,
              vy: eVy,
              life: 1,
            })
          }
          photons.splice(i, 1)
        }
      }

      // Update and draw electrons
      for (let i = electrons.length - 1; i >= 0; i--) {
        const e = electrons[i]
        e.x += e.vx
        e.y += e.vy
        e.vy += 0.02 // gravity
        e.life -= 0.005

        if (e.life <= 0 || e.y > height) {
          electrons.splice(i, 1)
          continue
        }

        // Draw electron
        ctx.fillStyle = `rgba(100, 200, 255, ${String(e.life)})`
        ctx.beginPath()
        ctx.arc(e.x, e.y, 4, 0, Math.PI * 2)
        ctx.fill()

        // Electron trail
        ctx.strokeStyle = `rgba(100, 200, 255, ${String(e.life * 0.3)})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(e.x, e.y)
        ctx.lineTo(e.x - e.vx * 5, e.y - e.vy * 5)
        ctx.stroke()
      }

      // Energy diagram
      const diagramX = width - 80
      const diagramY = 30
      const diagramH = 80

      // Work function level
      ctx.strokeStyle = "rgba(255, 150, 100, 0.8)"
      ctx.setLineDash([3, 3])
      ctx.beginPath()
      ctx.moveTo(diagramX - 30, diagramY + diagramH * (1 - workFunction / 6))
      ctx.lineTo(diagramX + 30, diagramY + diagramH * (1 - workFunction / 6))
      ctx.stroke()
      ctx.setLineDash([])

      ctx.fillStyle = "rgba(255, 150, 100, 0.8)"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(
        `W = ${workFunction} eV`,
        diagramX - 28,
        diagramY + diagramH * (1 - workFunction / 6) - 3
      )

      // Photon energy level
      ctx.strokeStyle = frequency > 50 ? "rgba(150, 50, 255, 0.8)" : "rgba(255, 200, 50, 0.8)"
      ctx.beginPath()
      ctx.moveTo(diagramX - 30, diagramY + diagramH * (1 - photonEnergy / 6))
      ctx.lineTo(diagramX + 30, diagramY + diagramH * (1 - photonEnergy / 6))
      ctx.stroke()

      ctx.fillStyle = frequency > 50 ? "rgba(150, 50, 255, 0.8)" : "rgba(255, 200, 50, 0.8)"
      ctx.fillText(
        `hν = ${photonEnergy.toFixed(1)} eV`,
        diagramX - 28,
        diagramY + diagramH * (1 - photonEnergy / 6) - 3
      )

      // Labels
      ctx.fillStyle = isDark ? "#888" : "#666"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Energy", diagramX, diagramY - 5)

      // Status
      ctx.fillStyle = canEmit ? "#90EE90" : "#FF6B6B"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(canEmit ? "✓ Photoelectric effect!" : "✗ hν < W", 10, 20)

      if (canEmit) {
        ctx.fillStyle = canEmit ? (isDark ? "#90EE90" : "#006400") : "#FF6B6B"
        ctx.font = "10px sans-serif"
        ctx.fillText(`E_kin = ${(kineticEnergy * 1.6e-19).toExponential(1)} J`, 10, 35)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [frequency, intensity, workFunction, isDark])

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded-lg"
        aria-label="Photoelectric effect: electron emission by light"
        role="img"
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-purple-400" : "text-purple-700"}>Frequency ν</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {(frequency * 0.8 + 400).toFixed(0)} THz
            </span>
          </div>
          <Slider
            value={[frequency]}
            onValueChange={(v) => {
              setFrequency(v[0])
            }}
            min={10}
            max={100}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-yellow-400" : "text-yellow-700"}>Intensity</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {intensity}%
            </span>
          </div>
          <Slider
            value={[intensity]}
            onValueChange={(v) => {
              setIntensity(v[0])
            }}
            min={10}
            max={100}
            step={5}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-orange-400" : "text-orange-700"}>Work function</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {workFunction} eV
            </span>
          </div>
          <Slider
            value={[workFunction * 10]}
            onValueChange={(v) => {
              setWorkFunction(v[0] / 10)
            }}
            min={10}
            max={50}
            step={1}
          />
        </div>
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
            Einstein equation
          </div>
          <div className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
            hν = W + E_kin
          </div>
        </div>
        <div
          className={`rounded p-2 border ${
            isDark
              ? "bg-green-950/30 border-green-500/20"
              : "bg-green-50 border-green-200"
          }`}
        >
          <div className={isDark ? "text-green-400 font-semibold" : "text-green-700 font-semibold"}>
            Kinetic energy
          </div>
          <div className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
            E = hν - W
          </div>
        </div>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark
            ? "bg-yellow-900/20 border-yellow-500/20"
            : "bg-yellow-50 border-yellow-200"
        }`}
      >
        <div className={isDark ? "text-yellow-300 font-semibold" : "text-yellow-700 font-semibold"}>
          ⚡ Photoelectric Effect (Einstein, 1905)
        </div>
        <p className={isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          Light consists of quanta (photons). Electrons are emitted only if hν ≥ W. Intensity
          affects the number of electrons, not their energy!
        </p>
      </div>
    </div>
  )
}
