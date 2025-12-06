"use server"

import { type BaseDoc, createModelWithAudit } from "../base-model"
import { type TrackedChargesDocument } from "./tracked-charges.model"
import { type VisitDocument } from "./visit.model"

const PatientSchemaDefinition = {
  // Required identification fields
  dni: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\d{8}$/, "El DNI debe tener exactamente 8 dígitos"],
  },

  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "El nombre es requerido"],
  },

  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "El apellido es requerido"],
  },

  // Optional contact information
  phone: {
    type: String,
    required: false,
    match: [/^9\d{8}$/, "El teléfono debe empezar con 9 y tener 9 dígitos"],
    default: null,
  },

  // Optional personal information
  origin: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },

  dateOfBirth: {
    type: Date,
    required: true,
    default: null,
  },

  gender: {
    type: String,
    required: true,
    enum: {
      values: ["M", "F"],
      message: "El sexo debe ser M (masculino) o F (femenino)",
    },
  },
}

export type PatientDocument = BaseDoc & {
  dni: string
  firstName: string
  lastName: string
  phone?: string | null
  origin?: string | null
  dateOfBirth: Date
  gender: "M" | "F"
  visits: VisitDocument[] | null
  charges: TrackedChargesDocument[] | null
}

export const PatientModel = createModelWithAudit<PatientDocument>(
  "Patient",
  PatientSchemaDefinition
)

PatientModel.schema.virtual("visits", {
  ref: "Visit",
  localField: "_id",
  foreignField: "patientId",
  justOne: false,
})

PatientModel.schema.virtual("charges", {
  ref: "TrackedCharges",
  localField: "_id",
  foreignField: "patientId",
  justOne: false,
})
