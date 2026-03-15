import type { Meta, StoryObj } from "@storybook/react"
import { PulsarVisualization } from "./pulsar"

const meta = {
  title: "Visualizations/Cosmos/Pulsar",
  component: PulsarVisualization,
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
} satisfies Meta<typeof PulsarVisualization>

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
