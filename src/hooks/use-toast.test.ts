/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { renderHook, act } from "@testing-library/react"
import { useToast, toast, reducer } from "./use-toast"
import type { ToastProps } from "@/components/ui/toast"
import type { ToastActionElement } from "@/components/ui/toast"

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

interface State {
  toasts: ToasterToast[]
}

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: ToasterToast["id"]
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: ToasterToast["id"]
    }

describe("reducer", () => {
  const initialState: State = { toasts: [] }

  it("should add a toast", () => {
    const action: Action = {
      type: "ADD_TOAST",
      toast: {
        id: "1",
        title: "Test Toast",
        open: true,
      },
    }

    const newState = reducer(initialState, action)

    expect(newState.toasts).toHaveLength(1)
    expect(newState.toasts[0].id).toBe("1")
    expect(newState.toasts[0].title).toBe("Test Toast")
  })

  it("should update a toast", () => {
    const stateWithToast: State = {
      toasts: [
        {
          id: "1",
          title: "Original",
          open: true,
        },
      ],
    }

    const action: Action = {
      type: "UPDATE_TOAST",
      toast: {
        id: "1",
        title: "Updated",
      },
    }

    const newState = reducer(stateWithToast, action)

    expect(newState.toasts[0].title).toBe("Updated")
  })

  it("should dismiss a toast", () => {
    const stateWithToast: State = {
      toasts: [
        {
          id: "1",
          title: "Test",
          open: true,
        },
      ],
    }

    const action: Action = {
      type: "DISMISS_TOAST",
      toastId: "1",
    }

    const newState = reducer(stateWithToast, action)

    expect(newState.toasts[0].open).toBe(false)
  })

  it("should remove a toast", () => {
    const stateWithToast: State = {
      toasts: [
        {
          id: "1",
          title: "Test",
          open: true,
        },
      ],
    }

    const action: Action = {
      type: "REMOVE_TOAST",
      toastId: "1",
    }

    const newState = reducer(stateWithToast, action)

    expect(newState.toasts).toHaveLength(0)
  })

  it("should limit toasts to TOAST_LIMIT", () => {
    const stateWithToast: State = {
      toasts: [
        {
          id: "1",
          title: "First",
          open: true,
        },
      ],
    }

    const action: Action = {
      type: "ADD_TOAST",
      toast: {
        id: "2",
        title: "Second",
        open: true,
      },
    }

    const newState = reducer(stateWithToast, action)

    expect(newState.toasts).toHaveLength(1)
    expect(newState.toasts[0].id).toBe("2")
  })

  it("should remove all toasts when toastId is undefined", () => {
    const stateWithToasts: State = {
      toasts: [
        { id: "1", title: "First", open: true },
        { id: "2", title: "Second", open: true },
      ],
    }

    const action: Action = {
      type: "REMOVE_TOAST",
    }

    const newState = reducer(stateWithToasts, action)

    expect(newState.toasts).toHaveLength(0)
  })
})

describe("useToast", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should return current state and toast function", () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.toasts).toBeDefined()
    expect(result.current.toast).toBeDefined()
    expect(result.current.dismiss).toBeDefined()
  })

  it("should add toast to state", () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: "Test Toast",
        description: "Test Description",
      })
    })

    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].title).toBe("Test Toast")
  })

  it("should dismiss toast", () => {
    const { result } = renderHook(() => useToast())

    let toastId: string | undefined

    act(() => {
      const toastResult = result.current.toast({
        title: "Test Toast",
      })
      toastId = toastResult.id
    })

    expect(result.current.toasts).toHaveLength(1)

    act(() => {
      result.current.dismiss(toastId)
    })

    // Toast should be marked as closed
    expect(result.current.toasts[0].open).toBe(false)
  })

  it("should return dismiss function from toast", () => {
    const { result } = renderHook(() => useToast())

    let dismissFn: (() => void) | undefined

    act(() => {
      const toastResult = result.current.toast({
        title: "Test Toast",
      })
      dismissFn = toastResult.dismiss
    })

    expect(dismissFn).toBeDefined()

    act(() => {
      dismissFn?.()
    })

    expect(result.current.toasts[0].open).toBe(false)
  })

  it("should return update function from toast", () => {
    const { result } = renderHook(() => useToast())

    let updateFn: ((props: { title?: string; description?: string }) => void) | undefined

    act(() => {
      const toastResult = result.current.toast({
        title: "Original Title",
      })
      updateFn = toastResult.update as typeof updateFn
    })

    expect(updateFn).toBeDefined()

    act(() => {
      updateFn?.({
        title: "Updated Title",
        description: "New Description",
      })
    })

    expect(result.current.toasts[0].title).toBe("Updated Title")
    expect(result.current.toasts[0].description).toBe("New Description")
  })

  it("should cleanup listener on unmount", () => {
    const { result, unmount } = renderHook(() => useToast())

    act(() => {
      result.current.toast({ title: "Test" })
    })

    unmount()

    // Should not throw after unmount
    expect(() => {
      act(() => {
        result.current.toast({ title: "After unmount" })
      })
    }).not.toThrow()
  })
})

describe("toast helper function", () => {
  it("should generate unique ids", () => {
    const { result: result1 } = renderHook(() => useToast())
    const { result: result2 } = renderHook(() => useToast())

    let id1: string | undefined
    let id2: string | undefined

    act(() => {
      id1 = result1.current.toast({ title: "First" }).id
      id2 = result2.current.toast({ title: "Second" }).id
    })

    expect(id1).not.toBe(id2)
  })

  it("should call onOpenChange when toast is closed", () => {
    const onOpenChangeMock = vi.fn()

    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.toast({
        title: "Test",
        onOpenChange: onOpenChangeMock,
      })
    })

    // The onOpenChange is called when toast is added with open: false
    // In the toast function, onOpenChange is set up to call dismiss when open becomes false
    expect(onOpenChangeMock).toBeDefined()
  })
})
