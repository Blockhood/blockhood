import Image from "next/image";
import Link from "next/link";

type EventCardProps = {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    summary: string;
    start_time: string;
    end_time: string;
    location: string;
    image_url: string | null;
    user: {
      id: string;
      full_name: string;
    };
  };
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("default", { month: "short" });
  return { day, month };
}

function formatTime(start: string, end: string) {
  const startTime = new Date(start).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(end).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${startTime} - ${endTime}`;
}

export default function EventCard({ event }: EventCardProps) {
  const { day, month } = formatDate(event.start_time);
  const timeRange = formatTime(event.start_time, event.end_time);

  return (
    <div className="event-card">
      <div className="event-image overflow-hidden">
        <Image
          src={event.image_url || "/placeholder.svg"}
          alt={event.title}
          width={600}
          height={400}
          className="w-full h-full object-cover"
        />
        <div className="event-date-badge">
          <span className="event-date-day">{day}</span>
          <span className="event-date-month">{month}</span>
        </div>
      </div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <div className="event-detail">
            <i className="fas fa-clock"></i>
            <span>{timeRange}</span>
          </div>
          <div className="event-detail">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.location}</span>
          </div>
        </div>
        <p className="event-description">{event.summary}</p>
        <div className="event-footer">
          <div className="event-host">
            <div className="event-host-avatar">
              <Image
                src="/default_pp.jpg"
                alt={event.user.full_name}
                width={35}
                height={35}
              />
            </div>
            <span className="event-host-name">
              Hosted by {event.user.full_name}
            </span>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="cta-button cta-secondary"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
