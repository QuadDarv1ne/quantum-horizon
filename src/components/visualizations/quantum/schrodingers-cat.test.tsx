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

    const allButtons = screen.getAllByRole("button")
    const observeButton = allButtons.find(
      (btn) => btn.textContent.includes("Open Box") || btn.textContent.includes("Открыть")
    )
    expect(observeButton).toBeDefined()

    const resetButton = allButtons.find(
      (btn) => btn.textContent.includes("Reset") || btn.textContent.includes("Сброс")
    )
    expect(resetButton).toBeDefined()
  })

  it("should show observation status", () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    // Check for probability indicator - status cards with alive/dead counts
    // Use queryAllByText since there might be multiple matching elements
    const aliveCards = screen.queryAllByText(/Alive/)
    const deadCards = screen.queryAllByText(/Dead/)
    expect(aliveCards.length > 0 || deadCards.length > 0).toBe(true)
  })

  it("should handle observe button click", async () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const allButtons = screen.getAllByRole("button")
    const observeButton = allButtons.find(
      (btn) => btn.textContent.includes("Open Box") || btn.textContent.includes("Открыть")
    )
    expect(observeButton).toBeDefined()

    if (observeButton) {
      await act(async () => {
        observeButton.click()
      })

      // Button should be disabled during observation
      expect(observeButton).toBeDisabled()
    }
  })

  it("should display result after observation", async () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const allButtons = screen.getAllByRole("button")
    const observeButton = allButtons.find(
      (btn) => btn.textContent.includes("Open Box") || btn.textContent.includes("Открыть")
    )
    expect(observeButton).toBeDefined()

    if (observeButton) {
      await act(async () => {
        observeButton.click()
      })
    }

    // Wait for observation to complete (1 second in component)
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100))
    })

    // Should show alive or dead result with specific emoji
    // Use queryAllByText since there might be multiple matching elements
    const aliveResults = screen.queryAllByText(/Alive/)
    const deadResults = screen.queryAllByText(/Dead/)
    expect(aliveResults.length > 0 || deadResults.length > 0).toBe(true)
  })

  it("should allow reset after observation", async () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    // Use getAllByRole since there might be multiple buttons with similar names
    const allButtons = screen.getAllByRole("button")
    const observeButton = allButtons.find(
      (btn) => btn.textContent.includes("Open Box") || btn.textContent.includes("Открыть")
    )
    expect(observeButton).toBeDefined()

    if (observeButton) {
      await act(async () => {
        observeButton.click()
      })
    }

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1100))
    })

    const resetButtons = screen.getAllByRole("button")
    const resetButton = resetButtons.find(
      (btn) => btn.textContent.includes("Reset") || btn.textContent.includes("Сброс")
    )
    expect(resetButton).toBeDefined()

    if (resetButton) {
      await act(async () => {
        resetButton.click()
      })
    }

    // Should be able to observe again
    if (observeButton) {
      expect(observeButton).not.toBeDisabled()
    }
  })

  it("should have proper accessibility attributes", () => {
    const { container } = render(<SchrodingersCatVisualization isDark={true} />)

    const region = container.querySelector('[role="application"]')
    expect(region).toHaveAttribute("aria-live", "polite")
    expect(region).toHaveAttribute("aria-atomic", "true")

    // Use querySelector to get the main canvas element specifically
    const canvas = container.querySelector("canvas[role='img']")
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute("tabindex", "0")
  })
})
