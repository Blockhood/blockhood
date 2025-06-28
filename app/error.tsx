"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { theme } = useTheme();

  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
        <i className="fas fa-exclamation-circle text-red-500 text-3xl"></i>
      </div>

      <h2
        className={`text-3xl font-bold mb-3 ${
          theme === "light" ? "text-gray-800" : "text-gray-100"
        }`}
      >
        Something went wrong
      </h2>

      <p
        className={`text-lg mb-8 max-w-md mx-auto ${
          theme === "light" ? "text-gray-600" : "text-gray-300"
        }`}
      >
        We've encountered an unexpected error. Our team has been notified and is
        working to fix the issue.
      </p>

      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={() => reset()}
          className="cta-button cta-secondary flex items-center"
        >
          <i className="fas fa-redo-alt mr-2"></i> Try Again
        </button>

        <Link href="/" className="cta-button cta-primary flex items-center">
          <i className="fas fa-home mr-2"></i> Return to Homepage
        </Link>
      </div>

      <div
        className={`mt-12 p-6 rounded-lg max-w-lg mx-auto ${
          theme === "light"
            ? "bg-gray-50 border border-gray-200"
            : "bg-gray-800/50 border border-gray-700"
        }`}
      >
        <h3
          className={`text-lg font-medium mb-2 ${
            theme === "light" ? "text-gray-800" : "text-gray-200"
          }`}
        >
          Need help?
        </h3>
        <p
          className={`mb-4 ${
            theme === "light" ? "text-gray-600" : "text-gray-400"
          }`}
        >
          If this issue persists, please contact our support team or try one of
          these options:
        </p>
        <ul className="space-y-2 text-left">
          <li>
            <Link
              href="/guides"
              className="text-accent hover:underline flex items-center"
            >
              <i className="fas fa-book mr-2"></i> Browse our guides
            </Link>
          </li>
          <li>
            <a
              href="https://discord.gg/8R4rJVkWdP"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline flex items-center"
            >
              <i className="fab fa-discord mr-2"></i> Join our Discord for
              support
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
