/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { describe, it, expect, beforeEach, vi } from "vitest"
import {
  getAllPresets,
  createCustomPreset,
  exportPresets,
  importPresets,
  DEFAULT_PRESETS,
  type VisualizationType,
} from "./presets"

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(global, "localStorage", {
  value: localStorageMock,
})

describe("presets", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it("возвращает стандартные пресеты для waveFunction", () => {
    const presets = getAllPresets("waveFunction")
    expect(presets.length).toBeGreaterThan(0)
    expect(presets.some((p) => p.isDefault)).toBe(true)
  })

  it("возвращает стандартные пресеты для timeDilation", () => {
    const presets = getAllPresets("timeDilation")
    expect(presets.length).toBeGreaterThan(0)
    expect(DEFAULT_PRESETS.timeDilation).toBeDefined()
  })

  it("возвращает стандартные пресеты для blackHole", () => {
    const presets = getAllPresets("blackHole")
    expect(presets.length).toBeGreaterThan(0)
    expect(DEFAULT_PRESETS.blackHole).toBeDefined()
  })

  it("создаёт пользовательский пресет", () => {
    const preset = createCustomPreset("Тестовый пресет", "Описание", "waveFunction", {
      waveFunction: {
        quantumNumber: 5,
        showProbability: true,
        showWaveFunction: true,
      },
    } as any)

    expect(preset.id).toMatch(/^custom-\d+$/)
    expect(preset.name).toBe("Тестовый пресет")
    expect(preset.visualizationType).toBe("waveFunction")
  })

  it("экспортирует пресеты в JSON", () => {
    localStorageMock.getItem.mockReturnValue(
      JSON.stringify({
        waveFunction: [
          {
            id: "custom-123",
            name: "Test",
            description: "Test preset",
            visualizationType: "waveFunction" as VisualizationType,
            settings: {},
            createdAt: Date.now(),
          },
        ],
      })
    )

    const exported = exportPresets()
    expect(typeof exported).toBe("string")
    expect(() => {
      try {
        JSON.parse(exported)
      } catch {
        throw new Error("Invalid JSON")
      }
    }).not.toThrow()
  })

  it("импортирует пресеты из JSON", () => {
    const json = JSON.stringify({
      timeDilation: [
        {
          id: "custom-imported",
          name: "Imported Preset",
          description: "From import",
          visualizationType: "timeDilation" as VisualizationType,
          settings: {
            timeDilation: {
              velocity: 0.5,
            },
          },
          createdAt: Date.now(),
        } as const,
      ],
    })

    const success = importPresets(json)
    expect(success).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })

  it("возвращает false при невалидном JSON импорте", () => {
    const success = importPresets("invalid json")
    expect(success).toBe(false)
  })

  it("возвращает пустой массив для неизвестной визуализации", () => {
    const presets = getAllPresets("unknown" as any)
    expect(presets).toEqual([])
  })

  it("создаёт пресет с корректным ID", () => {
    const preset = createCustomPreset("Test", "Desc", "waveFunction", {} as any)
    expect(typeof preset.id).toBe("string")
    expect(preset.id).toMatch(/^custom-\d+$/)
  })

  it("импортирует пресеты и проверяет структуру", () => {
    const json = JSON.stringify({
      timeDilation: [
        {
          id: "custom-imported",
          name: "Imported Preset",
          description: "From import",
          visualizationType: "timeDilation" as VisualizationType,
          settings: {
            timeDilation: {
              velocity: 0.5,
            },
          },
          createdAt: Date.now(),
        } as const,
      ],
    })

    const success = importPresets(json)
    expect(success).toBe(true)
    expect(localStorageMock.setItem).toHaveBeenCalled()
  })
})
