import type { Meta, StoryObj } from "@storybook/react"
import { EntropyVisualization } from "./entropy"

const meta = {
  title: "Visualizations/Thermodynamics/Entropy",
  component: EntropyVisualization,
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
} satisfies Meta<typeof EntropyVisualization>

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
