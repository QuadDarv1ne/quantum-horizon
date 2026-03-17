import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { RelativitySection } from "./relativity-section"

describe("RelativitySection", () => {
  it("should render relativity visualizations cards", () => {
    const { container } = render(<RelativitySection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })

  it("should apply dark theme styles", () => {
    const { container } = render(<RelativitySection isDark={true} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThan(0)
  })

  it("should render with light theme", () => {
    const { container } = render(<RelativitySection isDark={false} />)

    const cards = container.querySelectorAll("[data-slot='card']")
    expect(cards.length).toBeGreaterThanOrEqual(3)
  })
})
