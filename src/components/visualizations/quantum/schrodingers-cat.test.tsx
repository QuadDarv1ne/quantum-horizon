import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, act } from "@testing-library/react"
import { SchrodingersCatVisualization } from "./schrodingers-cat"

describe("SchrodingersCatVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render canvas element", () => {
    render(<SchrodingersCatVisualization isDark={true} />)

    const canvas = screen.getByRole("img", {
      name: /schrodinger/i,
    })
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute("aria-live", "polite")
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

    // Should show probability indicator
    expect(screen.getByText(/50%|alive|dead/i)).toBeInTheDocument()
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

    // Should show alive or dead result
    const resultText = screen.getByText(/alive|dead|alive|dead/i)
    expect(resultText).toBeInTheDocument()
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

    const region = container.querySelector('[role="region"]')
    expect(region).toHaveAttribute("aria-label", /schrodinger/i)

    const canvas = screen.getByRole("img")
    expect(canvas).toHaveAttribute("aria-live", "polite")
    expect(canvas).toHaveAttribute("aria-atomic", "true")
  })
})
