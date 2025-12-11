import { Card, CardContent, CardHeader } from "~/app/_components/ui/card"
import { Skeleton } from "~/app/_components/ui/skeleton"

export function OverviewCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="gap-0">
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-1 pb-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-5 w-40 mt-1" />
            <Skeleton className="h-4 w-48 mt-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
