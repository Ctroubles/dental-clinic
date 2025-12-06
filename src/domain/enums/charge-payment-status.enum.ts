import { z } from "zod"

/**
 * Tracked charge status enum for tracked charges
 */
export const ChargePaymentStatusEnum = z.enum(
  ["paid", "partiallyPaid", "unpaid"],
  {
    errorMap: () => ({
      message: "Tracked charge status must be paid, partiallyPaid, or unpaid",
    }),
  }
)
