"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import Link from "next/link"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to the console but don't display it to the user
    console.error("Error caught by ErrorBoundary:", error)
    console.error("Component stack:", errorInfo.componentStack)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        this.props.fallback || (
          <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-exclamation-triangle text-amber-500 text-2xl"></i>
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-gray-400 mb-6 max-w-md">
              We've encountered an unexpected error. Our team has been notified and is working to fix the issue.
            </p>
            <div className="flex gap-4">
              <button onClick={() => window.location.reload()} className="cta-button cta-secondary flex items-center">
                <i className="fas fa-redo-alt mr-2"></i> Refresh Page
              </button>
              <Link href="/" className="cta-button cta-primary flex items-center">
                <i className="fas fa-home mr-2"></i> Go to Homepage
              </Link>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
