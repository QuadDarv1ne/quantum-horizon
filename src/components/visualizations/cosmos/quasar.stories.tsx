import type { Meta, StoryObj } from "@storybook/react"
import { QuasarVisualization } from "./quasar"

const meta = {
  title: "Visualizations/Cosmos/Quasar",
  component: QuasarVisualization,
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
} satisfies Meta<typeof QuasarVisualization>

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
