"use server"

import { BaseDoc, createModelWithAudit } from "../base-model"

const LocationSchemaDefinition = {
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [1, "El nombre es requerido"],
    maxlength: [100, "El nombre no puede exceder 100 caracteres"],
  },

  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    default: null,
  },
}

export type LocationDocument = BaseDoc & {
  name: string
  description?: string | null
}

export const LocationModel = createModelWithAudit<LocationDocument>(
  "Location",
  LocationSchemaDefinition
)
