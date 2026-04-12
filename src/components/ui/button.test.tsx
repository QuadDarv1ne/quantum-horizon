import { describe, it, expect, vi, afterEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { Button } from "@/components/ui/button"

describe("Button", () => {
  afterEach(() => {
    cleanup()
  })

  it("renders correctly with children", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })

  it("handles click events", async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    const button = screen.getByRole("button", { name: /click me/i })
    await userEvent.click(button)
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("applies disabled state correctly", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button", { name: /disabled/i })).toBeDisabled()
  })

  it("applies variant classes", () => {
    const { rerender } = render(<Button variant="default">Default</Button>)
    const defaultButton = screen.queryByRole("button", { name: /default/i })
    expect(defaultButton).toHaveClass(
      "bg-gradient-to-r",
      "from-purple-600",
      "to-blue-600"
    )

    rerender(<Button variant="destructive">Destructive</Button>)
    const destructiveButton = screen.queryByRole("button", { name: /destructive/i })
    expect(destructiveButton).toHaveClass("from-red-600", "to-orange-600")
  })

  it("applies size classes", () => {
    const { rerender } = render(<Button size="default">Default</Button>)
    const defaultButton = screen.queryByRole("button", { name: /default/i })
    expect(defaultButton).toHaveClass("h-10")

    rerender(<Button size="sm">Small</Button>)
    const smallButton = screen.queryByRole("button", { name: /small/i })
    expect(smallButton).toHaveClass("h-9")

    rerender(<Button size="lg">Large</Button>)
    const largeButton = screen.queryByRole("button", { name: /large/i })
    expect(largeButton).toHaveClass("h-12")
  })
})
