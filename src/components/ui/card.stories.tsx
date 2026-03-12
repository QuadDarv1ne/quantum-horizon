import type { Meta, StoryObj } from "@storybook/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content goes here.</p>
      </CardContent>
    </Card>
  ),
}

export const WithMultipleContent: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Quantum Physics</CardTitle>
        <CardDescription>Explore the quantum world</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <span className="text-sm font-medium">Active</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Progress</span>
          <span className="text-sm font-medium">75%</span>
        </div>
      </CardContent>
    </Card>
  ),
}

export const Dark: Story = {
  render: () => (
    <Card className="w-[350px] bg-slate-900 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Dark Theme</CardTitle>
        <CardDescription className="text-slate-400">
          Card with dark styling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-slate-300">Content in dark mode.</p>
      </CardContent>
    </Card>
  ),
}
