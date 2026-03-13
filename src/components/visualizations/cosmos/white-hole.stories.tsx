import type { Meta, StoryObj } from "@storybook/react"
import { WhiteHoleVisualization } from "./white-hole"

const meta = {
  title: "Visualizations/Cosmos/WhiteHole",
  component: WhiteHoleVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof WhiteHoleVisualization>

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
