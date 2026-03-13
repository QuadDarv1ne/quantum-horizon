import type { Meta, StoryObj } from "@storybook/react"
import { BigBangVisualization } from "./big-bang"

const meta = {
  title: "Visualizations/Cosmos/BigBang",
  component: BigBangVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof BigBangVisualization>

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
