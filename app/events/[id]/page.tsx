"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import AuthDialog from "@/components/auth-dialog"
import { useTheme } from "next-themes"

// Mock data for events
const eventsData = [
  {
    id: "1",
    title: "Web3 Beginners Workshop",
    description: "Join us for a hands-on workshop designed to introduce beginners to the world of Web3.",
    longDescription: `
      <p>Are you curious about Web3 but don't know where to start? This workshop is designed specifically for beginners who want to understand the fundamentals of Web3 technologies and how they're reshaping the internet.</p>
      
      <h3>What You'll Learn:</h3>
      <ul>
        <li>The key differences between Web2 and Web3</li>
        <li>Understanding blockchain technology and its role in Web3</li>
        <li>How to set up your first Web3 wallet</li>
        <li>Navigating decentralized applications (dApps)</li>
        <li>Introduction to NFTs and their use cases</li>
        <li>Overview of decentralized finance (DeFi)</li>
      </ul>
      
      <h3>Workshop Format:</h3>
      <p>This is a hands-on, interactive workshop. Participants will be guided through practical exercises including setting up a wallet, interacting with a dApp, and exploring the Web3 ecosystem. The workshop will conclude with a Q&A session where you can get answers to all your Web3 questions.</p>
      
      <h3>Who Should Attend:</h3>
      <p>This workshop is perfect for:</p>
      <ul>
        <li>Complete beginners with no prior blockchain knowledge</li>
        <li>Web developers curious about Web3</li>
        <li>Anyone interested in understanding the future of the internet</li>
        <li>Students looking to expand their tech knowledge</li>
      </ul>
      
      <h3>Requirements:</h3>
      <p>Participants should have:</p>
      <ul>
        <li>A laptop or desktop computer</li>
        <li>A stable internet connection</li>
        <li>Basic computer literacy</li>
      </ul>
      
      <p>No prior blockchain or cryptocurrency knowledge is required!</p>
    `,
    image: "/placeholder.svg?height=600&width=1200",
    date: {
      day: "15",
      month: "May",
      year: "2025",
      full: "May 15, 2025",
    },
    time: "2:00 PM - 4:00 PM",
    timezone: "UTC",
    location: "Virtual (Zoom)",
    locationDetails: {
      type: "virtual",
      platform: "Zoom",
      link: "https://zoom.us/j/example (link will be sent to registered participants)",
    },
    host: {
      name: "Alex Johnson",
      avatar: "/default_pp.jpg",
      bio: "Blockchain educator and developer with 5 years of experience in the Web3 space.",
    },
    attendees: 42,
    maxAttendees: 100,
    isFree: true,
    price: "Free",
    tags: ["workshop", "beginners", "web3", "blockchain"],
    relatedEvents: [2, 3],
  },
  {
    id: "2",
    title: "DeFi Deep Dive",
    description: "Explore the world of decentralized finance with experts in the field.",
    longDescription: `<p>Detailed description of the DeFi Deep Dive event would go here...</p>`,
    image: "/placeholder.svg?height=600&width=1200",
    date: {
      day: "22",
      month: "May",
      year: "2025",
      full: "May 22, 2025",
    },
    time: "6:00 PM - 8:00 PM",
    timezone: "UTC",
    location: "Virtual (Discord)",
    locationDetails: {
      type: "virtual",
      platform: "Discord",
      link: "https://discord.gg/example (link will be sent to registered participants)",
    },
    host: {
      name: "Sarah Chen",
      avatar: "/default_pp.jpg",
      bio: "DeFi researcher and protocol analyst with expertise in yield optimization.",
    },
    attendees: 78,
    maxAttendees: 150,
    isFree: true,
    price: "Free",
    tags: ["defi", "finance", "ethereum", "yield"],
    relatedEvents: [1, 3],
  },
  {
    id: "3",
    title: "NFT Creation Masterclass",
    description: "Learn how to create, mint, and sell your own NFTs in this comprehensive masterclass.",
    longDescription: `<p>Detailed description of the NFT Creation Masterclass would go here...</p>`,
    image: "/placeholder.svg?height=600&width=1200",
    date: {
      day: "29",
      month: "May",
      year: "2025",
      full: "May 29, 2025",
    },
    time: "3:00 PM - 5:30 PM",
    timezone: "UTC",
    location: "Virtual (Zoom)",
    locationDetails: {
      type: "virtual",
      platform: "Zoom",
      link: "https://zoom.us/j/example (link will be sent to registered participants)",
    },
    host: {
      name: "David Wilson",
      avatar: "/default_pp.jpg",
      bio: "Digital artist and NFT creator with over 100 successful NFT launches.",
    },
    attendees: 65,
    maxAttendees: 120,
    isFree: false,
    price: "$25",
    tags: ["nft", "art", "creation", "masterclass"],
    relatedEvents: [1, 2],
  },
]

