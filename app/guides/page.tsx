"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { useTheme } from "next-themes";
import SignInPrompt from "@/components/sign-in";

export default function GuidesPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme();
  const { handleError, ErrorToasts } = useErrorHandler();

  const filteredGuides =
    activeFilter === "all"
      ? guides
      : guides.filter(
          (guide) =>
            guide.level === activeFilter || guide.category === activeFilter
        );

  const handleGuideAction = (action: string) => {
    try {
      // Simulate an error that would be logged but not shown to the user
      if (action === "bookmark" && Math.random() > 0.7) {
        throw new Error("Failed to bookmark guide - server error");
      }

      // Normal flow continues
      console.log(`Guide ${action} successful`);
    } catch (error) {
      // This will log to console but not show UI error
      handleError(error);
    }
  };

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
            {/* <button
              className={`filter-button ${
                activeFilter === "basics" ? "active" : ""
              }`}
              onClick={() => setActiveFilter("basics")}
            >
              Web3 Basics
            </button> */}
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
            {filteredGuides.map((guide) => (
              <div key={guide.id} className="guide-card">
                <div className="guide-image">
                  <Image
                    src={guide.image || "/placeholder.svg"}
                    alt={guide.title}
                    width={600}
                    height={400}
                  />
                  <span className={`guide-level level-${guide.level}`}>
                    {guide.level}
                  </span>
                </div>
                <div className="guide-content">
                  <h3 className="guide-title">{guide.title}</h3>
                  <p className="guide-excerpt">{guide.excerpt}</p>
                  <div className="guide-meta">
                    <div className="guide-author">
                      <Image
                        src={guide.author.avatar || "/placeholder.svg"}
                        alt={guide.author.name}
                        width={25}
                        height={25}
                      />
                      <span>{guide.author.name}</span>
                    </div>
                    <div className="guide-date">{guide.date}</div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      href={`/guides/${guide.id}`}
                      className="text-accent hover:underline"
                    >
                      Read More
                    </Link>
                    <div className="flex gap-2">
                      <button
                        //    onClick={() => handleGuideAction("bookmark")}
                        //    className="text-gray-400 hover:text-accent"
                        //    title="Bookmark"
                        //  >
                        //    <i className="fas fa-bookmark"></i>
                        //  </button>
                        //  <button
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
                <Link href="/guides/submit" className="cta-button cta-primary">
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

const guides = [
  {
    id: 1,
    title: "Understanding Blockchain Basics",
    excerpt:
      "Learn the fundamental concepts of blockchain technology and how it works.",
    image: "/placeholder.svg?height=400&width=600",
    level: "beginner",
    author: {
      name: "Alex Johnson",
      avatar: "/default_pp.jpg",
    },
    date: "May 10, 2025",
    category: "basics",
  },
  {
    id: 2,
    title: "Getting Started with Cryptocurrency",
    excerpt:
      "A beginner's guide to buying, storing, and using cryptocurrencies safely.",
    image: "/placeholder.svg?height=400&width=600",
    level: "beginner",
    author: {
      name: "Sarah Chen",
      avatar: "/default_pp.jpg",
    },
    date: "May 5, 2025",
    category: "basics",
  },
  {
    id: 3,
    title: "Web3 Wallets Explained",
    excerpt:
      "Everything you need to know about different types of Web3 wallets.",
    image: "/placeholder.svg?height=400&width=600",
    level: "beginner",
    author: {
      name: "Michael Brown",
      avatar: "/default_pp.jpg",
    },
    date: "April 28, 2025",
    category: "basics",
  },
  {
    id: 4,
    title: "DeFi Protocols and Yield Farming",
    excerpt:
      "Explore decentralized finance protocols and strategies for yield farming.",
    image: "/placeholder.svg?height=400&width=600",
    level: "intermediate",
    author: {
      name: "Jessica Lee",
      avatar: "/default_pp.jpg",
    },
    date: "May 12, 2025",
    category: "defi",
  },
  {
    id: 5,
    title: "NFT Creation and Marketplaces",
    excerpt:
      "Learn how to create, mint, and sell your own NFTs on popular marketplaces.",
    image: "/placeholder.svg?height=400&width=600",
    level: "intermediate",
    author: {
      name: "David Wilson",
      avatar: "/default_pp.jpg",
    },
    date: "May 8, 2025",
    category: "nft",
  },
  {
    id: 6,
    title: "Smart Contract Development with Solidity",
    excerpt: "A comprehensive guide to writing and deploying smart contracts.",
    image: "/placeholder.svg?height=400&width=600",
    level: "advanced",
    author: {
      name: "Emma Rodriguez",
      avatar: "/default_pp.jpg",
    },
    date: "May 15, 2025",
    category: "development",
  },
];
