/**
 * Mappers for converting Mongoose documents to domain entities
 *
 * Each mapper handles the transformation from database layer (Mongoose)
 * to domain layer (plain TypeScript types), ensuring:
 * - ObjectIds are converted to strings
 * - Null/undefined values are handled correctly
 * - Type safety is maintained
 * - No Mongoose-specific methods leak into domain entities
 */

export * from "./base.mapper"
export * from "./item.mapper"
export * from "./doctor.mapper"
export * from "./patient.mapper"
export * from "./tracked-charges.mapper"
export * from "./payment.mapper"
export * from "./visit.mapper"
export * from "./location.mapper"
