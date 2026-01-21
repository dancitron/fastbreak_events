// Event filters component - Search and sport filter
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { SearchBar } from '@/components/ui/search-bar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SPORT_TYPES } from '@/lib/constants'

export function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSport = searchParams.get('sport') || 'all'

  function updateSportFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') {
      params.set('sport', value)
    } else {
      params.delete('sport')
    }
    startTransition(() => {
      router.push(`/dashboard?${params.toString()}`)
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Search input */}
      <SearchBar
        placeholder="Search events..."
        basePath="/dashboard"
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
  )
}
