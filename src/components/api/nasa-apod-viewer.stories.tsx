import type { Meta, StoryObj } from "@storybook/react"
import { NASAAPODViewer } from "./nasa-apod-viewer"

const meta = {
  title: "API Integrations/NASA APOD Viewer",
  component: NASAAPODViewer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    showDateSelector: {
      control: "boolean",
      description: "Show date selector for historical APOD images",
    },
  },
} satisfies Meta<typeof NASAAPODViewer>

export default meta
type Story = StoryObj<typeof meta>

// Default story - today's APOD
export const Default: Story = {
  args: {
    showDateSelector: true,
  },
}

// Without date selector
export const NoDateSelector: Story = {
  args: {
    showDateSelector: false,
  },
}

// Custom date (example: Hubble Deep Field)
export const HistoricalDate: Story = {
  args: {
    showDateSelector: true,
  },
  render: (args) => <NASAAPODViewer {...args} />,
}

// Loading state
export const Loading: Story = {
  args: {
    showDateSelector: false,
  },
  render: () => (
    <div className="w-[800px]">
      <NASAAPODViewer />
    </div>
  ),
}
