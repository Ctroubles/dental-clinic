import type { Item } from "@/domain/entities/item"
import type { ItemDocument } from "@/infrastructure/persistence/mongoose/models"
import { mapAuditFields } from "./base.mapper"

/**
 * Maps a Mongoose ItemDocument to a domain Item entity
 * Converts ObjectIds to strings and handles null/undefined values
 */
export function mapItemDocumentToEntity(doc: ItemDocument | null): Item | null {
  if (!doc) return null

  const auditFields = mapAuditFields(doc)

  return {
    ...auditFields,
    code: doc.code,
    name: doc.name,
    type: doc.type,
    defaultPrice: doc.defaultPrice,
    isActive: doc.isActive,
    description: doc.description ?? null,
  }
}

/**
 * Maps an array of Mongoose ItemDocuments to domain Item entities
 */
export function mapItemDocumentsToEntities(docs: ItemDocument[]): Item[] {
  return docs
    .map(mapItemDocumentToEntity)
    .filter((item): item is Item => item !== null)
}
