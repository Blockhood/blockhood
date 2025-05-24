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

export default function PostJobPage() {
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("id") || "";
    setUser(storedUser);
  }, []);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [about, setAbout] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [requirements, setRequirements] = useState("");
  const [niceToHave, setNiceToHave] = useState("");
  const [benefits, setBenefits] = useState("");
  const [jobType, setJobType] = useState("full-time");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [companyFounded, setCompanyFounded] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const currentDate = new Date().toISOString();
      const deadlineDate = new Date();
      deadlineDate.setDate(deadlineDate.getDate() + 30); // Default deadline 30 days from now

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

      // Handle tags similar to guides
      const tagNames = tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0);

      const tagIds: string[] = [];

      // Process tags if any are provided
      for (const tagName of tagNames) {
        const { data: existingTag, error: fetchError } = await supabase
          .from("tags")
          .select("id")
          .eq("name", tagName)
          .single();

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError;
        }

        if (existingTag) {
          tagIds.push(existingTag.id);
        } else {
          // Create new tag
          await create("tags", { name: tagName });

          const { data: newTag, error: newTagError } = await supabase
            .from("tags")
            .select("id")
            .eq("name", tagName)
            .single();

          if (newTagError) throw newTagError;
          tagIds.push(newTag.id);
        }
      }

      // Create the career posting
      await create("careers", {
        title,
        slug,
        summary,
        about,
        responsibilities,
        requirements,
        nice_to_have: niceToHave,
        benefits,
        job_type: jobType,
        location,
        experience,
        salary_range: salaryRange,
        posted_at: currentDate,
        deadline: deadlineDate.toISOString(),
        company_name: companyName,
        company_website: companyWebsite,
        company_size: companySize,
        company_founded: companyFounded ? parseInt(companyFounded) : null,
        image_url: imageUrl,
      });

      // Get the created career ID to create tag relationships
      const { data: careerData, error: careerError } = await supabase
        .from("careers")
        .select("id")
        .eq("slug", slug)
        .single();

      if (careerError) throw careerError;
      const careerId = careerData.id;

      // Create career_tags relationships
      for (const tagId of tagIds) {
        await create("career_tags", {
          career_id: careerId,
          tag_id: tagId,
        });
      }

      router.push("/careers");
    } catch (err: any) {
      setError(err.message || "Failed to post job. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
            <h1>Post a Job</h1>
            <p>Share a Web3 job opportunity with the Blockhood community</p>
          </div>
        </section>

        <section className="guides-container">
          <div className="container max-w-3xl mx-auto">
            <SignInPrompt
              title="Want to post a job?"
              description="Sign in to share job opportunities with the Blockhood community"
              buttonText="Sign In to Post Jobs"
              icon="fas fa-briefcase"
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
          <h1>Post a Job</h1>
          <p>Share a Web3 job opportunity with the Blockhood community</p>
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
                Job Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="E.g., Blockchain Developer"
                required
              />
            </div>

            <div>
              <label
                htmlFor="summary"
                className="block text-light mb-2 font-medium"
              >
                Job Summary
              </label>
              <input
                type="text"
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="Brief summary of the job opportunity"
                required
              />
            </div>

            <div>
              <label
                htmlFor="about"
                className="block text-light mb-2 font-medium"
              >
                About the Role
              </label>
              <textarea
                id="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="Describe the role and its importance..."
                rows={4}
                required
              />
            </div>

            <div>
              <label
                htmlFor="responsibilities"
                className="block text-light mb-2 font-medium"
              >
                Responsibilities
              </label>
              <textarea
                id="responsibilities"
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="List the key responsibilities for this role..."
                rows={6}
                required
              />
            </div>

            <div>
              <label
                htmlFor="requirements"
                className="block text-light mb-2 font-medium"
              >
                Requirements
              </label>
              <textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="List the mandatory requirements..."
                rows={6}
                required
              />
            </div>

            <div>
              <label
                htmlFor="niceToHave"
                className="block text-light mb-2 font-medium"
              >
                Nice to Have (Optional)
              </label>
              <textarea
                id="niceToHave"
                value={niceToHave}
                onChange={(e) => setNiceToHave(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="List any bonus skills or experience..."
                rows={4}
              />
            </div>

            <div>
              <label
                htmlFor="benefits"
                className="block text-light mb-2 font-medium"
              >
                Benefits
              </label>
              <textarea
                id="benefits"
                value={benefits}
                onChange={(e) => setBenefits(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                placeholder="Describe the compensation and benefits package..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="jobType"
                  className="block text-light mb-2 font-medium"
                >
                  Job Type
                </label>
                <select
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  required
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-light mb-2 font-medium"
                >
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="E.g., Remote, New York, NY"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="experience"
                  className="block text-light mb-2 font-medium"
                >
                  Experience Level
                </label>
                <input
                  type="text"
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="E.g., 2-4 years"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="salaryRange"
                  className="block text-light mb-2 font-medium"
                >
                  Salary Range
                </label>
                <input
                  type="text"
                  id="salaryRange"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="E.g., $80,000 - $120,000"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="companyName"
                  className="block text-light mb-2 font-medium"
                >
                  Company Name
                </label>
                <input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="Your company name"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label
                  htmlFor="companyWebsite"
                  className="block text-light mb-2 font-medium"
                >
                  Company Website
                </label>
                <input
                  type="url"
                  id="companyWebsite"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="https://company.com"
                />
              </div>

              <div>
                <label
                  htmlFor="companySize"
                  className="block text-light mb-2 font-medium"
                >
                  Company Size
                </label>
                <input
                  type="text"
                  id="companySize"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="E.g., 11-50 employees"
                />
              </div>

              <div>
                <label
                  htmlFor="companyFounded"
                  className="block text-light mb-2 font-medium"
                >
                  Year Founded
                </label>
                <input
                  type="number"
                  id="companyFounded"
                  value={companyFounded}
                  onChange={(e) => setCompanyFounded(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light"
                  placeholder="E.g., 2015"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>
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
                placeholder="blockchain, smart-contracts, solidity, defi (comma separated)"
              />
              <p className="text-sm text-gray-400 mt-1">
                Add relevant tags to help candidates find this job posting
              </p>
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-light mb-2 font-medium"
              >
                Company Logo / Job Image (Optional)
              </label>
              <div className="flex flex-col space-y-2">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-darker border-gray-700 text-light file:text-white file:bg-primary file:border-0 file:px-4 file:py-2 file:rounded-md"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Company logo preview"
                      className="w-full max-h-48 object-contain rounded-lg bg-gray-800 p-4"
                    />
                  </div>
                )}
                <p className="text-sm text-gray-400">
                  Upload your company logo or a relevant image. Max size: 2MB.
                  Supported formats: PNG, JPG, JPEG
                </p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => router.push("/careers")}
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
                    <i className="fas fa-spinner fa-spin mr-2"></i> Posting
                    Job...
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
