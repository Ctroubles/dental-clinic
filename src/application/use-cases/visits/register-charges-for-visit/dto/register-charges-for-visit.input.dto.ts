import { z } from "zod"
import { mongoObjectId } from "@/domain/entities/_base"
import { ChargeProgressStatusEnum } from "@/domain/enums/charge-progress-status.enum"
import { ItemTypeEnum } from "@/domain/enums/item-type.enum"
import { PaymentMethodEnum } from "@/domain/enums/payment-method.enum"

/**
 * Schema for a new charge line
 * Used when creating a new tracked charge from an item
 */
export const newChargeLineSchema = z.object({
  mode: z.literal("new"),
  itemId: mongoObjectId,
  type: ItemTypeEnum,
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres"),
  quantity: z
    .number()
    .int("La cantidad debe ser un número entero")
    .positive("La cantidad debe ser mayor a 0"),
  totalPrice: z
    .number({
      required_error: "El precio total es requerido",
      invalid_type_error: "El precio total debe ser un número",
    })
    .positive("El precio total debe ser mayor a 0")
    .finite("El precio total debe ser un número finito"),
  progressStatus: ChargeProgressStatusEnum,
  paidNow: z
    .number({
      required_error: "El monto pagado es requerido",
      invalid_type_error: "El monto pagado debe ser un número",
    })
    .min(0, "El monto pagado no puede ser negativo")
    .finite("El monto pagado debe ser un número finito"),
  notes: z
    .string()
    .max(1000, "Las notas no pueden exceder 1000 caracteres")
    .optional()
    .nullable(),
})

/**
 * Schema for an existing charge line
 * Used when updating an existing tracked charge
 */
export const existingChargeLineSchema = z.object({
  mode: z.literal("existing"),
  trackedChargeId: mongoObjectId,
  progressStatus: ChargeProgressStatusEnum,
  paidNow: z
    .number({
      required_error: "El monto pagado es requerido",
      invalid_type_error: "El monto pagado debe ser un número",
    })
    .min(0, "El monto pagado no puede ser negativo")
    .finite("El monto pagado debe ser un número finito"),
  notes: z
    .string()
    .max(1000, "Las notas no pueden exceder 1000 caracteres")
    .optional()
    .nullable(),
})

/**
 * Discriminated union schema for charge lines
 * Uses the 'mode' field to determine which schema to apply
 */
export const chargeLineSchema = z.discriminatedUnion("mode", [
  newChargeLineSchema,
  existingChargeLineSchema,
])

/**
 * Schema for registering charges for a visit
 */
export const registerChargesForVisitInputSchema = z
  .object({
    visitId: mongoObjectId,
    lines: z
      .array(chargeLineSchema)
      .min(1, "Se requiere al menos una línea de cargo")
      .max(100, "No se pueden procesar más de 100 líneas de cargo a la vez"),
    paymentMethod: PaymentMethodEnum,
  })
  .refine(
    data => {
      return data.lines.every(line => {
        if (line.mode === "new") {
          return line.paidNow <= line.totalPrice
        }
        return true
      })
    },
    {
      message: "El monto pagado no puede ser mayor al precio total",
      path: ["lines"],
    }
  )

/**
 * Type inference from schemas
 */
export type NewChargeLine = z.infer<typeof newChargeLineSchema>
export type ExistingChargeLine = z.infer<typeof existingChargeLineSchema>
export type ChargeLine = z.infer<typeof chargeLineSchema>

export type RegisterChargesForVisitInput = z.infer<
  typeof registerChargesForVisitInputSchema
>
