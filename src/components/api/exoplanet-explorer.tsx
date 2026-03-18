/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
"use client"

import { useState, useEffect, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Stars, Html } from "@react-three/drei"
import * as THREE from "three"
import { Telescope, Info, Ruler, Thermometer, Clock, Orbit } from "lucide-react"
import { VisualizationLoader } from "@/components/ui/visualization-loader"
import { PhysicsTooltip, TooltipTrigger } from "@/components/ui/physics-tooltip-enhanced"
import { cn } from "@/lib/utils"

interface ExoplanetData {
  pl_name: string
  hostname: string
  ra: number
  dec: number
  pl_massj: number
  pl_radj: number
  pl_orbper: number
  pl_eqt: number
  pl_disc: string
  discoverymethod: string
  sy_snum: number
  sy_pnum: number
}

interface Planet3DProps {
  radius: number
  color: string
  distance: number
  orbitSpeed: number
  isSelected: boolean
  onClick: () => void
}

function Planet3D({ radius, color, distance, orbitSpeed, isSelected, onClick }: Planet3DProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(({ clock }) => {
    if (meshRef.current) {
      // Orbital motion
      const t = clock.getElapsedTime() * orbitSpeed
      meshRef.current.position.x = Math.cos(t) * distance
      meshRef.current.position.z = Math.sin(t) * distance
      
      // Self rotation
      meshRef.current.rotation.y += 0.01
    }
  })

  return (
    <group>
      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[distance - 0.05, distance + 0.05, 64]} />
        <meshBasicMaterial color="#4f46e5" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      {/* Planet */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered || isSelected ? 1.2 : 1}
      >
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.5 : hovered ? 0.3 : 0.1}
          metalness={0.5}
          roughness={0.7}
        />
        
        {hovered && (
          <Html distanceFactor={10}>
            <div className="rounded-lg bg-black/90 px-3 py-2 text-xs text-white whitespace-nowrap backdrop-blur-sm">
              Click for details
            </div>
          </Html>
        )}
      </mesh>
    </group>
  )
}

function StarField() {
  return (
    <group>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </group>
  )
}

interface ExoplanetExplorerProps {
  className?: string
}

