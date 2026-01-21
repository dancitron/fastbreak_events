// Type exports

/**
 * Application-level types
 * Extends database types with application-specific types
 */

import { Tables } from './database'

// Database row types
export type Event = Tables<'events'>
export type Venue = Tables<'venues'>
export type EventVenue = Tables<'event_venues'>

// Extended types with relations
export type EventWithVenues = Event & {
  venues: Venue[]
}

export type VenueWithEvents = Venue & {
  events: Event[]
}

// Form types
export type CreateEventData = {
  name: string
  sport_type: Event['sport_type']
  date_time: string
  description?: string
  venue_ids: string[]
}

export type UpdateEventData = Partial<CreateEventData>

export type CreateVenueData = {
  name: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  capacity?: number
  supported_sports?: Array<Event['sport_type']>
}

export type UpdateVenueData = Partial<CreateVenueData>
