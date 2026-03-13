import type { Meta, StoryObj } from "@storybook/react"
import { StandardModelVisualization } from "./standard-model"

const meta = {
  title: "Visualizations/Cosmos/StandardModel",
  component: StandardModelVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StandardModelVisualization>

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
