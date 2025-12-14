import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"

export const GET = createSecureContext((req: NextRequest) => {
  const getDailyRevenueController = getInjection("IGetDailyRevenueController")

  const from = req.nextUrl.searchParams.get("from")
  const to = req.nextUrl.searchParams.get("to")

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  return getDailyRevenueController({
    dateRange: {
      from: from ? new Date(from) : weekAgo,
      to: to ? new Date(to) : now,
    },
  })
})
