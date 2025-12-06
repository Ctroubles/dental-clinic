import { z } from "zod"

/**
 * Payment method enum for sales transactions
 */
export const PaymentMethodEnum = z.enum(
  ["cash", "yape", "plin", "card", "transfer"],
  {
    errorMap: () => ({
      message: "Payment method must be cash, yape, plin, card, or transfer",
    }),
  }
)

/**
 * Payment method type
 */
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>
