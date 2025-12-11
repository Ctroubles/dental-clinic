import { Payment, PaymentInsert } from "@/domain/entities/payment"
import { PaymentMethod } from "@/domain/enums"
import { IBaseRepository } from "./base.repository.interface"
import { PersistenceSession } from "./persistence-session.interface"

export type PaymentsFilters = {
  search?: string | null
  patientId?: string | null
  doctorId?: string | null
  chargeId?: string | null
  visitId?: string | null
  method?: PaymentMethod[] | null
}

export interface IPaymentRepository
  extends IBaseRepository<Payment, PaymentsFilters> {
  findByChargeId(chargeId: Payment["chargeId"]): Promise<Payment[]>
  findByInvoiceId(invoiceId: string): Promise<Payment[]>
  findByVisitId(visitId: Payment["visitId"]): Promise<Payment[]>
  createMany(
    payments: PaymentInsert[],
    createdBy: string,
    session: PersistenceSession
  ): Promise<Payment[]>

  upsertMany(
    payments: Array<PaymentInsert & { id?: string }>,
    createdBy: string,
    session?: PersistenceSession
  ): Promise<Payment[]>
}
