import Image from "next/image"
import Link from "next/link"

type EventCardProps = {
  event: {
    id: number | string
    title: string
    description: string
    image: string
    date: {
      day: string
      month: string
    }
    time: string
    location: string
    host: {
      name: string
      avatar: string
    }
  }
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="event-card">
      <div className="event-image">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} width={600} height={400} />
        <div className="event-date-badge">
          <span className="event-date-day">{event.date.day}</span>
          <span className="event-date-month">{event.date.month}</span>
        </div>
      </div>
      <div className="event-content">
        <h3 className="event-title">{event.title}</h3>
        <div className="event-details">
          <div className="event-detail">
            <i className="fas fa-clock"></i>
            <span>{event.time}</span>
          </div>
          <div className="event-detail">
            <i className="fas fa-map-marker-alt"></i>
            <span>{event.location}</span>
          </div>
        </div>
        <p className="event-description">{event.description}</p>
        <div className="event-footer">
          <div className="event-host">
            <div className="event-host-avatar">
              <Image src={event.host.avatar || "/placeholder.svg"} alt={event.host.name} width={35} height={35} />
            </div>
            <span className="event-host-name">Hosted by {event.host.name}</span>
          </div>
          <Link href={`/events/${event.id}`} className="cta-button cta-secondary">
            Details
          </Link>
        </div>
      </div>
    </div>
  )
}
