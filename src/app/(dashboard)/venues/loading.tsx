import { CardSkeleton } from "@/components/ui/card-skeleton"

export default function VenuesLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton
            key={i}
            contentLines={["full", "2/3", "1/3"]}
            tagCount={3}
            tagWidths={["w-16", "w-20", "w-16"]}
            wrapTags
          />
        ))}
      </div>
    </div>
  )
}
