import type { Meta, StoryObj } from "@storybook/react"
import { VisualizationCanvas } from "./visualization-canvas"

const meta = {
  title: "Visualizations/Base/VisualizationCanvas",
  component: VisualizationCanvas,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof VisualizationCanvas>

export default meta
type Story = StoryObj<typeof meta>

// Пример простой анимации - вращающийся квадрат
const drawRotatingSquare = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isDark: boolean,
  time: number
) => {
  ctx.clearRect(0, 0, width, height)

  // Фон
  ctx.fillStyle = isDark ? "#0a0a15" : "#f0f0f0"
  ctx.fillRect(0, 0, width, height)

  // Вращающийся квадрат
  const centerX = width / 2
  const centerY = height / 2
  const size = Math.min(width, height) * 0.3

  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(time)

  ctx.fillStyle = isDark ? "#6366f1" : "#4f46e5"
  ctx.fillRect(-size / 2, -size / 2, size, size)

  ctx.restore()

  // Орбиты
  ctx.strokeStyle = isDark ? "rgba(99, 102, 241, 0.3)" : "rgba(79, 70, 229, 0.3)"
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(centerX, centerY, size, 0, Math.PI * 2)
  ctx.stroke()
}

export const Default: Story = {
  args: {
    draw: () => undefined,
    isDark: true,
  },
  render: () => {
    const drawFn = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      isDark: boolean
    ) => {
      const time = Date.now() * 0.001
      drawRotatingSquare(ctx, width, height, isDark, time)
    }

    return (
      <div className="w-full h-[400px]">
        <VisualizationCanvas draw={drawFn} isDark={true} />
      </div>
    )
  },
}

export const LightMode: Story = {
  args: {
    draw: () => undefined,
    isDark: false,
  },
  render: () => {
    const drawFn = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      isDark: boolean
    ) => {
      const time = Date.now() * 0.001
      drawRotatingSquare(ctx, width, height, isDark, time)
    }

    return (
      <div className="w-full h-[400px]">
        <VisualizationCanvas draw={drawFn} isDark={false} />
      </div>
    )
  },
}

export const WithCustomDraw: Story = {
  args: {
    draw: () => undefined,
    isDark: true,
  },
  render: () => {
    const drawWave = (
      ctx: CanvasRenderingContext2D,
      width: number,
      height: number,
      isDark: boolean
    ) => {
      ctx.clearRect(0, 0, width, height)

      const time = Date.now() * 0.002
      const centerY = height / 2

      // Фон
      ctx.fillStyle = isDark ? "#0a0a15" : "#f0f0f0"
      ctx.fillRect(0, 0, width, height)

      // Синусоидальная волна
      ctx.strokeStyle = isDark ? "#a855f7" : "#9333ea"
      ctx.lineWidth = 3
      ctx.beginPath()

      for (let x = 0; x < width; x++) {
        const y = centerY + Math.sin(x * 0.02 + time) * 50
        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
    }

    return (
      <div className="w-full h-[400px]">
        <VisualizationCanvas draw={drawWave} isDark={true} />
      </div>
    )
  },
}
