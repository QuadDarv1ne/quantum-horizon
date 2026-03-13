import type { Meta, StoryObj } from "@storybook/react"
import { VisualizationControls } from "./visualization-controls"

const meta = {
  title: "Visualizations/Base/VisualizationControls",
  component: VisualizationControls,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VisualizationControls>

export default meta
type Story = StoryObj<typeof meta>

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

export const Playing: Story = {
  args: {
    isPlaying: true,
    animationSpeed: 1,
    onTogglePlay: noop,
    onSpeedChange: noop,
    isDark: true,
  },
}

export const Paused: Story = {
  args: {
    isPlaying: false,
    animationSpeed: 1,
    onTogglePlay: noop,
    onSpeedChange: noop,
    isDark: true,
  },
}

export const WithReset: Story = {
  args: {
    isPlaying: false,
    animationSpeed: 1,
    onTogglePlay: noop,
    onSpeedChange: noop,
    onReset: noop,
    isDark: true,
  },
}

export const LightMode: Story = {
  args: {
    isPlaying: false,
    animationSpeed: 1,
    onTogglePlay: noop,
    onSpeedChange: noop,
    onReset: noop,
    isDark: false,
  },
}
