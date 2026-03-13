import type { Meta, StoryObj } from "@storybook/react"
import { DarkMatterVisualization } from "./dark-matter"

const meta = {
  title: "Visualizations/Cosmos/DarkMatter",
  component: DarkMatterVisualization,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof DarkMatterVisualization>

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
