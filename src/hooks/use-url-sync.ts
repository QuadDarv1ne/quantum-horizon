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
