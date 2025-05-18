"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import SignInPrompt from "@/components/sign-in";
import AuthDialog from "@/components/auth-dialog";

export default function HostEventPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [locationType, setLocationType] = useState("virtual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // In a real app, this would be an API call to save the event
      console.log("Submitting event:", {
        title,
        description,
        date,
        time,
        location:
          locationType === "virtual" ? `Virtual (${location})` : location,
        host: user?.id,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to events page after successful submission
      router.push("/events");
    } catch (err) {
      setError("Failed to create event. Please try again.");
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
            <h1>Host an Event</h1>
            <p>Create and share your Web3 event with the Blockhood community</p>
          </div>
        </section>

        <section className="guides-container">
          <div className="container max-w-3xl mx-auto">
            <SignInPrompt
              title="Want to host an event?"
              description="Sign in to create and share your Web3 event with the community"
              buttonText="Sign In to Host Events"
              icon="fas fa-calendar-plus"
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
          <h1>Host an Event</h1>
          <p>Create and share your Web3 event with the Blockhood community</p>
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
                Event Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="E.g., Web3 Beginners Workshop"
                required
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-light mb-2 font-medium"
              >
                Event Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="Describe your event..."
                rows={5}
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="date"
                  className="block text-light mb-2 font-medium"
                >
                  Event Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="time"
                  className="block text-light mb-2 font-medium"
                >
                  Event Time
                </label>
                <input
                  type="time"
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-light mb-2 font-medium">
                Event Type
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="virtual"
                    checked={locationType === "virtual"}
                    onChange={() => setLocationType("virtual")}
                    className="mr-2"
                  />
                  <span className="text-light">Virtual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="physical"
                    checked={locationType === "physical"}
                    onChange={() => setLocationType("physical")}
                    className="mr-2"
                  />
                  <span className="text-light">In-Person</span>
                </label>
              </div>
            </div>

            <div>
              <label
                htmlFor="location"
                className="block text-light mb-2 font-medium"
              >
                {locationType === "virtual"
                  ? "Platform (Zoom, Discord, etc.)"
                  : "Location Address"}
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder={
                  locationType === "virtual"
                    ? "E.g., Zoom, Discord, Google Meet"
                    : "Full address of the venue"
                }
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/events")}
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
                    <i className="fas fa-spinner fa-spin mr-2"></i> Creating
                    Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
