// Event actions
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { safeAction, ActionResult } from './action-helper'
import type { EventWithVenues, CreateEventData, UpdateEventData } from '@/lib/types'
import type { Database } from '@/lib/types/database'

type SportType = Database['public']['Enums']['sport_type']

export async function getEvents(search?: string, sportType?: string): Promise<ActionResult<EventWithVenues[]>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    let query = supabase
      .from('events')
      .select(`
        *,
        event_venues (
          venue_id,
          venues (*)
        )
      `)
      .eq('user_id', user.id)
      .order('date_time', { ascending: true })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (sportType && sportType !== 'all') {
      query = query.eq('sport_type', sportType as SportType)
    }

    const { data, error } = await query

    if (error) throw error

    // Transform the data to match EventWithVenues type
    const events = (data ?? []).map((event) => ({
      ...event,
      venues: event.event_venues?.map((ev) => ev.venues).filter(Boolean) || [],
    }))

    return events
  })
}

export async function getEventById(id: string): Promise<ActionResult<EventWithVenues | null>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('events')
      .select(`
        *,
        event_venues (
          venue_id,
          venues (*)
        )
      `)
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    if (!data) return null

    return {
      ...data,
      venues: data.event_venues?.map((ev) => ev.venues).filter(Boolean) || [],
    }
  })
}

export async function createEvent(data: CreateEventData): Promise<ActionResult<{ id: string }>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Create the event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        name: data.name,
        sport_type: data.sport_type,
        date_time: data.date_time,
        description: data.description,
        user_id: user.id,
      })
      .select('id')
      .single()

    if (eventError) throw eventError

    // Create venue associations
    if (data.venue_ids && data.venue_ids.length > 0) {
      const eventVenues = data.venue_ids.map((venue_id) => ({
        event_id: event.id,
        venue_id,
      }))

      const { error: venueError } = await supabase
        .from('event_venues')
        .insert(eventVenues)

      if (venueError) throw venueError
    }

    revalidatePath('/dashboard')
    return { id: event.id }
  })
}

export async function updateEvent(id: string, data: UpdateEventData): Promise<ActionResult<{ id: string }>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Update the event
    const { error: eventError } = await supabase
      .from('events')
      .update({
        name: data.name,
        sport_type: data.sport_type,
        date_time: data.date_time,
        description: data.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (eventError) throw eventError

    // Update venue associations if provided
    if (data.venue_ids !== undefined) {
      // Delete existing associations
      await supabase
        .from('event_venues')
        .delete()
        .eq('event_id', id)

      // Create new associations
      if (data.venue_ids.length > 0) {
        const eventVenues = data.venue_ids.map((venue_id) => ({
          event_id: id,
          venue_id,
        }))

        const { error: venueError } = await supabase
          .from('event_venues')
          .insert(eventVenues)

        if (venueError) throw venueError
      }
    }

    revalidatePath('/dashboard')
    revalidatePath(`/events/${id}/edit`)
    return { id }
  })
}

export async function deleteEvent(id: string): Promise<ActionResult<{ success: boolean }>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/dashboard')
    return { success: true }
  })
}
