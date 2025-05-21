"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function AuthDialog({ onClose }: { onClose: () => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useTheme();

  // Handle Email/Password Auth
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login with email/password
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        // Register new user
        if (!name) throw new Error("Name is required");
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
      }
      onClose();
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OAuth Login
  const handleOAuthLogin = async (provider: "google") => {
    setError("");
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      console.error("OAuth error:", err);
      setError(err instanceof Error ? err.message : "Social login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className={`${
          theme === "light" ? "bg-white shadow-xl" : "bg-gray-900 shadow-2xl"
        } rounded-lg max-w-md w-full p-8 relative border ${
          theme === "light" ? "border-gray-200" : "border-gray-700"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 ${
            theme === "light"
              ? "text-gray-500 hover:text-gray-700"
              : "text-gray-400 hover:text-gray-200"
          } transition-colors`}
        >
          ✕
        </button>

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 relative">
            <Image
              src="/blockchain-logo.png"
              alt="Blockhood Logo"
              width={80}
              height={80}
              className="rounded-full border-2 border-primary"
            />
          </div>
        </div>

        <h2
          className={`text-2xl font-bold text-center mb-6 ${
            theme === "light" ? "text-gray-800" : "text-gray-100"
          }`}
        >
          {isLogin ? "Sign In to Blockhood" : "Join Blockhood"}
        </h2>

        {error && (
          <div className="mb-6 p-4 bg-red-900/90 border border-red-700 text-white rounded-lg text-sm">
            <div className="flex items-center">
              <span className="mr-2">⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleOAuthLogin("google")}
            className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border ${
              theme === "light"
                ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
            } transition-colors`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="24px"
              height="24px"
            >
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              />
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              />
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              />
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

        <div className={`relative flex items-center justify-center mb-6`}>
          <div
            className={`flex-grow border-t ${
              theme === "light" ? "border-gray-300" : "border-gray-700"
            }`}
          ></div>
          <span
            className={`mx-4 text-sm ${
              theme === "light" ? "text-gray-500" : "text-gray-400"
            }`}
          >
            or
          </span>
          <div
            className={`flex-grow border-t ${
              theme === "light" ? "border-gray-300" : "border-gray-700"
            }`}
          ></div>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-5">
              <label
                htmlFor="name"
                className={`block mb-2 text-sm font-medium ${
                  theme === "light" ? "text-gray-700" : "text-gray-200"
                }`}
              >
                Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span
                    className={`${
                      theme === "light" ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    👤
                  </span>
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-gray-800 border-gray-600 text-gray-100"
                  }`}
                  placeholder="Your name"
                  required
                />
              </div>
            </div>
          )}

          <div className="mb-5">
            <label
              htmlFor="email"
              className={`block mb-2 text-sm font-medium ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span
                  className={`${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  ✉️
                </span>
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-gray-800 border-gray-600 text-gray-100"
                }`}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className={`block mb-2 text-sm font-medium ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span
                  className={`${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  🔒
                </span>
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900"
                    : "bg-gray-800 border-gray-600 text-gray-100"
                }`}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="cta-button cta-primary w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 px-4 rounded-lg transition duration-300 flex justify-center items-center"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">🌀</span>
                {isLogin ? "Signing In..." : "Creating Account..."}
              </>
            ) : (
              <>{isLogin ? "Sign In" : "Create Account"}</>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {isLogin ? (
            <button
              onClick={() => setIsLogin(false)}
              className={`text-accent hover:underline text-sm ${
                theme === "light" ? "text-primary" : "text-blue-400"
              }`}
            >
              Need an account? Sign up
            </button>
          ) : (
            <button
              onClick={() => setIsLogin(true)}
              className={`text-accent hover:underline text-sm ${
                theme === "light" ? "text-primary" : "text-blue-400"
              }`}
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
