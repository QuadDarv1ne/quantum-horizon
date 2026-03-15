import type { Meta, StoryObj } from "@storybook/react"
import { ProtoplanetaryDiskVisualization } from "./protoplanetary-disk"

const meta = {
  title: "Visualizations/Cosmos/ProtoplanetaryDisk",
  component: ProtoplanetaryDiskVisualization,
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
} satisfies Meta<typeof ProtoplanetaryDiskVisualization>

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
