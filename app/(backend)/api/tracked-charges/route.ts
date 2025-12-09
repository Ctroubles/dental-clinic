import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { loadCargoFilters } from "@/features/cargos/helpers"
import { type IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"

export const GET = createSecureContext((req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const rawInput = loadCargoFilters(searchParams)

  const input: IGetTrackedChargesUseCaseInput = {
    filters: {
      search: rawInput.search,
      patientId: rawInput.patientId,
      doctorId: rawInput.doctorId,
      itemId: rawInput.itemId,
      type: rawInput.type,
      paymentStatus: rawInput.paymentStatus,
      progressStatus: rawInput.progressStatus,
    },
    page: rawInput.page,
    pageSize: rawInput.pageSize,
  }

  const getTrackedChargesController = getInjection(
    "IGetTrackedChargesController"
  )
  return getTrackedChargesController(input)
})

export const POST = createSecureContext(
  async (req: NextRequest, context: ApiContext) => {
    const user = context.user
    const data = await req.json()

    const createTrackedChargeController = getInjection(
      "ICreateTrackedChargeController"
    )
    return createTrackedChargeController(
      { newTrackedCharge: data },
      user.dbUserId
    )
  }
)
