import type { Meta, StoryObj } from "@storybook/react"
import { SplitScreen } from "./split-screen"

const meta = {
  title: "UI/SplitScreen",
  component: SplitScreen,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SplitScreen>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithInitialVisualizations: Story = {
  args: {
    leftVisualization: "waveFunction",
    rightVisualization: "timeDilation",
  },
}

export const WithSameVisualizations: Story = {
  args: {
    leftVisualization: "blackHole",
    rightVisualization: "blackHole",
  },
}
