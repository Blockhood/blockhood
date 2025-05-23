"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import EventCard from "@/components/event-card";
import SignInPrompt from "@/components/sign-in";
import { getAll } from "@/lib/crud";

export default function EventsPage() {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const user = localStorage.getItem("id") || "";
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const fetchedEvents = await getAll<any>(
          "events",
          "*, user:users!events_user_id_fkey(id, full_name)"
        );
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
            {!loading &&
              events.map((event: any) => (
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
                <Link href="/events/create" className="cta-button cta-primary">
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
