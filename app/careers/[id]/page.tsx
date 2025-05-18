"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import AuthDialog from "@/components/auth-dialog"
import { useTheme } from "next-themes"

// Mock data for careers
const careersData = [
  {
    id: "1",
    title: "Blockchain Developer",
    company: {
      name: "CryptoTech",
      location: "Remote",
      logo: "/blockchain-logo.png",
      about:
        "CryptoTech is a leading blockchain development company specializing in building decentralized applications and smart contract solutions for enterprises and startups.",
      website: "https://example.com/cryptotech",
      size: "50-100 employees",
      founded: "2018",
    },
    type: "Full-time",
    salary: "$90,000 - $120,000",
    experience: "2-4 years",
    description: `
      <h2>About the Role</h2>
      <p>We're looking for a skilled Blockchain Developer to join our team. You'll be responsible for designing and implementing blockchain solutions for our clients, focusing on Ethereum-based applications and smart contracts.</p>
      
      <h2>Responsibilities</h2>
      <ul>
        <li>Design, implement, and deploy smart contracts using Solidity</li>
        <li>Develop and maintain decentralized applications (dApps)</li>
        <li>Integrate blockchain solutions with existing systems</li>
        <li>Optimize gas costs and ensure security of smart contracts</li>
        <li>Collaborate with cross-functional teams to define, design, and ship new features</li>
        <li>Identify and fix bugs and performance bottlenecks</li>
        <li>Stay up-to-date with the latest blockchain technologies and best practices</li>
      </ul>
      
      <h2>Requirements</h2>
      <ul>
        <li>2-4 years of experience in blockchain development</li>
        <li>Strong proficiency in Solidity and Ethereum development</li>
        <li>Experience with Web3.js, Ethers.js, or similar libraries</li>
        <li>Familiarity with blockchain development frameworks (Hardhat, Truffle, etc.)</li>
        <li>Understanding of blockchain architecture and consensus mechanisms</li>
        <li>Strong JavaScript/TypeScript skills</li>
        <li>Experience with React or similar frontend frameworks</li>
        <li>Knowledge of security best practices in blockchain development</li>
      </ul>
      
      <h2>Nice to Have</h2>
      <ul>
        <li>Experience with other blockchain platforms (Solana, Polkadot, etc.)</li>
        <li>Contributions to open-source blockchain projects</li>
        <li>Experience with DeFi protocols</li>
        <li>Knowledge of cryptography and zero-knowledge proofs</li>
        <li>Understanding of tokenomics and blockchain economics</li>
      </ul>
      
      <h2>Benefits</h2>
      <ul>
        <li>Competitive salary and equity options</li>
        <li>Flexible remote work policy</li>
        <li>Health, dental, and vision insurance</li>
        <li>401(k) matching</li>
        <li>Professional development budget</li>
        <li>Regular team retreats and events</li>
        <li>Opportunity to work on cutting-edge blockchain technology</li>
      </ul>
    `,
    postedDate: "May 1, 2025",
    applicationDeadline: "June 15, 2025",
    tags: ["Solidity", "Ethereum", "Smart Contracts", "Web3.js"],
    relatedJobs: [2, 3],
  },
  {
    id: "2",
    title: "Web3 Product Manager",
    company: {
      name: "DeFi Solutions",
      location: "New York, NY (Hybrid)",
      logo: "/blockchain-logo.png",
      about:
        "DeFi Solutions is a financial technology company building the next generation of decentralized finance products.",
      website: "https://example.com/defisolutions",
      size: "100-250 employees",
      founded: "2019",
    },
    type: "Full-time",
    salary: "$110,000 - $140,000",
    experience: "3-5 years",
    description: `<p>Detailed job description for Web3 Product Manager would go here...</p>`,
    postedDate: "April 28, 2025",
    applicationDeadline: "May 31, 2025",
    tags: ["Product Management", "DeFi", "Agile", "Blockchain"],
    relatedJobs: [1, 3],
  },
  {
    id: "3",
    title: "NFT Community Manager",
    company: {
      name: "ArtBlock",
      location: "Remote",
      logo: "/blockchain-logo.png",
      about: "ArtBlock is a leading NFT marketplace connecting digital artists with collectors worldwide.",
      website: "https://example.com/artblock",
      size: "25-50 employees",
      founded: "2021",
    },
    type: "Part-time",
    salary: "$40,000 - $60,000",
    experience: "1-3 years",
    description: `<p>Detailed job description for NFT Community Manager would go here...</p>`,
    postedDate: "May 5, 2025",
    applicationDeadline: "June 5, 2025",
    tags: ["NFTs", "Community Management", "Social Media", "Discord"],
    relatedJobs: [1, 2],
  },
]

