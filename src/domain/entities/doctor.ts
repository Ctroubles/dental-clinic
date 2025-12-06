import { z } from "zod"
import { genderEnum } from "../enums/gender.enum"
import { baseZ, mongoObjectId } from "./_base"

/**
 * Complete doctor schema that includes base audit fields
 * Extends the base schema with doctor-specific fields
 */
export const doctorSchema = baseZ.merge(
  z.object({
    userId: mongoObjectId.optional().nullable(),

    firstName: z.string().min(1, "El nombre es requerido"),

    lastName: z.string().min(1, "El apellido es requerido"),

    phone: z
      .string()
      .regex(/^9\d{8}$/, "El teléfono debe empezar con 9 y tener 9 dígitos")
      .optional()
      .nullable(),

    gender: genderEnum.optional().nullable(),
  })
)

/**
 * Complete doctor type including all fields from base schema and doctor input
 * Represents a full doctor record in the database
 */
export type Doctor = z.infer<typeof doctorSchema>

/**
 * Doctor input schema for creating and updating doctors
 * Contains all the fields required for doctor registration and management
 */
export const doctorInsertSchema = doctorSchema.pick({
  userId: true,
  firstName: true,
  lastName: true,
  phone: true,
  gender: true,
})

/**
 * Type for doctor input data when creating or updating a doctor
 * Only firstName and lastName are required, userId and phone are optional
 */
export type DoctorInsert = z.infer<typeof doctorInsertSchema>
