"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import { useTheme } from "next-themes";
import React from "react";

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [guide, setGuide] = useState<any>(null);
  const [relatedGuides, setRelatedGuides] = useState<any[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);

    setTimeout(() => {
      const foundGuide = guidesData.find((g) => g.id === params.id);

      if (foundGuide) {
        setGuide(foundGuide);

        // Get related guides
        if (foundGuide.relatedGuides && foundGuide.relatedGuides.length > 0) {
          const related = guidesData
            .filter((g) =>
              foundGuide.relatedGuides.includes(Number.parseInt(g.id))
            )
            .slice(0, 2);
          setRelatedGuides(related);
        }
      } else {
        // Guide not found, redirect to guides list
        router.push("/guides");
      }

      setIsLoading(false);
    }, 500);
  }, [params.id, router]);

  const handleBookmark = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsBookmarked(!isBookmarked);
    // In a real app, you would save this to the user's profile
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading guide...</p>
        </div>
      </div>
    );
  }

  if (!guide) return null;

  return (
    <main>
      <div className="bg-gradient-to-b from-darker to-dark py-20">
        <div className="container max-w-4xl mx-auto px-4">
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
                guide.level === "beginner"
                  ? "bg-green-600"
                  : guide.level === "intermediate"
                  ? "bg-yellow-600"
                  : "bg-red-600"
              }`}
            >
              {guide.level.charAt(0).toUpperCase() + guide.level.slice(1)}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {guide.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-400 gap-4 mb-6">
              <div className="flex items-center">
                <i className="far fa-calendar mr-2"></i>
                <span>{guide.date}</span>
              </div>
              <div className="flex items-center">
                <i className="far fa-clock mr-2"></i>
                <span>{guide.readTime}</span>
              </div>
              <div className="flex items-center">
                <i className="far fa-folder mr-2"></i>
                <span className="capitalize">{guide.category}</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image
                  src={guide.author.avatar || "/placeholder.svg"}
                  alt={guide.author.name}
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <div className="font-medium">{guide.author.name}</div>
                <div className="text-sm text-gray-400">{guide.author.bio}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-10">
        <div className="relative mb-10 rounded-xl overflow-hidden">
          <Image
            src={guide.image || "/placeholder.svg"}
            alt={guide.title}
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>

        <div className="flex justify-end mb-8">
          <div className="flex gap-3">
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
          dangerouslySetInnerHTML={{ __html: guide.content }}
        ></div>

        <div className="border-t border-b py-6 mb-10 flex flex-wrap gap-2">
          {guide.tags.map((tag: string) => (
            <span
              key={tag}
              className={`px-3 py-1 rounded-full text-sm ${
                theme === "light"
                  ? "bg-gray-200 text-gray-800"
                  : "bg-gray-800 text-gray-200"
              }`}
            >
              #{tag}
            </span>
          ))}
        </div>

        {relatedGuides.length > 0 && (
          <div className="mb-10">
            <h3 className="text-2xl font-bold mb-6">Related Guides</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedGuides.map((relatedGuide) => (
                <div
                  key={relatedGuide.id}
                  className={`rounded-xl overflow-hidden border ${
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div className="h-40 overflow-hidden">
                    <Image
                      src={relatedGuide.image || "/placeholder.svg"}
                      alt={relatedGuide.title}
                      width={600}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-2 ${
                        relatedGuide.level === "beginner"
                          ? "bg-green-600"
                          : relatedGuide.level === "intermediate"
                          ? "bg-yellow-600"
                          : "bg-red-600"
                      }`}
                    >
                      {relatedGuide.level.charAt(0).toUpperCase() +
                        relatedGuide.level.slice(1)}
                    </span>
                    <h4 className="font-bold mb-2">{relatedGuide.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      {relatedGuide.excerpt}
                    </p>
                    <Link
                      href={`/guides/${relatedGuide.id}`}
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
                placeholder="Share your thoughts on this guide..."
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

const guidesData = [
  {
    id: "1",
    title: "Understanding Blockchain Basics",
    content: `
      <h2>Introduction to Blockchain</h2>
      <p>Blockchain is a distributed ledger technology that enables secure, transparent, and immutable record-keeping without the need for a central authority. At its core, a blockchain is a chain of blocks, where each block contains a list of transactions.</p>
      
      <h2>Key Concepts</h2>
      <p>To understand blockchain, you need to grasp these fundamental concepts:</p>
      <ul>
        <li><strong>Decentralization:</strong> Unlike traditional systems where a central authority controls the data, blockchain distributes data across a network of computers (nodes).</li>
        <li><strong>Transparency:</strong> All transactions on a blockchain are visible to anyone with access to the network.</li>
        <li><strong>Immutability:</strong> Once data is recorded on a blockchain, it cannot be altered or deleted without consensus from the network.</li>
        <li><strong>Consensus Mechanisms:</strong> These are protocols that ensure all nodes in the network agree on the validity of transactions.</li>
      </ul>
      
      <h2>How Blockchain Works</h2>
      <p>When a transaction is initiated, it is broadcast to the network of nodes. These nodes validate the transaction using predetermined rules. Valid transactions are grouped into a block, which is then added to the chain through a consensus mechanism like Proof of Work or Proof of Stake.</p>
      
      <h2>Types of Blockchains</h2>
      <p>There are three main types of blockchains:</p>
      <ul>
        <li><strong>Public Blockchains:</strong> Open to anyone, fully decentralized (e.g., Bitcoin, Ethereum)</li>
        <li><strong>Private Blockchains:</strong> Restricted to specific users, often within an organization</li>
        <li><strong>Consortium Blockchains:</strong> Controlled by a group of organizations rather than a single entity</li>
      </ul>
      
      <h2>Applications of Blockchain</h2>
      <p>Beyond cryptocurrencies, blockchain technology has applications in:</p>
      <ul>
        <li>Supply chain management</li>
        <li>Healthcare data management</li>
        <li>Voting systems</li>
        <li>Digital identity verification</li>
        <li>Smart contracts</li>
        <li>Decentralized finance (DeFi)</li>
      </ul>
      
      <h2>Getting Started</h2>
      <p>To start exploring blockchain technology:</p>
      <ol>
        <li>Create a cryptocurrency wallet</li>
        <li>Acquire a small amount of cryptocurrency</li>
        <li>Explore blockchain explorers to see transactions</li>
        <li>Join blockchain communities to learn from others</li>
      </ol>
    `,
    excerpt:
      "Learn the fundamental concepts of blockchain technology and how it works.",
    image: "/placeholder.svg?height=600&width=1200",
    level: "beginner",
    author: {
      name: "Alex Johnson",
      avatar: "/default_pp.jpg",
      bio: "Blockchain educator and developer with 5 years of experience in the Web3 space.",
    },
    date: "May 10, 2025",
    category: "basics",
    readTime: "8 min read",
    tags: ["blockchain", "cryptocurrency", "web3", "beginners"],
    relatedGuides: [2, 3],
  },
  {
    id: "2",
    title: "Getting Started with Cryptocurrency",
    content: `
      <h2>Introduction to Cryptocurrency</h2>
      <p>Cryptocurrency is a digital or virtual currency that uses cryptography for security and operates on a blockchain. Unlike traditional currencies issued by governments (fiat), cryptocurrencies are typically decentralized and not controlled by any central authority.</p>
      
      <h2>Popular Cryptocurrencies</h2>
      <p>There are thousands of cryptocurrencies, but some of the most well-known include:</p>
      <ul>
        <li><strong>Bitcoin (BTC):</strong> The first and most valuable cryptocurrency</li>
        <li><strong>Ethereum (ETH):</strong> Known for its smart contract functionality</li>
        <li><strong>Binance Coin (BNB):</strong> Native to the Binance exchange</li>
        <li><strong>Solana (SOL):</strong> Known for high throughput and low transaction costs</li>
        <li><strong>Cardano (ADA):</strong> Focuses on sustainability and scalability</li>
      </ul>
      
      <h2>How to Buy Cryptocurrency</h2>
      <p>To purchase cryptocurrency, follow these steps:</p>
      <ol>
        <li>Choose a reputable cryptocurrency exchange (e.g., Coinbase, Binance, Kraken)</li>
        <li>Create an account and complete identity verification</li>
        <li>Connect a payment method (bank account, credit card, etc.)</li>
        <li>Place an order to buy your chosen cryptocurrency</li>
        <li>Consider moving your cryptocurrency to a secure wallet</li>
      </ol>
      
      <h2>Types of Wallets</h2>
      <p>Cryptocurrency wallets come in several forms:</p>
      <ul>
        <li><strong>Hardware Wallets:</strong> Physical devices that store your keys offline (e.g., Ledger, Trezor)</li>
        <li><strong>Software Wallets:</strong> Applications on your computer or phone (e.g., MetaMask, Trust Wallet)</li>
        <li><strong>Paper Wallets:</strong> Physical documents containing your keys</li>
        <li><strong>Exchange Wallets:</strong> Provided by cryptocurrency exchanges (convenient but less secure)</li>
      </ul>
      
      <h2>Security Best Practices</h2>
      <p>To keep your cryptocurrency safe:</p>
      <ul>
        <li>Use strong, unique passwords for all accounts</li>
        <li>Enable two-factor authentication (2FA)</li>
        <li>Back up your wallet's seed phrase in multiple secure locations</li>
        <li>Be cautious of phishing attempts and scams</li>
        <li>Consider using a hardware wallet for large amounts</li>
        <li>Never share your private keys or seed phrase with anyone</li>
      </ul>
      
      <h2>Understanding Market Volatility</h2>
      <p>Cryptocurrency markets are known for their volatility. Prices can fluctuate dramatically in short periods. As a beginner, consider starting with small investments and learning about market trends before committing significant funds.</p>
    `,
    excerpt:
      "A beginner's guide to buying, storing, and using cryptocurrencies safely.",
    image: "/placeholder.svg?height=600&width=1200",
    level: "beginner",
    author: {
      name: "Sarah Chen",
      avatar: "/default_pp.jpg",
      bio: "Cryptocurrency analyst and financial educator specializing in digital assets.",
    },
    date: "May 5, 2025",
    category: "basics",
    readTime: "10 min read",
    tags: ["cryptocurrency", "bitcoin", "ethereum", "wallets", "security"],
    relatedGuides: [1, 3],
  },
  {
    id: "3",
    title: "Web3 Wallets Explained",
    content: `<p>Detailed content about Web3 wallets would go here...</p>`,
    excerpt:
      "Everything you need to know about different types of Web3 wallets.",
    image: "/placeholder.svg?height=600&width=1200",
    level: "beginner",
    author: {
      name: "Michael Brown",
      avatar: "/default_pp.jpg",
      bio: "Web3 developer and security expert.",
    },
    date: "April 28, 2025",
    category: "basics",
    readTime: "7 min read",
    tags: ["wallets", "web3", "security", "metamask"],
    relatedGuides: [1, 2],
  },
  {
    id: "4",
    title: "DeFi Protocols and Yield Farming",
    content: `<p>Detailed content about DeFi protocols would go here...</p>`,
    excerpt:
      "Explore decentralized finance protocols and strategies for yield farming.",
    image: "/placeholder.svg?height=600&width=1200",
    level: "intermediate",
    author: {
      name: "Jessica Lee",
      avatar: "/default_pp.jpg",
      bio: "DeFi researcher and protocol analyst.",
    },
    date: "May 12, 2025",
    category: "defi",
    readTime: "12 min read",
    tags: ["defi", "yield farming", "liquidity", "staking"],
    relatedGuides: [5, 6],
  },
  {
    id: "5",
    title: "NFT Creation and Marketplaces",
    content: `<p>Detailed content about NFTs would go here...</p>`,
    excerpt:
      "Learn how to create, mint, and sell your own NFTs on popular marketplaces.",
    image: "/placeholder.svg?height=600&width=1200",
    level: "intermediate",
    author: {
      name: "David Wilson",
      avatar: "/default_pp.jpg",
      bio: "Digital artist and NFT creator.",
    },
    date: "May 8, 2025",
    category: "nft",
    readTime: "9 min read",
    tags: ["nft", "digital art", "marketplaces", "minting"],
    relatedGuides: [4, 6],
  },
  {
    id: "6",
    title: "Smart Contract Development with Solidity",
    content: `<p>Detailed content about Solidity would go here...</p>`,
    excerpt: "A comprehensive guide to writing and deploying smart contracts.",
    image: "/placeholder.svg?height=600&width=1200",
    level: "advanced",
    author: {
      name: "Emma Rodriguez",
      avatar: "/default_pp.jpg",
      bio: "Smart contract developer and blockchain architect.",
    },
    date: "May 15, 2025",
    category: "development",
    readTime: "15 min read",
    tags: ["solidity", "smart contracts", "ethereum", "development"],
    relatedGuides: [4, 5],
  },
];
