import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"
import { IGetTopServicesUseCaseInput } from "@/application/use-cases/analytics/get-top-services.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const getTopServicesController = getInjection("IGetTopServicesController")

  const limitParam = req.nextUrl.searchParams.get("limit")

  const input: IGetTopServicesUseCaseInput = {
    limit: limitParam ? Number(limitParam) : 5,
  }

  return getTopServicesController(input)
})
