import type { Doctor } from "@/domain/entities/doctor"
import type { DoctorDocument } from "@/infrastructure/persistence/mongoose/models"
import { mapAuditFields, objectIdToString } from "./base.mapper"

/**
 * Maps a Mongoose DoctorDocument to a domain Doctor entity
 * Converts ObjectIds to strings and handles null/undefined values
 */
export function mapDoctorDocumentToEntity(
  doc: DoctorDocument | null
): Doctor | null {
  if (!doc) return null

  const auditFields = mapAuditFields(doc)

  return {
    ...auditFields,
    userId: objectIdToString(doc.userId),
    firstName: doc.firstName,
    lastName: doc.lastName,
    phone: doc.phone ?? undefined,
    gender: doc.gender ?? undefined,
  }
}

/**
 * Maps an array of Mongoose DoctorDocuments to domain Doctor entities
 */
export function mapDoctorDocumentsToEntities(docs: DoctorDocument[]): Doctor[] {
  return docs
    .map(mapDoctorDocumentToEntity)
    .filter((doctor): doctor is Doctor => doctor !== null)
}
