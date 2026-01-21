'use client'

import { MapPin, Users, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SPORT_COLORS, SPORT_TYPES, type SportType } from '@/lib/constants'
import type { Venue } from '@/lib/types'

interface VenueCardProps {
  venue: Venue
  onEdit?: (venue: Venue) => void
  onDelete?: (venue: Venue) => void
}

export function VenueCard({ venue, onEdit, onDelete }: VenueCardProps) {
  const fullAddress = [venue.address, venue.city, venue.state, venue.zip_code]
    .filter(Boolean)
    .join(', ')

  const supportedSports =
    venue.supported_sports
      ?.map((sportValue) => SPORT_TYPES.find((s) => s.value === sportValue))
      .filter(Boolean) || []

  const primarySport = venue.supported_sports?.[0] as SportType | undefined
  const accentColor = primarySport
    ? SPORT_COLORS[primarySport]
    : { bg: 'bg-orange-500', text: 'text-orange-500', glow: 'shadow-orange-500/20' }

  const hasActions = onEdit || onDelete

  return (
    <div
      className={`
        relative overflow-hidden rounded-lg
        bg-zinc-900 border border-zinc-800
        shadow-lg ${accentColor.glow} shadow-md
        transition-all hover:shadow-xl
        flex flex-col
      `}
    >
      {/* LED accent bar */}
      <div className={`h-1 ${accentColor.bg}`} />

      {/* Header */}
      <div className="px-4 py-2 border-b border-zinc-800 bg-zinc-950/50">
        <span
          className={`text-xs font-bold uppercase tracking-wider ${accentColor.text}`}
        >
          Venue
        </span>
      </div>

      {/* Venue name */}
      <div className="px-4 pt-3">
        <h3 className="text-lg font-bold text-white truncate">{venue.name}</h3>
      </div>

      {/* Address */}
      {fullAddress && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{fullAddress}</span>
          </div>
        </div>
      )}

      {/* Capacity */}
      {venue.capacity && (
        <div className="px-4 pb-2">
          <div className="flex items-center gap-1.5 text-zinc-400 text-sm">
            <Users className="w-3.5 h-3.5" />
            <span>Capacity: {venue.capacity.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Supported sports */}
      {supportedSports.length > 0 && (
        <div className="px-4 pb-3">
          <p className="text-xs text-zinc-500 mb-1.5">Supported Sports</p>
          <div className="flex flex-wrap gap-1.5">
            {supportedSports.map((sport) => {
              const sportColor = SPORT_COLORS[sport?.value as SportType]
              return (
                <span
                  key={sport?.value}
                  className={`text-xs px-2 py-0.5 rounded-full bg-zinc-800 ${sportColor?.text || 'text-zinc-400'}`}
                >
                  {sport?.label}
                </span>
              )
            })}
          </div>
        </div>
      )}

      {/* Actions */}
      {hasActions && (
        <div className="px-4 py-3 border-t border-zinc-800 bg-zinc-950/30 flex justify-between mt-auto">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(venue)}
              className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <Pencil className="w-4 h-4 mr-1.5" />
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(venue)}
              className="text-zinc-400 hover:text-red-400 hover:bg-zinc-800"
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              Delete
            </Button>
          )}
        </div>
      )}

      {/* Footer for read-only cards */}
      {!hasActions && (
        <div className="px-4 py-2 border-t border-zinc-800 bg-zinc-950/30 mt-auto">
          <span className="text-xs text-zinc-500">
            Created {new Date(venue.created_at).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  )
}
