/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */

"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { Satellite, Globe, Clock, Zap } from "lucide-react"
import { VisualizationLoader } from "@/components/ui/visualization-loader"
import { PhysicsTooltip, TooltipTrigger } from "@/components/ui/physics-tooltip-enhanced"
import { cn } from "@/lib/utils"

// Dynamic import for leaflet (avoid SSR issues)
const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), {
  ssr: false,
  loading: () => <VisualizationLoader className="h-[400px]" />,
})

const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), {
  ssr: false,
})

const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })

const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), {
  ssr: false,
})

interface SatelliteData {
  id: number
  name: string
  latitude: number
  longitude: number
  altitude: number
  velocity: number
  visibility: string
  footprint: number
  timestamp: number
  daynum: number
  solar_lat: number
  solar_lon: number
}

interface SatelliteTrackerProps {
  className?: string
  satelliteId?: number // Default: 25544 (ISS)
  showMultipleSatellites?: boolean
}

export function SatelliteTracker({
  className,
  satelliteId = 25544,
  showMultipleSatellites = false,
}: SatelliteTrackerProps) {
  const [satellites, setSatellites] = useState<SatelliteData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  const fetchSatellite = async (id: number) => {
    try {
      const response = await fetch(`https://api.wheretheiss.at/v1/satellites/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch satellite ${id}`)
      }
      return await response.json()
    } catch {
      return null
    }
  }

  const fetchAllSatellites = async () => {
    try {
      setLoading(true)
      setError(null)

      const ids = showMultipleSatellites ? [25544, 48274, 43013, 37849] : [satelliteId]

      const results = await Promise.all(ids.map(fetchSatellite))
      const validResults = results.filter(Boolean) as SatelliteData[]

      setSatellites(validResults)
      setLastUpdate(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load satellites")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAllSatellites()

    // Update every 5 seconds
    const interval = setInterval(fetchAllSatellites, 5000)
    return () => {
      clearInterval(interval)
    }
  }, [satelliteId, showMultipleSatellites])

  if (loading && satellites.length === 0) {
    return <VisualizationLoader className={className} />
  }

  if (error && satellites.length === 0) {
    return (
      <div
        className={cn("bg-card flex items-center justify-center rounded-xl border p-8", className)}
      >
        <div className="space-y-4 text-center">
          <div className="text-4xl">📡</div>
          <h3 className="text-lg font-semibold">Signal Lost</h3>
          <p className="text-muted-foreground text-sm">{error}</p>
          <button
            onClick={() => fetchAllSatellites()}
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Reconnect
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("bg-card overflow-hidden rounded-xl border shadow-lg", className)}>
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-purple-500/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Globe className="size-8 text-blue-500" />
              <h3 className="text-2xl font-bold">🛰️ Satellite Tracker</h3>
            </div>

            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <Clock className="size-4" />
              <span>Live tracking • Updated {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>

          <PhysicsTooltip
            title="Satellite Tracking"
            description="Real-time position data from NORAD TLE (Two-Line Element) sets. Positions are calculated using SGP4 propagation model."
            learnMoreUrl="https://www.wheretheiss.at/"
          >
            <TooltipTrigger>
              <span className="text-sm">How it works?</span>
            </TooltipTrigger>
          </PhysicsTooltip>
        </div>
      </div>

      {/* Map */}
      <div className="relative aspect-video w-full bg-blue-950">
        <MapContainer
          center={[0, 0]}
          zoom={2}
          scrollWheelZoom={true}
          zoomControl={true}
          className="size-full"
          style={{ background: "#0f172a" }}
        >
          <TileLayer
            attribution="© OpenStreetMap contributors | © NASA"
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png"
          />

          {satellites.map((sat) => (
            <div key={sat.id}>
              {/* Satellite marker */}
              <Marker position={[sat.latitude, sat.longitude]}>
                <Popup>
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold">{sat.name}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between gap-4">
                        <span>🌍 Altitude:</span>
                        <span className="font-mono">{sat.altitude.toFixed(2)} km</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>⚡ Velocity:</span>
                        <span className="font-mono">{sat.velocity.toFixed(2)} km/h</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>👁️ Visibility:</span>
                        <span className="capitalize">{sat.visibility}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>📍 Coordinates:</span>
                        <span className="font-mono">
                          {sat.latitude.toFixed(4)}, {sat.longitude.toFixed(4)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Ground track indicator */}
              <CircleMarker
                center={[sat.latitude, sat.longitude]}
                radius={sat.footprint / 100} // Scale footprint
                pathOptions={{
                  color: "rgba(59, 130, 246, 0.3)",
                  fillColor: "rgba(59, 130, 246, 0.5)",
                  fillOpacity: 0.3,
                  weight: 1,
                }}
              />
            </div>
          ))}
        </MapContainer>

        {/* Overlay stats */}
        <div className="absolute right-4 bottom-4 left-4 flex gap-4">
          {satellites.map((sat) => (
            <div
              key={sat.id}
              className="flex-1 rounded-lg bg-black/70 p-3 text-white backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <Satellite className="size-4 text-blue-400" />
                <span className="font-semibold">{sat.name}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-gray-400">Altitude</div>
                  <div className="font-mono text-sm">{sat.altitude.toFixed(0)} km</div>
                </div>
                <div>
                  <div className="text-gray-400">Velocity</div>
                  <div className="font-mono text-sm">{(sat.velocity / 3600).toFixed(2)} km/s</div>
                </div>
                <div>
                  <div className="text-gray-400">Position</div>
                  <div className="font-mono text-sm">
                    {sat.latitude.toFixed(2)}°, {sat.longitude.toFixed(2)}°
                  </div>
                </div>
                <div>
                  <div className="text-gray-400">Footprint</div>
                  <div className="font-mono text-sm">{sat.footprint.toFixed(0)} km</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="border-t p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {satellites.map((sat) => (
            <div key={sat.id} className="rounded-lg border p-4">
              <div className="mb-3 flex items-center gap-2">
                <Zap className="size-4 text-yellow-500" />
                <h4 className="font-semibold">{sat.name}</h4>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">NORAD ID:</dt>
                  <dd className="font-mono">{sat.id}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Visibility:</dt>
                  <dd
                    className={cn(
                      "capitalize",
                      sat.visibility === "daylight" ? "text-yellow-500" : "text-blue-500"
                    )}
                  >
                    {sat.visibility}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Solar Lat:</dt>
                  <dd className="font-mono">{sat.solar_lat.toFixed(2)}°</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Solar Lon:</dt>
                  <dd className="font-mono">{sat.solar_lon.toFixed(2)}°</dd>
                </div>
              </dl>
            </div>
          ))}
        </div>

        {/* Refresh button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={fetchAllSatellites}
            className="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
          >
            <Globe className="size-4" />
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}

export default SatelliteTracker
