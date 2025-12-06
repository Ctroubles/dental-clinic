import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"
import { type IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"
import { PaymentMethod } from "@/domain/enums"

export const GET = createSecureContext((req: NextRequest) => {
  const input: IGetAllPaymentsUseCaseInput = {
    filters: {
      search: req.nextUrl.searchParams.get("search") || undefined,
      patientId: req.nextUrl.searchParams.get("patientId") || undefined,
      doctorId: req.nextUrl.searchParams.get("doctorId") || undefined,
      chargeId: req.nextUrl.searchParams.get("chargeId") || undefined,
      visitId: req.nextUrl.searchParams.get("visitId") || undefined,
      method: req.nextUrl.searchParams.get("method") as
        | PaymentMethod
        | undefined,
    },
    page: Number(req.nextUrl.searchParams.get("page")) || 1,
    pageSize: Number(req.nextUrl.searchParams.get("pageSize")) || 10,
  }
  const getAllPaymentsController = getInjection("IGetAllPaymentsController")
  return getAllPaymentsController(input)
})
