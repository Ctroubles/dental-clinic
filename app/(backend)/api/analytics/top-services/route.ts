import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext((req: NextRequest) => {
  const getTopServicesController = getInjection("IGetTopServicesController")

  const from = req.nextUrl.searchParams.get("from")
  const to = req.nextUrl.searchParams.get("to")
  const limitParam = req.nextUrl.searchParams.get("limit")

  return getTopServicesController({
    dateRange: {
      from: from ? new Date(from) : new Date(),
      to: to ? new Date(to) : new Date(),
    },
    limit: limitParam ? Number(limitParam) : 5,
  })
})
