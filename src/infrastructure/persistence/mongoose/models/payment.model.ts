"use server"

import { Schema, Types } from "mongoose"
import { BaseDoc, createModelWithAudit } from "../base-model"
import { DoctorDocument } from "./doctor.model"
import { InvoiceDocument } from "./invoice.model"
import { PatientDocument } from "./patient.model"
import { TrackedChargesDocument } from "./tracked-charges.model"

const PaymentSchemaDefinition = {
  visitId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Visit",
  },

  chargeId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "TrackedCharges",
    default: null,
  },

  invoiceId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Invoice",
    default: null,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Patient",
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },

  // Required payment information
  amount: {
    type: Number,
    required: true,
    min: [0, "El monto debe ser un número positivo"],
  },

  date: {
    type: Date,
    required: true,
  },

  method: {
    type: String,
    required: true,
    enum: {
      values: ["cash", "yape", "plin", "card", "transfer"],
      message: "El método de pago debe ser cash, yape, plin, card o transfer",
    },
  },
}

export type PaymentDocument = BaseDoc & {
  visitId: Types.ObjectId
  chargeId: Types.ObjectId
  invoiceId?: Types.ObjectId | null
  patientId: Types.ObjectId
  doctorId: Types.ObjectId
  amount: number
  date: Date
  method: "cash" | "yape" | "plin" | "card" | "transfer"
  charge: TrackedChargesDocument | null
  invoice: InvoiceDocument | null
  patient: PatientDocument | null
  doctor: DoctorDocument | null
}

export const PaymentModel = createModelWithAudit<PaymentDocument>(
  "Payment",
  PaymentSchemaDefinition
)

PaymentModel.schema.virtual("charge", {
  ref: "TrackedCharges",
  localField: "chargeId",
  foreignField: "_id",
  justOne: true,
})

PaymentModel.schema.virtual("invoice", {
  ref: "Invoice",
  localField: "invoiceId",
  foreignField: "_id",
  justOne: true,
})

PaymentModel.schema.virtual("patient", {
  ref: "Patient",
  localField: "patientId",
  foreignField: "_id",
  justOne: true,
})

PaymentModel.schema.virtual("doctor", {
  ref: "User",
  localField: "doctorId",
  foreignField: "_id",
  justOne: true,
})
