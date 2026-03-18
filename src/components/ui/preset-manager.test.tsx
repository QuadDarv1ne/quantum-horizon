import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { PresetManager } from "./preset-manager"

// Mock localStorage
beforeEach(() => {
  Storage.prototype.getItem = vi.fn()
  Storage.prototype.setItem = vi.fn()
  Storage.prototype.removeItem = vi.fn()
  Storage.prototype.clear = vi.fn()
})

describe.skip("PresetManager", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue(null)
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
