import type { Meta, StoryObj } from "@storybook/react"
import { Slider } from "./slider"
import { Label } from "./label"

const meta = {
  title: "UI/Slider",
  component: Slider,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 1,
  },
}

export const WithLabel: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm gap-4">
      <Label>Volume: {args.defaultValue?.[0]}%</Label>
      <Slider {...args} />
    </div>
  ),
  args: {
    defaultValue: [75],
    min: 0,
    max: 100,
  },
}

export const Range: Story = {
  args: {
    defaultValue: [25, 75],
    min: 0,
    max: 100,
  },
}

export const Steps: Story = {
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    step: 10,
  },
}

export const Vertical: Story = {
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
    orientation: "vertical",
    className: "h-[200px]",
  },
}

export const Disabled: Story = {
  args: {
    defaultValue: [50],
    disabled: true,
  },
}
