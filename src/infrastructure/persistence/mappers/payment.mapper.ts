import { Payment } from "@/domain/entities/payment"
import { PaymentDocument } from "@/infrastructure/persistence/mongoose/models"
import { mapAuditFields } from "./base.mapper"
import { mapDoctorDocumentToEntity } from "./doctor.mapper"
import { mapPatientDocumentToEntity } from "./patient.mapper"
import { mapTrackedChargesDocumentToEntity } from "./tracked-charges.mapper"

export function mapPaymentDocumentToEntity(
  doc: PaymentDocument | null
): Payment | null {
  if (!doc) return null

  const auditFields = mapAuditFields(doc)

  return {
    ...auditFields,
    createdBy: doc.createdBy.toString(),
    updatedBy: doc.updatedBy?.toString(),
    chargeId: doc.chargeId.toString(),
    visitId: doc.visitId.toString(),
    patientId: doc.patientId.toString(),
    doctorId: doc.doctorId.toString(),
    invoiceId: doc.invoiceId?.toString() || null,
    amount: doc.amount,
    date: doc.date,
    method: doc.method,
    charge: mapTrackedChargesDocumentToEntity(doc.charge),
    patient: mapPatientDocumentToEntity(doc.patient),
    doctor: mapDoctorDocumentToEntity(doc.doctor),
    invoice: null,
  }
}

export function mapPaymentDocumentsToEntities(
  docs: PaymentDocument[] | null
): Payment[] | null {
  if (!Array.isArray(docs)) return null

  return docs
    .map(mapPaymentDocumentToEntity)
    .filter((payment): payment is Payment => payment !== null)
}
