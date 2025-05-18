"use client"

import { useState, useCallback } from "react"
import ErrorToast from "@/components/error-toast"

export function useErrorHandler() {
  const [errors, setErrors] = useState<{ id: string; message: string }[]>([])

  const handleError = useCallback((error: unknown) => {
    // Log to console
    console.error("Error caught by useErrorHandler:", error)

    // Create error message
    const errorMessage =
      error instanceof Error ? error.message : typeof error === "string" ? error : "An unexpected error occurred"

    // Create unique ID for this error
    const errorId = Date.now().toString()

    // Add to errors state
    setErrors((prev) => [...prev, { id: errorId, message: errorMessage }])

    // Return the error ID in case it's needed
    return errorId
  }, [])

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id))
  }, [])

  // Component to render all current error toasts
  const ErrorToasts = useCallback(() => {
    return (
      <>
        {errors.map((error) => (
          <ErrorToast key={error.id} message={error.message} onClose={() => dismissError(error.id)} />
        ))}
      </>
    )
  }, [errors, dismissError])

  return {
    handleError,
    dismissError,
    ErrorToasts,
    hasErrors: errors.length > 0,
  }
}
