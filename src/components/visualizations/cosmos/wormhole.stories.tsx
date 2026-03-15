import type { Meta, StoryObj } from "@storybook/react"
import { WormholeVisualization } from "./wormhole"

const meta = {
  title: "Visualizations/Cosmos/Wormhole",
  component: WormholeVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    isDark: {
      control: "boolean",
      description: "Dark theme",
    },
  },
} satisfies Meta<typeof WormholeVisualization>

export default meta
type Story = StoryObj<typeof meta>

export const Dark: Story = {
  args: {
    isDark: true,
  },
}

export const Light: Story = {
  args: {
    isDark: false,
  },
}
