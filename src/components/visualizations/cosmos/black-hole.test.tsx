import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { BlackHoleVisualization } from "./black-hole"

describe("BlackHoleVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("exports component correctly", () => {
    expect(BlackHoleVisualization).toBeDefined()
    expect(typeof BlackHoleVisualization).toBe("function")
  })
})
