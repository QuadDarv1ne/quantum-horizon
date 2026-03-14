/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface AtomicModelVisualizationProps {
  isDark: boolean
}

type ElementKey = "H" | "He" | "Li" | "C" | "Na"

interface ElementData {
  protons: number
  electrons: number
  shells: number[]
  name: string
  color: string
}

interface Electron {
  shellIndex: number
  baseAngle: number
}

export function AtomicModelVisualization({ isDark }: AtomicModelVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [element, setElement] = useState<ElementKey>("H")
  const [showTransitions, setShowTransitions] = useState(true)
  const [selectedTransition, setSelectedTransition] = useState<{ from: number; to: number } | null>(
    null
  )

  const timeRef = useRef(0)
  const electronAnglesRef = useRef<number[]>([])
  const shellRadiiRef = useRef<number[]>([])
  const nucleusGradientRef = useRef<CanvasGradient | null>(null)
  const bgGradientRef = useRef<CanvasGradient | null>(null)

  const elements: Record<ElementKey, ElementData> = {
    H: { protons: 1, electrons: 1, shells: [1], name: "Водород", color: "#FF6B6B" },
    He: { protons: 2, electrons: 2, shells: [2], name: "Гелий", color: "#4ECDC4" },
    Li: { protons: 3, electrons: 3, shells: [2, 1], name: "Литий", color: "#45B7D1" },
    C: { protons: 6, electrons: 6, shells: [2, 4], name: "Углерод", color: "#96CEB4" },
    Na: { protons: 11, electrons: 11, shells: [2, 8, 1], name: "Натрий", color: "#FFEAA7" },
  }

  const currentElement = elements[element]

  // Initialize electron angles when element changes
  useEffect(() => {
    const angles: number[] = []
    let totalElectrons = 0
    currentElement.shells.forEach((count) => {
      for (let i = 0; i < count; i++) {
        angles.push((totalElectrons * (360 / currentElement.electrons) * Math.PI) / 180)
        totalElectrons++
      }
    })
    electronAnglesRef.current = angles
  }, [currentElement])

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
      const maxRadius = Math.min(width, height) * 0.4

      // Update time
      if (isPlaying) {
        timeRef.current += (delta / 1000) * animationSpeed
      }
      const time = timeRef.current

      // Calculate shell radii
      shellRadiiRef.current = currentElement.shells.map(
        (_, i) => (maxRadius * (i + 1)) / currentElement.shells.length
      )
      const shellRadii = shellRadiiRef.current

      // Clear
      ctx.fillStyle = isDarkMode ? "#0a0a20" : "#1a1a3e"
      ctx.fillRect(0, 0, width, height)

      // Background gradient (cached)
      if (!bgGradientRef.current) {
        const bgGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          0,
          centerX,
          centerY,
          maxRadius + 30
        )
        bgGradient.addColorStop(0, isDarkMode ? "#0a0a20" : "#1a1a3e")
        bgGradient.addColorStop(1, isDarkMode ? "#050510" : "#0f0f2d")
        bgGradientRef.current = bgGradient
      }
      ctx.fillStyle = bgGradientRef.current
      ctx.fillRect(0, 0, width, height)

      // Draw electron shells (orbits)
      shellRadii.forEach((radius, shellIndex) => {
        ctx.strokeStyle = isDarkMode
          ? `rgba(100, 150, 255, ${String(0.3 - shellIndex * 0.05)})`
          : `rgba(80, 130, 235, ${String(0.4 - shellIndex * 0.05)})`
        ctx.lineWidth = 1
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = isDarkMode ? "rgba(150, 180, 255, 0.5)" : "rgba(130, 160, 235, 0.6)"
        ctx.font = "9px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(`n=${String(shellIndex + 1)}`, centerX + radius + 15, centerY)
      })

      // Draw nucleus (cached gradient)
      const nucleusRadius = 15 + currentElement.protons * 0.5
      if (!nucleusGradientRef.current) {
        const nucleusGradient = ctx.createRadialGradient(
          centerX - nucleusRadius / 3,
          centerY - nucleusRadius / 3,
          0,
          centerX,
          centerY,
          nucleusRadius
        )
        nucleusGradient.addColorStop(0, currentElement.color)
        nucleusGradient.addColorStop(0.7, currentElement.color + "b3")
        nucleusGradient.addColorStop(
          1,
          isDarkMode ? "rgba(50, 50, 80, 0.8)" : "rgba(40, 40, 70, 0.8)"
        )
        nucleusGradientRef.current = nucleusGradient
      }

      ctx.fillStyle = nucleusGradientRef.current
      ctx.beginPath()
      ctx.arc(centerX, centerY, nucleusRadius, 0, Math.PI * 2)
      ctx.fill()

      // Draw protons and neutrons
      const nucleonCount = currentElement.protons + Math.round(currentElement.protons * 1.1)
      for (let i = 0; i < Math.min(nucleonCount, 15); i++) {
        const angle = (i / 15) * Math.PI * 2
        const r = nucleusRadius * 0.5 * Math.sqrt(i / 15)
        const nx = centerX + Math.cos(angle + time * 0.5) * r
        const ny = centerY + Math.sin(angle + time * 0.5) * r

        ctx.fillStyle =
          i < currentElement.protons ? "rgba(255, 100, 100, 0.8)" : "rgba(100, 150, 255, 0.8)"
        ctx.beginPath()
        ctx.arc(nx, ny, 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Element symbol
      ctx.fillStyle = isDarkMode ? "#fff" : "#000"
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(element, centerX, centerY + 5)

      // Draw electrons
      const electrons: Electron[] = []
      let electronIndex = 0
      currentElement.shells.forEach((count, shellIndex) => {
        for (let i = 0; i < count; i++) {
          electrons.push({ shellIndex, baseAngle: electronAnglesRef.current[electronIndex] })
          electronIndex++
        }
      })

      electrons.forEach((e) => {
        const radius = shellRadii[e.shellIndex]
        const shellSpeed = 2 - e.shellIndex * 0.3
        const angle = e.baseAngle + time * shellSpeed
        const ex = centerX + Math.cos(angle) * radius
        const ey = centerY + Math.sin(angle) * radius

        // Electron glow
        const electronGlow = ctx.createRadialGradient(ex, ey, 0, ex, ey, 8)
        electronGlow.addColorStop(0, "rgba(100, 200, 255, 0.8)")
        electronGlow.addColorStop(1, "rgba(100, 200, 255, 0)")
        ctx.fillStyle = electronGlow
        ctx.beginPath()
        ctx.arc(ex, ey, 8, 0, Math.PI * 2)
        ctx.fill()

        // Electron core
        ctx.fillStyle = "#64B5F6"
        ctx.beginPath()
        ctx.arc(ex, ey, 4, 0, Math.PI * 2)
        ctx.fill()

        // Electron trail
        ctx.strokeStyle = "rgba(100, 200, 255, 0.2)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, angle - 0.5, angle)
        ctx.stroke()
      })

      // Show transition animation
      if (showTransitions && selectedTransition) {
        const fromRadius = shellRadii[selectedTransition.from - 1]
        const toRadius = shellRadii[selectedTransition.to - 1]
        const transitionProgress = (Math.sin(time * 3) + 1) / 2
        const currentRadius = fromRadius + (toRadius - fromRadius) * transitionProgress

        const photonX = centerX + currentRadius
        const photonY = centerY

        ctx.fillStyle =
          selectedTransition.to > selectedTransition.from
            ? "rgba(255, 255, 100, 0.9)"
            : "rgba(255, 100, 100, 0.9)"

        ctx.beginPath()
        ctx.arc(photonX, photonY, 6, 0, Math.PI * 2)
        ctx.fill()

        ctx.strokeStyle =
          selectedTransition.to > selectedTransition.from
            ? "rgba(255, 255, 100, 0.5)"
            : "rgba(255, 100, 100, 0.5)"
        ctx.lineWidth = 1
        ctx.beginPath()
        for (let x = photonX + 10; x < width - 20; x += 2) {
          const y = photonY + Math.sin((x - photonX) * 0.2 + time * 5) * 5
          if (x === photonX + 10) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()

        const deltaE = Math.abs(selectedTransition.to - selectedTransition.from) * 2.18
        ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(`ΔE = ${String(deltaE.toFixed(2))} эВ`, photonX + 20, photonY - 10)
      }

      // Element info
      ctx.fillStyle = currentElement.color
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(currentElement.name, 15, 25)

      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
      ctx.font = "10px sans-serif"
      ctx.fillText(`Протонов: ${currentElement.protons}`, 15, 40)
      ctx.fillText(`Электронов: ${currentElement.electrons}`, 15, 55)
      ctx.fillText(`Оболочек: ${currentElement.shells.length}`, 15, 70)

      ctx.fillStyle = isDarkMode ? "rgba(100, 200, 255, 0.8)" : "rgba(50, 150, 200, 0.8)"
      ctx.font = "11px monospace"
      ctx.textAlign = "center"
      ctx.fillText("E_n = -13.6 eV / n²", width / 2, height - 15)
    },
    [isPlaying, animationSpeed, element, showTransitions, selectedTransition, currentElement]
  )

  const triggerTransition = (from: number, to: number) => {
    setSelectedTransition({ from, to })
    setTimeout(() => {
      setSelectedTransition(null)
    }, 3000)
  }

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

      <div className="flex flex-wrap gap-2">
        {Object.keys(elements).map((el) => (
          <Button
            key={el}
            onClick={() => {
              setElement(el as ElementKey)
            }}
            variant={element === el ? "default" : "outline"}
            size="sm"
            className={`text-xs ${
              element === el
                ? "bg-purple-600 text-white"
                : isDark
                  ? "border-purple-500/50 text-purple-300"
                  : "border-purple-500 text-purple-700"
            }`}
          >
            {el}
          </Button>
        ))}
      </div>

      {showTransitions && currentElement.shells.length > 1 && (
        <div className="flex gap-2">
          <Button
            onClick={() => {
              triggerTransition(1, 2)
            }}
            variant="outline"
            size="sm"
            className={`text-xs ${
              isDark ? "border-yellow-500/50 text-yellow-400" : "border-yellow-500 text-yellow-700"
            }`}
          >
            ↑ Возбуждение
          </Button>
          <Button
            onClick={() => {
              triggerTransition(2, 1)
            }}
            variant="outline"
            size="sm"
            className={`text-xs ${
              isDark ? "border-red-500/50 text-red-400" : "border-red-500 text-red-700"
            }`}
          >
            ↓ Излучение
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => {
            setShowTransitions(!showTransitions)
          }}
          variant="outline"
          size="sm"
          className={`text-xs ${
            showTransitions
              ? isDark
                ? "border-cyan-500/50 text-cyan-300"
                : "border-cyan-500 text-cyan-700"
              : ""
          }`}
        >
          {showTransitions ? "✓ Переходы" : "○ Переходы"}
        </Button>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark
            ? "border-blue-500/20 bg-gradient-to-r from-blue-900/30 to-purple-900/30"
            : "border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50"
        }`}
      >
        <div className={`mb-1 font-semibold ${isDark ? "text-cyan-300" : "text-cyan-700"}`}>
          ⚛️ Модель Бора (1913)
        </div>
        <p className={isDark ? "mt-1 text-gray-400" : "mt-1 text-gray-600"}>
          Электроны движутся по дискретным орбитам. Переход между уровнями сопровождается
          испусканием/поглощением фотона: ΔE = hν
        </p>
      </div>
    </div>
  )
}
