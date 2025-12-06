import { z } from "zod"
import {
  ChargePaymentStatusEnum,
  ChargeProgressStatusEnum,
  ItemTypeEnum,
} from "../enums"
import { baseZ, mongoObjectId } from "./_base"
import type { Doctor } from "./doctor"
import type { Item } from "./item"
import type { Patient } from "./patient"
import { Visit } from "./visit"

/**
 * Complete tracked charges schema that includes base audit fields
 * Extends the base schema with tracked charges-specific fields
 */
export const trackedChargeSchema = baseZ.merge(
  z.object({
    patientId: mongoObjectId,

    doctorId: mongoObjectId,

    itemId: mongoObjectId,

    visitIds: mongoObjectId.array(),

    type: ItemTypeEnum,

    description: z.string().min(1, "La descripción del cargo es requerida"),

    totalPrice: z.number().positive("El total debe ser un número positivo"),

    paidAmount: z
      .number()
      .min(0, "El monto pagado debe ser un número positivo"),

    paymentStatus: ChargePaymentStatusEnum,

    progressStatus: ChargeProgressStatusEnum,

    notes: z.string().optional().nullable(),
  })
)

/**
 * Base tracked charge type from schema (without populated fields)
 */
type TrackedChargeBase = z.infer<typeof trackedChargeSchema>

/**
 * Complete tracked charges type including all fields from base schema and populated fields
 * Represents a full tracked charge record in the database with optional populated relations
 */
export type TrackedCharge = TrackedChargeBase & {
  // Populated fields (optional, added when using populate)
  patient?: Patient | null
  doctor?: Doctor | null
  item?: Item | null
  visits?: Visit[] | null
}

/**
 * Tracked charges input schema for creating and updating tracked charges
 * Contains all the fields required for tracked charges registration and management
 */
export const trackedChargeInsertSchema = trackedChargeSchema.pick({
  patientId: true,
  doctorId: true,
  itemId: true,
  visitIds: true,
  type: true,
  description: true,
  totalPrice: true,
  paidAmount: true,
  paymentStatus: true,
  progressStatus: true,
  notes: true,
})

/**
 * Type for tracked charges input data when creating or updating a tracked charge
 * All fields are required
 */
export type TrackedChargeInsert = z.infer<typeof trackedChargeInsertSchema>
