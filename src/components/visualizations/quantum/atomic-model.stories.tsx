import type { Meta, StoryObj } from "@storybook/react"
import { AtomicModelVisualization } from "./atomic-model"

const meta = {
  title: "Visualizations/Quantum/AtomicModel",
  component: AtomicModelVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof AtomicModelVisualization>

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
