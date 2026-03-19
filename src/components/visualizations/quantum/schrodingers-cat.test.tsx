/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import { SchrodingersCatVisualization } from "./schrodingers-cat"

// Mock useCanvasAnimation hook
vi.mock("@/hooks/use-canvas-animation", () => ({
  useCanvasAnimation: vi.fn(),
}))

// Mock visualization store
vi.mock("@/stores/visualization-store", () => {
  const mockStore = vi.fn((selector: unknown) => {
    if (typeof selector === "function") {
      // Call selector with mock state
      return selector({
        isPlaying: false,
        animationSpeed: 1,
        togglePlaying: vi.fn(),
        setAnimationSpeed: vi.fn(),
      })
    }
    return {}
  })
  return {
    useVisualizationStore: mockStore,
    selectIsPlaying: (state: { isPlaying: boolean }) => state.isPlaying,
    selectAnimationSpeed: (state: { animationSpeed: number }) => state.animationSpeed,
  }
})

describe("SchrodingersCatVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render canvas element", () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const canvas = screen.getByRole("img", {
      name: /schrödinger|schrodinger/i,
    })
    expect(canvas).toBeInTheDocument()
    // aria-live is on the parent container, not the canvas itself
    const container = canvas.closest('[role="application"]')
    expect(container).toHaveAttribute("aria-live", "polite")
  })

  it("should render control buttons", () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const observeButton = screen.getByRole("button", {
      name: /open box|открыть/i,
    })
    expect(observeButton).toBeInTheDocument()

    const resetButton = screen.getByRole("button", {
      name: /reset|сброс/i,
    })
    expect(resetButton).toBeInTheDocument()
  })

  it("should show observation status", () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    // Check for probability indicator - status cards with alive/dead counts
    const aliveCard = screen.getByText(/Alive/).closest('[class*="border-green"]')
    const deadCard = screen.getByText(/Dead/).closest('[class*="border-red"]')
    expect(aliveCard || deadCard).toBeInTheDocument()
  })

  it("should handle observe button click", async () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const observeButton = screen.getByRole("button", {
      name: /open box|открыть/i,
    })

    await act(async () => {
      observeButton.click()
    })

    // Button should be disabled during observation
    expect(observeButton).toBeDisabled()
  })

  it("should display result after observation", async () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const observeButton = screen.getByRole("button", {
      name: /open box|открыть/i,
    })

    await act(async () => {
      observeButton.click()
    })

    // Wait for observation to complete (1 second in component)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100))
    })

    // Should show alive or dead result with specific emoji
    const aliveResult = screen.queryByText(/🐱 Alive/)
    const deadResult = screen.queryByText(/💀 Dead/)
    expect(aliveResult || deadResult).toBeInTheDocument()
  })

  it("should allow reset after observation", async () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const observeButton = screen.getByRole("button", {
      name: /open box|открыть/i,
    })

    await act(async () => {
      observeButton.click()
    })

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100))
    })

    const resetButton = screen.getByRole("button", {
      name: /reset|сброс/i,
    })

    await act(async () => {
      resetButton.click()
    })

    // Should be able to observe again
    expect(observeButton).not.toBeDisabled()
  })

  it("should have proper accessibility attributes", () => {
    const { container } = render(<SchrodingersCatVisualization isDark={true} />)

    const region = container.querySelector('[role="application"]')
    expect(region).toHaveAttribute("aria-live", "polite")
    expect(region).toHaveAttribute("aria-atomic", "true")

    const canvas = screen.getByRole("img")
    expect(canvas).toHaveAttribute("role", "img")
    expect(canvas).toHaveAttribute("tabindex", "0")
  })
})
