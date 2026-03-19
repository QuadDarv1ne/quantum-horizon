/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import { setupCanvas } from "@/hooks/use-canvas-animation"
import { Button } from "@/components/ui/button"

interface StandardModelVisualizationProps {
  isDark: boolean
}

interface Particle {
  name: string
  fullName: string
  mass: string
  charge: string
  color: string
  generation: number
  spin?: string
}

interface ParticlesData {
  quarks: Particle[]
  leptons: Particle[]
  bosons: Particle[]
}

export function StandardModelVisualization({ isDark }: StandardModelVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedParticle, setSelectedParticle] = useState<string | null>(null)
  const [showDecays, setShowDecays] = useState(false)

  const particles = useMemo<ParticlesData>(
    () => ({
      quarks: [
        {
          name: "u",
          fullName: "Up",
          mass: "2.2 MeV",
          charge: "+2/3",
          color: isDark ? "#EF4444" : "#DC2626",
          generation: 1,
        },
        {
          name: "d",
          fullName: "Down",
          mass: "4.7 MeV",
          charge: "-1/3",
          color: isDark ? "#22C55E" : "#16A34A",
          generation: 1,
        },
        {
          name: "c",
          fullName: "Charm",
          mass: "1.28 GeV",
          charge: "+2/3",
          color: isDark ? "#F97316" : "#EA580C",
          generation: 2,
        },
        {
          name: "s",
          fullName: "Strange",
          mass: "95 MeV",
          charge: "-1/3",
          color: isDark ? "#84CC16" : "#65A30D",
          generation: 2,
        },
        {
          name: "t",
          fullName: "Top",
          mass: "173 GeV",
          charge: "+2/3",
          color: isDark ? "#DC2626" : "#B91C1C",
          generation: 3,
        },
        {
          name: "b",
          fullName: "Bottom",
          mass: "4.18 GeV",
          charge: "-1/3",
          color: isDark ? "#16A34A" : "#15803D",
          generation: 3,
        },
      ],
      leptons: [
        {
          name: "e",
          fullName: "Electron",
          mass: "0.511 MeV",
          charge: "-1",
          color: isDark ? "#3B82F6" : "#2563EB",
          generation: 1,
        },
        {
          name: "νe",
          fullName: "Electron neutrino",
          mass: "< 0.000002 eV",
          charge: "0",
          color: isDark ? "#60A5FA" : "#3B82F6",
          generation: 1,
        },
        {
          name: "μ",
          fullName: "Muon",
          mass: "105.7 MeV",
          charge: "-1",
          color: isDark ? "#8B5CF6" : "#7C3AED",
          generation: 2,
        },
        {
          name: "νμ",
          fullName: "Muon neutrino",
          mass: "< 0.17 MeV",
          charge: "0",
          color: isDark ? "#A78BFA" : "#8B5CF6",
          generation: 2,
        },
        {
          name: "τ",
          fullName: "Tau",
          mass: "1.777 GeV",
          charge: "-1",
          color: isDark ? "#EC4899" : "#DB2777",
          generation: 3,
        },
        {
          name: "ντ",
          fullName: "Tau neutrino",
          mass: "< 18 MeV",
          charge: "0",
          color: isDark ? "#F472B6" : "#EC4899",
          generation: 3,
        },
      ],
      bosons: [
        {
          name: "γ",
          fullName: "Photon",
          mass: "0",
          charge: "0",
          color: isDark ? "#FBBF24" : "#F59E0B",
          spin: "1",
          generation: 0,
        },
        {
          name: "g",
          fullName: "Gluon",
          mass: "0",
          charge: "0",
          color: isDark ? "#F59E0B" : "#D97706",
          spin: "1",
          generation: 0,
        },
        {
          name: "Z",
          fullName: "Z boson",
          mass: "91.2 GeV",
          charge: "0",
          color: isDark ? "#A855F7" : "#9333EA",
          spin: "1",
          generation: 0,
        },
        {
          name: "W",
          fullName: "W boson",
          mass: "80.4 GeV",
          charge: "±1",
          color: isDark ? "#EF4444" : "#DC2626",
          spin: "1",
          generation: 0,
        },
        {
          name: "H",
          fullName: "Higgs",
          mass: "125 GeV",
          charge: "0",
          color: isDark ? "#FFD700" : "#FBBF24",
          spin: "0",
          generation: 0,
        },
      ],
    }),
    [isDark]
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let bgGradient: CanvasGradient | null = null

    const resize = () => {
      setupCanvas(canvas, ctx)
      bgGradient = null
    }
    resize()
    window.addEventListener("resize", resize)

    const width = canvas.offsetWidth
    const height = canvas.offsetHeight

    let time = 0

    const drawParticle = (
      x: number,
      y: number,
      particle: Particle,
      isHovered: boolean,
      isQuark = false
    ) => {
      const radius = isHovered ? 28 : 22

      // Glow effect
      if (isHovered) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 2)
        glow.addColorStop(0, particle.color + "AA")
        glow.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(x, y, radius * 2, 0, Math.PI * 2)
        ctx.fill()
      }

      // Particle body
      const gradient = ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius)
      gradient.addColorStop(0, particle.color)
      gradient.addColorStop(1, particle.color + "88")
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()

      // Border
      ctx.strokeStyle = isHovered ? (isDark ? "#FFFFFF" : "#000000") : particle.color
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.stroke()

      // Quark color charges (r, g, b)
      if (isQuark) {
        const colors = ["#EF4444", "#22C55E", "#3B82F6"]
        for (let i = 0; i < 3; i++) {
          const angle = time * 2 + (i * Math.PI * 2) / 3
          const px = x + Math.cos(angle) * (radius + 6)
          const py = y + Math.sin(angle) * (radius + 6)
          ctx.fillStyle = colors[i]
          ctx.beginPath()
          ctx.arc(px, py, 4, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Particle symbol
      ctx.fillStyle = isDark ? "#FFFFFF" : "#000000"
      ctx.font = `bold ${String(isHovered ? 14 : 12)}px sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(particle.name, x, y)

      return { x, y, radius, particle }
    }

    const animate = () => {
      time += 0.02
      ctx.clearRect(0, 0, width, height)

      // Background - cached gradient
      if (!bgGradient) {
        bgGradient = ctx.createLinearGradient(0, 0, width, height)
        bgGradient.addColorStop(0, isDark ? "#0a0a15" : "#f0f4ff")
        bgGradient.addColorStop(1, isDark ? "#15152a" : "#e0e7ff")
      }
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, width, height)

      // Grid pattern
      ctx.strokeStyle = isDark ? "rgba(100, 100, 150, 0.1)" : "rgba(50, 50, 100, 0.1)"
      ctx.lineWidth = 1
      for (let i = 0; i < width; i += 30) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i, height)
        ctx.stroke()
      }
      for (let i = 0; i < height; i += 30) {
        ctx.beginPath()
        ctx.moveTo(0, i)
        ctx.lineTo(width, i)
        ctx.stroke()
      }

      // Section labels
      ctx.font = "bold 11px sans-serif"
      ctx.textAlign = "center"

      // Quarks section
      ctx.fillStyle = isDark ? "#EF4444" : "#DC2626"
      ctx.fillText("КВАРКИ", width * 0.18, 25)
      ctx.strokeStyle = isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(220, 38, 38, 0.3)"
      ctx.strokeRect(10, 35, width * 0.32, height - 50)

      // Leptons section
      ctx.fillStyle = isDark ? "#3B82F6" : "#2563EB"
      ctx.fillText("ЛЕПТОНЫ", width * 0.5, 25)
      ctx.strokeStyle = isDark ? "rgba(59, 130, 246, 0.3)" : "rgba(37, 99, 235, 0.3)"
      ctx.strokeRect(width * 0.35, 35, width * 0.3, height - 50)

      // Bosons section
      ctx.fillStyle = isDark ? "#FBBF24" : "#F59E0B"
      ctx.fillText("БОЗОНЫ", width * 0.82, 25)
      ctx.strokeStyle = isDark ? "rgba(251, 191, 36, 0.3)" : "rgba(245, 158, 11, 0.3)"
      ctx.strokeRect(width * 0.68, 35, width * 0.3, height - 50)

      // Generation labels
      ctx.font = "9px sans-serif"
      ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)"
      ctx.fillText("I", 25, 55)
      ctx.fillText("II", 25, height * 0.4)
      ctx.fillText("III", 25, height * 0.7)

      const particlePositions: Array<{
        x: number
        y: number
        radius: number
        particle: Particle
      }> = []

      // Draw quarks
      particles.quarks.forEach((p, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const x = 30 + width * 0.05 + col * 60
        const y = 60 + (row * (height - 80)) / 3
        const isHovered = selectedParticle === p.name
        const pos = drawParticle(x, y, p, isHovered, true)
        particlePositions.push(pos)
      })

      // Draw leptons
      particles.leptons.forEach((p, i) => {
        const row = Math.floor(i / 2)
        const col = i % 2
        const x = width * 0.35 + 30 + col * 60
        const y = 60 + (row * (height - 80)) / 3
        const isHovered = selectedParticle === p.name
        const pos = drawParticle(x, y, p, isHovered)
        particlePositions.push(pos)
      })

      // Draw bosons
      particles.bosons.forEach((p, i) => {
        const x = width * 0.68 + 35 + (i % 2) * 60
        const y = 60 + Math.floor(i / 2) * 60 + (i >= 4 ? 30 : 0)
        const isHovered = selectedParticle === p.name
        const pos = drawParticle(x, y, p, isHovered)
        particlePositions.push(pos)
      })

      // Show selected particle info
      const selected = [...particles.quarks, ...particles.leptons, ...particles.bosons].find(
        (p) => p.name === selectedParticle
      )

      if (selected) {
        ctx.fillStyle = isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)"
        ctx.fillRect(width - 95, height - 70, 90, 65)
        ctx.strokeStyle = selected.color
        ctx.lineWidth = 2
        ctx.strokeRect(width - 95, height - 70, 90, 65)

        ctx.fillStyle = selected.color
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "left"
        ctx.fillText(selected.fullName, width - 88, height - 52)

        ctx.fillStyle = isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
        ctx.font = "9px sans-serif"
        ctx.fillText(`m: ${selected.mass}`, width - 88, height - 38)
        ctx.fillText(`q: ${selected.charge}`, width - 88, height - 24)
        if ("spin" in selected) {
          ctx.fillText(`spin: ${selected.spin}`, width - 88, height - 10)
        }
      }

      // Force carriers animation
      if (showDecays) {
        ctx.strokeStyle = isDark ? "rgba(251, 191, 36, 0.5)" : "rgba(245, 158, 11, 0.5)"
        ctx.lineWidth = 1
        ctx.setLineDash([3, 3])

        // Gluon lines between quarks
        for (let i = 0; i < 5; i++) {
          const q1 = particlePositions[i]
          const q2 = particlePositions[i + 1]
          if (i % 2 === 0 && q1 && q2) {
            ctx.beginPath()
            ctx.moveTo(q1.x, q1.y)
            const midX = (q1.x + q2.x) / 2 + Math.sin(time * 3) * 10
            const midY = (q1.y + q2.y) / 2 + Math.cos(time * 3) * 10
            ctx.quadraticCurveTo(midX, midY, q2.x, q2.y)
            ctx.stroke()
          }
        }
        ctx.setLineDash([])
      }

      // Higgs field effect
      const higgsPos = particlePositions.find((p) => p.particle.name === "H")
      if (higgsPos) {
        for (let i = 0; i < 8; i++) {
          const angle = time + (i * Math.PI) / 4
          const radius = 40 + Math.sin(time * 2 + i) * 5
          ctx.strokeStyle = isDark
            ? `rgba(255, 215, 0, ${0.3 - i * 0.03})`
            : `rgba(251, 191, 36, ${0.3 - i * 0.03})`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(higgsPos.x, higgsPos.y, radius, angle, angle + 0.3)
          ctx.stroke()
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParticle, showDecays, isDark])

  return (
    <div className="space-y-3">
      <canvas
        ref={canvasRef}
        className="h-56 w-full cursor-pointer rounded-lg"
        aria-label="Стандартная модель: кварки, лептоны, бозоны"
        role="img"
      />

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setSelectedParticle("u")
          }}
          variant={selectedParticle === "u" ? "default" : "outline"}
          size="sm"
          className={`text-xs ${
            selectedParticle === "u"
              ? isDark
                ? "bg-red-600"
                : "bg-red-500"
              : isDark
                ? "border-red-500/50 text-red-400"
                : "border-red-500 text-red-600"
          }`}
        >
          u - Up
        </Button>
        <Button
          onClick={() => {
            setSelectedParticle("e")
          }}
          variant={selectedParticle === "e" ? "default" : "outline"}
          size="sm"
          className={`text-xs ${
            selectedParticle === "e"
              ? isDark
                ? "bg-blue-600"
                : "bg-blue-500"
              : isDark
                ? "border-blue-500/50 text-blue-400"
                : "border-blue-500 text-blue-600"
          }`}
        >
          e - Электрон
        </Button>
        <Button
          onClick={() => {
            setSelectedParticle("H")
          }}
          variant={selectedParticle === "H" ? "default" : "outline"}
          size="sm"
          className={`text-xs ${
            selectedParticle === "H"
              ? isDark
                ? "bg-yellow-500"
                : "bg-yellow-400"
              : isDark
                ? "border-yellow-500/50 text-yellow-400"
                : "border-yellow-500 text-yellow-600"
          }`}
        >
          H - Хиггс
        </Button>
        <Button
          onClick={() => {
            setShowDecays(!showDecays)
          }}
          variant="outline"
          size="sm"
          className={`text-xs ${
            isDark ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"
          }`}
        >
          🔄 Взаимодействия
        </Button>
      </div>

      <div
        className={`rounded-lg border p-2 text-xs ${
          isDark ? "border-purple-500/20 bg-purple-900/20" : "border-purple-200 bg-purple-50"
        }`}
      >
        <div className={`font-semibold ${isDark ? "text-purple-300" : "text-purple-700"}`}>
          🧩 Стандартная модель (1970s)
        </div>
        <p className={`mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          Описывает все известные элементарные частицы и 3 из 4 фундаментальных взаимодействий
          (электромагнитное, слабое, сильное). Гравитация не включена — это главная проблема физики!
        </p>
        <p className={`mt-1 ${isDark ? "text-yellow-400" : "text-yellow-600"}`}>
          Бозон Хиггса (2012): даёт массу всем частицам через поле Хиггса.
        </p>
      </div>
    </div>
  )
}
