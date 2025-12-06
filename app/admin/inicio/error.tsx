"use client"

import { IconAlertCircle } from "@tabler/icons-react"
import { Alert, AlertDescription, AlertTitle } from "~/app/_components/ui/alert"

export default function OverviewError({ error }: { error: Error }) {
  return (
    <Alert variant="destructive">
      <IconAlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        Failed to load statistics: {error.message}
      </AlertDescription>
    </Alert>
  )
}
