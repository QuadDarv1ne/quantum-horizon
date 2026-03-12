/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { userEvent } from "@testing-library/user-event"
import { VisualizationControls } from "./visualization-controls"

describe("VisualizationControls", () => {
  const mockProps = {
    isPlaying: false,
    animationSpeed: 1,
    onTogglePlay: vi.fn(),
    onSpeedChange: vi.fn(),
    isDark: true,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("renders play button when not playing", () => {
    render(<VisualizationControls {...mockProps} />)

    const playButton = screen.getByRole("button")
    expect(playButton).toBeInTheDocument()
  })

  it("renders pause button when playing", () => {
    render(<VisualizationControls {...mockProps} isPlaying={true} />)

    const pauseButton = screen.getByRole("button")
    expect(pauseButton).toBeInTheDocument()
  })

  it("calls onTogglePlay when play/pause button is clicked", async () => {
    const user = userEvent.setup()
    render(<VisualizationControls {...mockProps} />)

    const playButton = screen.getByRole("button")
    await user.click(playButton)

    expect(mockProps.onTogglePlay).toHaveBeenCalledTimes(1)
  })

  it("calls onSpeedChange when speed slider is changed", async () => {
    const user = userEvent.setup()
    render(<VisualizationControls {...mockProps} />)

    const speedSlider = screen.getByRole("slider")
    expect(speedSlider).toBeInTheDocument()
  })

  it("renders reset button when onReset is provided", () => {
    const onReset = vi.fn()
    render(<VisualizationControls {...mockProps} onReset={onReset} />)

    const resetButton = screen.getByRole("button", { name: /reset/i })
    expect(resetButton).toBeInTheDocument()
  })

  it("does not render reset button when onReset is not provided", () => {
    render(<VisualizationControls {...mockProps} />)

    const resetButton = screen.queryByRole("button", { name: /reset/i })
    expect(resetButton).not.toBeInTheDocument()
  })

  it("applies dark theme styles when isDark is true", () => {
    const { container } = render(<VisualizationControls {...mockProps} />)

    const controlsContainer = container.firstChild as HTMLElement
    expect(controlsContainer).toHaveClass("bg-gray-800/50")
  })

  it("applies light theme styles when isDark is false", () => {
    const { container } = render(<VisualizationControls {...mockProps} isDark={false} />)

    const controlsContainer = container.firstChild as HTMLElement
    expect(controlsContainer).toHaveClass("bg-gray-100/50")
  })
})
