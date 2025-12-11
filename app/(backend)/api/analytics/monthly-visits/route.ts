import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"
import { IGetMonthlyVisitsUseCaseInput } from "@/application/use-cases/analytics/get-monthly-visits.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const getMonthlyVisitsController = getInjection("IGetMonthlyVisitsController")

  const monthsParam = req.nextUrl.searchParams.get("months")

  const input: IGetMonthlyVisitsUseCaseInput = {
    months: monthsParam ? Number(monthsParam) : 6,
  }

  return getMonthlyVisitsController(input)
})
