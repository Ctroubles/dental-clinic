import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"
import { IGetDailyRevenueUseCaseInput } from "@/application/use-cases/analytics/get-daily-revenue.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const getDailyRevenueController = getInjection("IGetDailyRevenueController")

  const fromParam = req.nextUrl.searchParams.get("from")
  const toParam = req.nextUrl.searchParams.get("to")

  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const input: IGetDailyRevenueUseCaseInput = {
    from: fromParam ? new Date(fromParam) : weekAgo,
    to: toParam ? new Date(toParam) : now,
  }

  return getDailyRevenueController(input)
})
