'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface SearchBarProps {
  placeholder?: string
  basePath: string
  searchParamKey?: string
  className?: string
}

export function SearchBar({
  placeholder = 'Search...',
  basePath,
  searchParamKey = 'search',
  className = ''
}: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSearch = searchParams.get(searchParamKey) || ''

  function handleSearchChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value.trim() !== '') {
      params.set(searchParamKey, value)
    } else {
      params.delete(searchParamKey)
    }

    const queryString = params.toString()
    const url = queryString ? `${basePath}?${queryString}` : basePath

    startTransition(() => {
      router.push(url)
    })
  }

  return (
    <div className={`relative flex-1 ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
      <Input
        type="search"
        placeholder={placeholder}
        defaultValue={currentSearch}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="pl-10 bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
      />
      {isPending && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">
          Loading...
        </div>
      )}
    </div>
  )
}
