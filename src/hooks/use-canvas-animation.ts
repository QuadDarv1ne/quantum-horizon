import { useEffect, useRef, useCallback } from 'react'

export function useCanvasAnimation(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  animate: (ctx: CanvasRenderingContext2D, width: number, height: number) => void,
  deps: React.DependencyList = []
) {
  const animationFrameId = useRef<number>(0)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    ctx.resetTransform()
    ctx.scale(2, 2)
    return { canvas, ctx }
  }, [canvasRef])

  useEffect(() => {
    const result = setupCanvas()
    if (!result) return

    const { canvas, ctx } = result
    ctxRef.current = ctx

    const handleResize = () => {
      setupCanvas()
      animate(ctx, canvas.offsetWidth, canvas.offsetHeight)
    }

    window.addEventListener('resize', handleResize)

    const loop = () => {
      animate(ctx, canvas.offsetWidth, canvas.offsetHeight)
      animationFrameId.current = requestAnimationFrame(loop)
    }
    loop()

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [...deps, setupCanvas, animate])

  return ctxRef
}
