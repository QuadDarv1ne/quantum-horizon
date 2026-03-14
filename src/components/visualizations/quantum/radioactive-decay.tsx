/* eslint-disable @typescript-eslint/restrict-template-expressions */
"use client"

import { useRef, useState, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface RadioactiveDecayVisualizationProps {
  isDark: boolean
}

type DecayType = "alpha" | "beta" | "gamma"

interface Atom {
  x: number
  y: number
  decayed: boolean
  decayTime: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  type: DecayType
  life: number
}

export function RadioactiveDecayVisualization({ isDark }: RadioactiveDecayVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { togglePlaying, setAnimationSpeed } = useVisualizationStore()

  const [decayType, setDecayType] = useState<DecayType>("alpha")
  const [halfLife, setHalfLife] = useState(50)
  const [atomCount, setAtomCount] = useState(100)

  const timeRef = useRef(0)
  const atomsRef = useRef<Atom[]>([])
  const particlesRef = useRef<Particle[]>([])
  const currentDecayedRef = useRef(0)

  // Initialize atoms when atomCount changes
  useEffect(() => {
    atomsRef.current = []
    const gridSize = Math.ceil(Math.sqrt(atomCount))
    const cellSize = 200 / (gridSize + 1)
    for (let i = 0; i < atomCount; i++) {
      const row = Math.floor(i / gridSize)
      const col = i % gridSize
      atomsRef.current.push({
        x: 50 + col * cellSize,
        y: 50 + row * cellSize,
        decayed: false,
        decayTime: Math.random() * halfLife * 2,
      })
    }
    currentDecayedRef.current = 0
    particlesRef.current = []
  }, [atomCount, halfLife])

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

      // Background
      ctx.fillStyle =
        decayType === "alpha"
          ? isDarkMode
            ? "#0a1510"
            : "#1a2520"
          : decayType === "beta"
            ? isDarkMode
              ? "#100a15"
              : "#251a25"
            : isDarkMode
              ? "#15100a"
              : "#25201a"
      ctx.fillRect(0, 0, width, height)

      // Decay logic
      atomsRef.current.forEach((atom) => {
        if (!atom.decayed && time > atom.decayTime * (100 / halfLife)) {
          atom.decayed = true
          currentDecayedRef.current++

          const angle = Math.random() * Math.PI * 2
          const speed = decayType === "alpha" ? 1.5 : decayType === "beta" ? 3 : 4
          particlesRef.current.push({
            x: atom.x,
            y: atom.y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            type: decayType,
            life: 1,
          })
        }
      })

      // Draw atoms
      atomsRef.current.forEach((atom) => {
        if (atom.decayed) {
          ctx.fillStyle = isDarkMode ? "rgba(100, 100, 100, 0.5)" : "rgba(150, 150, 150, 0.5)"
        } else {
          const gradient = ctx.createRadialGradient(atom.x, atom.y, 0, atom.x, atom.y, 8)
          gradient.addColorStop(
            0,
            decayType === "alpha" ? "#4CAF50" : decayType === "beta" ? "#9C27B0" : "#FF9800"
          )
          gradient.addColorStop(
            1,
            isDarkMode ? "rgba(50, 50, 50, 0.5)" : "rgba(100, 100, 100, 0.5)"
          )
          ctx.fillStyle = gradient
        }
        ctx.beginPath()
        ctx.arc(atom.x, atom.y, 6, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.008

        if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
          particlesRef.current.splice(i, 1)
          continue
        }

        let color: string
        switch (p.type) {
          case "alpha":
            color = `rgba(76, 175, 80, ${String(p.life)})`
            break
          case "beta":
            color = `rgba(156, 39, 176, ${String(p.life)})`
            break
          case "gamma":
            color = `rgba(255, 152, 0, ${String(p.life)})`
            break
        }

        ctx.strokeStyle = color.replace("1)", "0.3)")
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(p.x - p.vx * 5, p.y - p.vy * 5)
        ctx.lineTo(p.x, p.y)
        ctx.stroke()

        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 10)
        glow.addColorStop(0, color)
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2)
        ctx.fill()

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(p.x, p.y, decayType === "alpha" ? 4 : 3, 0, Math.PI * 2)
        ctx.fill()
      }

      // Decay curve
      const graphX = width - 100
      const graphY = 10
      const graphW = 90
      const graphH = 60

      ctx.fillStyle = isDarkMode ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 255, 255, 0.5)"
      ctx.fillRect(graphX, graphY, graphW, graphH)

      ctx.strokeStyle = isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(graphX, graphY + graphH)
      ctx.lineTo(graphX + graphW, graphY + graphH)
      ctx.moveTo(graphX, graphY + graphH)
      ctx.lineTo(graphX, graphY)
      ctx.stroke()

      ctx.strokeStyle =
        decayType === "alpha" ? "#4CAF50" : decayType === "beta" ? "#9C27B0" : "#FF9800"
      ctx.lineWidth = 2
      ctx.beginPath()
      for (let i = 0; i <= graphW; i++) {
        const t = (i / graphW) * 5
        const remaining = Math.exp((-t * Math.LN2) / (halfLife / 50))
        const y = graphY + graphH - remaining * graphH
        if (i === 0) ctx.moveTo(graphX + i, y)
        else ctx.lineTo(graphX + i, y)
      }
      ctx.stroke()

      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)"
      ctx.font = "9px sans-serif"
      ctx.textAlign = "left"
      ctx.fillText(`N(t) = N₀·e^(-λt)`, 10, 25)
      ctx.fillText(`T½ = ${halfLife} ед.`, 10, 40)
      ctx.fillText(`Распалось: ${currentDecayedRef.current}/${atomCount}`, 10, 55)

      let decayLabel: string
      switch (decayType) {
        case "alpha":
          decayLabel = "α: ²⁴He (2p + 2n)"
          break
        case "beta":
          decayLabel = "β: e⁻ + ν̄ₑ"
          break
        case "gamma":
          decayLabel = "γ: hν (фотон)"
          break
      }
      ctx.fillStyle = isDarkMode ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
      ctx.fillText(decayLabel, 10, height - 15)
    },
    [isPlaying, animationSpeed, decayType, halfLife, atomCount]
  )

  const reset = () => {
    timeRef.current = 0
    currentDecayedRef.current = 0
    particlesRef.current = []
    atomsRef.current.forEach((atom) => {
      atom.decayed = false
      atom.decayTime = Math.random() * halfLife * 2
    })
  }

  return (
    <div className="space-y-4">
      <VisualizationCanvas draw={draw} isDark={isDark} className="h-[300px]" />
      <VisualizationControls
        isPlaying={isPlaying}
        animationSpeed={animationSpeed}
        onTogglePlay={togglePlaying}
        onSpeedChange={setAnimationSpeed}
        isDark={isDark}
      />

      <div className="grid grid-cols-3 gap-2 text-xs">
        <Button
          onClick={() => {
            setDecayType("alpha")
            reset()
          }}
          variant={decayType === "alpha" ? "default" : "outline"}
          className={`text-xs ${
            decayType === "alpha"
              ? "bg-green-600 text-white"
              : isDark
                ? "border-green-500/50 text-green-400"
                : "border-green-500 text-green-700"
          }`}
          size="sm"
        >
          α Альфа
        </Button>
        <Button
          onClick={() => {
            setDecayType("beta")
            reset()
          }}
          variant={decayType === "beta" ? "default" : "outline"}
          className={`text-xs ${
            decayType === "beta"
              ? "bg-purple-600 text-white"
              : isDark
                ? "border-purple-500/50 text-purple-400"
                : "border-purple-500 text-purple-700"
          }`}
          size="sm"
        >
          β Бета
        </Button>
        <Button
          onClick={() => {
            setDecayType("gamma")
            reset()
          }}
          variant={decayType === "gamma" ? "default" : "outline"}
          className={`text-xs ${
            decayType === "gamma"
              ? "bg-orange-600 text-white"
              : isDark
                ? "border-orange-500/50 text-orange-400"
                : "border-orange-500 text-orange-700"
          }`}
          size="sm"
        >
          γ Гамма
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-cyan-400" : "text-cyan-700"}>
              T½ Период полураспада
            </span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {halfLife}
            </span>
          </div>
          <Slider
            value={[halfLife]}
            onValueChange={(v) => {
              setHalfLife(v[0])
              reset()
            }}
            min={10}
            max={100}
            step={5}
          />
        </div>
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className={isDark ? "text-yellow-400" : "text-yellow-700"}>Атомов</span>
            <span className={isDark ? "font-mono text-white" : "font-mono text-gray-900"}>
              {atomCount}
            </span>
          </div>
          <Slider
            value={[atomCount]}
            onValueChange={(v) => {
              setAtomCount(v[0])
              reset()
            }}
            min={25}
            max={200}
            step={25}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={togglePlaying} variant="outline" size="sm" className="flex-1 text-xs">
          {isPlaying ? "⏸️ Пауза" : "▶️ Играть"}
        </Button>
        <Button onClick={reset} variant="outline" size="sm" className="flex-1 text-xs">
          🔄 Сброс
        </Button>
      </div>

      <div
        className={`rounded-lg border p-3 text-sm ${
          isDark ? "border-green-500/20 bg-green-900/20" : "border-green-200 bg-green-50"
        }`}
      >
        <div className={`mb-1 font-semibold ${isDark ? "text-green-300" : "text-green-700"}`}>
          ☢️ Закон радиоактивного распада
        </div>
        <p className={isDark ? "mt-1 text-gray-400" : "mt-1 text-gray-600"}>
          N(t) = N₀·e^(-λt), где λ = ln(2)/T½. Распад — случайный процесс: каждый атом имеет
          вероятность 50% распасться за период полураспада.
        </p>
      </div>
    </div>
  )
}
