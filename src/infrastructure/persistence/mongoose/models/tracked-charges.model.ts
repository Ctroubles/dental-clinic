"use server"

import { Schema, Types } from "mongoose"
import {
  ChargePaymentStatus,
  ChargeProgressStatus,
  ItemType,
} from "@/domain/enums"
import { BaseDoc, createModelWithAudit } from "../base-model"
import { type DoctorDocument } from "./doctor.model"
import { type ItemDocument } from "./item.model"
import { type PatientDocument } from "./patient.model"
import { type VisitDocument } from "./visit.model"

const TrackedChargesSchemaDefinition = {
  // Required reference fields
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

  itemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Item",
  },

  visitIds: {
    type: [Schema.Types.ObjectId],
    required: true,
    ref: "Visit",
  },

  // Required charge information
  type: {
    type: String,
    required: true,
    enum: {
      values: ["service", "product"],
      message: "Item type must be service or product",
    },
  },

  description: {
    type: String,
    required: true,
    trim: true,
    minlength: [1, "Description is required"],
  },

  totalPrice: {
    type: Number,
    required: true,
    min: [0, "Total must be a positive number"],
  },

  paidAmount: {
    type: Number,
    required: true,
    min: [0, "Paid amount must be a positive number"],
    validate: {
      validator(this: TrackedChargesDocument, value: number) {
        return value <= this.totalPrice
      },
      message: "Paid amount cannot be greater than total price",
    },
  },

  paymentStatus: {
    type: String,
    required: true,
    enum: {
      values: ["paid", "partiallyPaid", "unpaid"],
      message: "Payment status must be paid, partiallyPaid or unpaid",
    },
  },

  progressStatus: {
    type: String,
    required: true,
    enum: {
      values: ["inProgress", "completed", "cancelled"],
      message: "Progress status must be inProgress, completed or cancelled",
    },
    default: "inProgress",
  },

  notes: {
    type: String,
    required: false,
    trim: true,
    default: null,
  },
}

export type TrackedChargesDocument = BaseDoc & {
  patientId: Types.ObjectId
  doctorId: Types.ObjectId
  itemId: Types.ObjectId
  visitIds: Types.ObjectId[]
  type: ItemType
  description: string
  totalPrice: number
  paidAmount: number
  paymentStatus: ChargePaymentStatus
  progressStatus: ChargeProgressStatus
  patient: PatientDocument
  doctor: DoctorDocument
  item: ItemDocument
  visits: VisitDocument[]
  notes?: string | null
}

export const TrackedChargesModel = createModelWithAudit<TrackedChargesDocument>(
  "TrackedCharges",
  TrackedChargesSchemaDefinition
)

TrackedChargesModel.schema.virtual("patient", {
  ref: "Patient",
  localField: "patientId",
  foreignField: "_id",
  justOne: true,
})

TrackedChargesModel.schema.virtual("doctor", {
  ref: "Doctor",
  localField: "doctorId",
  foreignField: "_id",
  justOne: true,
})

TrackedChargesModel.schema.virtual("item", {
  ref: "Item",
  localField: "itemId",
  foreignField: "_id",
  justOne: true,
})

TrackedChargesModel.schema.virtual("visits", {
  ref: "Visit",
  localField: "visitIds",
  foreignField: "_id",
  justOne: false,
})
