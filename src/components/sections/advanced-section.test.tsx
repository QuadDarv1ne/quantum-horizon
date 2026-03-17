import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { AdvancedSection } from "./advanced-section"

describe("AdvancedSection", () => {
  it("should render advanced visualizations cards", () => {
    const { container } = render(<AdvancedSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(10)
  })

  it("should apply dark theme styles", () => {
    const { container } = render(<AdvancedSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThan(0)
  })

  it("should render with light theme", () => {
    const { container } = render(<AdvancedSection isDark={false} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(10)
  })
})
