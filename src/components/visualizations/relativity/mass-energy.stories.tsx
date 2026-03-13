import type { Meta, StoryObj } from "@storybook/react"
import { MassEnergyVisualization } from "./mass-energy"

const meta = {
  title: "Visualizations/Relativity/MassEnergy",
  component: MassEnergyVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MassEnergyVisualization>

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
