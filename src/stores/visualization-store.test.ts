/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, beforeEach } from "vitest"
import {
  useVisualizationStore,
  selectVisualizationSettings,
  selectWaveFunctionSettings,
  selectTimeDilationSettings,
  selectBlackHoleSettings,
  type VisualizationType,
} from "./visualization-store"

describe("useVisualizationStore", () => {
  beforeEach(() => {
    // Reset store to default state
    useVisualizationStore.setState({
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
    })
  })

  describe("Initial state", () => {
    it("should have correct initial selectedVisualization", () => {
      const state = useVisualizationStore.getState()
      expect(state.selectedVisualization).toBeNull()
    })

    it("should have correct initial isFullscreen", () => {
      const state = useVisualizationStore.getState()
      expect(state.isFullscreen).toBe(false)
    })

    it("should have correct initial isPlaying", () => {
      const state = useVisualizationStore.getState()
      expect(state.isPlaying).toBe(true)
    })

    it("should have correct initial animationSpeed", () => {
      const state = useVisualizationStore.getState()
      expect(state.animationSpeed).toBe(1.0)
    })

    it("should have correct initial waveFunction settings", () => {
      const state = useVisualizationStore.getState()
      expect(state.waveFunction.quantumNumber).toBe(1)
      expect(state.waveFunction.showProbability).toBe(true)
      expect(state.waveFunction.showWaveFunction).toBe(true)
    })

    it("should have correct initial timeDilation settings", () => {
      const state = useVisualizationStore.getState()
      expect(state.timeDilation.velocity).toBe(0.5)
      expect(state.timeDilation.showClock).toBe(true)
    })

    it("should have correct initial blackHole settings", () => {
      const state = useVisualizationStore.getState()
      expect(state.blackHole.mass).toBe(10)
      expect(state.blackHole.showAccretionDisk).toBe(true)
      expect(state.blackHole.showHawkingRadiation).toBe(false)
    })
  })

  describe("General actions", () => {
    it("should set selected visualization", () => {
      useVisualizationStore.getState().setSelectedVisualization("waveFunction")

      const state = useVisualizationStore.getState()
      expect(state.selectedVisualization).toBe("waveFunction")
    })

    it("should toggle fullscreen", () => {
      useVisualizationStore.getState().toggleFullscreen()

      const state = useVisualizationStore.getState()
      expect(state.isFullscreen).toBe(true)

      useVisualizationStore.getState().toggleFullscreen()
      expect(useVisualizationStore.getState().isFullscreen).toBe(false)
    })

    it("should set fullscreen directly", () => {
      useVisualizationStore.getState().setIsFullscreen(true)

      expect(useVisualizationStore.getState().isFullscreen).toBe(true)
    })

    it("should toggle playing", () => {
      useVisualizationStore.getState().togglePlaying()

      const state = useVisualizationStore.getState()
      expect(state.isPlaying).toBe(false)

      useVisualizationStore.getState().togglePlaying()
      expect(useVisualizationStore.getState().isPlaying).toBe(true)
    })

    it("should set playing directly", () => {
      useVisualizationStore.getState().setIsPlaying(false)

      expect(useVisualizationStore.getState().isPlaying).toBe(false)
    })

    it("should clamp animationSpeed between 0.1 and 2.0", () => {
      useVisualizationStore.getState().setAnimationSpeed(0.05)
      expect(useVisualizationStore.getState().animationSpeed).toBe(0.1)

      useVisualizationStore.getState().setAnimationSpeed(3.0)
      expect(useVisualizationStore.getState().animationSpeed).toBe(2.0)

      useVisualizationStore.getState().setAnimationSpeed(1.5)
      expect(useVisualizationStore.getState().animationSpeed).toBe(1.5)
    })
  })

  describe("Wave Function actions", () => {
    it("should set quantum number", () => {
      useVisualizationStore.getState().setQuantumNumber(3)

      const state = useVisualizationStore.getState()
      expect(state.waveFunction.quantumNumber).toBe(3)
    })

    it("should clamp quantum number to minimum 1", () => {
      useVisualizationStore.getState().setQuantumNumber(0)

      expect(useVisualizationStore.getState().waveFunction.quantumNumber).toBe(1)
    })

    it("should toggle showProbability", () => {
      useVisualizationStore.getState().toggleShowProbability()

      expect(useVisualizationStore.getState().waveFunction.showProbability).toBe(false)

      useVisualizationStore.getState().toggleShowProbability()
      expect(useVisualizationStore.getState().waveFunction.showProbability).toBe(true)
    })

    it("should toggle showWaveFunction", () => {
      useVisualizationStore.getState().toggleShowWaveFunction()

      expect(useVisualizationStore.getState().waveFunction.showWaveFunction).toBe(false)

      useVisualizationStore.getState().toggleShowWaveFunction()
      expect(useVisualizationStore.getState().waveFunction.showWaveFunction).toBe(true)
    })
  })

  describe("Time Dilation actions", () => {
    it("should set velocity", () => {
      useVisualizationStore.getState().setVelocity(0.8)

      const state = useVisualizationStore.getState()
      expect(state.timeDilation.velocity).toBe(0.8)
    })

    it("should clamp velocity between 0 and 0.99", () => {
      useVisualizationStore.getState().setVelocity(-0.1)
      expect(useVisualizationStore.getState().timeDilation.velocity).toBe(0)

      useVisualizationStore.getState().setVelocity(1.5)
      expect(useVisualizationStore.getState().timeDilation.velocity).toBe(0.99)
    })

    it("should toggle showClock", () => {
      useVisualizationStore.getState().toggleShowClock()

      expect(useVisualizationStore.getState().timeDilation.showClock).toBe(false)

      useVisualizationStore.getState().toggleShowClock()
      expect(useVisualizationStore.getState().timeDilation.showClock).toBe(true)
    })
  })

  describe("Black Hole actions", () => {
    it("should set black hole mass", () => {
      useVisualizationStore.getState().setBlackHoleMass(25)

      const state = useVisualizationStore.getState()
      expect(state.blackHole.mass).toBe(25)
    })

    it("should clamp mass to minimum 1", () => {
      useVisualizationStore.getState().setBlackHoleMass(0)

      expect(useVisualizationStore.getState().blackHole.mass).toBe(1)
    })

    it("should toggle accretion disk", () => {
      useVisualizationStore.getState().toggleAccretionDisk()

      expect(useVisualizationStore.getState().blackHole.showAccretionDisk).toBe(false)

      useVisualizationStore.getState().toggleAccretionDisk()
      expect(useVisualizationStore.getState().blackHole.showAccretionDisk).toBe(true)
    })

    it("should toggle Hawking radiation", () => {
      useVisualizationStore.getState().toggleHawkingRadiation()

      expect(useVisualizationStore.getState().blackHole.showHawkingRadiation).toBe(true)

      useVisualizationStore.getState().toggleHawkingRadiation()
      expect(useVisualizationStore.getState().blackHole.showHawkingRadiation).toBe(false)
    })
  })

  describe("Reset", () => {
    it("should reset all settings to defaults", () => {
      // Change some settings
      useVisualizationStore.getState().setSelectedVisualization("blackHole")
      useVisualizationStore.getState().setIsFullscreen(true)
      useVisualizationStore.getState().setIsPlaying(false)
      useVisualizationStore.getState().setAnimationSpeed(1.5)
      useVisualizationStore.getState().setQuantumNumber(5)
      useVisualizationStore.getState().setVelocity(0.9)
      useVisualizationStore.getState().setBlackHoleMass(50)

      // Reset
      useVisualizationStore.getState().resetSettings()

      const state = useVisualizationStore.getState()
      expect(state.selectedVisualization).toBeNull()
      expect(state.isFullscreen).toBe(false)
      expect(state.isPlaying).toBe(true)
      expect(state.animationSpeed).toBe(1.0)
      expect(state.waveFunction.quantumNumber).toBe(1)
      expect(state.timeDilation.velocity).toBe(0.5)
      expect(state.blackHole.mass).toBe(10)
    })
  })
})

