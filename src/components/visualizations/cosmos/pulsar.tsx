"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { QueryParam } from "@/hooks/use-url-sync"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface PulsarVisualizationProps {
  isDark: boolean
}

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
}

export function PulsarVisualization({ isDark }: PulsarVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [rotationSpeed, setRotationSpeed] = useState(() =>
    QueryParam.getNumber("pulsar.rotation", 10)
  )
  const [beamIntensity, setBeamIntensity] = useState(() =>
    QueryParam.getNumber("pulsar.beam", 1)
  )
  const [tiltAngle, setTiltAngle] = useState(() =>
    QueryParam.getNumber("pulsar.tilt", 30)
  )
  const [showMagneticField, setShowMagneticField] = useState(() =>
    QueryParam.getBoolean("pulsar.field", true)
  )
  const [showParticles, setShowParticles] = useState(() =>
    QueryParam.getBoolean("pulsar.particles", true)
  )

  const particlesRef = useRef<Particle[]>([])
  const timeRef = useRef(0)
  const rotationRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("pulsar.rotation", rotationSpeed)
  }, [rotationSpeed])

  useEffect(() => {
    QueryParam.setNumber("pulsar.beam", beamIntensity)
  }, [beamIntensity])

  useEffect(() => {
    QueryParam.setNumber("pulsar.tilt", tiltAngle)
  }, [tiltAngle])

  useEffect(() => {
    QueryParam.setBoolean("pulsar.field", showMagneticField)
  }, [showMagneticField])

  useEffect(() => {
    QueryParam.setBoolean("pulsar.particles", showParticles)
  }, [showParticles])

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = []
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2,
        y: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
        vx: 0,
        vy: 0,
        vz: 0,
        life: Math.random(),
      })
    }
    particlesRef.current = particles
  }, [])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      timeRef.current += delta * 0.001
      rotationRef.current += rotationSpeed * delta * 0.01
      const isDarkMode = _isDark

      // Background with space
      ctx.fillStyle = isDarkMode ? "#000005" : "#0a0a1a"
      ctx.fillRect(0, 0, width, height)

      // Draw distant stars
      ctx.fillStyle = "#fff"
      for (let i = 0; i < 100; i++) {
        const x = (Math.sin(i * 123.456) * 0.5 + 0.5) * width
        const y = (Math.cos(i * 789.012) * 0.5 + 0.5) * height
        const brightness = 0.3 + 0.7 * Math.sin(timeRef.current * 2 + i)
        ctx.globalAlpha = brightness
        ctx.beginPath()
        ctx.arc(x, y, 0.5 + Math.random(), 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      const centerX = width / 2
      const centerY = height / 2
      const neutronStarRadius = 25

      // Tilt angle in radians
      const tiltRad = (tiltAngle * Math.PI) / 180

      // Draw accretion disk (if any)
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotationRef.current * 0.5)
      ctx.scale(1, 0.3)

      const diskGradient = ctx.createRadialGradient(0, 0, neutronStarRadius * 1.5, 0, 0, 80)
      diskGradient.addColorStop(0, "rgba(255, 100, 50, 0)")
      diskGradient.addColorStop(0.2, "rgba(255, 100, 50, 0.3)")
      diskGradient.addColorStop(0.5, "rgba(255, 50, 20, 0.1)")
      diskGradient.addColorStop(1, "rgba(255, 50, 20, 0)")
      ctx.fillStyle = diskGradient
      ctx.beginPath()
      ctx.arc(0, 0, 80, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // Draw neutron star
      const starGradient = ctx.createRadialGradient(
        centerX - 5,
        centerY - 5,
        0,
        centerX,
        centerY,
        neutronStarRadius
      )
      starGradient.addColorStop(0, "#fff")
      starGradient.addColorStop(0.3, "#ffd700")
      starGradient.addColorStop(0.7, "#ff8c00")
      starGradient.addColorStop(1, "#ff4500")
      ctx.fillStyle = starGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, neutronStarRadius, 0, Math.PI * 2)
      ctx.fill()

      // Glowing corona
      const coronaGradient = ctx.createRadialGradient(centerX, centerY, neutronStarRadius, centerX, centerY, neutronStarRadius * 2)
      coronaGradient.addColorStop(0, "rgba(255, 200, 50, 0.5)")
      coronaGradient.addColorStop(0.5, "rgba(255, 100, 50, 0.2)")
      coronaGradient.addColorStop(1, "rgba(255, 100, 50, 0)")
      ctx.fillStyle = coronaGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, neutronStarRadius * 2, 0, Math.PI * 2)
      ctx.fill()

      // Draw magnetic field lines
      if (showMagneticField) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.4)"
        ctx.lineWidth = 1

        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2
          const offset = Math.sin(angle + rotationRef.current) * tiltRad

          ctx.beginPath()
          for (let t = 0; t <= 1; t += 0.02) {
            const r = neutronStarRadius * (1 + t * 3)
            const fieldAngle = angle + offset * t
            const x = centerX + Math.cos(fieldAngle) * r * Math.sin(t * Math.PI)
            const y = centerY + Math.sin(fieldAngle) * r * 0.3 + t * 50 * Math.sin(rotationRef.current)
            if (t === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.stroke()
        }
      }

      // Draw relativistic jets/beams
      const beamAngle = tiltRad
      const beamLength = Math.min(width, height) * 0.4 * beamIntensity

      // Top jet
      const topBeamX = centerX + Math.sin(beamAngle) * Math.cos(rotationRef.current) * beamLength
      const topBeamY = centerY - Math.cos(beamAngle) * beamLength

      const beamGradient1 = ctx.createLinearGradient(centerX, centerY, topBeamX, topBeamY)
      beamGradient1.addColorStop(0, "rgba(0, 200, 255, 0.8)")
      beamGradient1.addColorStop(0.3, "rgba(0, 150, 255, 0.4)")
      beamGradient1.addColorStop(0.6, "rgba(0, 100, 255, 0.1)")
      beamGradient1.addColorStop(1, "rgba(0, 100, 255, 0)")
      ctx.fillStyle = beamGradient1
      ctx.beginPath()
      ctx.moveTo(centerX - 10, centerY)
      ctx.lineTo(topBeamX - 20 * beamIntensity, topBeamY)
      ctx.lineTo(topBeamX + 20 * beamIntensity, topBeamY)
      ctx.lineTo(centerX + 10, centerY)
      ctx.closePath()
      ctx.fill()

      // Bottom jet (opposite direction)
      const bottomBeamX = centerX - Math.sin(beamAngle) * Math.cos(rotationRef.current) * beamLength
      const bottomBeamY = centerY + Math.cos(beamAngle) * beamLength

      const beamGradient2 = ctx.createLinearGradient(centerX, centerY, bottomBeamX, bottomBeamY)
      beamGradient2.addColorStop(0, "rgba(0, 200, 255, 0.8)")
      beamGradient2.addColorStop(0.3, "rgba(0, 150, 255, 0.4)")
      beamGradient2.addColorStop(0.6, "rgba(0, 100, 255, 0.1)")
      beamGradient2.addColorStop(1, "rgba(0, 100, 255, 0)")
      ctx.fillStyle = beamGradient2
      ctx.beginPath()
      ctx.moveTo(centerX - 10, centerY)
      ctx.lineTo(bottomBeamX - 20 * beamIntensity, bottomBeamY)
      ctx.lineTo(bottomBeamX + 20 * beamIntensity, bottomBeamY)
      ctx.lineTo(centerX + 10, centerY)
      ctx.closePath()
      ctx.fill()

      // Pulsing effect (lighthouse)
      const pulsePhase = (rotationRef.current % (Math.PI * 2)) / (Math.PI * 2)
      const pulseIntensity = Math.pow(Math.sin(pulsePhase * Math.PI * 2), 100)

      if (pulseIntensity > 0.1) {
        const pulseGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150)
        pulseGradient.addColorStop(0, `rgba(255, 255, 255, ${String(pulseIntensity * 0.8)})`)
        pulseGradient.addColorStop(0.5, `rgba(200, 200, 255, ${String(pulseIntensity * 0.3)})`)
        pulseGradient.addColorStop(1, "rgba(100, 100, 255, 0)")
        ctx.fillStyle = pulseGradient
        ctx.fillRect(0, 0, width, height)
      }

      // Emit particles from poles
      if (showParticles) {
        // Add new particles
        if (Math.random() < 0.3) {
          particlesRef.current.push({
            x: centerX + (Math.random() - 0.5) * 20,
            y: centerY - neutronStarRadius,
            z: 0,
            vx: (Math.random() - 0.5) * 2,
            vy: -5 - Math.random() * 5,
            vz: (Math.random() - 0.5) * 2,
            life: 1,
          })
          particlesRef.current.push({
            x: centerX + (Math.random() - 0.5) * 20,
            y: centerY + neutronStarRadius,
            z: 0,
            vx: (Math.random() - 0.5) * 2,
            vy: 5 + Math.random() * 5,
            vz: (Math.random() - 0.5) * 2,
            life: 1,
          })
        }

        // Update and draw particles
        particlesRef.current = particlesRef.current.filter((p) => {
          p.x += p.vx
          p.y += p.vy
          p.life -= delta * 0.002

          if (p.life <= 0) return false

          const alpha = p.life
          const hue = 180 + p.life * 60
          ctx.fillStyle = `hsla(${String(hue)}, 80%, 60%, ${String(alpha)})`
          ctx.beginPath()
          ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2)
          ctx.fill()

          return true
        })

        // Limit particles
        if (particlesRef.current.length > 200) {
          particlesRef.current = particlesRef.current.slice(-200)
        }
      }

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(width - 240, 20, 220, 140)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(width - 240, 20, 220, 140)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 13px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Пульсар", width - 230, 42)

      ctx.font = "11px monospace"
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.fillText(`Период: ${(1000 / rotationSpeed).toFixed(2)} мс`, width - 230, 62)
      ctx.fillText(`Частота: ${rotationSpeed.toFixed(1)} Гц`, width - 230, 80)
      ctx.fillText(`Наклон оси: ${tiltAngle.toFixed(0)}°`, width - 230, 98)

      // Pulse indicator
      ctx.fillStyle = pulseIntensity > 0.5 ? "#22c55e" : "#ef4444"
      ctx.beginPath()
      ctx.arc(width - 30, 98, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = "10px monospace"
      ctx.fillStyle = isDarkMode ? "#64748b" : "#94a3b8"
      ctx.fillText("Импульс", width - 230, 120)

      // Lighthouse beam visualization
      const beamY = 135
      ctx.fillStyle = isDarkMode ? "#1e293b" : "#e2e8f0"
      ctx.fillRect(width - 230, beamY, 200, 15)
      const beamWidth = pulseIntensity * 200
      ctx.fillStyle = `rgba(34, 197, 94, ${String(0.5 + pulseIntensity * 0.5)})`
      ctx.fillRect(width - 230, beamY, beamWidth, 15)
      ctx.strokeStyle = isDarkMode ? "#475569" : "#cbd5e1"
      ctx.strokeRect(width - 230, beamY, 200, 15)
    },
    [rotationSpeed, beamIntensity, tiltAngle, showMagneticField, showParticles]
  )

  return (
    <div className="relative w-full h-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 items-end">
        <Card className="bg-background/90 backdrop-blur border-primary/20">
          <CardContent className="p-4 space-y-3 min-w-[340px]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Частота вращения</span>
                <span className="text-sm text-muted-foreground">{rotationSpeed.toFixed(1)} Гц</span>
              </div>
              <Slider
                value={[rotationSpeed]}
                onValueChange={([v]) => setRotationSpeed(v)}
                min={1}
                max={50}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Интенсивность лучей</span>
                <span className="text-sm text-muted-foreground">{beamIntensity.toFixed(1)}×</span>
              </div>
              <Slider
                value={[beamIntensity]}
                onValueChange={([v]) => setBeamIntensity(v)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Наклон оси</span>
                <span className="text-sm text-muted-foreground">{tiltAngle.toFixed(0)}°</span>
              </div>
              <Slider
                value={[tiltAngle]}
                onValueChange={([v]) => setTiltAngle(v)}
                min={0}
                max={90}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowMagneticField(!showMagneticField)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showMagneticField ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Маг. поле
              </button>
              <button
                onClick={() => setShowParticles(!showParticles)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showParticles ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Частицы
              </button>
            </div>
          </CardContent>
        </Card>
        <VisualizationControls
          isPlaying={isPlaying}
          animationSpeed={animationSpeed}
          onTogglePlay={togglePlaying}
          onSpeedChange={setAnimationSpeed}
          isDark={isDark}
        />
      </div>
    </div>
  )
}