export default function EventPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [event, setEvent] = useState<any>(null)
  const [relatedEvents, setRelatedEvents] = useState<any[]>([])
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { theme } = useTheme()

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true)

    setTimeout(() => {
      const foundEvent = eventsData.find((e) => e.id === params.id)

      if (foundEvent) {
        setEvent(foundEvent)

        // Get related events
        if (foundEvent.relatedEvents && foundEvent.relatedEvents.length > 0) {
          const related = eventsData.filter((e) => foundEvent.relatedEvents.includes(Number.parseInt(e.id))).slice(0, 2)
          setRelatedEvents(related)
        }
      } else {
        // Event not found, redirect to events list
        router.push("/events")
      }

      setIsLoading(false)
    }, 500)
  }, [params.id, router])

  const handleRegister = () => {
    if (!user) {
      setShowAuthDialog(true)
      return
    }

    setIsRegistered(!isRegistered)
    // In a real app, you would register the user for the event
  }

  const formatDate = (date: any) => {
    return `${date.month} ${date.day}, ${date.year}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-500">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) return null

  return (
    <main>
      <div className="bg-gradient-to-b from-darker to-dark py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link href="/events" className="text-accent hover:underline flex items-center">
              <i className="fas fa-arrow-left mr-2"></i> Back to Events
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>

            <div className="flex flex-wrap items-center text-sm text-gray-400 gap-4 mb-6">
              <div className="flex items-center">
                <i className="far fa-calendar mr-2"></i>
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center">
                <i className="far fa-clock mr-2"></i>
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>{event.location}</span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                <Image src={event.host.avatar || "/placeholder.svg"} alt={event.host.name} width={40} height={40} />
              </div>
              <div>
                <div className="font-medium">Hosted by {event.host.name}</div>
                <div className="text-sm text-gray-400">{event.host.bio}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="relative mb-8 rounded-xl overflow-hidden">
              <Image
                src={event.image || "/placeholder.svg"}
                alt={event.title}
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div>

            <div
              className={`event-description prose ${
                theme === "light" ? "prose-gray" : "prose-invert"
              } max-w-none mb-10`}
              dangerouslySetInnerHTML={{ __html: event.longDescription }}
            ></div>

            <div className="border-t border-b py-6 mb-10 flex flex-wrap gap-2">
              {event.tags.map((tag: string) => (
                <span
                  key={tag}
                  className={`px-3 py-1 rounded-full text-sm ${
                    theme === "light" ? "bg-gray-200 text-gray-800" : "bg-gray-800 text-gray-200"
                  }`}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className={`rounded-xl p-6 ${theme === "light" ? "bg-gray-100" : "bg-gray-800"}`}>
              <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
              {user ? (
                <div>
                  <textarea
                    placeholder="Ask the host a question about this event..."
                    className={`w-full p-4 rounded-lg border mb-4 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-800"
                        : "bg-gray-700 border-gray-600 text-gray-100"
                    }`}
                    rows={4}
                  ></textarea>
                  <button className="cta-button cta-primary">Send Question</button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4">Sign in to ask questions about this event</p>
                  <button onClick={() => setShowAuthDialog(true)} className="cta-button cta-primary">
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div
              className={`sticky top-24 rounded-xl border p-6 ${
                theme === "light" ? "bg-white border-gray-200 shadow-sm" : "bg-gray-800 border-gray-700"
              }`}
            >
              <div className="mb-6">
                <div className="text-2xl font-bold mb-1">{event.price}</div>
                <div className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-300"}`}>
                  {event.attendees} attending · {event.maxAttendees - event.attendees} spots left
                </div>
                <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleRegister}
                className={`w-full py-3 px-4 rounded-lg font-medium mb-4 ${
                  isRegistered ? "bg-green-600 hover:bg-green-700 text-white" : "bg-primary hover:bg-hover text-white"
                } transition-colors`}
              >
                {isRegistered ? "Registered" : "Register for Event"}
              </button>

              <button className="w-full py-3 px-4 rounded-lg font-medium mb-6 border border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
                <i className="far fa-calendar-plus mr-2"></i> Add to Calendar
              </button>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-1 mr-3 text-gray-400">
                    <i className="far fa-calendar"></i>
                  </div>
                  <div>
                    <div className="font-medium">Date and Time</div>
                    <div className="text-sm text-gray-500">{formatDate(event.date)}</div>
                    <div className="text-sm text-gray-500">
                      {event.time} ({event.timezone})
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-1 mr-3 text-gray-400">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-gray-500">{event.location}</div>
                    {event.locationDetails.type === "virtual" && (
                      <div className="text-sm text-gray-500">Platform: {event.locationDetails.platform}</div>
                    )}
                    {isRegistered && (
                      <div className="mt-2">
                        <a href="#" className="text-accent hover:underline text-sm">
                          View access details
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-1 mr-3 text-gray-400">
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <div className="font-medium">Host</div>
                    <div className="text-sm text-gray-500">{event.host.name}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <button className="w-full flex items-center justify-center gap-2 text-accent hover:underline">
                  <i className="fas fa-share-alt"></i> Share Event
                </button>
              </div>
            </div>
          </div>
        </div>

        {relatedEvents.length > 0 && (
          <div className="mt-12 mb-10">
            <h3 className="text-2xl font-bold mb-6">Similar Events</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedEvents.map((relatedEvent) => (
                <div
                  key={relatedEvent.id}
                  className={`rounded-xl overflow-hidden border ${
                    theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div className="h-40 overflow-hidden relative">
                    <Image
                      src={relatedEvent.image || "/placeholder.svg"}
                      alt={relatedEvent.title}
                      width={600}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {relatedEvent.date.month} {relatedEvent.date.day}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-2">{relatedEvent.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">{relatedEvent.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <i className="far fa-clock mr-1"></i> {relatedEvent.time}
                      </div>
                      <Link href={`/events/${relatedEvent.id}`} className="text-accent hover:underline text-sm">
                        View Event
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showAuthDialog && <AuthDialog onClose={() => setShowAuthDialog(false)} />}
    </main>
  )
}
