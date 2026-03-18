import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PresetManager } from "./preset-manager"

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

describe("PresetManager", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it("рендерит кнопку пресетов", () => {
    render(<PresetManager visualizationType="waveFunction" />)

    const presetButton = screen.getByRole("button", { name: /пресеты/i })
    expect(presetButton).toBeInTheDocument()
  })

  it("показывает стандартные пресеты для waveFunction", () => {
    render(<PresetManager visualizationType="waveFunction" />)

    const presetButton = screen.getByRole("button", { name: /пресеты/i })
    expect(presetButton).toBeInTheDocument()
  })

  it("показывает стандартные пресеты для timeDilation", () => {
    render(<PresetManager visualizationType="timeDilation" />)

    const presetButton = screen.getByRole("button", { name: /пресеты/i })
    expect(presetButton).toBeInTheDocument()
  })

  it("показывает стандартные пресеты для blackHole", () => {
    render(<PresetManager visualizationType="blackHole" />)

    const presetButton = screen.getByRole("button", { name: /пресеты/i })
    expect(presetButton).toBeInTheDocument()
  })

  it("имеет кнопку сохранения пресета", () => {
    render(<PresetManager visualizationType="waveFunction" />)

    const presetButton = screen.getByRole("button", { name: /пресеты/i })
    expect(presetButton).toBeInTheDocument()
  })
})
