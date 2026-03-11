import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

// Типы для настроек визуализаций
export type VisualizationType =
  | "waveFunction"
  | "uncertainty"
  | "tunneling"
  | "timeDilation"
  | "lengthContraction"
  | "massEnergy"
  | "hrDiagram"
  | "neutronStar"
  | "blackHole"
  | "doubleSlit"
  | "darkMatter"

export interface VisualizationSettings {
  // Общие настройки
  selectedVisualization: VisualizationType | null
  isFullscreen: boolean
  isPlaying: boolean
  animationSpeed: number // 0.1 - 2.0

  // Настройки для конкретных визуализаций
  waveFunction: {
    quantumNumber: number
    showProbability: boolean
    showWaveFunction: boolean
  }
  timeDilation: {
    velocity: number // 0 - 0.99c
    showClock: boolean
  }
  blackHole: {
    mass: number
    showAccretionDisk: boolean
    showHawkingRadiation: boolean
  }
}

interface VisualizationState extends VisualizationSettings {
  // Actions - общие
  setSelectedVisualization: (type: VisualizationType | null) => void
  toggleFullscreen: () => void
  setIsFullscreen: (value: boolean) => void
  togglePlaying: () => void
  setIsPlaying: (value: boolean) => void
  setAnimationSpeed: (speed: number) => void

  // Actions - waveFunction
  setQuantumNumber: (n: number) => void
  toggleShowProbability: () => void
  toggleShowWaveFunction: () => void

  // Actions - timeDilation
  setVelocity: (v: number) => void
  toggleShowClock: () => void

  // Actions - blackHole
  setBlackHoleMass: (mass: number) => void
  toggleAccretionDisk: () => void
  toggleHawkingRadiation: () => void

  // Reset
  resetSettings: () => void
}

// Начальные значения
const defaultSettings: VisualizationSettings = {
  selectedVisualization: null,
  isFullscreen: false,
  isPlaying: true,
  animationSpeed: 1.0,

  waveFunction: {
    quantumNumber: 1,
    showProbability: true,
    showWaveFunction: true,
  },
  timeDilation: {
    velocity: 0.5,
    showClock: true,
  },
  blackHole: {
    mass: 10,
    showAccretionDisk: true,
    showHawkingRadiation: false,
  },
}

export const useVisualizationStore = create<VisualizationState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      // Общие actions
      setSelectedVisualization: (type) =>
        set({ selectedVisualization: type }),

      toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),
      setIsFullscreen: (value) => set({ isFullscreen: value }),

      togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setIsPlaying: (value) => set({ isPlaying: value }),

      setAnimationSpeed: (speed) =>
        set({ animationSpeed: Math.max(0.1, Math.min(2.0, speed)) }),

      // waveFunction actions
      setQuantumNumber: (n) =>
        set((state) => ({
          waveFunction: { ...state.waveFunction, quantumNumber: Math.max(1, n) },
        })),

      toggleShowProbability: () =>
        set((state) => ({
          waveFunction: {
            ...state.waveFunction,
            showProbability: !state.waveFunction.showProbability,
          },
        })),

      toggleShowWaveFunction: () =>
        set((state) => ({
          waveFunction: {
            ...state.waveFunction,
            showWaveFunction: !state.waveFunction.showWaveFunction,
          },
        })),

      // timeDilation actions
      setVelocity: (v) =>
        set((state) => ({
          timeDilation: { ...state.timeDilation, velocity: Math.max(0, Math.min(0.99, v)) },
        })),

      toggleShowClock: () =>
        set((state) => ({
          timeDilation: {
            ...state.timeDilation,
            showClock: !state.timeDilation.showClock,
          },
        })),

      // blackHole actions
      setBlackHoleMass: (mass) =>
        set((state) => ({
          blackHole: { ...state.blackHole, mass: Math.max(1, mass) },
        })),

      toggleAccretionDisk: () =>
        set((state) => ({
          blackHole: {
            ...state.blackHole,
            showAccretionDisk: !state.blackHole.showAccretionDisk,
          },
        })),

      toggleHawkingRadiation: () =>
        set((state) => ({
          blackHole: {
            ...state.blackHole,
            showHawkingRadiation: !state.blackHole.showHawkingRadiation,
          },
        })),

      // Reset
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: "visualization-settings",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Сохраняем только настройки, не selectedVisualization
        isFullscreen: state.isFullscreen,
        isPlaying: state.isPlaying,
        animationSpeed: state.animationSpeed,
        waveFunction: state.waveFunction,
        timeDilation: state.timeDilation,
        blackHole: state.blackHole,
      }),
    },
  ),
)

// Селекторы для оптимизации ререндеров
export const selectVisualizationSettings = (state: VisualizationState) => ({
  isPlaying: state.isPlaying,
  animationSpeed: state.animationSpeed,
  selectedVisualization: state.selectedVisualization,
})

export const selectWaveFunctionSettings = (state: VisualizationState) =>
  state.waveFunction

export const selectTimeDilationSettings = (state: VisualizationState) =>
  state.timeDilation

export const selectBlackHoleSettings = (state: VisualizationState) =>
  state.blackHole
