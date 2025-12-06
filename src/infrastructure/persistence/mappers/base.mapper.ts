import type { Document, Types } from "mongoose"
import type { BaseDoc } from "@/infrastructure/persistence/mongoose/base-model"

/**
 * Base mapper utilities for converting Mongoose documents to domain entities
 * Handles common transformations like ObjectId to string conversion
 */

/**
 * Converts a Mongoose ObjectId to a string, handling null/undefined cases
 */
export function objectIdToString(
  value: Types.ObjectId | string | null | undefined
): string | undefined {
  if (!value) return undefined
  if (typeof value === "string") return value
  return value.toString()
}

/**
 * Converts a Mongoose ObjectId to a string, returning null if undefined
 */
export function objectIdToStringOrNull(
  value: Types.ObjectId | string | null | undefined
): string | null {
  if (!value) return null
  if (typeof value === "string") return value
  return value.toString()
}

/**
 * Maps common audit fields from Mongoose document to domain entity
 * Converts ObjectIds to strings and handles optional fields
 */
export function mapAuditFields<T extends BaseDoc>(doc: T) {
  return {
    id: objectIdToString(doc.id)!,
    createdBy: objectIdToString(doc.createdBy)!,
    createdAt: doc.createdAt,
    updatedBy: objectIdToString(doc.updatedBy),
    updatedAt: doc.updatedAt,
  }
}

/**
 * Converts a Mongoose document to a plain object using toObject()
 * This removes all Mongoose-specific methods and properties
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toPlainObject<T extends Document>(doc: T | null): any {
  if (!doc) return null
  return doc.toObject({ virtuals: true })
}

/**
 * Type guard to check if a value is a Mongoose ObjectId
 */
export function isObjectId(value: unknown): value is Types.ObjectId {
  return (
    value !== null &&
    value !== undefined &&
    typeof value === "object" &&
    "toString" in value &&
    typeof (value as Types.ObjectId).toString === "function"
  )
}
