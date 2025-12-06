import { z } from "zod"
import { genderEnum } from "../enums/gender.enum"
import { baseZ } from "./_base"
import type { TrackedCharge } from "./tracked-charge"
import type { Visit } from "./visit"

/**
 * Complete patient schema that includes base audit fields
 * Extends the base schema with patient-specific fields
 */
export const patientSchema = baseZ.merge(
  z.object({
    dni: z
      .string()
      .trim()
      .regex(/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"),

    firstName: z.string().min(1, "El nombre es requerido"),

    lastName: z.string().min(1, "El apellido es requerido"),

    phone: z
      .string()
      .regex(/^9\d{8}$/, "El teléfono debe empezar con 9 y tener 9 dígitos")
      .optional()
      .nullable(),

    origin: z
      .string()
      .min(1, "La procedencia es requerida")
      .optional()
      .nullable(),

    dateOfBirth: z.date(),

    gender: genderEnum.optional().nullable(),
  })
)

/**
 * Base patient type from schema (without populated fields)
 */
type PatientBase = z.infer<typeof patientSchema>

/**
 * Complete patient type including all fields from base schema and populated fields
 * Represents a full patient record in the database with optional populated relations
 */
export type Patient = PatientBase & {
  // Populated fields (optional, added when using populate)
  visits: Visit[] | null
  charges: TrackedCharge[] | null
}

/**
 * Patient input schema for creating and updating patients
 * Contains all the fields required for patient registration and management
 */
export const patientInsertSchema = patientSchema.pick({
  dni: true,
  firstName: true,
  lastName: true,
  phone: true,
  origin: true,
  dateOfBirth: true,
  gender: true,
})

/**
 * Type for patient input data when creating or updating a patient
 * All fields except dni, firstName, and lastName are optional
 */
export type PatientInsert = z.infer<typeof patientInsertSchema>
