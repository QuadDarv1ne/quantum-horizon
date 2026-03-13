import type { Meta, StoryObj } from "@storybook/react"
import { DarkEnergyVisualization } from "./dark-energy"

const meta = {
  title: "Visualizations/Cosmos/DarkEnergy",
  component: DarkEnergyVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DarkEnergyVisualization>

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
