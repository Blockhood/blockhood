"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

interface ErrorToastProps {
  message: string
  onClose: () => void
  duration?: number
}

export default function ErrorToast({ message, onClose, duration = 5000 }: ErrorToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Log the error to console
    console.error("Error:", message)

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Allow time for exit animation
    }, duration)

    return () => clearTimeout(timer)
  }, [message, duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-md bg-red-900/90 text-white px-4 py-3 rounded-lg shadow-lg border border-red-700 transform transition-all duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <i className="fas fa-exclamation-circle text-red-300"></i>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">Something went wrong</p>
          <p className="mt-1 text-xs text-red-200">{message || "An unexpected error occurred. Please try again."}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-4 flex-shrink-0 inline-flex text-red-200 hover:text-white focus:outline-none"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
