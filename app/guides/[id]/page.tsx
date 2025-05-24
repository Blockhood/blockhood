"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAll, getBySlug } from "@/lib/crud";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";

export default function GuidePage() {
  const params = useParams();
  const rawId = params?.id;
  const slug: string = Array.isArray(rawId) ? rawId[0] : rawId || "";
  const router = useRouter();
  const [user, setUser] = useState("");

  const [guide, setGuide] = useState<any>(null);
  const [relatedGuides, setRelatedGuides] = useState<any[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setUser(localStorage.getItem("id") || "");
  }, []);

  useEffect(() => {
    const fetchGuide = async () => {
      try {
        const fetchedGuide = await getBySlug<any>(
          "guides",
          "slug",
          slug,
          `
            *,
            user:users!guides_user_id_fkey(id, full_name),
            guide_tags(
              tag:tags(id, name)
            )
          `
        );
        setGuide(fetchedGuide);
      } catch (error) {
        console.error("Failed to fetch guide:", error);
      }
    };

    const fetchRelatedGuides = async () => {
      try {
        const fetchedGuides = await getAll<any>(
          "guides",
          "*, user:users!guides_user_id_fkey(id, full_name)"
        );
        setRelatedGuides(fetchedGuides);
      } catch (error) {
        console.error("Failed to fetch related guides:", error);
      }
    };

    fetchGuide();
    fetchRelatedGuides();
  }, [slug]);

  const handleBookmark = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }
    setIsBookmarked(!isBookmarked);
  };

  if (!guide) return null;

  return (
    <main>
      <div className="bg-gradient-to-b from-darker to-dark pt-20">
        <div className="container max-w-5xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/guides"
              className="text-accent hover:underline flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Guides
            </Link>
          </div>

          <div className="mb-8">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${
                guide?.level === "beginner"
                  ? "bg-green-600"
                  : guide?.level === "intermediate"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {guide?.level?.toUpperCase()}
            </span>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              {guide?.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-400 gap-4 mb-6">
              <div className="flex items-center">
                <i className="far fa-calendar mr-2"></i>
                <span>
                  {new Date(guide?.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <i className="far fa-clock mr-2"></i>
                <span>{guide?.duration}</span>
              </div>
            </div>

            <div className="flex items-center mt-4">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {guide?.user?.full_name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <div className="font-medium">{guide?.user?.full_name}</div>
                <div className="text-sm text-gray-400">
                  author guide "{guide?.title}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-5xl mx-auto px-4 py-10">
        <div className="relative mb-10 rounded-xl overflow-hidden">
          <Image
            src={guide?.image_url || "/placeholder.svg"}
            alt={guide?.title}
            width={1200}
            height={600}
            className="w-full h-[20rem] md:h-[30rem] lg:h-[40rem] object-cover rounded-lg"
          />
        </div>

        <div className="flex justify-end mb-8">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleBookmark}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                isBookmarked
                  ? "bg-primary text-white border-primary"
                  : theme === "light"
                  ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
              } transition-colors`}
            >
              <i className={`${isBookmarked ? "fas" : "far"} fa-bookmark`}></i>
              <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>

            <button
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                theme === "light"
                  ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  : "bg-gray-800 text-gray-200 border-gray-700 hover:bg-gray-700"
              } transition-colors`}
            >
              <i className="fas fa-share-alt"></i>
              <span>Share</span>
            </button>
          </div>
        </div>

        <div
          className={`guide-content prose ${
            theme === "light" ? "prose-gray" : "prose-invert"
          } max-w-none mb-12`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {guide?.content?.replace(/\\n/g, "\n")}
          </ReactMarkdown>
        </div>

        <div className="border-t border-b py-6 mb-10 flex flex-wrap gap-2">
          {guide?.guide_tags?.map((gt: any) => (
            <span
              key={gt?.tag?.id}
              className={`px-3 py-1 rounded-full text-sm ${
                theme === "light"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              #{gt?.tag?.name}
            </span>
          ))}
        </div>

        {relatedGuides?.filter(
          (relatedGuide) =>
            relatedGuide?.level === guide?.level &&
            relatedGuide?.id !== guide?.id
        ).length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6">Related Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedGuides
                .filter(
                  (relatedGuide) =>
                    relatedGuide?.level === guide?.level &&
                    relatedGuide?.id !== guide?.id
                )
                .map((relatedGuide) => (
                  <div
                    key={relatedGuide?.id}
                    className={`rounded-xl overflow-hidden border ${
                      theme === "light"
                        ? "bg-white border-gray-200"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <div className="h-40 overflow-hidden">
                      <Image
                        src={relatedGuide?.image_url || "/placeholder.svg"}
                        alt={relatedGuide?.title}
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                          relatedGuide?.level === "beginner"
                            ? "bg-green-600"
                            : relatedGuide?.level === "intermediate"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                      >
                        {relatedGuide?.level?.toUpperCase()}
                      </span>
                      <h4 className="font-bold mb-2">{relatedGuide?.title}</h4>
                      <p className="text-sm text-gray-400 mb-3">
                        {relatedGuide?.summary}
                      </p>
                      <Link
                        href={`/guides/${relatedGuide?.slug}`}
                        className="text-accent hover:underline text-sm"
                      >
                        Read Guide
                      </Link>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div
          className={`rounded-xl p-6 ${
            theme === "light" ? "bg-gray-100" : "bg-gray-800"
          }`}
        >
          <h3 className="text-xl font-bold mb-4">Join the Discussion</h3>
          {user ? (
            <div>
              <textarea
                placeholder="Share your thoughts on this guide?..."
                className={`w-full p-4 rounded-lg border mb-4 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-800"
                    : "bg-gray-700 border-gray-600 text-gray-100"
                }`}
                rows={4}
              ></textarea>
              <button className="cta-button cta-primary">Post Comment</button>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="mb-4">
                Sign in to join the discussion and comment on this guide
              </p>
              <button
                onClick={() => setShowAuthDialog(true)}
                className="cta-button cta-primary"
              >
                Sign In to Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {showAuthDialog && (
        <AuthDialog onClose={() => setShowAuthDialog(false)} />
      )}
    </main>
  );
}
