"use server"

import { Schema, Types } from "mongoose"
import { BaseDoc, createModelWithAudit } from "../base-model"

const InvoiceSchemaDefinition = {
  // Required reference field
  visitId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Visit",
  },

  // Invoice identification
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  // Invoice dates
  issueDate: {
    type: Date,
    required: true,
  },

  dueDate: {
    type: Date,
    required: true,
  },

  // Financial information
  totalAmount: {
    type: Number,
    required: true,
    min: [0, "El total debe ser un número positivo"],
  },

  paidAmount: {
    type: Number,
    required: true,
    min: [0, "El monto pagado debe ser un número positivo"],
    default: 0,
  },

  status: {
    type: String,
    required: true,
    enum: {
      values: [
        "DRAFT",
        "SENT",
        "PAID",
        "PARTIALLY_PAID",
        "OVERDUE",
        "CANCELLED",
      ],
      message:
        "El estado debe ser DRAFT, SENT, PAID, PARTIALLY_PAID, OVERDUE o CANCELLED",
    },
    default: "DRAFT",
  },

  // Optional notes
  notes: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
}

export type InvoiceDocument = BaseDoc & {
  visitId: Types.ObjectId
  invoiceNumber: string
  issueDate: Date
  dueDate: Date
  totalAmount: number
  paidAmount: number
  status: "DRAFT" | "SENT" | "PAID" | "PARTIALLY_PAID" | "OVERDUE" | "CANCELLED"
  notes?: string | null
}

export const InvoiceModel = createModelWithAudit<InvoiceDocument>(
  "Invoice",
  InvoiceSchemaDefinition
)