export default function CareerPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [job, setJob] = useState<any>(null)
  const [relatedJobs, setRelatedJobs] = useState<any[]>([])
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isApplied, setIsApplied] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)

    setTimeout(() => {
      const foundJob = careersData.find((j) => j.id === params.id)

      if (foundJob) {
        setJob(foundJob)

        // Get related jobs
        if (foundJob.relatedJobs && foundJob.relatedJobs.length > 0) {
          const related = careersData.filter((j) => foundJob.relatedJobs.includes(Number.parseInt(j.id))).slice(0, 2)
          setRelatedJobs(related)
        }
      } else {
        // Job not found, redirect to careers list
        router.push("/careers")
      }

      setIsLoading(false)
    }, 500)
  }, [params.id, router])

  const handleApply = () => {
    if (!user) {
      setShowAuthDialog(true)
      return
    }

    setIsApplied(!isApplied)
    // In a real app, you would save the application
  }

  const handleSaveJob = () => {
    if (!user) {
      setShowAuthDialog(true)
      return
    }

    setIsSaved(!isSaved)
    // In a real app, you would save this to the user's profile
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) return null

  return (
    <main>
      <div className="bg-gradient-to-b from-darker to-dark py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/careers" className="text-accent hover:underline flex items-center">
              <i className="fas fa-arrow-left mr-2"></i> Back to Careers
            </Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-lg p-2 flex items-center justify-center">
              <Image
                src={job.company.logo || "/placeholder.svg"}
                alt={job.company.name}
                width={80}
                height={80}
                className="max-w-full max-h-full"
              />
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                <div>{job.company.name}</div>
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  <span>{job.company.location}</span>
                </div>
                <div className="flex items-center">
                  <i className="far fa-clock mr-1"></i>
                  <span>{job.type}</span>
                </div>
                <div className="flex items-center">
                  <i className="fas fa-dollar-sign mr-1"></i>
                  <span>{job.salary}</span>
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
                    theme === "light" ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary-foreground"
                  }`}
                >
                  {job.type}
                </span>
                <span className="text-sm text-gray-500">Posted on {job.postedDate}</span>
              </div>

              <div
                className={`job-description prose ${
                  theme === "light" ? "prose-gray" : "prose-invert"
                } max-w-none mb-10`}
                dangerouslySetInnerHTML={{ __html: job.description }}
              ></div>

              <div className="border-t border-b py-6 mb-10 flex flex-wrap gap-2">
                {job.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === "light" ? "bg-gray-200 text-gray-800" : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <button
                  onClick={handleApply}
                  className={`py-3 px-6 rounded-lg font-medium ${
                    isApplied ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary hover:bg-hover text-white"
                  } transition-colors`}
                >
                  {isApplied ? "Application Submitted" : "Apply for this Position"}
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

            {relatedJobs.length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-bold mb-6">Similar Jobs</h3>
                <div className="space-y-4">
                  {relatedJobs.map((relatedJob) => (
                    <div
                      key={relatedJob.id}
                      className={`p-6 rounded-xl border ${
                        theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg p-1 flex-shrink-0 flex items-center justify-center">
                          <Image
                            src={relatedJob.company.logo || "/placeholder.svg"}
                            alt={relatedJob.company.name}
                            width={40}
                            height={40}
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="font-bold mb-1">{relatedJob.title}</h4>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500 mb-3">
                            <span>{relatedJob.company.name}</span>
                            <span>{relatedJob.company.location}</span>
                            <span>{relatedJob.type}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="text-sm font-medium">{relatedJob.salary}</div>
                            <Link href={`/careers/${relatedJob.id}`} className="text-accent hover:underline text-sm">
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

          <div className="md:col-span-1">
            <div
              className={`sticky top-24 rounded-xl border p-6 ${
                theme === "light" ? "bg-white border-gray-200 shadow-sm" : "bg-gray-800 border-gray-700"
              }`}
            >
              <h3 className="text-xl font-bold mb-4">About {job.company.name}</h3>

              <div className="space-y-4 mb-6">
                <p className="text-sm text-gray-500">{job.company.about}</p>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                    <i className="fas fa-globe"></i>
                  </div>
                  <div>
                    <a
                      href={job.company.website}
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
                  <div className="text-sm text-gray-500">{job.company.size}</div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="text-sm text-gray-500">Founded in {job.company.founded}</div>
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
                      <div className="text-sm text-gray-500">{job.type}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Salary Range</div>
                      <div className="text-sm text-gray-500">{job.salary}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                      <i className="fas fa-user-graduate"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Experience</div>
                      <div className="text-sm text-gray-500">{job.experience}</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-5 mt-0.5 mr-3 text-gray-400">
                      <i className="far fa-calendar-check"></i>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Application Deadline</div>
                      <div className="text-sm text-gray-500">{job.applicationDeadline}</div>
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

      {showAuthDialog && <AuthDialog onClose={() => setShowAuthDialog(false)} />}
    </main>
  )
}
