import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"
import { IGetRecentPaymentsUseCaseInput } from "@/application/use-cases/analytics/get-recent-payments.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const getRecentPaymentsController = getInjection(
    "IGetRecentPaymentsController"
  )

  const limitParam = req.nextUrl.searchParams.get("limit")

  const input: IGetRecentPaymentsUseCaseInput = {
    limit: limitParam ? Number(limitParam) : 5,
  }

  return getRecentPaymentsController(input)
})
