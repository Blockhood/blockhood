"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import SignInPrompt from "@/components/sign-in";
import AuthDialog from "@/components/auth-dialog";
import { create } from "@/lib/crud";
import { uploadImage } from "@/lib/upload-image";
import { supabase } from "@/lib/supabase";

export default function SubmitGuidePage() {
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("id") || "";
    setUser(storedUser);
  }, []);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [slug, setSlug] = useState("");
  const [level, setLevel] = useState("beginner");
  const [duration, setDuration] = useState("5 min");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");

      let imageUrl = "";

      if (image) {
        const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
        if (!allowedTypes.includes(image.type)) {
          throw new Error("Only PNG, JPG, and JPEG files are allowed.");
        }

        if (image.size > 2 * 1024 * 1024) {
          throw new Error("Image size must be less than 2MB.");
        }

        imageUrl = await uploadImage(image);
      }

      // 1. Split tags string dan trimming
      const tagNames = tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      const tagIds: string[] = [];

      for (const tagName of tagNames) {
        // Cek apakah tag sudah ada berdasarkan slug/name
        const { data: existingTag, error: fetchError } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          // PGRST116 = no rows found (normal), selain itu lempar error
          throw fetchError;
        }

        if (existingTag) {
          tagIds.push(existingTag.id);
        } else {
          // Jika tidak ada, buat tag baru
          await create("tags", { name: tagName });

          // Ambil kembali ID dari tag baru
          const { data: newTag, error: newTagError } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tagName)
            .single();

          if (newTagError) throw newTagError;
          tagIds.push(newTag.id);
        }
      }

      // 2. Simpan guide
      await create("guides", {
        title,
        summary,
        content,
        slug,
        level,
        duration,
        image_url: imageUrl,
        user_id: user,
      });

      // Ambil guide yang baru saja dibuat (berdasarkan slug)
      const { data: guideData, error: guideError } = await supabase
        .from("guides")
        .select("id")
        .eq("slug", slug)
        .single();

      if (guideError) throw guideError;
      const guideId = guideData.id;

      // 3. Simpan relasi guide ↔ tags
      for (const tagId of tagIds) {
        await create("guide_tags", {
          guide_id: guideId,
          tag_id: tagId,
        });
      }

      router.push("/guides");
    } catch (err: any) {
      setError(err.message || "Failed to submit guide. Please try again.");
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
                onBlur={generateSlug}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="E.g., Understanding Blockchain Fundamentals"
                required
              />
            </div>

            <div>
              <label
                htmlFor="summary"
                className="block text-light mb-2 font-medium"
              >
                Short Summary
              </label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="A brief description of what your guide covers"
                rows={3}
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-light mb-2 font-medium"
              >
                Cover Image
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Cover preview"
                      className="w-full max-h-96 object-cover rounded-lg"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-400">
                  Upload an image to make your guide more engaging. Recommended
                  size: 1200x630px
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="slug"
                  className="block text-light mb-2 font-medium"
                >
                  URL Slug
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-700 bg-gray-800 text-gray-300">
                    /guides/
                  </span>
                  <input
                    type="text"
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="flex-1 px-4 py-2 border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                    placeholder="understanding-blockchain-fundamentals"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="duration"
                  className="block text-light mb-2 font-medium"
                >
                  Estimated Reading Time
                </label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                >
                  <option value="5 min">5 minutes</option>
                  <option value="10 min">10 minutes</option>
                  <option value="15 min">15 minutes</option>
                  <option value="20 min">20 minutes</option>
                  <option value="30 min">30 minutes</option>
                  <option value="45 min">45 minutes</option>
                  <option value="1 hour">1 hour</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label
                  htmlFor="tags"
                  className="block text-light mb-2 font-medium"
                >
                  Tags
                </label>
                <input
                  type="text"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="blockchain, smart-contracts, ethereum (comma separated)"
                />
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
