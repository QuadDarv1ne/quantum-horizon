import type { Meta, StoryObj } from "@storybook/react"
import { FullscreenWrapper } from "./fullscreen-wrapper"

const meta = {
  title: "Visualizations/Base/FullscreenWrapper",
  component: FullscreenWrapper,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FullscreenWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const DarkMode: Story = {
  args: {
    title: "Wave Function",
    isDark: true,
    children: (
      <div className="h-64 w-full rounded-lg bg-gradient-to-br from-purple-900 to-blue-900" />
    ),
  },
}

export const LightMode: Story = {
  args: {
    title: "Black Hole",
    isDark: false,
    children: (
      <div className="h-64 w-full rounded-lg bg-gradient-to-br from-blue-100 to-purple-100" />
    ),
  },
}
