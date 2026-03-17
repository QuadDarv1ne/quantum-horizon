import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "./checkbox"
import { Label } from "./label"

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="checked" />
      <Label htmlFor="checked">Checked state</Label>
    </div>
  ),
  args: {
    checked: true,
  },
}

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} id="disabled" />
      <Label htmlFor="disabled">Disabled checkbox</Label>
    </div>
  ),
  args: {
    disabled: true,
  },
}

export const WithDescription: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center space-x-2">
        <Checkbox {...args} id="notification" />
        <Label htmlFor="notification">Enable notifications</Label>
      </div>
      <p className="text-muted-foreground text-sm">
        You will receive email updates about your account.
      </p>
    </div>
  ),
}
