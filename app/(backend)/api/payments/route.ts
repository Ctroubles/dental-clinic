import { NextRequest } from "next/server"
import { getInjection } from "di/container"
import { createSecureContext } from "~/lib/api/middleware"
import { type IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"
import { loadPaymentFilters } from "@/features/payments/helpers/parsers"

export const GET = createSecureContext((req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams

  const rawInput = loadPaymentFilters(searchParams)

  const input: IGetAllPaymentsUseCaseInput = {
    filters: {
      search: rawInput.search,
      patientId: rawInput.patientId,
      doctorId: rawInput.doctorId,
      chargeId: rawInput.chargeId,
      visitId: rawInput.visitId,
      method: rawInput.method,
    },
    page: rawInput.page,
    pageSize: rawInput.pageSize,
  }
  const getAllPaymentsController = getInjection("IGetAllPaymentsController")
  return getAllPaymentsController(input)
})
