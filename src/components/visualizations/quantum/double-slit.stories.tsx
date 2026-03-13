import type { Meta, StoryObj } from "@storybook/react"
import { DoubleSlitVisualization } from "./double-slit"

const meta = {
  title: "Visualizations/Quantum/DoubleSlit",
  component: DoubleSlitVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DoubleSlitVisualization>

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
