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

    expect(screen.getByText(/relativity/i)).toBeInTheDocument()
    expect(screen.getByText("Time Dilation")).toBeInTheDocument()
    expect(screen.getByText("Length")).toBeInTheDocument()
    expect(screen.getByText("E = mc²")).toBeInTheDocument()
  })

  it("renders cosmos visualizations section", () => {
    render(<VisualizationSelector {...mockProps} />)

    expect(screen.getByText(/cosmos/i)).toBeInTheDocument()
    expect(screen.getByText("HR Diagram")).toBeInTheDocument()
    expect(screen.getByText("Neutron Star")).toBeInTheDocument()
    expect(screen.getByText("Black Hole")).toBeInTheDocument()
    expect(screen.getByText("Dark Matter")).toBeInTheDocument()
  })

  it("calls onSelect when a visualization is clicked", async () => {
    const user = userEvent.setup()
    render(<VisualizationSelector {...mockProps} />)

    const waveFunctionButton = screen.getByText("Wave Function").closest("button")
    if (waveFunctionButton) {
      await user.click(waveFunctionButton)
    }

    expect(mockProps.onSelect).toHaveBeenCalledWith("waveFunction")
  })

  it("applies active styles to selected visualization", () => {
    render(<VisualizationSelector {...mockProps} selected="waveFunction" />)

    const waveFunctionButton = screen.getByText("Wave Function").closest("button")
    expect(waveFunctionButton).toHaveClass("bg-blue-600")
  })

  it("applies inactive styles to unselected visualizations", () => {
    render(<VisualizationSelector {...mockProps} selected="waveFunction" />)

    const tunnelingButton = screen.getByText("Tunneling").closest("button")
    expect(tunnelingButton).toHaveClass("bg-gray-700")
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
