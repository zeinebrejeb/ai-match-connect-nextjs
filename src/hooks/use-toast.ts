// C:\Users\Rj\ai-match-connect-nextjs\src\hooks\use-toast.ts
"use client"; // Added: This hook relies on client-side features and global state

import * as React from "react"

// Ensure this path is correct for your Toast component props
import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
// Note: TOAST_REMOVE_DELAY is very long (1,000,000 ms = ~16.6 minutes).
// This might be intentional, but double-check if you meant a shorter duration.
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  // Added: onOpenChange from Radix Toast primitive is needed for dismiss
  onOpenChange?: (open: boolean) => void
  open?: boolean // Added: Radix primitive expects an 'open' prop
}

// Using 'as const' makes the string literals read-only and provides type safety
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Global counter for generating unique IDs
let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Extracting the value types from actionTypes using 'typeof' and indexing
type ActionType = typeof actionTypes[keyof typeof actionTypes]

type Action =
  | {
      type: typeof actionTypes.ADD_TOAST // Use typeof actionTypes.<key> for better type safety
      toast: ToasterToast
    }
  | {
      type: typeof actionTypes.UPDATE_TOAST
      toast: Partial<ToasterToast>
    }
  | {
      type: typeof actionTypes.DISMISS_TOAST
      toastId?: ToasterToast["id"]
    }
  | {
      type: typeof actionTypes.REMOVE_TOAST
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

// Map to store timeouts for toasts awaiting removal
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Helper function to add toast IDs to the queue for delayed removal
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    // Dispatch the remove action after the delay
    dispatch({
      type: actionTypes.REMOVE_TOAST, // Use actionTypes.<key>
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// The reducer function that manages the toast state
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST: // Use actionTypes.<key>
      return {
        ...state,
        // Add new toast at the beginning and limit the number of toasts
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST: // Use actionTypes.<key>
      return {
        ...state,
        // Update the specific toast if found
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: { // Use actionTypes.<key>
      const { toastId } = action

      // Side effect: Add toast(s) to the removal queue when dismissed
      // In a more complex app, side effects might be handled outside the reducer
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        // If no toastId is provided, dismiss all toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      // Mark the toast(s) as not open (for animation/UI purposes)
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Mark as closed
              }
            : t
        ),
      }
    }
    case actionTypes.REMOVE_TOAST: // Use actionTypes.<key>
      // Remove toast(s) from the state based on id
      if (action.toastId === undefined) {
         // If no toastId is provided for REMOVE, clear all (handles dismiss all -> remove all)
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
    default: // Added default case for thoroughness
        return state;
  }
}

// Array of listeners to notify when state changes
const listeners: Array<(state: State) => void> = []

// Global state managed by the reducer outside of a React component
let memoryState: State = { toasts: [] }

// Function to dispatch actions and update state, notifying listeners
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Define the type for the toast function input
type Toast = Omit<ToasterToast, "id" | "open" | "onOpenChange"> & {
    // Allow overriding open/onOpenChange if needed, but hook handles default
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};


// The main toast function used to add a new toast
function toast({ ...props }: Toast) {
  const id = genId() // Generate a unique ID

  // Functions to update or dismiss the specific toast instance
  const update = (props: ToasterToast) =>
    dispatch({
      type: actionTypes.UPDATE_TOAST, // Use actionTypes.<key>
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id }) // Use actionTypes.<key>

  // Dispatch the action to add the new toast
  dispatch({
    type: actionTypes.ADD_TOAST, // Use actionTypes.<key>
    toast: {
      ...props,
      id,
      open: true, // Mark as open initially
      onOpenChange: (open) => { // Handle Radix's onOpenChange to trigger dismiss
        if (!open) dismiss()
      },
    },
  })

  // Return the ID and controls for the specific toast instance
  return {
    id: id,
    dismiss,
    update,
  }
}

// The React hook to subscribe to toast state changes
function useToast() {
  // Use React state to hold the current global state
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // Subscribe to state changes when component mounts
    listeners.push(setState)
    // Clean up subscription when component unmounts
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
     // No dependencies needed, state updates are handled by the listener
  }, []) // Empty dependency array

  // Return the current state and the toast/dismiss functions
  return {
    ...state,
    toast, // The function to add new toasts
    dismiss: (toastId?: string) => dispatch({ type: actionTypes.DISMISS_TOAST, toastId }), // Use actionTypes.<key>
  }
}

// Export the hook and the toast function
export { useToast, toast }