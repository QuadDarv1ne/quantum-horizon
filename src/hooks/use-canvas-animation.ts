import { useEffect, useRef, useCallback } from "react"

export function setupCanvas(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  canvas.width = canvas.offsetWidth * 2
  canvas.height = canvas.offsetHeight * 2
  ctx.resetTransform()
  ctx.scale(2, 2)
}

export function useCanvasAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  animate: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
  deps: React.DependencyList = []
) {
  const animationFrameId = useRef<number | undefined>(undefined)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const setupCanvasCallback = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
  }, [canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setupCanvas(canvas, ctx)
    ctxRef.current = ctx

    const handleResize = () => {
      setupCanvasCallback()
      animate(ctx, canvas.offsetWidth, canvas.offsetHeight)
    }

    window.addEventListener("resize", handleResize)

    const loop = () => {
      animate(ctx, canvas.offsetWidth, canvas.offsetHeight)
      animationFrameId.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ctxRef
}
