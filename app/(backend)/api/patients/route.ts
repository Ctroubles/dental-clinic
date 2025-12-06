import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { type IGetPatientsUseCaseInput } from "@/application/use-cases/patients/get-patients.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const getPatientsController = getInjection("IGetPatientsController")
  const input: IGetPatientsUseCaseInput = {
    filters: {
      search: req.nextUrl.searchParams.get("search") || undefined,
      gender: req.nextUrl.searchParams.get("gender") as "M" | "F" | undefined,
    },
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 10,
  }
  return getPatientsController(input)
})

export const POST = createSecureContext(
  async (req: NextRequest, context: ApiContext) => {
    const user = context.user
    const data = await req.json()

    const createPatientController = getInjection("ICreatePatientController")
    return createPatientController({ newPatient: data }, user.dbUserId)
  }
)
