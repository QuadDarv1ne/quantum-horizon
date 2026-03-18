/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useState, useEffect } from "react"
import { Cloud, Zap, Wind, Shield, AlertTriangle, TrendingUp, Sun, Radio } from "lucide-react"
import { VisualizationLoader } from "@/components/ui/visualization-loader"
import { PhysicsTooltip, TooltipTrigger } from "@/components/ui/physics-tooltip-enhanced"
import { cn } from "@/lib/utils"

interface SpaceWeatherEvent {
  id: string
  eventID: string
  activityID: string
  startTime21_5: string
  stopTime21_5: string
  link: string
  note: string
  catalogURL: string | null
}

interface SolarWindData {
  speed: number
  density: number
  temperature: number
  magneticField: number
}

interface AuroraForecast {
  kpIndex: number
  visibility: string
  probability: number
  regions: string[]
}

interface SpaceWeatherDashboardProps {
  className?: string
}

export function SpaceWeatherDashboard({ className }: SpaceWeatherDashboardProps) {
  const [solarFlares, setSolarFlares] = useState<SolarFlareEvent[]>([])
  const [solarWind, setSolarWind] = useState<SolarWindData | null>(null)
  const [auroraForecast, setAuroraForecast] = useState<AuroraForecast | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  interface SolarFlareEvent {
    flrID: string
    flClass: string
    flEnergy: number
    peakTime: string
    sourceLocation: string
    cme?: boolean
    note?: string
    link?: string
  }

  // Mock data (in production, fetch from NASA DONKI API)
  const mockSolarFlares: SolarFlareEvent[] = [
    {
      flrID: "gev_20260318_0123",
      flClass: "M2.5",
      flEnergy: 2.5e-5,
      peakTime: "2026-03-18T14:23:00Z",
      sourceLocation: "N15W30",
      cme: true,
    },
    {
      flrID: "gev_20260317_2145",
      flClass: "C8.7",
      flEnergy: 8.7e-6,
      peakTime: "2026-03-17T21:45:00Z",
      sourceLocation: "S22E15",
      cme: false,
    },
    {
      flrID: "gev_20260317_1030",
      flClass: "X1.2",
      flEnergy: 1.2e-4,
      peakTime: "2026-03-17T10:30:00Z",
      sourceLocation: "N08W45",
      cme: true,
    },
  ]

  const mockSolarWind: SolarWindData = {
    speed: 450, // km/s
    density: 5.2, // protons/cm³
    temperature: 120000, // Kelvin
    magneticField: 8.5, // nT
  }

  const mockAuroraForecast: AuroraForecast = {
    kpIndex: 6, // 0-9 scale
    visibility: "High latitudes",
    probability: 75,
    regions: ["Alaska", "Northern Canada", "Scandinavia", "Iceland"],
  }

  useEffect(() => {
    const loadSpaceWeather = async () => {
      try {
        setLoading(true)

        // In production: fetch from NASA DONKI API
        // const response = await fetch('https://api.nasa.gov/DONKI/swx?startDate=...')

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setSolarFlares(mockSolarFlares)
        setSolarWind(mockSolarWind)
        setAuroraForecast(mockAuroraForecast)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load space weather")
      } finally {
        setLoading(false)
      }
    }

    loadSpaceWeather()

    // Update every 5 minutes
    const interval = setInterval(
      () => {
        void loadSpaceWeather()
      },
      5 * 60 * 1000
    )
    return () => {
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return <VisualizationLoader className={className} />
  }

  if (error) {
    return (
      <div
        className={cn("bg-card flex items-center justify-center rounded-xl border p-8", className)}
      >
        <div className="space-y-4 text-center">
          <div className="text-4xl">☢️</div>
          <h3 className="text-lg font-semibold">Radiation Storm Detected</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button
            onClick={() => {
              window.location.reload()
            }}
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Reconnect Sensors
          </button>
        </div>
      </div>
    )
  }

  const getFlareSeverity = (class_: string) => {
    if (class_.startsWith("X"))
      return { level: "Extreme", color: "text-red-500", bg: "bg-red-500/20" }
    if (class_.startsWith("M"))
      return { level: "Moderate", color: "text-orange-500", bg: "bg-orange-500/20" }
    if (class_.startsWith("C"))
      return { level: "Minor", color: "text-yellow-500", bg: "bg-yellow-500/20" }
    return { level: "Low", color: "text-green-500", bg: "bg-green-500/20" }
  }

  const getKpSeverity = (kp: number) => {
    if (kp >= 8) return { level: "Extreme Storm", color: "text-red-500", bg: "bg-red-500/20" }
    if (kp >= 6)
      return { level: "Moderate Storm", color: "text-orange-500", bg: "bg-orange-500/20" }
    if (kp >= 4) return { level: "Active", color: "text-yellow-500", bg: "bg-yellow-500/20" }
    return { level: "Quiet", color: "text-green-500", bg: "bg-green-500/20" }
  }

  return (
    <div className={cn("bg-card overflow-hidden rounded-xl border shadow-lg", className)}>
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="size-8 text-yellow-500" />
              <h3 className="text-2xl font-bold">☀️ Space Weather Dashboard</h3>
            </div>
            <p className="text-muted-foreground text-sm">
              Real-time solar activity and geomagnetic conditions
            </p>
          </div>

          <PhysicsTooltip
            title="Space Weather"
            description="Conditions in space influenced by the Sun's activity, including solar flares, coronal mass ejections (CMEs), and solar wind. Affects satellites, communications, and auroras."
            learnMoreUrl="https://www.swpc.noaa.gov/"
          >
            <TooltipTrigger>
              <span className="text-sm">What is space weather?</span>
            </TooltipTrigger>
          </PhysicsTooltip>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 p-6 lg:grid-cols-2">
        {/* Solar Flares */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Zap className="size-5 text-yellow-500" />
            <h4 className="text-lg font-semibold">Recent Solar Flares</h4>
          </div>

          <div className="space-y-3">
            {solarFlares.map((flare) => {
              const severity = getFlareSeverity(flare.flClass)
              return (
                <div
                  key={flare.flrID}
                  className={cn("rounded-lg border p-4 transition-all", severity.bg)}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-2xl font-bold", severity.color)}>
                          {flare.flClass}
                        </span>
                        {flare.cme && (
                          <span className="rounded-full bg-red-500/20 px-2 py-1 text-xs text-red-500">
                            CME Alert
                          </span>
                        )}
                      </div>

                      <div className="text-muted-foreground text-sm">
                        <div>Peak: {new Date(flare.peakTime).toLocaleString()}</div>
                        <div>Location: {flare.sourceLocation}</div>
                        {flare.note && <div>Note: {flare.note}</div>}
                      </div>
                    </div>

                    <a
                      href={flare.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-background hover:bg-accent rounded-md px-3 py-1 text-xs"
                    >
                      Details →
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Solar Wind & Aurora */}
        <div className="space-y-4">
          {/* Solar Wind */}
          <div className="flex items-center gap-2">
            <Wind className="size-5 text-blue-500" />
            <h4 className="text-lg font-semibold">Solar Wind</h4>
          </div>

          {solarWind && (
            <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <TrendingUp className="size-4" />
                  Speed
                </div>
                <div className="text-2xl font-bold">{solarWind.speed}</div>
                <div className="text-muted-foreground text-xs">km/s</div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Radio className="size-4" />
                  Density
                </div>
                <div className="text-2xl font-bold">{solarWind.density}</div>
                <div className="text-muted-foreground text-xs">protons/cm³</div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Thermometer className="size-4" />
                  Temperature
                </div>
                <div className="text-2xl font-bold">
                  {(solarWind.temperature / 1000).toFixed(1)}K
                </div>
                <div className="text-muted-foreground text-xs">thousands</div>
              </div>

              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Shield className="size-4" />
                  B-Field
                </div>
                <div className="text-2xl font-bold">{solarWind.magneticField}</div>
                <div className="text-muted-foreground text-xs">nanoTesla</div>
              </div>
            </div>
          )}

          {/* Aurora Forecast */}
          <div className="mt-6 flex items-center gap-2">
            <Cloud className="size-5 text-purple-500" />
            <h4 className="text-lg font-semibold">Aurora Forecast</h4>
          </div>

          {auroraForecast && (
            <div className={cn("rounded-lg border p-4", getKpSeverity(auroraForecast.kpIndex).bg)}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "text-4xl font-bold",
                      getKpSeverity(auroraForecast.kpIndex).color
                    )}
                  >
                    Kp {auroraForecast.kpIndex}
                  </div>
                  <div>
                    <div
                      className={cn("font-semibold", getKpSeverity(auroraForecast.kpIndex).color)}
                    >
                      {getKpSeverity(auroraForecast.kpIndex).level}
                    </div>
                    <div className="text-muted-foreground text-sm">{auroraForecast.visibility}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold">{auroraForecast.probability}%</div>
                  <div className="text-muted-foreground text-xs">Probability</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium">Visible in:</div>
                <div className="flex flex-wrap gap-2">
                  {auroraForecast.regions.map((region) => (
                    <span
                      key={region}
                      className="rounded-full bg-purple-500/20 px-3 py-1 text-xs text-purple-500"
                    >
                      {region}
                    </span>
                  ))}
                </div>
              </div>

              {/* Kp Index Scale */}
              <div className="mt-4 h-2 w-full rounded-full bg-gradient-to-r from-green-500 via-orange-500 via-yellow-500 to-red-500">
                <div
                  className="relative h-4 w-1 rounded-full bg-white shadow-lg"
                  style={{ left: `${((auroraForecast.kpIndex / 9) * 100).toFixed(1)}%` }}
                />
              </div>
              <div className="text-muted-foreground mt-1 flex justify-between text-xs">
                <span>Quiet</span>
                <span>Storm</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Educational Section */}
      <div className="bg-muted/50 border-t p-6">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-500" />
              <h4 className="font-semibold">Why It Matters</h4>
            </div>
            <p className="text-muted-foreground text-sm">
              Space weather can disrupt satellite communications, GPS navigation, power grids, and
              pose radiation risks to astronauts and airline passengers.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-blue-500" />
              <h4 className="font-semibold">Earth's Protection</h4>
            </div>
            <p className="text-muted-foreground text-sm">
              Our planet's magnetic field shields us from most harmful solar radiation, creating
              beautiful auroras near the poles as charged particles interact with the atmosphere.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sun className="size-5 text-yellow-500" />
              <h4 className="font-semibold">Solar Cycle</h4>
            </div>
            <p className="text-muted-foreground text-sm">
              The Sun goes through an 11-year cycle of activity. We're currently approaching Solar
              Maximum (expected 2025), meaning more flares and auroras!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper component for temperature icon
function Thermometer({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    </svg>
  )
}
