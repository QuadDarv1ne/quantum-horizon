import type { Meta, StoryObj } from "@storybook/react"
import { SuperconductivityVisualization } from "./superconductivity"

const meta = {
  title: "Visualizations/Quantum/Superconductivity",
  component: SuperconductivityVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SuperconductivityVisualization>

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
