import { getVenues } from '@/lib/actions/venues'
import { VenuesClient } from '@/components/venues/venues-client'

interface VenuesPageProps {
  searchParams: Promise<{ search?: string; sport?: string }>
}

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const params = await searchParams
  const search = params.search
  const sport = params.sport

  const result = await getVenues(search, sport)

  if (!result.success) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Venues</h1>
        </div>
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            Error loading venues: {result.error}
          </p>
        </div>
      </div>
    )
  }

  return <VenuesClient initialVenues={result.data} initialSearch={search} />
}