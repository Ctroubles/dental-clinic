import { PaymentMethod } from "@/domain/enums/payment-method.enum"

export interface RegisterChargesForVisitResult {
  patientId: string
  doctorId: string
  visitId: string
  trackedCharges: Array<{
    id: string
    totalPrice: number
    paidAmount: number
    paymentStatus: "paid" | "partiallyPaid" | "unpaid"
  }>
  payments: Array<{
    id: string
    amount: number
    method: PaymentMethod
  }>
}
