import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CardSkeletonProps {
  contentLines?: string[]
  tagCount?: number
  tagWidths?: string[]
  wrapTags?: boolean
  footerButtons?: number
}

export function CardSkeleton({
  contentLines = ["full", "2/3"],
  tagCount = 2,
  tagWidths = ["w-16", "w-20"],
  wrapTags = false,
  footerButtons = 2,
}: CardSkeletonProps) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="space-y-2">
        {contentLines.map((width, index) => (
          <Skeleton key={index} className={`h-4 w-${width}`} />
        ))}
        {tagCount > 0 && (
          <div className={`flex gap-2 mt-3 ${wrapTags ? "flex-wrap" : ""}`}>
            {Array.from({ length: tagCount }).map((_, index) => (
              <Skeleton
                key={index}
                className={`h-5 ${tagWidths[index] || tagWidths[tagWidths.length - 1]}`}
              />
            ))}
          </div>
        )}
      </CardContent>
      {footerButtons > 0 && (
        <CardFooter className="flex justify-end gap-2">
          {Array.from({ length: footerButtons }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-16" />
          ))}
        </CardFooter>
      )}
    </Card>
  )
}
