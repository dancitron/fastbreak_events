import { EventCard } from '@/components/events/event-card'
import type { EventWithVenues } from '@/lib/types'

interface EventListProps {
  events: EventWithVenues[]
  onEdit: (event: EventWithVenues) => void
  onDelete: (event: EventWithVenues) => void
  deletingEventId?: string
}

export function EventList({ events, onEdit, onDelete, deletingEventId }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
          <span className="text-3xl">🏆</span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No events yet</h3>
        <p className="text-zinc-400">Create your first event to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onEdit={onEdit}
          onDelete={() => onDelete(event)}
          isDeleting={deletingEventId === event.id}
        />
      ))}
    </div>
  )
}
