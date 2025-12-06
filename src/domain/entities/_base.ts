import { z } from "zod"

// MongoDB ObjectId validation (24 character hex string)
export const mongoObjectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Ingrese un ID válido")

export const auditZ = z.object({
  createdBy: mongoObjectId,
  updatedBy: mongoObjectId.optional(),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
})

export const baseZ = auditZ.merge(
  z.object({
    id: mongoObjectId,
  })
)

export type AuditFields = z.infer<typeof auditZ>
