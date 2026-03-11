import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { WaveFunctionVisualization } from "./wave-function"

describe("WaveFunctionVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders canvas element", () => {
    const { getByTestId } = render(<WaveFunctionVisualization isDark={true} />)

    const canvas = getByTestId("visualization-canvas")
    expect(canvas).toBeInTheDocument()
  })
})
