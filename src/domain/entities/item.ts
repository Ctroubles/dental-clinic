import { z } from "zod"
import { ItemTypeEnum } from "../enums"
import { baseZ } from "./_base"

/**
 * Complete item schema that includes base audit fields
 * Extends the base schema with item-specific fields
 */
export const itemSchema = baseZ.merge(
  z.object({
    code: z
      .string()
      .min(1, "El código del artículo es requerido")
      .max(20, "El código no puede exceder 20 caracteres"),

    name: z
      .string()
      .min(1, "El nombre del artículo es requerido")
      .max(100, "El nombre no puede exceder 100 caracteres"),

    type: ItemTypeEnum,

    defaultPrice: z
      .number()
      .positive("El precio por defecto debe ser un número positivo"),

    isActive: z.boolean().default(true),

    description: z
      .string()
      .max(500, "La descripción no puede exceder 500 caracteres")
      .optional()
      .nullable(),
  })
)

/**
 * Complete item type including all fields from base schema and item input
 * Represents a full item record in the database
 */
export type Item = z.infer<typeof itemSchema>

/**
 * Item input schema for creating and updating items
 * Contains all the fields required for item registration and management
 */
export const itemInsertSchema = itemSchema.pick({
  code: true,
  name: true,
  type: true,
  defaultPrice: true,
  isActive: true,
  description: true,
})

/**
 * Type for item input data when creating or updating an item
 * All fields are required except isActive which defaults to true
 */
export type ItemInsert = z.infer<typeof itemInsertSchema>
