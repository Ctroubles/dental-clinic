import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"
import { type IGetVisitsUseCaseInput } from "@/application/use-cases/visits/get-visits.use-case"

export const GET = createSecureContext(req => {
  const getVisitsController = getInjection("IGetVisitsController")
  const input: IGetVisitsUseCaseInput = {
    filters: {
      search: req.nextUrl.searchParams.get("search") || undefined,
      patientId: req.nextUrl.searchParams.get("patientId") || undefined,
      doctorId: req.nextUrl.searchParams.get("doctorId") || undefined,
    },
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 10,
  }
  return getVisitsController(input)
})

export const POST = createSecureContext(async (req, context) => {
  const user = context.user
  const data = await req.json()

  const createVisitController = getInjection("ICreateVisitController")
  return createVisitController({ newVisit: data }, user.dbUserId)
})
