import type { Visit } from "@/domain/entities/visit"
import type { VisitDocument } from "@/infrastructure/persistence/mongoose/models"
import { mapAuditFields, objectIdToStringOrNull } from "./base.mapper"
import { mapDoctorDocumentToEntity } from "./doctor.mapper"
import { mapLocationDocumentToEntity } from "./location.mapper"
import { mapPatientDocumentToEntity } from "./patient.mapper"
import { mapPaymentDocumentsToEntities } from "./payment.mapper"
import { mapTrackedChargesDocumentsToEntities } from "./tracked-charges.mapper"

/**
 * Maps a Mongoose VisitDocument to a domain Visit entity
 * Converts ObjectIds to strings and handles null/undefined values
 */
export function mapVisitDocumentToEntity(
  doc: VisitDocument | null
): Visit | null {
  if (!doc) return null

  const auditFields = mapAuditFields(doc)

  return {
    ...auditFields,
    patientId: doc.patientId.toString(),
    doctorId: doc.doctorId.toString(),
    locationId: doc.locationId.toString(),
    date: doc.date,
    notes: doc.notes ?? null,
    invoiceId: objectIdToStringOrNull(doc.invoiceId),
    patient: mapPatientDocumentToEntity(doc.patient),
    doctor: mapDoctorDocumentToEntity(doc.doctor),
    location: mapLocationDocumentToEntity(doc.location),
    payments: mapPaymentDocumentsToEntities(doc.payments),
    charges: mapTrackedChargesDocumentsToEntities(doc.charges),
    invoice: null,
  }
}

/**
 * Maps an array of Mongoose VisitDocuments to domain Visit entities
 */
export function mapVisitDocumentsToEntities(
  docs: VisitDocument[] | null
): Visit[] | null {
  if (!Array.isArray(docs)) return null

  return (
    docs
      .map(mapVisitDocumentToEntity)
      .filter((visit): visit is Visit => visit !== null) ?? []
  )
}
