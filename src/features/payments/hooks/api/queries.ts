import { makeQuery } from "~/lib/api/queryFactory"
import { IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"
import { paymentQueryKeys } from "../../constants"
import {
  getPaymentById,
  getPayments,
  getPaymentsByCharge,
  getPaymentsByInvoice,
} from "../../requests"

export const { useHook: useGetPayments } = makeQuery(
  (request: IGetAllPaymentsUseCaseInput) => ({
    queryFn: () => getPayments(request),
    queryKey: paymentQueryKeys.list(request),
  })
)

export const { useHook: useGetPaymentById } = makeQuery(
  (paymentId: string) => ({
    queryFn: () => getPaymentById(paymentId),
    queryKey: paymentQueryKeys.detail(paymentId),
  })
)

export const { useHook: useGetPaymentsByCharge } = makeQuery(
  (chargeId: string) => ({
    queryFn: () => getPaymentsByCharge(chargeId),
    queryKey: paymentQueryKeys.byCharge(chargeId),
  })
)

export const { useHook: useGetPaymentsByInvoice } = makeQuery(
  (invoiceId: string) => ({
    queryFn: () => getPaymentsByInvoice(invoiceId),
    queryKey: paymentQueryKeys.byInvoice(invoiceId),
  })
)
