import { z } from "zod"

/**
 * Item type enum for services and products
 */
export const ItemTypeEnum = z.enum(["service", "product"], {
  errorMap: () => ({
    message: "Item type must be service or product",
  }),
})

/**
 * Item type
 */
export type ItemType = z.infer<typeof ItemTypeEnum>
