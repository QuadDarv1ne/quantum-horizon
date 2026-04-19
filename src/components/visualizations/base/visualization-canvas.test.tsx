import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { VisualizationCanvas } from "./visualization-canvas"

describe("VisualizationCanvas", () => {
  const mockDraw = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  it("renders canvas element", () => {
    const { getByTestId } = render(
      <VisualizationCanvas draw={mockDraw} isDark={true} className="test-class" />
    )

    const canvas = getByTestId("visualization-canvas")
    expect(canvas).toBeInTheDocument()
    expect(canvas.tagName).toMatch(/CANVAS/)
  })

  it("applies className prop", () => {
    const { container } = render(
      <VisualizationCanvas draw={mockDraw} isDark={false} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass("relative", "custom-class")
  })

  it("receives isDark prop", () => {
    vi.useFakeTimers()

    render(<VisualizationCanvas draw={mockDraw} isDark={true} />)

    vi.advanceTimersByTime(100)

    expect(mockDraw).toHaveBeenCalled()

    vi.useRealTimers()
  })

  it("has proper ARIA attributes", () => {
    const { container } = render(
      <VisualizationCanvas
        draw={mockDraw}
        isDark={true}
        ariaLabel="Test visualization"
        ariaDescription="Interactive physics demo"
      />
    )

    const canvas = container.querySelector("canvas[role='img']")
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute("aria-label", "Test visualization")
    expect(canvas).toHaveAttribute("aria-description", "Interactive physics demo")
  })

  it("is keyboard accessible", () => {
    const { container } = render(
      <VisualizationCanvas
        draw={mockDraw}
        isDark={true}
        tabIndex={0}
        ariaLabel="Keyboard accessible visualization"
      />
    )

    const canvas = container.querySelector("canvas[role='img']")
    expect(canvas).toBeInTheDocument()
    expect(canvas).toHaveAttribute("tabindex", "0")
  })

  it("calls onKeyDown when key is pressed", async () => {
    const handleKeyDown = vi.fn()

    const { getByTestId } = render(
      <VisualizationCanvas
        draw={mockDraw}
        isDark={true}
        onKeyDown={handleKeyDown}
        ariaLabel="Test visualization"
        tabIndex={0}
      />
    )

    const canvas = getByTestId('visualization-canvas')
    canvas.focus()
    await userEvent.keyboard("{Enter}")

    expect(handleKeyDown).toHaveBeenCalled()
  })
})
