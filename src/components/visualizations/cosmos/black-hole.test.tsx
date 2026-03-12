/* eslint-disable @typescript-eslint/no-unsafe-call */
import { describe, it, expect, vi } from "vitest"
import { render } from "@testing-library/react"
import { BlackHoleVisualization } from "./black-hole"

describe("BlackHoleVisualization", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders canvas element", () => {
    const { getByTestId } = render(<BlackHoleVisualization isDark={true} />)

    const canvas = getByTestId("visualization-canvas")
    expect(canvas).toBeInTheDocument()
  })
})
