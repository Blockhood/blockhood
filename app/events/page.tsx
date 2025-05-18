"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import EventCard from "@/components/event-card";
import SignInPrompt from "@/components/sign-in";

// Mock data for events
const events = [
  {
    id: 1,
    title: "Web3 Beginners Workshop",
    description:
      "Join us for a hands-on workshop designed to introduce beginners to the world of Web3.",
    image: "/placeholder.svg?height=400&width=600",
    date: {
      day: "15",
      month: "May",
    },
    time: "2:00 PM - 4:00 PM",
    location: "Virtual (Zoom)",
    host: {
      name: "Alex Johnson",
      avatar: "/default_pp.jpg",
    },
  },
  {
    id: 2,
    title: "DeFi Deep Dive",
    description:
      "Explore the world of decentralized finance with experts in the field.",
    image: "/placeholder.svg?height=400&width=600",
    date: {
      day: "22",
      month: "May",
    },
    time: "6:00 PM - 8:00 PM",
    location: "Virtual (Discord)",
    host: {
      name: "Sarah Chen",
      avatar: "/default_pp.jpg",
    },
  },
  {
    id: 3,
    title: "NFT Creation Masterclass",
    description:
      "Learn how to create, mint, and sell your own NFTs in this comprehensive masterclass.",
    image: "/placeholder.svg?height=400&width=600",
    date: {
      day: "29",
      month: "May",
    },
    time: "3:00 PM - 5:30 PM",
    location: "Virtual (Zoom)",
    host: {
      name: "David Wilson",
      avatar: "/default_pp.jpg",
    },
  },
];

export default function EventsPage() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { user } = useAuth();

  return (
    <main>
      <section className="page-header">
        <div className="container">
          <h1>Upcoming Events</h1>
          <p>
            Join our community events to learn, connect, and grow in the Web3
            space
          </p>
        </div>
      </section>

      <section className="guides-container">
        <div className="container">
          <div className="events-grid">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          <div className="host-event-cta">
            {user ? (
              <div className="submit-guide">
                <h3>Want to host your own event?</h3>
                <p>
                  Share your knowledge with the community by hosting a Web3
                  event
                </p>
                <Link href="/events/host" className="cta-button cta-primary">
                  <i className="fas fa-calendar-plus"></i> Host an Event
                </Link>
              </div>
            ) : (
              <SignInPrompt
                title="Want to host your own event?"
                description="Share your knowledge with the community by hosting a Web3 event"
                buttonText="Sign In to Host Events"
                icon="fas fa-calendar-plus"
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
