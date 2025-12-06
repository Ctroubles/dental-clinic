import { NextRequest } from "next/server"
import { getInjection } from "~/di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { type IGetDoctorsUseCaseInput } from "@/application/use-cases/doctors/get-doctors.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const getDoctorsController = getInjection("IGetDoctorsController")
  const input: IGetDoctorsUseCaseInput = {
    filters: {
      search: req.nextUrl.searchParams.get("search") || undefined,
      gender: req.nextUrl.searchParams.get("gender") as "M" | "F" | undefined,
    },
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 10,
  }
  return getDoctorsController(input)
})

export const POST = createSecureContext(
  async (req: NextRequest, context: ApiContext) => {
    const user = context.user
    const data = await req.json()

    const createDoctorController = getInjection("ICreateDoctorController")
    return createDoctorController({ newDoctor: data }, user.dbUserId)
  }
)
