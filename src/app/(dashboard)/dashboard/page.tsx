import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EventsClient } from '@/components/events/events-client'
import { EventFilters } from '@/components/events/event-filters'
import { getEvents } from '@/lib/actions/events'

interface DashboardPageProps {
  searchParams: Promise<{ search?: string; sport?: string }>
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams
  const result = await getEvents(params.search, params.sport)
  const events = result.success ? result.data : []

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 mt-1">Manage your sports events</p>
        </div>
        <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25">
          <Link href="/events/new">
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <EventFilters />

      {/* Event list */}
      <EventsClient initialEvents={events} />
    </div>
  )
}
