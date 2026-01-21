import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { EventForm } from '@/components/events/event-form'

export default function NewEventPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Button
        asChild
        variant="ghost"
        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
      >
        <Link href="/dashboard">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Create Event</h1>
        <p className="text-zinc-400 mt-1">Add a new sports event to your calendar</p>
      </div>

      {/* Event Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <EventForm />
      </div>
    </div>
  )
}