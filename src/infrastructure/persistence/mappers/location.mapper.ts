import type { Location } from "@/domain/entities/location"
import type { LocationDocument } from "@/infrastructure/persistence/mongoose/models"
import { mapAuditFields } from "./base.mapper"

/**
 * Maps a Mongoose LocationDocument to a domain Location entity
 * Converts ObjectIds to strings and handles null/undefined values
 */
export function mapLocationDocumentToEntity(
  doc: LocationDocument | null
): Location | null {
  if (!doc) return null

  const auditFields = mapAuditFields(doc)

  return {
    ...auditFields,
    name: doc.name,
    description: doc.description ?? null,
  }
}

/**
 * Maps an array of Mongoose LocationDocuments to domain Location entities
 */
export function mapLocationDocumentsToEntities(
  docs: LocationDocument[]
): Location[] {
  return docs
    .map(mapLocationDocumentToEntity)
    .filter((location): location is Location => location !== null)
}
