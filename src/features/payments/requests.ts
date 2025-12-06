import { apiFetch } from "~/lib/api/apiFetch"
import { PageableResult } from "@/application/common/pagination"
import { type IGetAllPaymentsUseCaseInput } from "@/application/use-cases/payments/get-all-payments.use-case"
import { Payment } from "@/domain/entities/payment"

export async function getPayments(request?: IGetAllPaymentsUseCaseInput) {
  const searchParams = new URLSearchParams()

  if (request?.filters?.search) {
    searchParams.set("search", request.filters.search)
  }
  if (request?.filters?.patientId) {
    searchParams.set("patientId", request.filters.patientId)
  }
  if (request?.filters?.doctorId) {
    searchParams.set("doctorId", request.filters.doctorId)
  }
  if (request?.filters?.chargeId) {
    searchParams.set("chargeId", request.filters.chargeId)
  }
  if (request?.filters?.visitId) {
    searchParams.set("visitId", request.filters.visitId)
  }
  if (request?.filters?.method) {
    searchParams.set("method", request.filters.method)
  }

  if (request?.page) {
    searchParams.set("page", request.page.toString())
  }

  if (request?.pageSize) {
    searchParams.set("pageSize", request.pageSize.toString())
  }

  const queryString = searchParams.toString()
  const url = queryString ? `payments?${queryString}` : "payments"

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
