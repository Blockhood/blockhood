"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import { useTheme } from "next-themes";
import React from "react";
import Loading from "@/app/loading";
import { getAll, getBySlug } from "@/lib/crud";

export default function CareerPage() {
  const params = useParams();
  const rawId = params?.id;
  const slug: string = Array.isArray(rawId) ? rawId[0] : rawId || "";
  const router = useRouter();
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("id") || "";
    setUser(storedUser);
  }, []);

  const [job, setJob] = useState<any>(null);
  const [relatedJobs, setRelatedJobs] = useState<any[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setIsLoading(true);

        const fetchedJob = await getBySlug<any>(
          "careers", // assuming your table name is "careers"
          "slug",
          slug,
          "*" // adjust fields as needed
        );

        setJob(fetchedJob);
      } catch (error) {
        console.error("Failed to fetch job:", error);
        // If job not found, redirect to careers list
        router.push("/careers");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchRelatedJobs = async () => {
      try {
        const fetchedJobs = await getAll<any>("careers", "*");

        setRelatedJobs(fetchedJobs);
      } catch (error) {
        console.error("Failed to fetch related jobs:", error);
      }
    };

    fetchRelatedJobs();
    fetchJob();
  }, [slug, router]);

  const handleApply = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsApplied(!isApplied);
    // In a real app, you would save the application
  };

  const handleSaveJob = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsSaved(!isSaved);
    // In a real app, you would save this to the user's profile
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!job) return null;

  return (
    <main>
      <div className="bg-gradient-to-b from-darker to-dark pt-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/careers"
              className="text-accent hover:underline flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Careers
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg p-2 flex items-center justify-center">
              <Image
                src={job?.image_url || "/blockhood-logo.png"}
                alt={job?.company_name || "Company"}
                width={80}
                height={80}
                className="max-w-full max-h-full"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {job?.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                <div>{job?.company_name}</div>
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  <span>{job?.location}</span>
                </div>
                <div className="flex items-center">
                  <i className="far fa-clock mr-1"></i>
                  <span>{job?.job_type}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-dollar-sign mr-1"></i>
                  <span>{job?.salary_range}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    theme === "light"
                      ? "bg-primary/10 text-primary"
                      : "bg-primary/20 text-primary-foreground"
                  }`}
                >
                  {job?.job_type}
                </span>
                <span className="text-sm text-gray-500">
                  Posted on{" "}
                  {new Date(job?.posted_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              {/* Job Summary */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Job Summary</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {job?.summary}
                </p>
              </div>

              {/* Responsibilities */}
              {job?.responsibilities && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Responsibilities</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {job.responsibilities.replace(/\\n/g, "\n")}
                    </pre>
                  </div>
                </div>
              )}

              {/* Requirements */}
              {job?.requirements && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Requirements</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {job.requirements.replace(/\\n/g, "\n")}
                    </pre>
                  </div>
                </div>
              )}

              {/* Nice to Have */}
              {job?.nice_to_have && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3">Nice to Have</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {job.nice_to_have.replace(/\\n/g, "\n")}
                    </pre>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job?.benefits && (
                <div className="mb-10">
                  <h3 className="text-xl font-bold mb-3">Benefits</h3>
                  <div className="prose dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm">
                      {job.benefits.replace(/\\n/g, "\n")}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={handleApply}
                  className={`py-3 px-6 rounded-lg font-medium ${
                    isApplied
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-primary hover:bg-hover text-white"
                  } transition-colors`}
                >
                  {isApplied
                    ? "Application Submitted"
                    : "Apply for this Position"}
                </button>

                <button
                  onClick={handleSaveJob}
                  className={`flex items-center gap-2 py-3 px-6 rounded-lg font-medium border ${
                    isSaved
                      ? theme === "light"
                        ? "bg-gray-100 border-gray-300 text-gray-800"
                        : "bg-gray-700 border-gray-600 text-gray-200"
                      : theme === "light"
                      ? "bg-white border-gray-300 text-gray-800 hover:bg-gray-50"
                      : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
                  } transition-colors`}
                >
                  <i className={`${isSaved ? "fas" : "far"} fa-bookmark`}></i>
                  <span>{isSaved ? "Saved" : "Save Job"}</span>
                </button>
              </div>
            </div>

            {/* Related Jobs */}
            {relatedJobs?.filter(
              (relatedJob) =>
                relatedJob?.job_type === job?.job_type &&
                relatedJob?.id !== job?.id
            ).length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6">Similar Jobs</h3>
                <div className="space-y-4">
                  {relatedJobs
                    .filter(
                      (relatedJob) =>
                        relatedJob?.job_type === job?.job_type &&
                        relatedJob?.id !== job?.id
                    )
                    .slice(0, 2) // Limit to 2 related jobs
                    .map((relatedJob) => (
                      <div
                        key={relatedJob?.id}
                        className={`p-6 rounded-xl border ${
                          theme === "light"
                            ? "bg-white border-gray-200"
                            : "bg-gray-800 border-gray-700"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-white rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                            <Image
                              src={
                                relatedJob?.image_url || "/blockhood-logo.png"
                              }
                              alt={relatedJob?.company_name || "Company"}
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold mb-1">
                              {relatedJob?.title}
                            </h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
                              <span>{relatedJob?.company_name}</span>
                              <span>{relatedJob?.location}</span>
                              <span>{relatedJob?.job_type}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium">
                                {relatedJob?.salary_range}
                              </div>
                              <Link
                                href={`/careers/${relatedJob?.slug}`}
                                className="text-accent hover:underline text-sm"
                              >
                                View Job
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            <div
              className={`sticky top-24 rounded-xl border p-6 ${
                theme === "light"
                  ? "bg-white border-gray-200 shadow-sm"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <h3 className="text-xl font-bold mb-4">
                About {job?.company_name}
              </h3>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-500">{job?.about}</p>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                    <i className="fas fa-globe"></i>
                  </div>
                  <div>
                    <a
                      href={job?.company_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline text-sm"
                    >
                      Company Website
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="text-sm text-gray-500">
                    {job?.company_size}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="text-sm text-gray-500">
                    Founded in {job?.company_founded}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-bold mb-3">Job Details</h4>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Job Type</div>
                      <div className="text-sm text-gray-500">
                        {job?.job_type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Salary Range</div>
                      <div className="text-sm text-gray-500">
                        {job?.salary_range}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                      <i className="fas fa-user-graduate"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Experience</div>
                      <div className="text-sm text-gray-500">
                        {job?.experience}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                      <i className="far fa-calendar-check"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Application Deadline
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(job?.deadline).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button className="w-full flex items-center justify-center gap-2 text-accent hover:underline">
                  <i className="fas fa-share-alt"></i> Share Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAuthDialog && (
        <AuthDialog onClose={() => setShowAuthDialog(false)} />
      )}
    </main>
  );
}
