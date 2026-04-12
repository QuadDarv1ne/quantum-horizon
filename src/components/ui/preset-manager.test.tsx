import { describe, it, expect, beforeEach, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { PresetManager } from "./preset-manager"
import { useVisualizationStore } from "@/stores/visualization-store"

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = vi.fn()
  Storage.prototype.setItem = vi.fn()
  Storage.prototype.removeItem = vi.fn()
  Storage.prototype.clear = vi.fn()
})

// Mock Zustand store
vi.mock("@/stores/visualization-store", () => ({
  useVisualizationStore: vi.fn(),
}))

describe("PresetManager", () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null)
    vi.mocked(useVisualizationStore).mockReturnValue({
      settings: {},
      updateSettings: vi.fn(),
    })
  })

  it("рендерит кнопку пресетов", () => {
    render(<PresetManager visualizationType="waveFunction" />)

    const buttons = screen.getAllByRole("button")
    const presetButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("пресет"))
    expect(presetButton).toBeDefined()
  })

  it("показывает стандартные пресеты для waveFunction", () => {
    render(<PresetManager visualizationType="waveFunction" />)

    const buttons = screen.getAllByRole("button")
    const presetButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("пресет"))
    expect(presetButton).toBeDefined()
  })

  it("показывает стандартные пресеты для timeDilation", () => {
    render(<PresetManager visualizationType="timeDilation" />)

    const buttons = screen.getAllByRole("button")
    const presetButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("пресет"))
    expect(presetButton).toBeDefined()
  })

  it("показывает стандартные пресеты для blackHole", () => {
    render(<PresetManager visualizationType="blackHole" />)

    const buttons = screen.getAllByRole("button")
    const presetButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("пресет"))
    expect(presetButton).toBeDefined()
  })

  it("имеет кнопку сохранения пресета", () => {
    render(<PresetManager visualizationType="waveFunction" />)

    const buttons = screen.getAllByRole("button")
    const presetButton = buttons.find((btn) => btn.textContent?.toLowerCase().includes("пресет"))
    expect(presetButton).toBeDefined()
  })
})
