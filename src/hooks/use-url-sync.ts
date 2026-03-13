import { useCallback } from "react"

interface UrlSyncOptions<T extends Record<string, unknown>> {
  encode: (state: T) => Record<string, string>
  decode: (params: URLSearchParams) => Partial<T>
  key?: string
}

/**
 * Sync state with URL query parameters
 */
export function useUrlSync<T extends Record<string, unknown>>(
  initialState: T,
  options: UrlSyncOptions<T>
): [T, (state: Partial<T>) => void] {
  const { encode, decode, key = "state" } = options

  const getStateFromUrl = useCallback((): T => {
    if (typeof window === "undefined") return initialState

    const params = new URLSearchParams(window.location.search)
    const encoded = params.get(key)

    if (!encoded) return initialState

    try {
      const parsed = JSON.parse(atob(encoded)) as Record<string, unknown>
      const decoded = decode(new URLSearchParams(parsed as Record<string, string>))
      return { ...initialState, ...decoded }
    } catch {
      return initialState
    }
  }, [initialState, key, decode])

  const setState = useCallback(
    (newState: Partial<T>) => {
      if (typeof window === "undefined") return

      const currentState = getStateFromUrl()
      const updatedState = { ...currentState, ...newState }
      const encoded = btoa(JSON.stringify(encode(updatedState)))

      const params = new URLSearchParams(window.location.search)
      params.set(key, encoded)

      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`
      window.history.replaceState({}, "", newUrl)
    },
    [getStateFromUrl, key, encode]
  )

  return [getStateFromUrl(), setState]
}

/**
 * Simple query param helpers
 */
export const QueryParam = {
  getString: (key: string, fallback = ""): string => {
    if (typeof window === "undefined") return fallback
    const params = new URLSearchParams(window.location.search)
    return params.get(key) ?? fallback
  },

  getNumber: (key: string, fallback = 0): number => {
    const value = QueryParam.getString(key)
    const parsed = parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  },

  getBoolean: (key: string, fallback = false): boolean => {
    const value = QueryParam.getString(key)
    if (value === "") return fallback
    return value === "true" || value === "1"
  },

  setString: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    params.set(key, value)
    const url = new URL(window.location.href)
    url.search = params.toString()
    window.history.replaceState({}, "", url.toString())
  },

  setNumber: (key: string, value: number): void => {
    QueryParam.setString(key, value.toString())
  },

  setBoolean: (key: string, value: boolean): void => {
    QueryParam.setString(key, value ? "true" : "false")
  },

  remove: (key: string): void => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    params.delete(key)
    const url = new URL(window.location.href)
    url.search = params.toString()
    window.history.replaceState({}, "", url.toString())
  },
}
