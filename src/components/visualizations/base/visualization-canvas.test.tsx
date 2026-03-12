import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import { VisualizationCanvas } from "./visualization-canvas"

describe("VisualizationCanvas", () => {
  const mockDraw = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders canvas element", () => {
    const { getByTestId } = render(
      <VisualizationCanvas draw={mockDraw} isDark={true} className="test-class" />
    )

    const canvas = getByTestId("visualization-canvas")
    expect(canvas).toBeInTheDocument()
    // Canvas mock returns CANVAS-MOCK element
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

    // Advance timers to allow animation frame to execute
    vi.advanceTimersByTime(100)

    // draw will be called in animation frame
    expect(mockDraw).toHaveBeenCalled()

    vi.useRealTimers()
  })
})
