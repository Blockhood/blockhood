"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import AuthDialog from "@/components/auth-dialog";
import { useTheme } from "next-themes";
import Loading from "@/app/loading";
import { getBySlug } from "@/lib/crud";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function EventPage() {
  const params = useParams();
  const rawId = params?.id;
  const slug: string = Array.isArray(rawId) ? rawId[0] : rawId || "";
  const router = useRouter();
  const user = localStorage.getItem("id") || "";
  const [event, setEvent] = useState<any>(null);
  const [relatedEvents, setRelatedEvents] = useState<any[]>([]);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setIsLoading(true);

        const fetchedEvent = await getBySlug<any>(
          "events",
          slug,
          `
            *,
            user:users!events_user_id_fkey(id, full_name),
            event_tags(
              tag:tags(id, name)
            )
          `
        );

        setEvent(fetchedEvent);
      } catch (error) {
        console.error("Failed to fetch event:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  console.log("event: ", event);

  const handleRegister = () => {
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setIsRegistered(!isRegistered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!event) return null;

  return (
    <main>
      <div className="bg-gradient-to-b from-darker to-dark pt-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/events"
              className="text-accent hover:underline flex items-center"
            >
              <i className="fas fa-arrow-left mr-2"></i> Back to Events
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {event?.title}
            </h1>

            <div className="flex flex-wrap items-center text-sm text-gray-400 gap-4 mb-6">
              <div className="flex items-center">
                <i className="far fa-calendar mr-2"></i>
                <span>{formatDate(event?.start_time)}</span>
              </div>
              <div className="flex items-center">
                <i className="far fa-clock mr-2"></i>
                <span>
                  {formatTime(event?.start_time)} -{" "}
                  {formatTime(event?.end_time)}
                </span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-map-marker-alt mr-2"></i>
                <span>
                  {event?.location} ({event?.platform})
                </span>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full overflow-hidden mr-3 bg-gray-600 flex items-center justify-center">
                <span className="text-white font-medium">
                  {event?.user?.full_name?.charAt(0) || "U"}
                </span>
              </div>
              <div>
                <div className="font-medium">
                  Hosted by {event?.user?.full_name || "Unknown"}
                </div>
                <div className="text-sm text-gray-400">Event Organizer</div>
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
                src={event?.image_url || "/placeholder.svg"}
                alt={event?.title || "Event image"}
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-bold mb-4">About This Event</h3>
              <div
                className={`event-description prose ${
                  theme === "light" ? "prose-gray" : "prose-invert"
                } max-w-none`}
              >
                <div className="prose dark:prose-invert text-xl">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {event?.description.replace(/\\n/g, "\n")}
                  </ReactMarkdown>
                </div>
                {event?.summary && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                      Summary: {event.summary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {event?.event_tags && event.event_tags.length > 0 && (
              <div className="border-t border-b py-6 mb-10 flex flex-wrap gap-2">
                {event.event_tags.map((eventTag: any, index: number) => (
                  <span
                    key={eventTag.tag?.id || index}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === "light"
                        ? "bg-gray-200 text-gray-800"
                        : "bg-gray-800 text-gray-200"
                    }`}
                  >
                    #{eventTag.tag?.name}
                  </span>
                ))}
              </div>
            )}

            <div
              className={`rounded-xl p-6 ${
                theme === "light" ? "bg-gray-100" : "bg-gray-800"
              }`}
            >
              <h3 className="text-xl font-bold mb-4">Have Questions?</h3>
              {user ? (
                <div>
                  <textarea
                    placeholder="Ask the organizer a question about this event..."
                    className={`w-full p-4 rounded-lg border mb-4 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-800"
                        : "bg-gray-700 border-gray-600 text-gray-100"
                    }`}
                    rows={4}
                  ></textarea>
                  <button className="cta-button cta-primary">
                    Send Question
                  </button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="mb-4">
                    Sign in to ask questions about this event
                  </p>
                  <button
                    onClick={() => setShowAuthDialog(true)}
                    className="cta-button cta-primary"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div
              className={`sticky top-24 rounded-xl border p-6 ${
                theme === "light"
                  ? "bg-white border-gray-200 shadow-sm"
                  : "bg-gray-800 border-gray-700"
              }`}
            >
              <div className="mb-6">
                <div className="text-2xl font-bold mb-1">Free</div>
                <div
                  className={`text-sm ${
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }`}
                >
                  {event?.attendees_count || 0} registered
                  {event?.capacity &&
                    ` · ${
                      event.capacity - (event?.attendees_count || 0)
                    } spots left`}
                </div>
                {event?.capacity && (
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${
                          ((event?.attendees_count || 0) / event.capacity) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>

              <button
                onClick={handleRegister}
                className={`w-full py-3 px-4 rounded-lg font-medium mb-4 ${
                  isRegistered
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-primary hover:bg-hover text-white"
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
                    <div className="text-sm text-gray-500">
                      {formatDate(event?.start_time)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatTime(event?.start_time)} -{" "}
                      {formatTime(event?.end_time)}
                    </div>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-5 mt-1 mr-3 text-gray-400">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-sm text-gray-500">
                      {event?.location}
                    </div>
                    <div className="text-sm text-gray-500">
                      Platform: {event?.platform}
                    </div>
                    {isRegistered && (
                      <div className="mt-2">
                        <a
                          href="#"
                          className="text-accent hover:underline text-sm"
                        >
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
                    <div className="text-sm text-gray-500">
                      {event?.user?.full_name || "Unknown"}
                    </div>
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
                    theme === "light"
                      ? "bg-white border-gray-200"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div className="h-40 overflow-hidden relative">
                    <Image
                      src={relatedEvent.image_url || "/placeholder.svg"}
                      alt={relatedEvent.title}
                      width={600}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-lg text-sm font-medium">
                      {formatDate(relatedEvent.start_time)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold mb-2">{relatedEvent.title}</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      {relatedEvent.summary || relatedEvent.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="text-sm">
                        <i className="far fa-clock mr-1"></i>{" "}
                        {formatTime(relatedEvent.start_time)}
                      </div>
                      <Link
                        href={`/events/${relatedEvent.slug}`}
                        className="text-accent hover:underline text-sm"
                      >
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

      {showAuthDialog && (
        <AuthDialog onClose={() => setShowAuthDialog(false)} />
      )}
    </main>
  );
}
