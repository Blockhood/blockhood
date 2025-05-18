"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import SignInPrompt from "@/components/sign-in";

// Mock data for careers
const careers = [
  {
    id: 1,
    title: "Blockchain Developer",
    company: {
      name: "CryptoTech",
      location: "Remote",
      logo: "/blockchain-logo.png",
    },
    type: "Full-time",
    salary: "$90,000 - $120,000",
    experience: "2-4 years",
    description:
      "We're looking for a skilled Blockchain Developer to join our team. You'll be responsible for designing and implementing blockchain solutions for our clients.",
    tags: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js"],
  },
  {
    id: 2,
    title: "Web3 Product Manager",
    company: {
      name: "DeFi Solutions",
      location: "New York, NY (Hybrid)",
      logo: "/blockchain-logo.png",
    },
    type: "Full-time",
    salary: "$110,000 - $140,000",
    experience: "3-5 years",
    description:
      "Join our team as a Web3 Product Manager to lead the development of our decentralized finance products. You'll work closely with developers, designers, and stakeholders.",
    tags: ["Product Management", "DeFi", "Agile", "Blockchain"],
  },
  {
    id: 3,
    title: "NFT Community Manager",
    company: {
      name: "ArtBlock",
      location: "Remote",
      logo: "/blockchain-logo.png",
    },
    type: "Part-time",
    salary: "$40,000 - $60,000",
    experience: "1-3 years",
    description:
      "We're seeking a passionate Community Manager to engage with our NFT community, organize events, and grow our presence in the NFT space.",
    tags: ["NFTs", "Community Management", "Social Media", "Discord"],
  },
];

export default function CareersPage() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>Web3 Careers</h1>
          <p>
            Find opportunities in the blockchain and Web3 space or post your own
            job listings
          </p>
        </div>
      </section>

      <section className="guides-container">
        <div className="container">
          <div className="careers-grid">
            {careers.map((job) => (
              <div key={job.id} className="career-card">
                <div className="career-header">
                  <div className="career-company">
                    <div className="career-company-logo">
                      <Image
                        src={job.company.logo || "/placeholder.svg"}
                        alt={job.company.name}
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="career-company-info">
                      <h3>{job.title}</h3>
                      <p>
                        {job.company.name} • {job.company.location}
                      </p>
                    </div>
                  </div>
                  <span className="career-type">{job.type}</span>
                </div>

                <div className="career-details">
                  <div className="career-detail">
                    <span className="career-detail-label">Salary</span>
                    <span className="career-detail-value">{job.salary}</span>
                  </div>
                  <div className="career-detail">
                    <span className="career-detail-label">Experience</span>
                    <span className="career-detail-value">
                      {job.experience}
                    </span>
                  </div>
                </div>

                <p className="career-description">{job.description}</p>

                <div className="career-footer">
                  <div className="career-tags">
                    {job.tags.map((tag, index) => (
                      <span key={index} className="career-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/careers/${job.id}`}
                    className="cta-button cta-secondary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="post-job-cta">
            {user ? (
              <div className="submit-guide">
                <h3>Have a Web3 job opportunity?</h3>
                <p>Share job openings with the Blockhood community</p>
                <Link href="/careers/post" className="cta-button cta-primary">
                  <i className="fas fa-plus-circle"></i> Post a Job
                </Link>
              </div>
            ) : (
              <SignInPrompt
                title="Have a Web3 job opportunity?"
                description="Share job openings with the Blockhood community"
                buttonText="Sign In to Post Jobs"
                icon="fas fa-briefcase"
                onSignInClick={() => setShowAuthDialog(true)}
              />
            )}
          </div>
        </div>
      </section>

      {showAuthDialog && (
        <AuthDialog onClose={() => setShowAuthDialog(false)} />
      )}
    </main>
  );
}
