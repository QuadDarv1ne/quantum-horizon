"use client"

import { useRef, useState, useEffect } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface SuperconductivityVisualizationProps {
  isDark: boolean
}

export function SuperconductivityVisualization({ isDark }: SuperconductivityVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [temperature, setTemperature] = useState(100) // Kelvin
  const [criticalTemp, setCriticalTemp] = useState(90) // Tc for YBCO
  const [showMagneticField, setShowMagneticField] = useState(true)
  const [levitationHeight, setLevitationHeight] = useState(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let bgGradient: CanvasGradient | null = null
    let lastIsSuperconducting = false

    const resize = () => {
      setupCanvas(canvas, ctx)
      bgGradient = null
    }
    resize()
    window.addEventListener("resize", resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    const centerX = width / 2

    // Superconducting state
    const isSuperconducting = temperature < criticalTemp
    const targetHeight = isSuperconducting ? 40 : 0

    let time = 0
    let currentHeight = levitationHeight

    const animate = () => {
      time += 0.03

      // Smoothly animate levitation height
      currentHeight += (targetHeight - currentHeight) * 0.05
      setLevitationHeight(currentHeight)

      ctx.clearRect(0, 0, width, height)

      // Background gradient - cached based on state
      if (!bgGradient || lastIsSuperconducting !== isSuperconducting) {
        bgGradient = ctx.createLinearGradient(0, 0, width, height)
        if (isSuperconducting) {
          bgGradient.addColorStop(0, isDark ? "#0a1525" : "#1a2535")
          bgGradient.addColorStop(1, isDark ? "#152540" : "#253550")
        } else {
          bgGradient.addColorStop(0, isDark ? "#251510" : "#352520")
          bgGradient.addColorStop(1, isDark ? "#402520" : "#503530")
        }
        lastIsSuperconducting = isSuperconducting
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Temperature indicator
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`T = ${String(temperature)} K`, 10, 20)
      ctx.fillText(`Tc = ${String(criticalTemp)} K`, 10, 35)

      // Superconductor state indicator
      ctx.fillStyle = isSuperconducting ? "#60A5FA" : "#F87171"
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(
        isSuperconducting ? "✓ Сверхпроводник" : "✗ Нормальное состояние",
        width - 10,
        20
      )

      // Draw permanent magnet (top)
      const magnetY = 30
      const magnetWidth = 80
      const magnetHeight = 25

      // Magnet poles
      ctx.fillStyle = "#EF4444"
      ctx.fillRect(centerX - magnetWidth / 2, magnetY, magnetWidth / 2, magnetHeight)
      ctx.fillStyle = "#3B82F6"
      ctx.fillRect(centerX, magnetY, magnetWidth / 2, magnetHeight)

      // Magnet labels
      ctx.fillStyle = "white"
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("N", centerX - magnetWidth / 4, magnetY + 17)
      ctx.fillText("S", centerX + magnetWidth / 4, magnetY + 17)

      // Draw magnetic field lines
      if (showMagneticField) {
        ctx.strokeStyle = isSuperconducting
          ? isDark
            ? "rgba(96, 165, 250, 0.4)"
            : "rgba(59, 130, 246, 0.5)"
          : isDark
            ? "rgba(248, 113, 113, 0.4)"
            : "rgba(239, 68, 68, 0.5)"
        ctx.lineWidth = 1.5

        for (let i = 0; i < 5; i++) {
          const offset = (i - 2) * 15

          ctx.beginPath()
          if (isSuperconducting) {
            // Field lines bend around superconductor (Meissner effect)
            const superconductorY = magnetY + magnetHeight + currentHeight + 30
            const superconductorTop = superconductorY - 20

            ctx.moveTo(centerX + offset, magnetY + magnetHeight)
            ctx.quadraticCurveTo(
              centerX + offset * 2.5,
              (magnetY + magnetHeight + superconductorTop) / 2,
              centerX + offset,
              superconductorTop
            )
          } else {
            // Field lines penetrate normal material
            ctx.moveTo(centerX + offset, magnetY + magnetHeight)
            ctx.lineTo(centerX + offset, height - 30)
          }
          ctx.stroke()
        }
      }

      // Draw superconductor sample
      const sampleY = magnetY + magnetHeight + currentHeight + 30
      const sampleWidth = 100
      const sampleHeight = 40

      // Sample glow when superconducting
      if (isSuperconducting) {
        const glow = ctx.createRadialGradient(
          centerX,
          sampleY + sampleHeight / 2,
          0,
          centerX,
          sampleY + sampleHeight / 2,
          80
        )
        glow.addColorStop(0, isDark ? "rgba(96, 165, 250, 0.3)" : "rgba(59, 130, 246, 0.25)")
        glow.addColorStop(1, "rgba(96, 165, 250, 0)")
        ctx.fillStyle = glow
        ctx.fillRect(centerX - 80, sampleY - 20, 160, sampleHeight + 40)
      }

      // Sample body
      const sampleGradient = ctx.createLinearGradient(
        centerX - sampleWidth / 2,
        sampleY,
        centerX + sampleWidth / 2,
        sampleY + sampleHeight
      )
      if (isSuperconducting) {
        sampleGradient.addColorStop(0, "#1E3A5F")
        sampleGradient.addColorStop(0.5, "#2563EB")
        sampleGradient.addColorStop(1, "#1E3A5F")
      } else {
        sampleGradient.addColorStop(0, "#4A4A4A")
        sampleGradient.addColorStop(0.5, "#6B6B6B")
        sampleGradient.addColorStop(1, "#4A4A4A")
      }
      ctx.fillStyle = sampleGradient
      ctx.beginPath()
      ctx.roundRect(centerX - sampleWidth / 2, sampleY, sampleWidth, sampleHeight, 5)
      ctx.fill()

      // Sample label
      ctx.fillStyle = "white"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("YBCO (YBa₂Cu₃O₇)", centerX, sampleY + sampleHeight / 2 + 4)

      // Cooper pairs visualization (inside superconductor)
      if (isSuperconducting) {
        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(255, 255, 255, 0.9)"
        for (let i = 0; i < 4; i++) {
          const px = centerX - 35 + i * 25
          const py = sampleY + sampleHeight / 2 + Math.sin(time * 2 + i) * 3

          // Cooper pair (two electrons)
          ctx.beginPath()
          ctx.arc(px - 4, py, 3, 0, Math.PI * 2)
          ctx.arc(px + 4, py, 3, 0, Math.PI * 2)
          ctx.fill()

          // Connection line (pairing)
          ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 255, 255, 0.6)"
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.moveTo(px - 4, py)
          ctx.lineTo(px + 4, py)
          ctx.stroke()
        }
      }

      // Levitation arrow
      if (currentHeight > 5) {
        ctx.strokeStyle = "#4ADE80"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(centerX - 60, sampleY + sampleHeight / 2)
        ctx.lineTo(centerX - 70, sampleY + sampleHeight / 2)
        ctx.lineTo(centerX - 65, sampleY + sampleHeight / 2 - 5)
        ctx.moveTo(centerX - 70, sampleY + sampleHeight / 2)
        ctx.lineTo(centerX - 65, sampleY + sampleHeight / 2 + 5)
        ctx.stroke()

        ctx.fillStyle = "#4ADE80"
        ctx.font = "9px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("левитация", centerX - 65, sampleY + sampleHeight / 2 + 18)
      }

      // Temperature bar
      const barX = width - 30
      const barY = 50
      const barHeight = 80

      ctx.fillStyle = isDark ? "rgba(50, 50, 50, 0.5)" : "rgba(200, 200, 200, 0.5)"
      ctx.fillRect(barX - 8, barY, 16, barHeight)

      // Temperature fill
      const tempFill = 1 - temperature / 150
      const fillGradient = ctx.createLinearGradient(barX - 8, barY + barHeight, barX - 8, barY)
      fillGradient.addColorStop(0, "#3B82F6")
      fillGradient.addColorStop(0.5, "#8B5CF6")
      fillGradient.addColorStop(1, "#EF4444")
      ctx.fillStyle = fillGradient
      ctx.fillRect(barX - 6, barY + barHeight * (1 - tempFill), 12, barHeight * tempFill)

      // Critical temperature marker
      const tcY = barY + barHeight * (criticalTemp / 150)
      ctx.strokeStyle = "#FFD700"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(barX - 12, tcY)
      ctx.lineTo(barX + 12, tcY)
      ctx.stroke()
      ctx.fillStyle = "#FFD700"
      ctx.font = "8px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText("Tc", barX + 15, tcY + 3)

      // Formula
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
      ctx.font = "10px monospace"
      ctx.textAlign = "center"
      ctx.fillText("B = 0 внутри сверхпроводника (эффект Мейсснера)", centerX, height - 15)

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [temperature, criticalTemp, showMagneticField, levitationHeight, isDark])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isSuperconducting = temperature < criticalTemp

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        className="w-full h-[350px] rounded-lg"
        aria-label="Сверхпроводимость: эффект Мейсснера"
        role="img"
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-blue-400" : "text-blue-700"}>Температура T (K)</span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {temperature} K
            </span>
          </div>
          <Slider
            value={[temperature]}
            onValueChange={(v) => {
              setTemperature(v[0])
            }}
            min={4}
            max={150}
            step={1}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className={isDark ? "text-yellow-400" : "text-yellow-700"}>
              Критическая Tc (K)
            </span>
            <span className={isDark ? "text-white font-mono" : "text-gray-900 font-mono"}>
              {criticalTemp} K
            </span>
          </div>
          <Slider
            value={[criticalTemp]}
            onValueChange={(v) => {
              setCriticalTemp(v[0])
            }}
            min={20}
            max={120}
            step={5}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setShowMagneticField(!showMagneticField)
          }}
          variant="outline"
          size="sm"
          className={`flex-1 text-xs ${
            showMagneticField
              ? isDark
                ? "border-blue-500/50 text-blue-300"
                : "border-blue-500 text-blue-700"
              : ""
          }`}
        >
          🧲 Магнитное поле
        </Button>
        <Button
          onClick={() => {
            setTemperature(temperature < criticalTemp ? 120 : 77)
          }}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          {temperature < criticalTemp ? "🔥 Нагреть" : "❄️ Охладить"}
        </Button>
      </div>

      <div
        className={`rounded-lg p-3 border text-sm ${
          isDark ? "bg-blue-900/20 border-blue-500/20" : "bg-blue-50 border-blue-200"
        }`}
      >
        <div className={`font-semibold mb-1 ${isDark ? "text-blue-300" : "text-blue-700"}`}>
          ❄️ Сверхпроводимость (1911, Оннес)
        </div>
        <p className={isDark ? "text-gray-400 mt-1" : "text-gray-600 mt-1"}>
          При T &lt; Tc электрическое сопротивление падает до нуля. Эффект Мейсснера (1933):
          сверхпроводник полностью вытесняет магнитное поле — именно это позволяет магнитам
          левитировать!
        </p>
        <p className={`mt-1 ${isDark ? "text-cyan-400" : "text-cyan-700"}`}>
          Куперовские пары: электроны объединяются и движутся без сопротивления.
        </p>
      </div>
    </div>
  )
}
