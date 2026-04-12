import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { VisualizationSelector } from "./visualization-selector"
import type { VisualizationType } from "@/stores/visualization-store"

describe("VisualizationSelector", () => {
  const mockProps = {
    selected: null as VisualizationType | null,
    onSelect: vi.fn(),
    isDark: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders quantum visualizations section", () => {
    render(<VisualizationSelector {...mockProps} />)

    expect(screen.getByText(/quantum/i)).toBeInTheDocument()
    expect(screen.getByText("Wave Function")).toBeInTheDocument()
    expect(screen.getByText("Uncertainty")).toBeInTheDocument()
    expect(screen.getByText("Tunneling")).toBeInTheDocument()
    expect(screen.getByText("Double Slit")).toBeInTheDocument()
  })

  it("renders relativity visualizations section", () => {
    render(<VisualizationSelector {...mockProps} />)

    expect(screen.getAllByText(/relativity/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText("Time Dilation")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Length")[0]).toBeInTheDocument()
    expect(screen.getAllByText("E = mc²")[0]).toBeInTheDocument()
  })

  it("renders cosmos visualizations section", () => {
    render(<VisualizationSelector {...mockProps} />)

    expect(screen.getAllByText(/cosmos/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText("HR Diagram")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Neutron Star")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Black Hole")[0]).toBeInTheDocument()
    expect(screen.getAllByText("Dark Matter")[0]).toBeInTheDocument()
  })

  it("calls onSelect when a visualization is clicked", async () => {
    const user = userEvent.setup()
    render(<VisualizationSelector {...mockProps} />)

    const waveFunctionButtons = screen.getAllByText("Wave Function")
    const waveFunctionButton = waveFunctionButtons[0].closest("button")
    if (waveFunctionButton) {
      await user.click(waveFunctionButton)
    }

    expect(mockProps.onSelect).toHaveBeenCalledWith("waveFunction")
  })

  it("applies active styles to selected visualization", () => {
    render(<VisualizationSelector {...mockProps} selected="waveFunction" />)

    // Find all Wave Function buttons (may be rendered multiple times due to React strict mode)
    const waveFunctionButtons = screen.getAllByRole("radio", { name: /wave function visualization/i })
    
    // At least one should be checked
    const checkedButton = waveFunctionButtons.find(
      (btn) => btn.getAttribute("aria-checked") === "true"
    )
    expect(checkedButton).toBeDefined()
  })

  it("applies inactive styles to unselected visualizations", () => {
    render(<VisualizationSelector {...mockProps} selected="waveFunction" />)

    // Find all Tunneling buttons
    const tunnelingButtons = screen.getAllByRole("radio", { name: /tunneling visualization/i })
    
    // At least one should be unchecked
    const uncheckedButton = tunnelingButtons.find(
      (btn) => btn.getAttribute("aria-checked") === "false"
    )
    expect(uncheckedButton).toBeDefined()
  })

  it("applies dark theme styles when isDark is true", () => {
    const { container } = render(<VisualizationSelector {...mockProps} />)

    const sectionTitle = container.querySelector("h3")
    expect(sectionTitle).toHaveClass("text-gray-400")
  })

  it("applies light theme styles when isDark is false", () => {
    const { container } = render(<VisualizationSelector {...mockProps} isDark={false} />)

    const sectionTitle = container.querySelector("h3")
    expect(sectionTitle).toHaveClass("text-gray-600")
  })
})
