import type { Meta, StoryObj } from "@storybook/react"
import { CarnotEngineVisualization } from "./carnot-engine"

const meta = {
  title: "Visualizations/Thermodynamics/CarnotEngine",
  component: CarnotEngineVisualization,
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
} satisfies Meta<typeof CarnotEngineVisualization>

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
