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
    expect(canvas.tagName).toBe("CANVAS")
  })

  it("applies className prop", () => {
    const { container } = render(
      <VisualizationCanvas draw={mockDraw} isDark={false} className="custom-class" />
    )

    expect(container.firstChild).toHaveClass("relative", "custom-class")
  })

  it("receives isDark prop", () => {
    render(
      <VisualizationCanvas draw={mockDraw} isDark={true} />
    )

    // Component should be rendered without errors
    expect(mockDraw).not.toHaveBeenCalled() // Will be called in animation frame
  })
})
