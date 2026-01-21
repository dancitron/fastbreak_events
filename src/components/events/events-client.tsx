'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { EventList } from '@/components/events/event-list'
import { EventForm } from '@/components/events/event-form'
import { deleteEvent, updateEvent } from '@/lib/actions/events'
import type { EventWithVenues } from '@/lib/types'
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
import { toast } from 'sonner'

interface EventsClientProps {
  initialEvents: EventWithVenues[]
}

export function EventsClient({ initialEvents }: EventsClientProps) {
  const router = useRouter()
  const [editingEvent, setEditingEvent] = useState<EventWithVenues | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<EventWithVenues | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = (event: EventWithVenues) => {
    setEditingEvent(event)
  }

  const handleEditSubmit = async (
    data: Parameters<typeof updateEvent>[1]
  ) => {
    if (!editingEvent) return

    const result = await updateEvent(editingEvent.id, data)

    if (result.success) {
      toast.success('Event updated successfully')
      setEditingEvent(null)
      router.refresh()
    } else {
      toast.error(result.error)
    }
  }

  const handleDelete = (event: EventWithVenues) => {
    setDeletingEvent(event)
  }

  const confirmDelete = async () => {
    if (!deletingEvent) return

    setIsDeleting(true)
    const result = await deleteEvent(deletingEvent.id)

    if (result.success) {
      toast.success('Event deleted successfully')
      setDeletingEvent(null)
      router.refresh()
    } else {
      toast.error(result.error)
    }
    setIsDeleting(false)
  }

  return (
    <>
      <EventList
        events={initialEvents}
        onEdit={handleEdit}
        onDelete={handleDelete}
        deletingEventId={deletingEvent?.id}
      />

      {/* Edit Dialog */}
      <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Event</DialogTitle>
            <DialogDescription>
              Update the event information below.
            </DialogDescription>
          </DialogHeader>
          {editingEvent && (
            <EventForm
              event={editingEvent}
              onSubmit={handleEditSubmit}
              submitLabel="Update Event"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingEvent}
        onOpenChange={() => setDeletingEvent(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the event &ldquo;
              {deletingEvent?.name}&rdquo;. This action cannot be undone.
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
