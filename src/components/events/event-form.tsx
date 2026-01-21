// Event form component - Create/Edit events
'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { SPORT_TYPES } from '@/lib/constants'
import { createEvent, updateEvent } from '@/lib/actions/events'
import type { EventWithVenues } from '@/lib/types'
import { cn } from '@/lib/utils'
import { VenueCombobox } from '@/components/venues/venue-combobox'

const eventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(100, 'Name is too long'),
  sport_type: z.string().min(1, 'Sport type is required'),
  date: z.date({ required_error: 'Date is required' }),
  time: z.string().min(1, 'Time is required'),
  description: z.string().max(500, 'Description is too long').optional(),
  venue_ids: z.array(z.string()).default([]),
})

type EventFormData = z.infer<typeof eventFormSchema>

interface EventFormProps {
  event?: EventWithVenues
  onSubmit?: (data: Parameters<typeof updateEvent>[1]) => Promise<void>
  submitLabel?: string
}

export function EventForm({ event, onSubmit: onSubmitCallback, submitLabel }: EventFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const isEditing = !!event

  // Parse existing event date/time
  const eventDate = event?.date_time ? new Date(event.date_time) : undefined
  const eventTime = eventDate ? format(eventDate, 'HH:mm') : ''

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      name: event?.name || '',
      sport_type: event?.sport_type || '',
      date: eventDate,
      time: eventTime,
      description: event?.description || '',
      venue_ids: event?.venues?.map((v) => v.id) || [],
    },
  })

  function onSubmit(data: EventFormData) {
    startTransition(async () => {
      // Combine date and time into ISO string
      const dateTime = new Date(data.date)
      const [hours, minutes] = data.time.split(':').map(Number)
      dateTime.setHours(hours, minutes, 0, 0)

      const eventData = {
        name: data.name,
        sport_type: data.sport_type as any,
        date_time: dateTime.toISOString(),
        description: data.description,
        venue_ids: data.venue_ids,
      }

      // If custom onSubmit callback is provided, use it
      if (onSubmitCallback) {
        await onSubmitCallback(eventData)
        return
      }

      // Otherwise, use default behavior (for standalone pages)
      const result = isEditing
        ? await updateEvent(event.id, eventData)
        : await createEvent(eventData)

      if (result.success) {
        toast.success(
          isEditing ? 'Event updated successfully' : 'Event created successfully'
        )
        router.push('/dashboard')
        router.refresh()
      } else {
        toast.error(result.error || 'Something went wrong')
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-300">Event Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Championship Finals"
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sport Type */}
        <FormField
          control={form.control}
          name="sport_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-300">Sport Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue placeholder="Select a sport" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-zinc-900 border-zinc-700">
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Date Picker */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-zinc-300">Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal bg-zinc-900 border-zinc-700 text-white hover:bg-zinc-800 hover:text-white',
                          !field.value && 'text-zinc-500'
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, 'PPP') : 'Pick a date'}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-zinc-900 border-zinc-700"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Input */}
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-zinc-300">Time</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    className="bg-zinc-900 border-zinc-700 text-white [&::-webkit-calendar-picker-indicator]:invert"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-300">
                Description (optional)
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add event details..."
                  className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Venue Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-300">
            Venues (optional)
          </label>
          <VenueCombobox
            selectedVenueIds={form.watch('venue_ids')}
            onVenuesChange={(venueIds) => form.setValue('venue_ids', venueIds)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1 bg-zinc-800 border-zinc-600 text-white hover:bg-zinc-700 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              submitLabel || (isEditing ? 'Update Event' : 'Create Event')
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}