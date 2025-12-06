import { TrackedCharge } from "@/domain/entities/tracked-charge"
import { type TrackedChargesDocument } from "@/infrastructure/persistence/mongoose/models"
import { mapAuditFields } from "./base.mapper"
import { mapDoctorDocumentToEntity } from "./doctor.mapper"
import { mapItemDocumentToEntity } from "./item.mapper"
import { mapPatientDocumentToEntity } from "./patient.mapper"
import { mapVisitDocumentsToEntities } from "./visit.mapper"

export function mapTrackedChargesDocumentToEntity(
  doc: TrackedChargesDocument | null
): TrackedCharge | null {
  if (!doc) return null

  const auditFields = mapAuditFields(doc)

  return {
    ...auditFields,
    createdBy: doc.createdBy.toString(),
    updatedBy: doc.updatedBy?.toString(),
    patientId: doc.patientId.toString(),
    doctorId: doc.doctorId.toString(),
    itemId: doc.itemId.toString(),
    visitIds: doc.visitIds?.map((visitId) => visitId.toString()),
    type: doc.type,
    description: doc.description,
    totalPrice: doc.totalPrice,
    paidAmount: doc.paidAmount,
    paymentStatus: doc.paymentStatus,
    progressStatus: doc.progressStatus,
    patient: mapPatientDocumentToEntity(doc.patient),
    doctor: mapDoctorDocumentToEntity(doc.doctor),
    item: mapItemDocumentToEntity(doc.item),
    visits: mapVisitDocumentsToEntities(doc.visits),
    notes: doc.notes,
  }
}

export function mapTrackedChargesDocumentsToEntities(
  docs: TrackedChargesDocument[] | null
): TrackedCharge[] | null {
  if (!Array.isArray(docs)) return null

  return docs
    .map(mapTrackedChargesDocumentToEntity)
    .filter((charge): charge is TrackedCharge => charge !== null)
}
