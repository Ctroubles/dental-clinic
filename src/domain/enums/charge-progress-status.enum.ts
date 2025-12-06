import { z } from "zod"

/**
 * Tracked charge progress status enum for tracked charges
 */
export const ChargeProgressStatusEnum = z.enum(
  ["inProgress", "completed", "cancelled"],
  {
    errorMap: () => ({
      message:
        "Tracked charge progress status must be inProgress, completed or cancelled",
    }),
  }
)

/**
 * Tracked charge progress status type
 */
export type ChargeProgressStatus = z.infer<typeof ChargeProgressStatusEnum>
