// Venue actions
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { safeAction, ActionResult } from './action-helper'
import type { Venue, CreateVenueData, UpdateVenueData } from '@/lib/types'

export async function getVenues(search?: string, sport?: string): Promise<ActionResult<Venue[]>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    let query = supabase
      .from('venues')
      .select('*')
      .eq('user_id', user.id)
      .order('name', { ascending: true })

    if (search) {
      query = query.ilike('name', `%${search}%`)
    }

    if (sport) {
      query = query.contains('supported_sports', [sport])
    }

    const { data, error } = await query

    if (error) throw error

    return data || []
  })
}

export async function getVenueById(id: string): Promise<ActionResult<Venue | null>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('venues')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (error) throw error

    return data
  })
}

export async function createVenue(venueData: CreateVenueData): Promise<ActionResult<{ id: string }>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data: venue, error } = await supabase
      .from('venues')
      .insert({
        name: venueData.name,
        address: venueData.address,
        city: venueData.city,
        state: venueData.state,
        zip_code: venueData.zip_code,
        capacity: venueData.capacity,
        supported_sports: venueData.supported_sports,
        user_id: user.id,
      })
      .select('id')
      .single()

    if (error) throw error

    revalidatePath('/venues')
    revalidatePath('/events/new')
    return { id: venue.id }
  })
}

export async function updateVenue(id: string, venueData: UpdateVenueData): Promise<ActionResult<{ id: string }>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('venues')
      .update({
        name: venueData.name,
        address: venueData.address,
        city: venueData.city,
        state: venueData.state,
        zip_code: venueData.zip_code,
        capacity: venueData.capacity,
        supported_sports: venueData.supported_sports,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/venues')
    revalidatePath('/events/new')
    return { id }
  })
}

export async function deleteVenue(id: string): Promise<ActionResult<{ success: boolean }>> {
  return safeAction(async () => {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    revalidatePath('/venues')
    revalidatePath('/events/new')
    return { success: true }
  })
}