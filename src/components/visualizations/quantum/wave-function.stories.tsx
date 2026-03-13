import type { Meta, StoryObj } from "@storybook/react"
import { WaveFunctionVisualization } from "./wave-function"

const meta = {
  title: "Visualizations/Quantum/WaveFunction",
  component: WaveFunctionVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WaveFunctionVisualization>

export default meta
type Story = StoryObj<typeof meta>

export const DarkMode: Story = {
  args: {
    isDark: true,
  },
}

export const LightMode: Story = {
  args: {
    isDark: false,
  },
}
