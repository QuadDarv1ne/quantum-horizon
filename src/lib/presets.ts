/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

// Система пресетов для настроек визуализаций

import { type VisualizationType, type VisualizationSettings } from "@/stores/visualization-store"

export interface Preset {
  id: string
  name: string
  description: string
  visualizationType: VisualizationType
  settings: Partial<VisualizationSettings>
  createdAt: number
  isDefault?: boolean
}

// Предустановленные пресеты для каждой визуализации
export const DEFAULT_PRESETS: Record<string, Preset[]> = {
  waveFunction: [
    {
      id: "wf-basic",
      name: "Базовый",
      description: "Основное состояние (n=1)",
      visualizationType: "waveFunction",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        waveFunction: {
          quantumNumber: 1,
          showProbability: true,
          showWaveFunction: true,
        },
      },
    },
    {
      id: "wf-excited",
      name: "Возбуждённое состояние",
      description: "Третий энергетический уровень (n=3)",
      visualizationType: "waveFunction",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        waveFunction: {
          quantumNumber: 3,
          showProbability: true,
          showWaveFunction: true,
        },
      },
    },
    {
      id: "wf-high",
      name: "Высокая энергия",
      description: "Высокий уровень (n=10)",
      visualizationType: "waveFunction",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        waveFunction: {
          quantumNumber: 10,
          showProbability: true,
          showWaveFunction: false,
        },
      },
    },
  ],
  timeDilation: [
    {
      id: "td-slow",
      name: "Низкая скорость",
      description: "10% скорости света",
      visualizationType: "timeDilation",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        timeDilation: {
          velocity: 0.1,
          showClock: true,
        },
      },
    },
    {
      id: "td-fast",
      name: "Высокая скорость",
      description: "90% скорости света",
      visualizationType: "timeDilation",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        timeDilation: {
          velocity: 0.9,
          showClock: true,
        },
      },
    },
    {
      id: "td-extreme",
      name: "Экстремальная",
      description: "99% скорости света",
      visualizationType: "timeDilation",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        timeDilation: {
          velocity: 0.99,
          showClock: true,
        },
      },
    },
  ],
  blackHole: [
    {
      id: "bh-small",
      name: "Звёздная",
      description: "Чёрная дыра звёздной массы (10 M☉)",
      visualizationType: "blackHole",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        blackHole: {
          mass: 10,
          showAccretionDisk: true,
          showHawkingRadiation: false,
        },
      },
    },
    {
      id: "bh-large",
      name: "Сверхмассивная",
      description: "Сверхмассивная чёрная дыра (1000 M☉)",
      visualizationType: "blackHole",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        blackHole: {
          mass: 1000,
          showAccretionDisk: true,
          showHawkingRadiation: true,
        },
      },
    },
    {
      id: "bh-hawking",
      name: "Излучение Хокинга",
      description: "Маленькая чёрная дыра с излучением",
      visualizationType: "blackHole",
      createdAt: Date.now(),
      isDefault: true,
      settings: {
        blackHole: {
          mass: 1,
          showAccretionDisk: false,
          showHawkingRadiation: true,
        },
      },
    },
  ],
  uncertainty: [
    {
      id: "unc-balanced",
      name: "Баланс",
      description: "Сбалансированная неопределённость",
      visualizationType: "uncertainty",
      createdAt: Date.now(),
      isDefault: true,
      settings: {},
    },
    {
      id: "unc-position",
      name: "Точное положение",
      description: "Минимальная неопределённость положения",
      visualizationType: "uncertainty",
      createdAt: Date.now(),
      isDefault: true,
      settings: {},
    },
    {
      id: "unc-momentum",
      name: "Точный импульс",
      description: "Минимальная неопределённость импульса",
      visualizationType: "uncertainty",
      createdAt: Date.now(),
      isDefault: true,
      settings: {},
    },
  ],
  massEnergy: [
    {
      id: "me-electron",
      name: "Электрон",
      description: "Энергия покоя электрона",
      visualizationType: "massEnergy",
      createdAt: Date.now(),
      isDefault: true,
      settings: {},
    },
    {
      id: "me-proton",
      name: "Протон",
      description: "Энергия покоя протона",
      visualizationType: "massEnergy",
      createdAt: Date.now(),
      isDefault: true,
      settings: {},
    },
    {
      id: "me-1kg",
      name: "1 килограмм",
      description: "Энергия в 1 кг массы",
      visualizationType: "massEnergy",
      createdAt: Date.now(),
      isDefault: true,
      settings: {},
    },
  ],
}

// Хранение пользовательских пресетов в localStorage
const PRESETS_STORAGE_KEY = "visualization-presets"

export function getUserPresets(): Record<string, Preset[]> {
  if (typeof window === "undefined") {
    return {}
  }

  try {
    const stored = localStorage.getItem(PRESETS_STORAGE_KEY)
    if (!stored) return {}
    return JSON.parse(stored) as Record<string, Preset[]>
  } catch {
    return {}
  }
}

export function saveUserPreset(visualizationType: string, preset: Preset): void {
  try {
    const presets = getUserPresets()
    if (!presets[visualizationType]) {
      presets[visualizationType] = []
    }
    presets[visualizationType].push(preset)
    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
  } catch {
    console.error("Failed to save preset")
  }
}

export function deleteUserPreset(visualizationType: string, presetId: string): void {
  try {
    const presets = getUserPresets()
    if (presets[visualizationType]) {
      presets[visualizationType] = presets[visualizationType].filter((p) => p.id !== presetId)
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presets))
    }
  } catch {
    console.error("Failed to delete preset")
  }
}

export function getAllPresets(visualizationType: string): Preset[] {
  const defaults = DEFAULT_PRESETS[visualizationType] || []
  const presets = getUserPresets()
  const userPresets = presets[visualizationType] || []
  return [...defaults, ...userPresets]
}

export function exportPresets(): string {
  const userPresets = getUserPresets()
  return JSON.stringify(userPresets, null, 2)
}

export function importPresets(jsonString: string): boolean {
  try {
    const presets: Record<string, Preset[]> = JSON.parse(jsonString)
    const currentPresets = getUserPresets()

    // Merge imported presets with current
    Object.keys(presets).forEach((type) => {
      const visualizationType = type as VisualizationType
      const typePresets = presets[visualizationType]
      if (!typePresets) return

      if (!currentPresets[visualizationType]) {
        currentPresets[visualizationType] = []
      }
      // Add imported presets, avoiding duplicates by id
      const existingIds = new Set(currentPresets[visualizationType].map((p) => p.id))
      typePresets.forEach((preset) => {
        if (!existingIds.has(preset.id)) {
          currentPresets[visualizationType].push(preset)
        }
      })
    })

    localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(currentPresets))
    return true
  } catch {
    return false
  }
}

export function applyPreset(
  preset: Preset,
  currentSettings: VisualizationSettings
): VisualizationSettings {
  return {
    ...currentSettings,
    ...preset.settings,
  }
}

export function createCustomPreset(
  name: string,
  description: string,
  visualizationType: VisualizationType,
  settings: Partial<VisualizationSettings>
): Preset {
  const id = `custom-${String(Date.now())}`
  return {
    id,
    name,
    description,
    visualizationType,
    settings,
    createdAt: Date.now(),
  }
}