describe("Selectors", () => {
  beforeEach(() => {
    useVisualizationStore.setState({
      selectedVisualization: "waveFunction",
      isFullscreen: true,
      isPlaying: false,
      animationSpeed: 1.5,
    })
  })

  it("should select visualization settings", () => {
    const state = useVisualizationStore.getState()
    const selected = selectVisualizationSettings(state)

    expect(selected).toEqual({
      isPlaying: false,
      animationSpeed: 1.5,
      selectedVisualization: "waveFunction",
    })
  })

  it("should select wave function settings", () => {
    const state = useVisualizationStore.getState()
    const selected = selectWaveFunctionSettings(state)

    expect(selected).toEqual({
      quantumNumber: 1,
      showProbability: true,
      showWaveFunction: true,
    })
  })

  it("should select time dilation settings", () => {
    const state = useVisualizationStore.getState()
    const selected = selectTimeDilationSettings(state)

    expect(selected).toEqual({
      velocity: 0.5,
      showClock: true,
    })
  })

  it("should select black hole settings", () => {
    const state = useVisualizationStore.getState()
    const selected = selectBlackHoleSettings(state)

    expect(selected).toEqual({
      mass: 10,
      showAccretionDisk: true,
      showHawkingRadiation: false,
    })
  })
})

describe("Persistence", () => {
  it("should persist settings to localStorage", () => {
    // Set some settings
    useVisualizationStore.getState().setIsFullscreen(true)
    useVisualizationStore.getState().setAnimationSpeed(1.5)

    // Get persisted state
    const persisted = localStorage.getItem("visualization-settings")
    expect(persisted).toBeTruthy()

    const parsed = JSON.parse(persisted!)
    expect(parsed.state.isFullscreen).toBe(true)
    expect(parsed.state.animationSpeed).toBe(1.5)
  })

  it("should not persist selectedVisualization", () => {
    useVisualizationStore.getState().setSelectedVisualization("blackHole")

    const persisted = localStorage.getItem("visualization-settings")
    const parsed = JSON.parse(persisted!)

    // selectedVisualization should not be in persisted state
    expect(parsed.state.selectedVisualization).toBeUndefined()
  })
})
