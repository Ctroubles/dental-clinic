import { IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"

export const paymentQueryKeys = {
  base: ["payments"] as const,
  baseList: () => [...paymentQueryKeys.base, "list"] as const,
  list: (request: IGetAllPaymentsUseCaseInput) => {
    return [...paymentQueryKeys.baseList(), request] as const
  },
  detail: (id: string) => [...paymentQueryKeys.base, "detail", id] as const,
  byCharge: (chargeId: string) =>
    [...paymentQueryKeys.base, "byCharge", chargeId] as const,
  byInvoice: (invoiceId: string) =>
    [...paymentQueryKeys.base, "byInvoice", invoiceId] as const,
}
