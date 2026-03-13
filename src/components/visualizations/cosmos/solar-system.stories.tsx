import type { Meta, StoryObj } from "@storybook/react"
import { SolarSystemVisualization } from "./solar-system"

const meta = {
  title: "Visualizations/Cosmos/SolarSystem",
  component: SolarSystemVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SolarSystemVisualization>

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
