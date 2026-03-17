import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { shallow } from "zustand/shallow"

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

interface VisualizationActions {
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

interface VisualizationState extends VisualizationSettings, VisualizationActions {}

// Начальные значения
const defaultSettings: Omit<VisualizationSettings, "selectedVisualization"> = {
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

// Селекторы для оптимизации ререндеров
export const selectVisualizationSettings = (state: VisualizationState) => ({
  isPlaying: state.isPlaying,
  animationSpeed: state.animationSpeed,
  selectedVisualization: state.selectedVisualization,
})

export const selectPlaybackSettings = (state: VisualizationState) => ({
  isPlaying: state.isPlaying,
  animationSpeed: state.animationSpeed,
})

// Отдельные селекторы для предотвращения лишних ререндеров
export const selectIsPlaying = (state: VisualizationState) => state.isPlaying
export const selectAnimationSpeed = (state: VisualizationState) => state.animationSpeed

export const selectWaveFunctionSettings = (state: VisualizationState) => state.waveFunction

export const selectTimeDilationSettings = (state: VisualizationState) => state.timeDilation

export const selectBlackHoleSettings = (state: VisualizationState) => state.blackHole

// Сравнение для wave function настроек (для использования с shallow)
export const waveFunctionComparer = (
  a: ReturnType<typeof selectWaveFunctionSettings>,
  b: ReturnType<typeof selectWaveFunctionSettings>
) =>
  a.quantumNumber === b.quantumNumber &&
  a.showProbability === b.showProbability &&
  a.showWaveFunction === b.showWaveFunction

// Сравнение для time dilation настроек
export const timeDilationComparer = (
  a: ReturnType<typeof selectTimeDilationSettings>,
  b: ReturnType<typeof selectTimeDilationSettings>
) => a.velocity === b.velocity && a.showClock === b.showClock

// Сравнение для black hole настроек
export const blackHoleComparer = (
  a: ReturnType<typeof selectBlackHoleSettings>,
  b: ReturnType<typeof selectBlackHoleSettings>
) =>
  a.mass === b.mass &&
  a.showAccretionDisk === b.showAccretionDisk &&
  a.showHawkingRadiation === b.showHawkingRadiation

export const useVisualizationStore = create<VisualizationState>()(
  persist(
    (set, _get) => ({
      selectedVisualization: null,
      ...defaultSettings,

      // Общие actions
      setSelectedVisualization: (type) => set({ selectedVisualization: type }),

      toggleFullscreen: () => set((state) => ({ isFullscreen: !state.isFullscreen })),

      setIsFullscreen: (value) => set({ isFullscreen: value }),

      togglePlaying: () => set((state) => ({ isPlaying: !state.isPlaying })),

      setIsPlaying: (value) => set({ isPlaying: value }),

      setAnimationSpeed: (speed) =>
        set(() => ({
          animationSpeed: Math.max(0.1, Math.min(2.0, speed)),
        })),

      // waveFunction actions
      setQuantumNumber: (n) =>
        set((state) => ({
          waveFunction: {
            ...state.waveFunction,
            quantumNumber: Math.max(1, n),
          },
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
          timeDilation: {
            ...state.timeDilation,
            velocity: Math.max(0, Math.min(0.99, v)),
          },
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
          blackHole: {
            ...state.blackHole,
            mass: Math.max(1, mass),
          },
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
      resetSettings: () =>
        set({
          selectedVisualization: null,
          ...defaultSettings,
        }),
    }),
    {
      name: "visualization-settings",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Экспортируем shallow для использования в компонентах
export { shallow }
