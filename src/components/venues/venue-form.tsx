'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Resolver } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { SPORT_TYPES } from '@/lib/constants'
import { useState, useTransition } from 'react'
import type { Venue, Event } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { X, Loader2 } from 'lucide-react'

const venueFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name is too long')
    .regex(/^[a-zA-Z0-9\s\-'&.,()]+$/, 'Name contains invalid characters'),
  address: z
    .string()
    .max(200, 'Address is too long')
    .regex(/^[a-zA-Z0-9\s\-'.,#/]*$/, 'Address contains invalid characters')
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .max(100, 'City is too long')
    .regex(/^[a-zA-Z\s\-'.]*$/, 'City can only contain letters, spaces, hyphens, and apostrophes')
    .optional()
    .or(z.literal('')),
  state: z
    .string()
    .max(50, 'State is too long')
    .regex(/^[a-zA-Z\s\-]*$/, 'State can only contain letters, spaces, and hyphens')
    .optional()
    .or(z.literal('')),
  zip_code: z
    .string()
    .max(10, 'Postal code is too long')
    .regex(/^[a-zA-Z0-9\s\-]*$/, 'Postal code can only contain letters, numbers, spaces, and hyphens')
    .optional()
    .or(z.literal('')),
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .positive('Capacity must be a positive number')
    .max(1000000, 'Capacity seems too large')
    .optional(),
})

type VenueFormValues = z.infer<typeof venueFormSchema>

interface VenueFormProps {
  initialData?: Venue
  onSubmit: (
    data: VenueFormValues & { supported_sports: Array<Event['sport_type']> }
  ) => Promise<void>
  submitLabel?: string
}

export function VenueForm({
  initialData,
  onSubmit,
  submitLabel = 'Create Venue',
}: VenueFormProps) {
  const [isPending, startTransition] = useTransition()
  const [selectedSports, setSelectedSports] = useState<Array<Event['sport_type']>>(
    (initialData?.supported_sports || []) as Array<Event['sport_type']>
  )

  const form = useForm<VenueFormValues>({
    resolver: zodResolver(venueFormSchema) as Resolver<VenueFormValues>,
    defaultValues: {
      name: initialData?.name || '',
      address: initialData?.address || '',
      city: initialData?.city || '',
      state: initialData?.state || '',
      zip_code: initialData?.zip_code || '',
      capacity: initialData?.capacity || undefined,
    },
  })

  const handleSubmit = (values: VenueFormValues) => {
    startTransition(async () => {
      await onSubmit({
        ...values,
        supported_sports: selectedSports as Array<Event['sport_type']>,
      })
    })
  }

  const addSport = (sportValue: string) => {
    if (!selectedSports.includes(sportValue as Event['sport_type'])) {
      setSelectedSports([...selectedSports, sportValue as Event['sport_type']])
    }
  }

  const removeSport = (sportValue: string) => {
    setSelectedSports(selectedSports.filter((s) => s !== sportValue))
  }

  const availableSports = SPORT_TYPES.filter(
    (sport) => !selectedSports.includes(sport.value)
  )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Name *</FormLabel>
              <FormControl>
                <Input placeholder="Stadium name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Maximum capacity"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    field.onChange(value === '' ? undefined : Number(value))
                  }}
                />
              </FormControl>
              <FormDescription>
                Optional: Maximum number of people the venue can hold
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-3">
          <FormLabel>Supported Sports</FormLabel>
          <div className="flex flex-wrap gap-2">
            {selectedSports.length > 0 ? (
              selectedSports.map((sportValue) => {
                const sport = SPORT_TYPES.find((s) => s.value === sportValue)
                return (
                  <Badge key={sportValue} variant="secondary" className="pr-1">
                    {sport?.label}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-auto p-1"
                      onClick={() => removeSport(sportValue)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )
              })
            ) : (
              <p className="text-sm text-muted-foreground">
                No sports selected
              </p>
            )}
          </div>
          {availableSports.length > 0 && (
            <Select onValueChange={addSport}>
              <SelectTrigger>
                <SelectValue placeholder="Add supported sport" />
              </SelectTrigger>
              <SelectContent>
                {availableSports.map((sport) => (
                  <SelectItem key={sport.value} value={sport.value}>
                    {sport.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <FormDescription>
            Select the sports that can be played at this venue
          </FormDescription>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? 'Saving...' : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  )
}