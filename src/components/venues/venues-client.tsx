'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { VenueCard } from '@/components/venues/venue-card'
import { VenueForm } from '@/components/venues/venue-form'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/ui/search-bar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Venue } from '@/lib/types'
import { updateVenue, deleteVenue } from '@/lib/actions/venues'
import { toast } from 'sonner'
import { SPORT_TYPES } from '@/lib/constants'

interface VenuesClientProps {
  initialVenues: Venue[]
  initialSearch?: string
}

export function VenuesClient({
  initialVenues,
  initialSearch,
}: VenuesClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [editingVenue, setEditingVenue] = useState<Venue | null>(null)
  const [deletingVenue, setDeletingVenue] = useState<Venue | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const currentSport = searchParams.get('sport') || 'all'

  function updateSportFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('sport', value)
    } else {
      params.delete('sport')
    }
    startTransition(() => {
      router.push(`/venues?${params.toString()}`)
    })
  }

  const handleEdit = (venue: Venue) => {
    setEditingVenue(venue)
  }

  const handleEditSubmit = async (
    data: Parameters<typeof updateVenue>[1]
  ) => {
    if (!editingVenue) return

    const result = await updateVenue(editingVenue.id, data)

    if (result.success) {
      toast.success('Venue updated successfully')
      setEditingVenue(null)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = (venue: Venue) => {
    setDeletingVenue(venue)
  }

  const confirmDelete = async () => {
    if (!deletingVenue) return

    setIsDeleting(true)
    const result = await deleteVenue(deletingVenue.id)

    if (result.success) {
      toast.success('Venue deleted successfully')
      setDeletingVenue(null)
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsDeleting(false)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Venues</h1>
            <p className="text-zinc-400 mt-1">Manage your event venues</p>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25">
            <Link href="/venues/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Venue
            </Link>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar
            placeholder="Search venues..."
            basePath="/venues"
          />

          {/* Sport filter */}
          <Select
            value={currentSport}
            onValueChange={updateSportFilter}
          >
            <SelectTrigger className="w-full sm:w-48 bg-zinc-900 border-zinc-700 text-white">
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-700">
              <SelectItem value="all" className="text-white focus:bg-zinc-800 focus:text-white">
                All Sports
              </SelectItem>
              {SPORT_TYPES.map((sport) => (
                <SelectItem
                  key={sport.value}
                  value={sport.value}
                  className="text-white focus:bg-zinc-800 focus:text-white"
                >
                  {sport.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Loading indicator */}
          {isPending && (
            <div className="flex items-center text-zinc-500 text-sm">
              Loading...
            </div>
          )}
        </div>

        {initialVenues.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
              <span className="text-3xl">🏟️</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No venues found</h3>
            <p className="text-zinc-400">
              {initialSearch
                ? 'Try adjusting your search terms.'
                : 'Create your first venue to get started!'}
            </p>
            {!initialSearch && (
              <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25">
                <Link href="/venues/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Venue
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingVenue} onOpenChange={() => setEditingVenue(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Venue</DialogTitle>
            <DialogDescription>
              Update the venue information below.
            </DialogDescription>
          </DialogHeader>
          {editingVenue && (
            <VenueForm
              initialData={editingVenue}
              onSubmit={handleEditSubmit}
              submitLabel="Update Venue"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingVenue}
        onOpenChange={() => setDeletingVenue(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the venue &ldquo;
              {deletingVenue?.name}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}