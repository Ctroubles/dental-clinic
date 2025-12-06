import { z } from "zod"
import { PaymentMethodEnum } from "../enums"
import { baseZ, mongoObjectId } from "./_base"
import type { Doctor } from "./doctor"
import type { Invoice } from "./invoice"
import type { Patient } from "./patient"
import type { TrackedCharge } from "./tracked-charge"

/**
 * Complete payment schema that includes base audit fields
 * Extends the base schema with payment-specific fields
 */
export const paymentSchema = baseZ.merge(
  z.object({
    visitId: mongoObjectId,

    chargeId: mongoObjectId,

    patientId: mongoObjectId,
    doctorId: mongoObjectId,

    invoiceId: mongoObjectId.optional().nullable(),

    amount: z.number().positive("El monto debe ser un número positivo"),

    date: z.date(),

    method: PaymentMethodEnum,
  })
)

/**
 * Base payment type from schema (without populated fields)
 */
type PaymentBase = z.infer<typeof paymentSchema>

/**
 * Complete payment type including all fields from base schema and populated fields
 * Represents a full payment record in the database with optional populated relations
 */
export type Payment = PaymentBase & {
  // Populated fields (optional, added when using populate)
  charge?: TrackedCharge | null
  invoice?: Invoice | null
  patient?: Patient | null
  doctor?: Doctor | null
}

/**
 * Payment input schema for creating and updating payments
 * Contains all the fields required for payment registration and management
 */
export const paymentInsertSchema = paymentSchema
  .pick({
    chargeId: true,
    visitId: true,
    invoiceId: true,
    amount: true,
    date: true,
    method: true,
    patientId: true,
    doctorId: true,
  })
  .refine(data => data.chargeId || data.invoiceId, {
    message: "Debe proporcionar al menos un ID de cargo o factura",
    path: ["chargeId", "invoiceId"],
  })

/**
 * Type for payment input data when creating or updating a payment
 * All fields are required
 */
export type PaymentInsert = z.infer<typeof paymentInsertSchema>
