import { describe, it, expect, vi, beforeEach } from "vitest"
import { render } from "@testing-library/react"
import { WaveFunctionVisualization } from "./wave-function"

describe("WaveFunctionVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("renders canvas element", () => {
    const { getByTestId } = render(<WaveFunctionVisualization isDark={true} />)

    const canvas = getByTestId("visualization-canvas")
    expect(canvas).toBeInTheDocument()
  })
})
