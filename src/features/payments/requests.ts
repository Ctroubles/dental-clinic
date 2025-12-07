import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"
import { Payment } from "@/domain/entities/payment"
import { serializePaymentFilters } from "./helpers"


export async function getPayments(rawRequest?: IGetAllPaymentsUseCaseInput) {
  let queryURL: string = ""

  if (rawRequest) {
    const { filters, ...rest } = rawRequest
    queryURL = serializePaymentFilters({ ...rest, ...(filters || {}) })
  }

  const url = queryURL ? `payments${queryURL}` : "payments"

  const response = await apiFetch<PageableResult<Payment>>(url, {
    method: "GET",
  })
  return response
}

export async function getPaymentById(paymentId: string) {
  const response = await apiFetch<Payment>(`/payments/${paymentId}`)
  return response
}

export async function getPaymentsByCharge(chargeId: string) {
  const response = await apiFetch<Payment[]>(`/payments/charge/${chargeId}`)
  return response
}

export async function getPaymentsByInvoice(invoiceId: string) {
  const response = await apiFetch<Payment[]>(`/payments/invoice/${invoiceId}`)
  return response
}
