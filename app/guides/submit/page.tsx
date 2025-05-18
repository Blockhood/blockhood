"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import SignInPrompt from "@/components/sign-in";
import AuthDialog from "@/components/auth-dialog";

export default function SubmitGuidePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("basics");
  const [level, setLevel] = useState("beginner");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // In a real app, this would be an API call to save the guide
      console.log("Submitting guide:", {
        title,
        content,
        category,
        level,
        author: user?.id,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to guides page after successful submission
      router.push("/guides");
    } catch (err) {
      setError("Failed to submit guide. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <main>
        <section className="page-header">
          <div className="container">
            <h1>Submit a Guide</h1>
            <p>Share your knowledge with the Blockhood community</p>
          </div>
        </section>

        <section className="guides-container">
          <div className="container max-w-3xl mx-auto">
            <SignInPrompt
              title="Want to contribute?"
              description="Sign in to share your knowledge with the community by writing your own guides"
              buttonText="Sign In to Submit"
              icon="fas fa-pen-to-square"
              onSignInClick={() => setShowAuthDialog(true)}
            />
          </div>
        </section>

        {showAuthDialog && (
          <AuthDialog onClose={() => setShowAuthDialog(false)} />
        )}
      </main>
    );
  }

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>Submit a Guide</h1>
          <p>Share your knowledge with the Blockhood community</p>
        </div>
      </section>

      <section className="guides-container">
        <div className="container max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 text-white rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-light mb-2 font-medium"
              >
                Guide Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="E.g., Understanding Blockchain Fundamentals"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="category"
                  className="block text-light mb-2 font-medium"
                >
                  Category
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                >
                  <option value="basics">Web3 Basics</option>
                  <option value="defi">DeFi</option>
                  <option value="nft">NFTs</option>
                  <option value="development">Development</option>
                  <option value="security">Security</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="level"
                  className="block text-light mb-2 font-medium"
                >
                  Difficulty Level
                </label>
                <select
                  id="level"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="content"
                className="block text-light mb-2 font-medium"
              >
                Guide Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="Write your guide content here..."
                rows={12}
                required
              ></textarea>
              <p className="text-sm text-gray-400 mt-2">
                You can use Markdown formatting for headings, lists, code
                blocks, etc.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/guides")}
                className="cta-button cta-secondary mr-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cta-button cta-primary"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Guide"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
