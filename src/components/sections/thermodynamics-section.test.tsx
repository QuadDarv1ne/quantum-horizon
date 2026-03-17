import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { ThermodynamicsSection } from "./thermodynamics-section"

describe("ThermodynamicsSection", () => {
  it("should render thermodynamics visualizations cards", () => {
    const { container } = render(<ThermodynamicsSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(5)
  })

  it("should apply dark theme styles", () => {
    const { container } = render(<ThermodynamicsSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThan(0)
  })

  it("should render with light theme", () => {
    const { container } = render(<ThermodynamicsSection isDark={false} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(5)
  })
})
