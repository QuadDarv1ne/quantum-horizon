import type { Meta, StoryObj } from "@storybook/react"
import { NeutronStarVisualization } from "./neutron-star"

const meta = {
  title: "Visualizations/Cosmos/NeutronStar",
  component: NeutronStarVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof NeutronStarVisualization>

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
