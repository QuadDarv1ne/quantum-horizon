"use client"

import { useQuery } from "@tanstack/react-query"

interface APODData {
  date: string
  explanation: string
  hdurl: string
  media_type: "image" | "video"
  service_version: string
  title: string
  url: string
  copyright?: string
}

interface UseAPODOptions {
  date?: string
  enabled?: boolean
  staleTime?: number
  gcTime?: number
}

/* eslint-disable @typescript-eslint/restrict-template-expressions */
export function useAPOD({
  date,
  enabled = true,
  staleTime = 1000 * 60 * 60, // 1 hour
  gcTime = 1000 * 60 * 60 * 24, // 24 hours
}: UseAPODOptions = {}) {
  const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY ?? "DEMO_KEY"
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}${date ? `&date=${date}` : ""}`

  return useQuery<APODData>({
    queryKey: ["apod", date ?? "today"],
    queryFn: async () => {
      const response = await fetch(apiUrl)
      if (!response.ok) {
        throw new Error(`Failed to fetch APOD: ${response.status}`)
      }
      return response.json() as Promise<APODData>
    },
    enabled,
    staleTime,
    gcTime,
    retry: 2,
    refetchOnWindowFocus: false,
  })
}
