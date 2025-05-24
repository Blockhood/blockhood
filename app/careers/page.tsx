"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import SignInPrompt from "@/components/sign-in";
import { getAll } from "@/lib/crud";

export default function CareersPage() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [user, setUser] = useState("");
  const [careers, setCareers] = useState<any[]>([]);

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const fetchedCareers = await getAll<any>("careers");
        setCareers(fetchedCareers);
      } catch (error) {
        console.error("Failed to fetch careers:", error);
      }
    };

    fetchCareers();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("id") || "";
    setUser(storedUser);
  }, []);

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
                        src={job.image_url || "/blockhood-logo.png"}
                        alt={job.company_name || "Company Logo"}
                        width={60}
                        height={60}
                      />
                    </div>
                    <div className="career-company-info">
                      <h3>{job.title}</h3>
                      <p>
                        {job.company_name} • {job.location}
                      </p>
                    </div>
                  </div>
                  <span className="career-type">{job.job_type}</span>
                </div>

                <div className="career-details">
                  <div className="career-detail">
                    <span className="career-detail-label">Salary</span>
                    <span className="career-detail-value">
                      {job.salary_range}
                    </span>
                  </div>
                  <div className="career-detail">
                    <span className="career-detail-label">Experience</span>
                    <span className="career-detail-value">
                      {job.experience}
                    </span>
                  </div>
                </div>

                <p className="career-description">{job.summary}</p>

                <div className="career-footer">
                  <div className="career-tags">
                    {job.tags?.map((tag: string, index: number) => (
                      <span key={index} className="career-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/careers/${job.slug || job.id}`}
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
                <Link href="/careers/create" className="cta-button cta-primary">
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
