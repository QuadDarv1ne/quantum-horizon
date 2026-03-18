/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import { useQuery } from "@tanstack/react-query"

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

interface UseSatelliteOptions {
  satelliteId?: number
  enabled?: boolean
  refetchInterval?: number
  staleTime?: number
  gcTime?: number
}

export function useSatellite({
  satelliteId = 25544, // ISS
  enabled = true,
  refetchInterval = 5000, // 5 seconds
  staleTime = 1000 * 5, // 5 seconds
  gcTime = 1000 * 60 * 5 // 5 minutes
}: UseSatelliteOptions = {}) {
  const apiUrl = `https://api.wheretheiss.at/v1/satellites/${satelliteId}`

  return useQuery<SatelliteData, Error>({
    queryKey: ["satellite", satelliteId],
    queryFn: async () => {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch satellite data: ${response.status}`)
      }
      return response.json()
    },
    enabled,
    refetchInterval,
    staleTime,
    gcTime,
    retry: 1,
    refetchOnWindowFocus: false,
  })
}

export function useMultipleSatellites(
  satelliteIds: number[] = [25544, 48274, 43013, 37849], // ISS, Tiangong, Hubble, GPS
  enabled = true
) {
  return useQuery<SatelliteData[], Error>({
    queryKey: ["satellites", satelliteIds],
    queryFn: async () => {
      const promises = satelliteIds.map(id =>
        fetch(`https://api.wheretheiss.at/v1/satellites/${id}`).then(res => {
          if (!res.ok) throw new Error(`Failed to fetch satellite ${id}`)
          return res.json()
        })
      )
      
      const results = await Promise.allSettled(promises)
      return results
        .filter((r): r is PromiseFulfilledResult<SatelliteData> => r.status === "fulfilled")
        .map(r => r.value)
    },
    enabled,
    refetchInterval: 5000,
    staleTime: 1000 * 5,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  })
}
