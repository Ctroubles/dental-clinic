import { ChargePaymentStatus } from "@/domain/enums"

export const calculateChargePaymentStatus = (
  paidAmount: number,
  totalPrice: number
): ChargePaymentStatus => {
  if (paidAmount >= totalPrice) return "paid"
  if (paidAmount > 0) return "partiallyPaid"

  return "unpaid"
}
