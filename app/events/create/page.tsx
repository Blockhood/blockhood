"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import SignInPrompt from "@/components/sign-in";
import AuthDialog from "@/components/auth-dialog";
import { create, getAll } from "@/lib/crud";
import { uploadImage } from "@/lib/upload-image";

interface Tag {
  id: string;
  name: string;
}

export default function HostEventPage() {
  const router = useRouter();
  const user = localStorage.getItem("id") || "";
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [platform, setPlatform] = useState("");
  const [capacity, setCapacity] = useState("");
  const [locationType, setLocationType] = useState("virtual");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  // Fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAll<Tag>("tags", "*");
        setAvailableTags(tags);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
      }
    };

    fetchTags();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validation
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Create a slug from the title if not provided
      const eventSlug =
        slug ||
        title
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-");

      // Format start and end times
      const start_time = new Date(`${startDate}T${startTime}`).toISOString();
      const end_time = new Date(`${endDate}T${endTime}`).toISOString();

      // Validate dates
      if (new Date(end_time) <= new Date(start_time)) {
        throw new Error("End time must be after start time");
      }

      let imageUrl = "";

      if (image) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(image.type)) {
          throw new Error("Only PNG, JPG, and JPEG files are allowed.");
        }

        if (image.size > 2 * 1024 * 1024) {
          throw new Error("Image size must be less than 2MB.");
        }

        imageUrl = await uploadImage(image, "guides/");
      }

      // Create the event
      const eventData = {
        title,
        summary,
        description,
        slug: eventSlug,
        start_time,
        end_time,
        location: location || (locationType === "virtual" ? platform : ""),
        platform: locationType === "virtual" ? platform : null,
        capacity: capacity ? parseInt(capacity) : null,
        attendees_count: 0,
        user_id: user, // Fixed: use user_id instead of host_id
        image_url: imageUrl,
      };

      const createdEvent = await create("events", eventData);

      // // Create event_tags relationships if tags are selected
      // if (selectedTags.length > 0 && createdEvent?.id) {
      //   for (const tagId of selectedTags) {
      //     try {
      //       await create("event_tags", {
      //         event_id: createdEvent.id,
      //         tag_id: tagId,
      //       });
      //     } catch (tagError) {
      //       console.error("Failed to create event tag relationship:", tagError);
      //     }
      //   }
      // }

      router.push("/events");
    } catch (err: any) {
      setError(err.message || "Failed to create event. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateSlug = () => {
    const generatedSlug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    setSlug(generatedSlug);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleLocationTypeChange = (type: string) => {
    setLocationType(type);
    // Clear location and platform when switching types
    setLocation("");
    setPlatform("");
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
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={generateSlug}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="E.g., Web3 Beginners Workshop"
                required
              />
            </div>

            <div>
              <label
                htmlFor="summary"
                className="block text-light mb-2 font-medium"
              >
                Event Summary *
              </label>
              <input
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="A brief summary of your event"
                maxLength={150}
                required
              />
              <p className="text-sm text-gray-400 mt-1">
                {summary.length}/150 characters
              </p>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-light mb-2 font-medium"
              >
                Event Description *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="Describe your event in detail..."
                rows={5}
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="slug"
                className="block text-light mb-2 font-medium"
              >
                URL Slug
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-700 bg-gray-800 text-gray-300">
                  /events/
                </span>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  pattern="[a-z0-9-]+"
                  className="flex-1 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="web3-beginners-workshop"
                />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Leave blank to automatically generate from title. Only lowercase
                letters, numbers, and hyphens allowed.
              </p>
            </div>

            <div>
              <label className="block text-light mb-2 font-medium">
                Event Type *
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="virtual"
                    checked={locationType === "virtual"}
                    onChange={() => handleLocationTypeChange("virtual")}
                    className="mr-2"
                  />
                  <span className="text-light">Virtual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="physical"
                    checked={locationType === "physical"}
                    onChange={() => handleLocationTypeChange("physical")}
                    className="mr-2"
                  />
                  <span className="text-light">In-Person</span>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-light mb-2 font-medium"
                >
                  {locationType === "virtual"
                    ? "Platform/Location *"
                    : "Venue Address *"}
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder={
                    locationType === "virtual"
                      ? "E.g., Zoom, Discord, Telegram, Google Meet"
                      : "Full address of the venue"
                  }
                  required
                />
              </div>

              {locationType === "virtual" && (
                <div>
                  <label
                    htmlFor="platform"
                    className="block text-light mb-2 font-medium"
                  >
                    Platform Details
                  </label>
                  <input
                    type="text"
                    id="platform"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                    placeholder="Additional platform details (optional)"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-light mb-2 font-medium"
                >
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="startTime"
                  className="block text-light mb-2 font-medium"
                >
                  Start Time *
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-light mb-2 font-medium"
                >
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="endTime"
                  className="block text-light mb-2 font-medium"
                >
                  End Time *
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="capacity"
                className="block text-light mb-2 font-medium"
              >
                Capacity
              </label>
              <input
                type="number"
                id="capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                min="1"
                max="10000"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="Maximum number of attendees"
              />
              <p className="text-sm text-gray-400 mt-1">
                Leave blank for unlimited capacity
              </p>
            </div>

            <div>
              <label className="block text-light mb-2 font-medium">Tags</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableTags.map((tag) => (
                  <label key={tag.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      className="mr-2"
                    />
                    <span className="text-light capitalize">{tag.name}</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Select relevant tags for your event to help people discover it
              </p>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-light mb-2 font-medium"
              >
                Event Image
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  id="image"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Event cover preview"
                      className="w-full max-h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-400">
                  Upload an image for your event. Recommended size: 1200x630px.
                  Max size: 2MB. Supported formats: PNG, JPG, JPEG.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/events")}
                className="cta-button cta-secondary mr-4"
                disabled={isSubmitting}
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
