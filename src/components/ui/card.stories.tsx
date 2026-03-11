import type { Meta, StoryObj } from "@storybook/react"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "./card"
import { Button } from "./button"

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is the main body of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardAction>
          <Button variant="ghost" size="icon">
            ⋮
          </Button>
        </CardAction>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>Card with action button in header.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has an action button in the top right corner.</p>
      </CardContent>
    </Card>
  ),
}

export const BorderWithShadow: Story = {
  render: () => (
    <Card className="border-primary shadow-md">
      <CardHeader>
        <CardTitle>Styled Card</CardTitle>
        <CardDescription>Card with custom border and shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card has custom styling applied.</p>
      </CardContent>
    </Card>
  ),
}
