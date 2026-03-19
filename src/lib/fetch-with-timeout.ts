/**
 * Fetch с таймаутом для предотвращения бесконечных загрузок
 */

export class FetchTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Request timed out after ${String(timeoutMs)}ms`)
    this.name = "FetchTimeoutError"
  }
}

interface FetchWithTimeoutOptions extends RequestInit {
  timeoutMs?: number
}

export async function fetchWithTimeout(
  url: string,
  options: FetchWithTimeoutOptions = {}
): Promise<Response> {
  const { timeoutMs = 10000, ...fetchOptions } = options

  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    controller.abort()
  }, timeoutMs)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    })
    return response
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new FetchTimeoutError(timeoutMs)
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}
