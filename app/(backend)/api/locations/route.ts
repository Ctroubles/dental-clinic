import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { IGetLocationsUseCaseInput } from "@/application/use-cases/locations/get-locations.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const getLocationsController = getInjection("IGetLocationsController")
  const input: IGetLocationsUseCaseInput = {
    filters: {
      search: req.nextUrl.searchParams.get("search") || undefined,
    },
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 10,
  }
  return getLocationsController(input)
})

export const POST = createSecureContext(
  async (req: NextRequest, context: ApiContext) => {
    const user = context.user
    const data = await req.json()

    const createLocationController = getInjection("ICreateLocationController")
    return createLocationController({ newLocation: data }, user.dbUserId)
  }
)
