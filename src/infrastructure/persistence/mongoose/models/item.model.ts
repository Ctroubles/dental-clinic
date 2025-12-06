"use server"

import { BaseDoc, createModelWithAudit } from "../base-model"

const ItemSchemaDefinition = {
  // Required identification fields
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [1, "El código del artículo es requerido"],
    maxlength: [20, "El código no puede exceder 20 caracteres"],
  },

  name: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "El nombre del artículo es requerido"],
    maxlength: [100, "El nombre no puede exceder 100 caracteres"],
  },

  type: {
    type: String,
    required: true,
    enum: {
      values: ["service", "product"],
      message: "El tipo debe ser service o product",
    },
  },

  defaultPrice: {
    type: Number,
    required: true,
    min: [0, "El precio por defecto debe ser un número positivo"],
  },

  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },

  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, "La descripción no puede exceder 500 caracteres"],
    default: null,
  },
}

export type ItemDocument = BaseDoc & {
  code: string
  name: string
  type: "service" | "product"
  defaultPrice: number
  isActive: boolean
  description?: string | null
}

export const ItemModel = createModelWithAudit<ItemDocument>(
  "Item",
  ItemSchemaDefinition
)
