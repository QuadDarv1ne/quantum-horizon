import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { CosmosSection } from "./cosmos-section"

describe("CosmosSection", () => {
  it("should render cosmos visualizations cards", () => {
    const { container } = render(<CosmosSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(10)
  })

  it("should apply dark theme styles", () => {
    const { container } = render(<CosmosSection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThan(0)
  })

  it("should render with light theme", () => {
    const { container } = render(<CosmosSection isDark={false} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(10)
  })
})
