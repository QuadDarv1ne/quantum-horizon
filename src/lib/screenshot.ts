/**
 * Save canvas as PNG image
 */
export function saveCanvasAsPNG(canvas: HTMLCanvasElement, filename = "visualization.png"): void {
  const link = document.createElement("a")
  link.download = filename
  link.href = canvas.toDataURL("image/png")
  link.click()
}

/**
 * Save canvas as JPEG image
 */
export function saveCanvasAsJPEG(
  canvas: HTMLCanvasElement,
  filename = "visualization.jpg",
  quality = 0.92
): void {
  const link = document.createElement("a")
  link.download = filename
  link.href = canvas.toDataURL("image/jpeg", quality)
  link.click()
}

/**
 * Copy canvas to clipboard
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/png")
  })

  if (!blob) {
    throw new Error("Failed to create blob from canvas: toBlob returned null")
  }

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob,
      }),
    ])
  } catch {
    // Fallback для браузеров без поддержки ClipboardItem
    const dataUrl = canvas.toDataURL("image/png")
    const text = await new Blob([dataUrl], { type: "text/plain" }).text()
    await navigator.clipboard.writeText(text)
  }
}

/**
 * Get canvas as data URL
 */
export function getCanvasAsDataURL(
  canvas: HTMLCanvasElement,
  format: "image/png" | "image/jpeg" = "image/png",
  quality?: number
): string {
  return canvas.toDataURL(format, quality)
}