export function ExoplanetExplorer({ className }: ExoplanetExplorerProps) {
  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null)
  const [planets, setPlanets] = useState<ExoplanetData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Sample exoplanet data (in real implementation, fetch from NASA API)
  const samplePlanets: ExoplanetData[] = [
    {
      pl_name: "Kepler-186f",
      hostname: "Kepler-186",
      ra: 297.5,
      dec: 43.95,
      pl_massj: 0.32,
      pl_radj: 1.11,
      pl_orbper: 129.9,
      pl_eqt: 188,
      pl_disc: "2014",
      discoverymethod: "Transit",
      sy_snum: 1,
      sy_pnum: 5,
    },
    {
      pl_name: "TRAPPIST-1e",
      hostname: "TRAPPIST-1",
      ra: 346.5,
      dec: -5.09,
      pl_massj: 0.24,
      pl_radj: 0.91,
      pl_orbper: 6.1,
      pl_eqt: 251,
      pl_disc: "2017",
      discoverymethod: "Transit",
      sy_snum: 1,
      sy_pnum: 7,
    },
    {
      pl_name: "Proxima Centauri b",
      hostname: "Proxima Centauri",
      ra: 217.4,
      dec: -62.68,
      pl_massj: 0.004,
      pl_radj: 1.03,
      pl_orbper: 11.2,
      pl_eqt: 234,
      pl_disc: "2016",
      discoverymethod: "Radial Velocity",
      sy_snum: 1,
      sy_pnum: 3,
    },
    {
      pl_name: "HD 40307 g",
      hostname: "HD 40307",
      ra: 97.5,
      dec: -51.0,
      pl_massj: 0.022,
      pl_radj: 1.8,
      pl_orbper: 197.8,
      pl_eqt: 220,
      pl_disc: "2012",
      discoverymethod: "Radial Velocity",
      sy_snum: 1,
      sy_pnum: 6,
    },
    {
      pl_name: "55 Cancri e",
      hostname: "55 Cancri",
      ra: 132.0,
      dec: 28.3,
      pl_massj: 0.026,
      pl_radj: 1.88,
      pl_orbper: 0.74,
      pl_eqt: 2573,
      pl_disc: "2004",
      discoverymethod: "Transit",
      sy_snum: 1,
      sy_pnum: 5,
    },
  ]

  useEffect(() => {
    // Simulate API fetch with sample data
    const loadPlanets = async () => {
      try {
        setLoading(true)
        // In production: fetch from NASA Exoplanet Archive
        // const response = await fetch('https://exoplanetarchive.ipac.caltech.edu/TAP/sync')
        setPlanets(samplePlanets)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load exoplanets")
      } finally {
        setLoading(false)
      }
    }

    void loadPlanets()
  }, [])

  const getPlanetColor = (temperature: number): string => {
    if (temperature > 1000) return "#ff6b35" // Hot - orange/red
    if (temperature > 500) return "#f4a261"  // Warm - light orange
    if (temperature > 200) return "#2ec4b6"  // Habitable - teal/blue
    return "#3a86ff" // Cold - blue
  }

  const getPlanetRadius = (radius: number): number => {
    // Scale for visualization (Earth = 1 unit)
    return Math.min(Math.max(radius * 0.5, 0.3), 2)
  }

  const getOrbitDistance = (index: number): number => {
    return 3 + index * 2 // Spaced orbits
  }

  const getOrbitSpeed = (period: number): number => {
    return 0.5 / Math.sqrt(period) // Faster for shorter periods
  }

  if (loading) {
    return <VisualizationLoader className={className} />
  }

  if (error) {
    return (
      <div className={cn(
        "flex items-center justify-center p-8 rounded-xl border bg-card",
        className
      )}>
        <div className="text-center space-y-4">
          <div className="text-4xl">🪐</div>
          <h3 className="text-lg font-semibold">Lost in Space</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Warp Again
          </button>
        </div>
      </div>
    )
  }

  const selectedData = selectedPlanet !== null ? planets[selectedPlanet] : null

  return (
    <div className={cn(
      "overflow-hidden rounded-xl border bg-card shadow-lg",
      className
    )}>
      {/* Header */}
      <div className="border-b bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Telescope className="size-8 text-purple-500" />
              <h3 className="text-2xl font-bold">🪐 Exoplanet Explorer</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Interactive 3D visualization of discovered exoplanets
            </p>
          </div>

          <PhysicsTooltip
            title="Exoplanets"
            description="Planets outside our Solar System orbiting other stars. Over 5,000 confirmed exoplanets discovered so far!"
            learnMoreUrl="https://exoplanets.nasa.gov/"
          >
            <TooltipTrigger>
              <span className="text-sm">What are exoplanets?</span>
            </TooltipTrigger>
          </PhysicsTooltip>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* 3D Visualization */}
        <div className="relative aspect-square w-full bg-black lg:aspect-auto">
          <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
            <ambientLight intensity={0.3} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#fef3c7" />
            
            {/* Central star */}
            <mesh>
              <sphereGeometry args={[1.5, 32, 32]} />
              <meshStandardMaterial
                color="#fef3c7"
                emissive="#fbbf24"
                emissiveIntensity={2}
              />
            </mesh>

            {/* Planets */}
            {planets.map((planet, index) => (
              <Planet3D
                key={planet.pl_name}
                radius={getPlanetRadius(planet.pl_radj)}
                color={getPlanetColor(planet.pl_eqt)}
                distance={getOrbitDistance(index)}
                orbitSpeed={getOrbitSpeed(planet.pl_orbper)}
                isSelected={selectedPlanet === index}
                onClick={() => setSelectedPlanet(index)}
              />
            ))}

            {/* Background */}
            <StarField />
            
            {/* Controls */}
            <OrbitControls
              enableZoom={true}
              enablePan={true}
              minDistance={5}
              maxDistance={50}
            />
          </Canvas>

          {/* Overlay instructions */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between text-xs text-white/70">
            <span>🖱️ Drag to rotate • Scroll to zoom</span>
            <span>Click planet for details</span>
          </div>
        </div>

        {/* Planet List & Details */}
        <div className="flex flex-col gap-4 p-6">
          {/* Planet List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg">Discovered Planets ({planets.length})</h4>
            <div className="max-h-[300px] overflow-y-auto space-y-2 rounded-lg border p-2">
              {planets.map((planet, index) => (
                <button
                  key={planet.pl_name}
                  onClick={() => setSelectedPlanet(index)}
                  className={cn(
                    "w-full p-3 text-left rounded-lg transition-all duration-200",
                    selectedPlanet === index
                      ? "bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/50"
                      : "border hover:bg-accent"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{planet.pl_name}</div>
                      <div className="text-xs text-muted-foreground">
                        ⭐ {planet.hostname} • 🌡️ {planet.pl_eqt}K
                      </div>
                    </div>
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: getPlanetColor(planet.pl_eqt) }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Planet Details */}
          {selectedData && (
            <div className="flex-1 space-y-4 rounded-lg border bg-gradient-to-br from-purple-500/5 to-blue-500/5 p-4">
              <div className="flex items-center gap-2">
                <Info className="size-5 text-purple-500" />
                <h4 className="text-xl font-bold">{selectedData.pl_name}</h4>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Ruler className="size-4" />
                    <span>Radius</span>
                  </div>
                  <div className="font-mono">
                    {(selectedData.pl_radj * 11.2).toFixed(2)} R⊕ 
                    <span className="text-xs text-muted-foreground ml-1">
                      ({selectedData.pl_radj.toFixed(2)} RJ)
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Thermometer className="size-4" />
                    <span>Temperature</span>
                  </div>
                  <div className={cn(
                    "font-mono",
                    selectedData.pl_eqt > 300 ? "text-red-500" :
                    selectedData.pl_eqt > 200 ? "text-green-500" : "text-blue-500"
                  )}>
                    {selectedData.pl_eqt}K
                    <span className="text-xs text-muted-foreground ml-1">
                      ({(selectedData.pl_eqt - 273.15).toFixed(1)}°C)
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="size-4" />
                    <span>Orbital Period</span>
                  </div>
                  <div className="font-mono">
                    {selectedData.pl_orbper.toFixed(1)} days
                    <span className="text-xs text-muted-foreground ml-1">
                      ({(selectedData.pl_orbper / 365).toFixed(2)} years)
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Orbit className="size-4" />
                    <span>Discovery</span>
                  </div>
                  <div className="font-mono">
                    {selectedData.pl_disc} • {selectedData.discoverymethod}
                  </div>
                </div>
              </div>

              {/* Habitability indicator */}
              <div className="rounded-lg border p-3">
                <div className="mb-2 text-sm font-medium">Habitability Zone</div>
                <div className="flex gap-1">
                  <div className={cn(
                    "flex-1 rounded py-1 text-center text-xs",
                    selectedData.pl_eqt < 200 
                      ? "bg-blue-500/20 text-blue-500 border border-blue-500/50" 
                      : "bg-gray-500/10 text-gray-500"
                  )}>
                    ❄️ Too Cold
                  </div>
                  <div className={cn(
                    "flex-1 rounded py-1 text-center text-xs",
                    selectedData.pl_eqt >= 200 && selectedData.pl_eqt <= 300
                      ? "bg-green-500/20 text-green-500 border border-green-500/50" 
                      : "bg-gray-500/10 text-gray-500"
                  )}>
                    ✅ Habitable
                  </div>
                  <div className={cn(
                    "flex-1 rounded py-1 text-center text-xs",
                    selectedData.pl_eqt > 300 
                      ? "bg-red-500/20 text-red-500 border border-red-500/50" 
                      : "bg-gray-500/10 text-gray-500"
                  )}>
                    🔥 Too Hot
                  </div>
                </div>
              </div>

              {/* Coordinates */}
              <div className="rounded-lg border bg-black/20 p-3 font-mono text-xs">
                <div>RA: {selectedData.ra.toFixed(2)}° | Dec: {selectedData.dec.toFixed(2)}°</div>
                <div className="text-muted-foreground mt-1">
                  System: {selectedData.sy_snum} stars • {selectedData.sy_pnum} planets
                </div>
              </div>
            </div>
          )}

          {!selectedData && (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-8 text-center text-muted-foreground">
              <div>
                <Telescope className="mx-auto mb-2 size-12 opacity-50" />
                <p>Select a planet to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
