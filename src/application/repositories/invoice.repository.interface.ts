import { Invoice, InvoiceInsert } from "@/domain/entities/invoice"

export interface IInvoiceRepository {
  findByPatientId(patientId: string): Promise<Invoice[]>
  findByVisitId(visitId: Invoice["visitId"]): Promise<Invoice[]>
  findByDateRange(startDate: string, endDate: string): Promise<Invoice[]>
  create(invoice: InvoiceInsert, createdBy: string): Promise<Invoice>
  update(invoice: Invoice): Promise<Invoice | null>
  delete(id: Invoice["id"]): Promise<void>
  getAll(): Promise<Invoice[]>
}
