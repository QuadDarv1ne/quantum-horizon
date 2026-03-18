import type { Meta, StoryObj } from "@storybook/react"
import { UserSettings } from "./user-settings"

const meta = {
  title: "UI/UserSettings",
  component: UserSettings,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UserSettings>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
