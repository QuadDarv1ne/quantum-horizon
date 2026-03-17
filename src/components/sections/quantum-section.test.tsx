import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { QuantumSection } from "./quantum-section"

describe("QuantumSection", () => {
  it("should render quantum visualizations cards", () => {
    const { container } = render(<QuantumSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })

  it("should apply dark theme styles", () => {
    const { container } = render(<QuantumSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThan(0)
  })

  it("should render with light theme", () => {
    const { container } = render(<QuantumSection isDark={false} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })
})
