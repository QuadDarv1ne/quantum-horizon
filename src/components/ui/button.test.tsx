import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("renders correctly with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    await userEvent.click(screen.getByRole("button", { name: /click me/i }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("applies disabled state correctly", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled()
  })

  it("applies variant classes", () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    expect(screen.getByRole("button")).toHaveClass(
      "bg-gradient-to-r",
      "from-purple-600",
      "to-blue-600"
    )

    rerender(<Button variant="destructive">Destructive</Button>)
    expect(screen.getByRole("button")).toHaveClass("from-red-600", "to-orange-600")
  })

  it("applies size classes", () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-10")

    rerender(<Button size="sm">Small</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-9")

    rerender(<Button size="lg">Large</Button>)
    expect(screen.getByRole("button")).toHaveClass("h-12")
  })
})
