'use client'

import { useRouter } from 'next/navigation'
import { VenueForm } from '@/components/venues/venue-form'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createVenue } from '@/lib/actions/venues'
import { toast } from 'sonner'

export default function NewVenuePage() {
  const router = useRouter()

  const handleSubmit = async (data: Parameters<typeof createVenue>[0]) => {
    // Filter out empty string values for optional fields
    const cleanedData = {
      ...data,
      address: data.address || undefined,
      city: data.city || undefined,
      state: data.state || undefined,
      zip_code: data.zip_code || undefined,
      capacity: typeof data.capacity === 'number' ? data.capacity : undefined,
    }

    const result = await createVenue(cleanedData)

    if (result.success) {
      toast.success('Venue created successfully')
      router.push('/venues')
    } else {
      toast.error(result.error)
      throw new Error(result.error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back button */}
      <Button
        asChild
        variant="ghost"
        className="text-zinc-400 hover:text-white hover:bg-zinc-800"
      >
        <Link href="/venues">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Venues
        </Link>
      </Button>

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Create Venue</h1>
        <p className="text-zinc-400 mt-1">Add a new venue where events can be held</p>
      </div>

      {/* Venue Form */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
        <VenueForm onSubmit={handleSubmit} submitLabel="Create Venue" />
      </div>
    </div>
  )
}