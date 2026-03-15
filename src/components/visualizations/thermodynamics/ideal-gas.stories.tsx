import type { Meta, StoryObj } from "@storybook/react"
import { IdealGasVisualization } from "./ideal-gas"

const meta = {
  title: "Visualizations/Thermodynamics/IdealGas",
  component: IdealGasVisualization,
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
} satisfies Meta<typeof IdealGasVisualization>

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
