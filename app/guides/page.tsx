"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import AuthDialog from "@/components/auth-dialog";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useTheme } from "next-themes";
import SignInPrompt from "@/components/sign-in";
import { getAll } from "@/lib/crud";
import { Guide } from "@/types/guides";
import Loading from "../loading";
import { useRouter } from "next/navigation";

export default function GuidesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("id") || "";
    setUser(storedUser);
  }, []);
  const { theme } = useTheme();
  const { handleError, ErrorToasts } = useErrorHandler();
  // const [guides, setGuides] = useState<Guide[]>([]);
  const [guides, setGuides] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        setLoading(true);

        const fetchedGuides = await getAll<any>(
          "guides",
          "*, user:users!guides_user_id_fkey(id, full_name)"
        );

        setGuides(fetchedGuides);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const filteredGuides =
    activeFilter === "all"
      ? guides
      : guides.filter(
          (guide: any) => guide.level.toLowerCase() === activeFilter
        );

  const handleGuideAction = (action: string) => {
    try {
      if (action === "bookmark" && Math.random() > 0.7) {
        throw new Error("Failed to bookmark guide - server error");
      }
      // console.log(`Guide ${action} successful`);
    } catch (error) {
      handleError(error);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>Blockchain Guides & Resources</h1>
          <p>
            Explore our collection of beginner-friendly guides to help you
            navigate the Web3 ecosystem
          </p>
        </div>
      </section>

      <section className="guides-container">
        <div className="container">
          <div className="guides-filter">
            <button
              className={`filter-button ${
                activeFilter === "all" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("all")}
            >
              All Guides
            </button>
            <button
              className={`filter-button ${
                activeFilter === "beginner" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("beginner")}
            >
              Beginner
            </button>
            <button
              className={`filter-button ${
                activeFilter === "intermediate" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("intermediate")}
            >
              Intermediate
            </button>
            <button
              className={`filter-button ${
                activeFilter === "advanced" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("advanced")}
            >
              Advanced
            </button>
          </div>

          <div className="guides-grid">
            {filteredGuides.map((guide: any) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-image">
                  <Image
                    src={guide.image_url || "/placeholder.svg"}
                    alt={guide.title}
                    width={600}
                    height={400}
                  />
                  <span
                    className={`guide-level level-${guide.level.toLowerCase()}`}
                  >
                    {guide.level}
                  </span>
                </div>
                <div className="guide-content">
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-excerpt">{guide.summary}</p>
                  <div className="guide-meta">
                    <div className="guide-author">
                      <div className="w-6 h-6 p-3 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {guide?.user?.full_name?.charAt(0) || "U"}
                        </span>
                      </div>
                      <span>{guide.user.full_name}</span>
                    </div>
                    <div className="guide-date">
                      {new Date(guide?.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="text-accent hover:underline"
                    >
                      Read More
                    </Link>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        // onClick={() => router.push(`/guides/${guide.slug}`)}
                        onClick={() => handleGuideAction("share")}
                        className="text-gray-400 hover:text-accent"
                        title="Share"
                      >
                        <i className="fas fa-share-alt"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="host-event-cta">
            {user ? (
              <div className="submit-guide">
                <h3>Want to contribute?</h3>
                <p>
                  Share your knowledge with the community by writing your own
                  guides
                </p>
                <Link href="/guides/create" className="cta-button cta-primary">
                  <i className="fas fa-pen-to-square"></i> Submit a Guide
                </Link>
              </div>
            ) : (
              <SignInPrompt
                title="Want to contribute?"
                description="Share your knowledge with the community by writing your own guides"
                buttonText="Sign In to Submit"
                icon="fas fa-pen-to-square"
                onSignInClick={() => setShowAuthDialog(true)}
              />
            )}
          </div>
        </div>
      </section>

      {showAuthDialog && (
        <AuthDialog onClose={() => setShowAuthDialog(false)} />
      )}
      <ErrorToasts />
    </main>
  );
}
