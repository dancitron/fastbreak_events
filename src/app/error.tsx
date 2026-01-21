"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body>
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Oops! Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error has occurred.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {error.message || "Please try refreshing the page or contact support if the problem persists."}
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={reset}>Try again</Button>
            </CardFooter>
          </Card>
        </div>
      </body>
    </html>
  )
}
