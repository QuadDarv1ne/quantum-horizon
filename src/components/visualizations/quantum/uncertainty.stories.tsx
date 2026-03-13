import type { Meta, StoryObj } from "@storybook/react"
import { UncertaintyVisualization } from "./uncertainty"

const meta = {
  title: "Visualizations/Quantum/Uncertainty",
  component: UncertaintyVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UncertaintyVisualization>

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
