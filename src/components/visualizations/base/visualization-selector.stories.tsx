import type { Meta, StoryObj } from "@storybook/react"
import { VisualizationSelector } from "./visualization-selector"

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const meta = {
  title: "Visualizations/Base/VisualizationSelector",
  component: VisualizationSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VisualizationSelector>

export default meta
type Story = StoryObj<typeof meta>

export const DarkMode: Story = {
  args: {
    selected: null,
    onSelect: noop,
    isDark: true,
  },
}

export const LightMode: Story = {
  args: {
    selected: null,
    onSelect: noop,
    isDark: false,
  },
}

export const WaveFunctionSelected: Story = {
  args: {
    selected: "waveFunction",
    onSelect: noop,
    isDark: true,
  },
}

export const BlackHoleSelected: Story = {
  args: {
    selected: "blackHole",
    onSelect: noop,
    isDark: true,
  },
}
