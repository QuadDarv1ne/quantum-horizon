import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { WaveFunctionVisualization } from "./wave-function"

describe("WaveFunctionVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("exports component correctly", () => {
    expect(WaveFunctionVisualization).toBeDefined()
    expect(typeof WaveFunctionVisualization).toBe("function")
  })
})
