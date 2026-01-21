'use client'

import { Check, ChevronsUpDown, Plus, X } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { Venue } from '@/lib/types'
import { getVenues } from '@/lib/actions/venues'
import { useEffect, useState } from 'react'

interface VenueComboboxProps {
  selectedVenueIds: string[]
  onVenuesChange: (venueIds: string[]) => void
}

export function VenueCombobox({
  selectedVenueIds,
  onVenuesChange,
}: VenueComboboxProps) {
  const [open, setOpen] = useState(false)
  const [venues, setVenues] = useState<Venue[]>([])
  const [search, setSearch] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadVenues = async () => {
      setIsLoading(true)
      const result = await getVenues(search)
      if (result.success) {
        setVenues(result.data)
      }
      setIsLoading(false)
    }

    const timeoutId = setTimeout(loadVenues, 300)
    return () => clearTimeout(timeoutId)
  }, [search])

  const selectedVenues = venues.filter((venue) =>
    selectedVenueIds.includes(venue.id)
  )

  const availableVenues = venues.filter(
    (venue) => !selectedVenueIds.includes(venue.id)
  )

  const handleSelect = (venueId: string) => {
    onVenuesChange([...selectedVenueIds, venueId])
    setOpen(false)
  }

  const handleRemove = (venueId: string) => {
    onVenuesChange(selectedVenueIds.filter((id) => id !== venueId))
  }

  return (
    <div className="space-y-3">
      {/* Selected venues as badges */}
      {selectedVenues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedVenues.map((venue) => (
            <span
              key={venue.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm bg-orange-500/20 text-orange-400 border border-orange-500/30"
            >
              {venue.name}
              <button
                type="button"
                onClick={() => handleRemove(venue.id)}
                className="ml-1 hover:text-orange-300"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Combobox trigger */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between bg-zinc-900 border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-white hover:border-zinc-600"
            type="button"
          >
            {selectedVenueIds.length > 0
              ? `${selectedVenueIds.length} venue${selectedVenueIds.length > 1 ? 's' : ''} selected`
              : 'Search and select venues...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-zinc-900 border-zinc-700" align="start">
          <Command shouldFilter={false} className="bg-zinc-900">
            <CommandInput
              placeholder="Type to search venues..."
              value={search}
              onValueChange={setSearch}
              className="border-zinc-700 text-white placeholder:text-zinc-500"
            />
            <CommandList className="max-h-[200px]">
              {isLoading ? (
                <CommandEmpty className="text-zinc-500">Loading venues...</CommandEmpty>
              ) : availableVenues.length === 0 ? (
                <CommandEmpty className="text-zinc-500">
                  {search ? 'No venues found.' : 'No more venues available.'}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {availableVenues.map((venue) => {
                    const address = [venue.city, venue.state]
                      .filter(Boolean)
                      .join(', ')
                    return (
                      <CommandItem
                        key={venue.id}
                        value={venue.id}
                        onSelect={handleSelect}
                        className="text-zinc-300 hover:bg-zinc-800 hover:text-white aria-selected:bg-zinc-800 aria-selected:text-white cursor-pointer"
                      >
                        <Check
                          className={cn(
                            'mr-2 h-4 w-4 text-orange-500',
                            selectedVenueIds.includes(venue.id)
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{venue.name}</span>
                          {address && (
                            <span className="text-xs text-zinc-500">
                              {address}
                            </span>
                          )}
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              )}
            </CommandList>
            <div className="border-t border-zinc-700 p-2">
              <Link
                href="/venues/new"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-orange-400 hover:text-orange-300 hover:bg-zinc-800 rounded-md transition-colors"
              >
                <Plus className="h-4 w-4" />
                Create a stadium
              </Link>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
