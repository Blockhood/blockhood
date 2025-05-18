"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"

export default function NotFound() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Wait for theme to be available
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="text-center max-w-2xl mx-auto">
        <div className="mb-8 relative w-40 h-40 mx-auto">
          <Image
            src="/blockchain-logo.png"
            alt="Blockhood Logo"
            width={160}
            height={160}
            className="rounded-xl opacity-70"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-7xl font-bold text-primary">404</span>
          </div>
        </div>

        <h1 className={`text-4xl font-bold mb-4 ${theme === "light" ? "text-gray-800" : "text-light"}`}>
          Page Not Found
        </h1>

        <p className={`text-xl mb-8 ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
          Oops! It seems you've ventured into uncharted blockchain territory.
        </p>

        <div className="space-y-4">
          <Link href="/" className="cta-button cta-primary inline-flex items-center">
            <i className="fas fa-home mr-2"></i> Return to Homepage
          </Link>

          <div
            className={`mt-12 p-6 rounded-lg border ${
              theme === "light" ? "bg-white border-gray-200 shadow-md" : "bg-dark border-gray-700"
            }`}
          >
            <h2 className={`text-xl font-semibold mb-3 ${theme === "light" ? "text-gray-800" : "text-light"}`}>
              Looking for something?
            </h2>
            <ul className="space-y-2 text-left">
              <li>
                <Link href="/guides" className="text-accent hover:underline flex items-center">
                  <i className="fas fa-book mr-2"></i> Explore our Web3 guides
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-accent hover:underline flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i> Check upcoming events
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-accent hover:underline flex items-center">
                  <i className="fas fa-briefcase mr-2"></i> Browse Web3 careers
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
