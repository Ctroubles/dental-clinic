import { z } from "zod"
import { baseZ, mongoObjectId } from "./_base"

/**
 * Complete invoice schema that includes base audit fields
 * Extends the base schema with invoice-specific fields
 */
export const invoiceSchema = baseZ.merge(
  z.object({
    visitId: mongoObjectId,

    invoiceNumber: z.string().min(1, "El número de factura es requerido"),

    issueDate: z.date(),

    dueDate: z.date(),

    totalAmount: z.number().positive("El total debe ser un número positivo"),

    paidAmount: z
      .number()
      .min(0, "El monto pagado debe ser un número positivo"),

    status: z.enum([
      "DRAFT",
      "SENT",
      "PAID",
      "PARTIALLY_PAID",
      "OVERDUE",
      "CANCELLED",
    ]),

    notes: z.string().optional().nullable(),
  })
)

/**
 * Complete invoice type including all fields from base schema and invoice input
 * Represents a full invoice record in the database
 */
export type Invoice = z.infer<typeof invoiceSchema>

/**
 * Invoice input schema for creating and updating invoices
 * Contains all the fields required for invoice registration and management
 */
export const invoiceInsertSchema = invoiceSchema.pick({
  visitId: true,
  invoiceNumber: true,
  issueDate: true,
  dueDate: true,
  totalAmount: true,
  paidAmount: true,
  status: true,
  notes: true,
})

/**
 * Type for invoice input data when creating or updating an invoice
 * All fields are required
 */
export type InvoiceInsert = z.infer<typeof invoiceInsertSchema>
