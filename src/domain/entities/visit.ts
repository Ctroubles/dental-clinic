import { z } from "zod"
import { baseZ, mongoObjectId } from "./_base"
import type { Doctor } from "./doctor"
import type { Invoice } from "./invoice"
import type { Location } from "./location"
import type { Patient } from "./patient"
import type { Payment } from "./payment"
import type { TrackedCharge } from "./tracked-charge"

/**
 * Complete visit schema that includes base audit fields
 * Extends the base schema with visit-specific fields
 */
export const visitSchema = baseZ.merge(
  z.object({
    patientId: mongoObjectId.refine(id => id !== "" && id, {
      message: "El paciente es requerido",
    }),

    doctorId: mongoObjectId.refine(id => id !== "" && id, {
      message: "El doctor es requerido",
    }),

    locationId: mongoObjectId.refine(id => id !== "" && id, {
      message: "La ubicación es requerida",
    }),

    date: z.date(),

    notes: z
      .string()
      .min(1, "Las notas de la consulta son requeridas")
      .optional()
      .nullable(),

    invoiceId: mongoObjectId.optional().nullable(),

    trackedCharges: z.array(mongoObjectId).optional().nullable(),
  })
)

/**
 * Base visit type from schema (without populated fields)
 */
type VisitBase = z.infer<typeof visitSchema>

/**
 * Complete visit type including all fields from base schema and populated fields
 * Represents a full visit record in the database with optional populated relations
 */
export type Visit = VisitBase & {
  // Populated fields
  patient: Patient | null
  doctor: Doctor | null
  location: Location | null
  invoice: Invoice | null
  payments: Payment[] | null
  charges: TrackedCharge[] | null
}

/**
 * Visit input schema for creating and updating visits
 * Contains all the fields required for visit registration and management
 */
export const visitInsertSchema = visitSchema.pick({
  patientId: true,
  doctorId: true,
  locationId: true,
  date: true,
  notes: true,
})

/**
 * Type for visit input data when creating or updating a visit
 * All fields are required except notes which is optional
 */
export type VisitInsert = z.infer<typeof visitInsertSchema>
