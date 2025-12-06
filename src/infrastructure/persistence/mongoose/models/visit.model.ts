"use server"

import { Schema, Types } from "mongoose"
import { type BaseDoc, createModelWithAudit } from "../base-model"
import { type DoctorDocument } from "./doctor.model"
import { LocationDocument } from "./location.model"
import { type PatientDocument } from "./patient.model"
import { type PaymentDocument } from "./payment.model"
import { type TrackedChargesDocument } from "./tracked-charges.model"

const VisitSchemaDefinition = {
  // Required reference fields
  patientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Patient",
  },

  doctorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Doctor",
  },

  locationId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Location",
  },

  // Invoice reference
  invoiceId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "Invoice",
    default: null,
  },

  // Required visit information
  date: {
    type: Date,
    required: true,
  },

  // Optional visit notes
  notes: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
}

export type VisitDocument = BaseDoc & {
  patientId: Types.ObjectId
  doctorId: Types.ObjectId
  locationId: Types.ObjectId
  date: Date
  notes?: string | null
  invoiceId?: Types.ObjectId | null

  // populated fields (1:1)
  patient: PatientDocument | null
  doctor: DoctorDocument | null
  location: LocationDocument | null
  // invoice: InvoiceDocument | null

  // populated fields (1:n)
  payments: PaymentDocument[] | null
  charges: TrackedChargesDocument[] | null
}

// Create the model with audit fields
const VisitModel = createModelWithAudit<VisitDocument>(
  "Visit",
  VisitSchemaDefinition
)

// Add virtual fields for population
VisitModel.schema.virtual("patient", {
  ref: "Patient",
  localField: "patientId",
  foreignField: "_id",
  justOne: true,
})

VisitModel.schema.virtual("doctor", {
  ref: "Doctor",
  localField: "doctorId",
  foreignField: "_id",
  justOne: true,
})

VisitModel.schema.virtual("location", {
  ref: "Location",
  localField: "locationId",
  foreignField: "_id",
  justOne: true,
})

VisitModel.schema.virtual("payments", {
  ref: "Payment",
  localField: "_id",
  foreignField: "visitId",
  justOne: false,
})

VisitModel.schema.virtual("charges", {
  ref: "TrackedCharges",
  localField: "_id",
  foreignField: "visitIds",
  justOne: false,
})

VisitModel.schema.virtual("invoice", {
  ref: "Invoice",
  localField: "invoiceId",
  foreignField: "_id",
  justOne: true,
})

// Ensure virtual fields are included when converting to JSON
VisitModel.schema.set("toJSON", { virtuals: true })
VisitModel.schema.set("toObject", { virtuals: true })

export { VisitModel }
