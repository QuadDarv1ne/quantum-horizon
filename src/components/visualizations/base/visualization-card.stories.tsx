import type { Meta, StoryObj } from "@storybook/react"
import { VisualizationCard } from "./visualization-card"

const meta = {
  title: "Visualizations/Base/VisualizationCard",
  component: VisualizationCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VisualizationCard>

export default meta
type Story = StoryObj<typeof meta>

export const PurpleDark: Story = {
  args: {
    title: "Wave Function",
    description: "Quantum wave function visualization",
    color: "purple",
    isDark: true,
    children: <div className="flex h-32 items-center justify-center">Content</div>,
  },
}

export const BlueDark: Story = {
  args: {
    title: "Black Hole",
    description: "Event horizon and singularity",
    color: "blue",
    isDark: true,
    children: <div className="flex h-32 items-center justify-center">Content</div>,
  },
}

export const GreenLight: Story = {
  args: {
    title: "Time Dilation",
    description: "Relativistic time effects",
    color: "green",
    isDark: false,
    children: <div className="flex h-32 items-center justify-center">Content</div>,
  },
}

export const OrangeDark: Story = {
  args: {
    title: "E = mc²",
    description: "Mass-energy equivalence",
    color: "orange",
    isDark: true,
    children: <div className="flex h-32 items-center justify-center">Content</div>,
  },
}
