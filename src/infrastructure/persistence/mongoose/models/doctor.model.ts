"use server"

import { Schema, Types } from "mongoose"
import { type BaseDoc, createModelWithAudit } from "../base-model"

const DoctorSchemaDefinition = {
  userId: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: "User",
    default: null,
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
  gender: {
    type: String,
    required: false,
    enum: ["M", "F"],
  },
  phone: {
    type: String,
    required: false,
    match: [/^9\d{8}$/, "El teléfono debe empezar con 9 y tener 9 dígitos"],
    default: null,
  },
}

export type DoctorDocument = BaseDoc & {
  userId?: Types.ObjectId | null
  firstName: string
  lastName: string
  phone?: string | null
  gender?: "M" | "F" | null
}

export const DoctorModel = createModelWithAudit<DoctorDocument>(
  "Doctor",
  DoctorSchemaDefinition
)
