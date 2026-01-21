'use client'

import { format } from 'date-fns'
import { MapPin, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SPORT_COLORS, SPORT_TYPES, type SportType } from '@/lib/constants'
import type { EventWithVenues } from '@/lib/types'

interface EventCardProps {
  event: EventWithVenues
  onEdit: (event: EventWithVenues) => void
  onDelete: () => void
  isDeleting: boolean
}

export function EventCard({ event, onEdit, onDelete, isDeleting }: EventCardProps) {
  const sportColor = SPORT_COLORS[event.sport_type as SportType]
  const sportLabel =
    SPORT_TYPES.find((s) => s.value === event.sport_type)?.label ||
    event.sport_type

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg
        bg-zinc-900 border border-zinc-800
        shadow-lg ${sportColor.glow} shadow-md
        transition-all hover:shadow-xl
        flex flex-col
      `}
    >
      {/* LED accent bar */}
      <div className={`h-1 ${sportColor.bg}`} />

      {/* Sport type header */}
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-950/50">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${sportColor.text}`}
        >
          {sportLabel}
        </span>
      </div>

      {/* Event name */}
      <div className="px-4 pt-3">
        <h3 className="text-lg font-bold text-white truncate">{event.name}</h3>
      </div>

      {/* Date and time */}
      <div className="px-4 py-3">
        <div className="font-mono text-xl text-white tracking-wide">
          {format(new Date(event.date_time), 'MMM dd')}
          <span className="text-zinc-500 mx-2">·</span>
          {format(new Date(event.date_time), 'hh:mm a')}
        </div>
      </div>

      {/* Venue info */}
      {event.venues && event.venues.length > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
            <MapPin className="w-3.5 h-3.5" />
            <span className="truncate">
              {event.venues[0].name}
              {event.venues.length > 1 && (
                <span className="text-zinc-500">
                  {' '}
                  +{event.venues.length - 1} more
                </span>
              )}
            </span>
          </div>
        </div>
      )}

      {/* Description */}
      {event.description && (
        <div className="px-4 pb-3">
          <p className="text-zinc-500 text-sm line-clamp-2">
            {event.description}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-950/30 flex justify-between mt-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(event)}
          className="text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <Pencil className="w-4 h-4 mr-1.5" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          disabled={isDeleting}
          className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
        >
          <Trash2 className="w-4 h-4 mr-1.5" />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </div>
  )
}
