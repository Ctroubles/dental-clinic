import type { Patient } from "@/domain/entities/patient"
import type { PatientDocument } from "@/infrastructure/persistence/mongoose/models"
import { mapAuditFields } from "./base.mapper"
import { mapTrackedChargesDocumentsToEntities } from "./tracked-charges.mapper"
import { mapVisitDocumentsToEntities } from "./visit.mapper"

export function mapPatientDocumentToEntity(
  doc: PatientDocument | null
): Patient | null {
  if (!doc) return null

  const auditFields = mapAuditFields(doc)

  return {
    ...auditFields,
    dni: doc.dni,
    firstName: doc.firstName,
    lastName: doc.lastName,
    dateOfBirth: doc.dateOfBirth,
    gender: doc.gender,
    phone: doc.phone ?? undefined,
    origin: doc.origin ?? undefined,
    visits: mapVisitDocumentsToEntities(doc.visits),
    charges: mapTrackedChargesDocumentsToEntities(doc.charges),
  }
}

export function mapPatientDocumentsToEntities(
  docs: PatientDocument[]
): Patient[] {
  return docs
    .map(mapPatientDocumentToEntity)
    .filter((patient): patient is Patient => patient !== null)
}
