"use client"

import { useQuery } from "@tanstack/react-query"

// Пример типа данных для физических констант
export interface PhysicalConstant {
  name: string
  symbol: string
  value: number
  unit: string
  uncertainty?: number
}

// Функция для получения физических констант (пример API)
async function getPhysicalConstants(): Promise<PhysicalConstant[]> {
  // В реальности здесь был бы fetch к API
  // Для примера возвращаем моковые данные
  await Promise.resolve() // Placeholder for async operation
  return [
    { name: "Speed of Light", symbol: "c", value: 299792458, unit: "m/s" },
    { name: "Planck Constant", symbol: "h", value: 6.62607015e-34, unit: "J·s" },
    { name: "Gravitational Constant", symbol: "G", value: 6.6743e-11, unit: "m³/(kg·s²)" },
    { name: "Elementary Charge", symbol: "e", value: 1.602176634e-19, unit: "C" },
    { name: "Boltzmann Constant", symbol: "k_B", value: 1.380649e-23, unit: "J/K" },
  ]
}

// Хук для получения физических констант
export function usePhysicalConstants() {
  return useQuery({
    queryKey: ["physical-constants"],
    queryFn: getPhysicalConstants,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
  })
}

// Пример хука для получения данных с параметрами
export async function fetchScientificData(category: string): Promise<unknown> {
  // Пример fetch с параметрами
  const response = await fetch(`/api/science/${category}`)
  if (!response.ok) throw new Error("Failed to fetch data")
  return response.json()
}

export function useScientificData(category: string) {
  return useQuery({
    queryKey: ["scientific-data", category],
    queryFn: () => fetchScientificData(category),
    enabled: !!category, // Запрос только если category существует
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
}
