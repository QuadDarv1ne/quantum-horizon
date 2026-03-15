"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { VisualizationCanvas } from "../base/visualization-canvas"
import { VisualizationControls } from "../base/visualization-controls"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { QueryParam } from "@/hooks/use-url-sync"
import { useVisualizationStore, selectPlaybackSettings } from "@/stores/visualization-store"

interface QuasarVisualizationProps {
  isDark: boolean
}

interface AccretionParticle {
  angle: number
  radius: number
  speed: number
  size: number
  brightness: number
}

interface JetParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  isUp: boolean
}

export function QuasarVisualization({ isDark }: QuasarVisualizationProps) {
  const { isPlaying, animationSpeed } = useVisualizationStore(selectPlaybackSettings)
  const { setAnimationSpeed, togglePlaying } = useVisualizationStore()

  const [blackHoleMass, setBlackHoleMass] = useState(() =>
    QueryParam.getNumber("quasar.mass", 6)
  )
  const [accretionRate, setAccretionRate] = useState(() =>
    QueryParam.getNumber("quasar.accretion", 1)
  )
  const [jetPower, setJetPower] = useState(() =>
    QueryParam.getNumber("quasar.jet", 1)
  )
  const [viewAngle, setViewAngle] = useState(() =>
    QueryParam.getNumber("quasar.angle", 45)
  )
  const [showJets, setShowJets] = useState(() =>
    QueryParam.getBoolean("quasar.jets", true)
  )
  const [showDisk, setShowDisk] = useState(() =>
    QueryParam.getBoolean("quasar.disk", true)
  )

  const accretionParticlesRef = useRef<AccretionParticle[]>([])
  const jetParticlesRef = useRef<JetParticle[]>([])
  const timeRef = useRef(0)
  const rotationRef = useRef(0)

  useEffect(() => {
    QueryParam.setNumber("quasar.mass", blackHoleMass)
  }, [blackHoleMass])

  useEffect(() => {
    QueryParam.setNumber("quasar.accretion", accretionRate)
  }, [accretionRate])

  useEffect(() => {
    QueryParam.setNumber("quasar.jet", jetPower)
  }, [jetPower])

  useEffect(() => {
    QueryParam.setNumber("quasar.angle", viewAngle)
  }, [viewAngle])

  useEffect(() => {
    QueryParam.setBoolean("quasar.jets", showJets)
  }, [showJets])

  useEffect(() => {
    QueryParam.setBoolean("quasar.disk", showDisk)
  }, [showDisk])

  // Initialize accretion disk particles
  useEffect(() => {
    const particles: AccretionParticle[] = []
    for (let i = 0; i < 500; i++) {
      const radius = 30 + Math.random() * 150
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius,
        speed: 0.001 * Math.sqrt(100 / radius) * accretionRate,
        size: 1 + Math.random() * 2,
        brightness: 0.5 + Math.random() * 0.5,
      })
    }
    accretionParticlesRef.current = particles
  }, [accretionRate])

  const draw = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      _isDark: boolean,
      delta: number
    ) => {
      timeRef.current += delta * 0.001
      const isDarkMode = _isDark

      // Background
      ctx.fillStyle = isDarkMode ? "#000005" : "#0a0a1a"
      ctx.fillRect(0, 0, width, height)

      // Draw distant galaxy glow
      const galaxyGradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        0,
        width / 2,
        height / 2,
        300
      )
      galaxyGradient.addColorStop(0, "rgba(100, 50, 150, 0.1)")
      galaxyGradient.addColorStop(0.5, "rgba(50, 30, 100, 0.05)")
      galaxyGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = galaxyGradient
      ctx.fillRect(0, 0, width, height)

      const centerX = width / 2
      const centerY = height / 2
      const schwarzschildRadius = 10 + blackHoleMass * 2
      const diskInnerRadius = schwarzschildRadius * 3
      const diskOuterRadius = 200

      // View angle
      const tiltRad = (viewAngle * Math.PI) / 180
      const foreshortening = Math.cos(tiltRad)

      // Draw relativistic jets first (behind the disk)
      if (showJets) {
        const jetLength = 250 * jetPower
        const jetBaseWidth = 20
        const jetTipWidth = 5

        // Back jet (going away)
        const backJetGradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX,
          centerY - jetLength
        )
        backJetGradient.addColorStop(0, "rgba(100, 200, 255, 0.4)")
        backJetGradient.addColorStop(0.3, "rgba(50, 150, 255, 0.2)")
        backJetGradient.addColorStop(0.6, "rgba(0, 100, 255, 0.05)")
        backJetGradient.addColorStop(1, "rgba(0, 100, 255, 0)")
        ctx.fillStyle = backJetGradient
        ctx.beginPath()
        ctx.moveTo(centerX - jetBaseWidth * foreshortening, centerY)
        ctx.lineTo(centerX - jetTipWidth * foreshortening, centerY - jetLength)
        ctx.lineTo(centerX + jetTipWidth * foreshortening, centerY - jetLength)
        ctx.lineTo(centerX + jetBaseWidth * foreshortening, centerY)
        ctx.closePath()
        ctx.fill()

        // Emit jet particles (back)
        if (Math.random() < 0.3 * jetPower) {
          for (let i = 0; i < 3; i++) {
            jetParticlesRef.current.push({
              x: centerX + (Math.random() - 0.5) * jetBaseWidth,
              y: centerY,
              vx: (Math.random() - 0.5) * 0.5,
              vy: -8 - Math.random() * 4,
              life: 1,
              isUp: true,
            })
          }
        }
      }

      // Draw accretion disk
      if (showDisk) {
        rotationRef.current += delta * 0.0005 * accretionRate

        // Draw disk in layers for 3D effect
        const diskLayers = 20
        for (let layer = diskLayers - 1; layer >= 0; layer--) {
          const layerRadius = diskInnerRadius + (layer / diskLayers) * (diskOuterRadius - diskInnerRadius)
          const temperature = 5000 + (1 - layer / diskLayers) * 25000
          const hue = Math.max(0, 60 - (temperature - 5000) / 500)
          const saturation = 80
          const lightness = 40 + (layer / diskLayers) * 30

          ctx.strokeStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.3 + layer / diskLayers * 0.5})`
          ctx.lineWidth = 2
          ctx.beginPath()

          // Elliptical orbit
          for (let angle = 0; angle <= Math.PI * 2; angle += 0.05) {
            const particleAngle = angle + rotationRef.current * Math.sqrt(100 / layerRadius)
            const x = centerX + Math.cos(particleAngle) * layerRadius
            const y = centerY + Math.sin(particleAngle) * layerRadius * foreshortening
            if (angle === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()
          ctx.stroke()
        }

        // Update and draw accretion particles
        accretionParticlesRef.current.forEach((p) => {
          p.angle += p.speed * delta * 0.06
          p.radius -= 0.02 * accretionRate * delta * 0.06

          // Reset if too close
          if (p.radius < diskInnerRadius) {
            p.radius = diskOuterRadius
            p.angle = Math.random() * Math.PI * 2
          }

          const x = centerX + Math.cos(p.angle) * p.radius
          const y = centerY + Math.sin(p.angle) * p.radius * foreshortening

          // Temperature-based color
          const temperature = 5000 + (1 - (p.radius - diskInnerRadius) / (diskOuterRadius - diskInnerRadius)) * 25000
          const hue = Math.max(0, 60 - (temperature - 5000) / 500)
          ctx.fillStyle = `hsla(${hue}, 90%, ${50 + p.brightness * 20}%, ${p.brightness})`
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()
        })

        // Inner bright ring (ISCO)
        const iscoGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          diskInnerRadius * 0.8,
          centerX,
          centerY,
          diskInnerRadius * 1.5
        )
        iscoGradient.addColorStop(0, "rgba(255, 200, 100, 0)")
        iscoGradient.addColorStop(0.5, "rgba(255, 200, 100, 0.5)")
        iscoGradient.addColorStop(1, "rgba(255, 100, 50, 0)")
        ctx.fillStyle = iscoGradient
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, diskInnerRadius * 1.5, diskInnerRadius * 1.5 * foreshortening, 0, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw black hole shadow (event horizon)
      const shadowGradient = ctx.createRadialGradient(
        centerX - 2,
        centerY - 2,
        0,
        centerX,
        centerY,
        schwarzschildRadius * 2.5
      )
      shadowGradient.addColorStop(0, "#000")
      shadowGradient.addColorStop(0.5, "rgba(0, 0, 0, 0.8)")
      shadowGradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = shadowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, schwarzschildRadius * 2.5, 0, Math.PI * 2)
      ctx.fill()

      // Photon sphere glow
      const photonGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        schwarzschildRadius * 1.5,
        centerX,
        centerY,
        schwarzschildRadius * 3
      )
      photonGlow.addColorStop(0, "rgba(255, 150, 50, 0.3)")
      photonGlow.addColorStop(0.5, "rgba(255, 100, 50, 0.1)")
      photonGlow.addColorStop(1, "rgba(255, 100, 50, 0)")
      ctx.fillStyle = photonGlow
      ctx.beginPath()
      ctx.arc(centerX, centerY, schwarzschildRadius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Draw front jet (in front of disk)
      if (showJets) {
        const jetLength = 250 * jetPower
        const jetBaseWidth = 20
        const jetTipWidth = 5

        // Front jet (coming towards viewer)
        const frontJetGradient = ctx.createLinearGradient(
          centerX,
          centerY,
          centerX,
          centerY + jetLength
        )
        frontJetGradient.addColorStop(0, "rgba(100, 255, 255, 0.6)")
        frontJetGradient.addColorStop(0.3, "rgba(50, 200, 255, 0.3)")
        frontJetGradient.addColorStop(0.6, "rgba(0, 150, 255, 0.1)")
        frontJetGradient.addColorStop(1, "rgba(0, 150, 255, 0)")
        ctx.fillStyle = frontJetGradient
        ctx.beginPath()
        ctx.moveTo(centerX - jetBaseWidth * foreshortening, centerY)
        ctx.lineTo(centerX - jetTipWidth * foreshortening, centerY + jetLength)
        ctx.lineTo(centerX + jetTipWidth * foreshortening, centerY + jetLength)
        ctx.lineTo(centerX + jetBaseWidth * foreshortening, centerY)
        ctx.closePath()
        ctx.fill()

        // Emit jet particles (front)
        if (Math.random() < 0.3 * jetPower) {
          for (let i = 0; i < 3; i++) {
            jetParticlesRef.current.push({
              x: centerX + (Math.random() - 0.5) * jetBaseWidth,
              y: centerY,
              vx: (Math.random() - 0.5) * 0.5,
              vy: 8 + Math.random() * 4,
              life: 1,
              isUp: false,
            })
          }
        }
      }

      // Update and draw jet particles
      jetParticlesRef.current = jetParticlesRef.current.filter((p) => {
        p.x += p.vx
        p.y += p.vy
        p.life -= delta * 0.003

        if (p.life <= 0) return false

        const alpha = p.life
        const hue = 180 + p.life * 40
        ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${alpha})`
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2 * p.life, 0, Math.PI * 2)
        ctx.fill()

        return true
      })

      // Limit particles
      if (jetParticlesRef.current.length > 100) {
        jetParticlesRef.current = jetParticlesRef.current.slice(-100)
      }

      // Gravitational lensing effect (distorted background)
      ctx.strokeStyle = "rgba(150, 150, 255, 0.1)"
      ctx.lineWidth = 0.5
      for (let i = 0; i < 5; i++) {
        const ringRadius = schwarzschildRadius * (3 + i * 0.5)
        ctx.beginPath()
        ctx.ellipse(centerX, centerY, ringRadius, ringRadius * foreshortening, 0, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Info panel
      ctx.fillStyle = isDarkMode ? "rgba(30, 30, 50, 0.95)" : "rgba(255, 255, 255, 0.95)"
      ctx.fillRect(width - 260, 20, 240, 160)
      ctx.strokeStyle = isDarkMode ? "#4a5568" : "#e2e8f0"
      ctx.strokeRect(width - 260, 20, 240, 160)

      ctx.fillStyle = isDarkMode ? "#e2e8f0" : "#1a202c"
      ctx.font = "bold 13px monospace"
      ctx.textAlign = "left"
      ctx.fillText("Квазар", width - 250, 42)

      ctx.font = "11px monospace"
      ctx.fillStyle = isDarkMode ? "#94a3b8" : "#64748b"
      ctx.fillText(`M = 10^${blackHoleMass.toFixed(1)} M☉`, width - 250, 62)
      ctx.fillText(`Аккреция: ${accretionRate.toFixed(1)} × Edd`, width - 250, 80)
      ctx.fillText(`Мощность джетов: ${jetPower.toFixed(1)} ×`, width - 250, 98)
      ctx.fillText(`Угол обзора: ${viewAngle.toFixed(0)}°`, width - 250, 116)

      // Luminosity indicator
      const luminosity = blackHoleMass * accretionRate * 1e12
      ctx.fillStyle = "#f59e0b"
      ctx.font = "10px monospace"
      ctx.fillText(`L ≈ ${luminosity.toExponential(1)} L☉`, width - 250, 136)

      // Redshift indicator
      const redshift = 0.1 + blackHoleMass * 0.05
      ctx.fillStyle = isDarkMode ? "#64748b" : "#94a3b8"
      ctx.fillText(`z ≈ ${redshift.toFixed(2)}`, width - 250, 152)

      // Accretion rate bar
      const barWidth = 200
      const barHeight = 8
      const barX = width - 250
      const barY = 165
      ctx.fillStyle = isDarkMode ? "#1e293b" : "#e2e8f0"
      ctx.fillRect(barX, barY, barWidth, barHeight)
      ctx.fillStyle = accretionRate > 1.5 ? "#ef4444" : accretionRate > 0.8 ? "#f59e0b" : "#22c55e"
      ctx.fillRect(barX, barY, Math.min(barWidth, barWidth * accretionRate / 2), barHeight)
      ctx.strokeStyle = isDarkMode ? "#475569" : "#cbd5e1"
      ctx.strokeRect(barX, barY, barWidth, barHeight)
    },
    [blackHoleMass, accretionRate, jetPower, viewAngle, showJets, showDisk]
  )

  return (
    <div className="relative w-full h-full">
      <VisualizationCanvas draw={draw} isDark={isDark} />
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-4 items-end">
        <Card className="bg-background/90 backdrop-blur border-primary/20">
          <CardContent className="p-4 space-y-3 min-w-[360px]">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Масса ЧД</span>
                <span className="text-sm text-muted-foreground">10^{blackHoleMass.toFixed(1)} M☉</span>
              </div>
              <Slider
                value={[blackHoleMass]}
                onValueChange={([v]) => setBlackHoleMass(v)}
                min={4}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Аккреция</span>
                <span className="text-sm text-muted-foreground">{accretionRate.toFixed(1)} × Edd</span>
              </div>
              <Slider
                value={[accretionRate]}
                onValueChange={([v]) => setAccretionRate(v)}
                min={0.1}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Джеты</span>
                <span className="text-sm text-muted-foreground">{jetPower.toFixed(1)}×</span>
              </div>
              <Slider
                value={[jetPower]}
                onValueChange={([v]) => setJetPower(v)}
                min={0.5}
                max={2}
                step={0.1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Угол обзора</span>
                <span className="text-sm text-muted-foreground">{viewAngle.toFixed(0)}°</span>
              </div>
              <Slider
                value={[viewAngle]}
                onValueChange={([v]) => setViewAngle(v)}
                min={0}
                max={85}
                step={5}
                className="w-full"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setShowJets(!showJets)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showJets ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Джеты
              </button>
              <button
                onClick={() => setShowDisk(!showDisk)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  showDisk ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
              >
                Диск
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
