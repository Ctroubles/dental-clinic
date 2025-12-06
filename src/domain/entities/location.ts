import { z } from "zod"
import { baseZ } from "./_base"

export const locationSchema = baseZ.merge(
  z.object({
    name: z.string().min(1, "El nombre es requerido"),
    description: z.string().optional().nullable(),
  })
)

export type Location = z.infer<typeof locationSchema>

export const locationInsertSchema = locationSchema.pick({
  name: true,
  description: true,
})

export type LocationInsert = z.infer<typeof locationInsertSchema>
