import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { ApiContext, createSecureContext } from "~/lib/api/middleware"
import { type IGetTrackedChargesUseCaseInput } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import {
  ChargePaymentStatus,
  ChargeProgressStatus,
  ItemType,
} from "@/domain/enums"

export const GET = createSecureContext((req: NextRequest) => {
  const getTrackedChargesController = getInjection(
    "IGetTrackedChargesController"
  )
  const input: IGetTrackedChargesUseCaseInput = {
    filters: {
      search: req.nextUrl.searchParams.get("search") || undefined,
      patientId: req.nextUrl.searchParams.get("patientId") || undefined,
      doctorId: req.nextUrl.searchParams.get("doctorId") || undefined,
      itemId: req.nextUrl.searchParams.get("itemId") || undefined,
      type: req.nextUrl.searchParams.get("type") as ItemType | undefined,
      paymentStatus: req.nextUrl.searchParams.get("paymentStatus") as
        | ChargePaymentStatus
        | undefined,
      progressStatus: req.nextUrl.searchParams.get("progressStatus") as
        | ChargeProgressStatus
        | undefined,
    },
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 10,
  }
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
