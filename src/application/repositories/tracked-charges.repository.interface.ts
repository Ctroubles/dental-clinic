import {
  TrackedCharge,
  TrackedChargeInsert,
} from "@/domain/entities/tracked-charge"
import {
  ChargePaymentStatus,
  ChargeProgressStatus,
  ItemType,
} from "@/domain/enums"
import { IBaseRepository } from "./base.repository.interface"
import { PersistenceSession } from "./persistence-session.interface"

export type TrackedChargesFilters = {
  search?: string | null
  patientId?: string | null
  doctorId?: string | null
  itemId?: string | null
  type?: ItemType[] | null
  paymentStatus?: ChargePaymentStatus[] | null
  progressStatus?: ChargeProgressStatus[] | null
}

export interface ITrackedChargesRepository
  extends IBaseRepository<
    TrackedCharge,
    TrackedChargeInsert,
    TrackedChargesFilters
  > {
  findByPatientId(
    patientId: TrackedCharge["patientId"]
  ): Promise<TrackedCharge[]>
  findByVisitId(
    visitId: string // TODO: REMOVE THIS
  ): Promise<TrackedCharge[]>
  create(
    trackedCharge: TrackedChargeInsert,
    createdBy: string,
    session?: PersistenceSession
  ): Promise<TrackedCharge>
  delete(id: TrackedCharge["id"]): Promise<void>

  createMany(
    trackedCharges: TrackedChargeInsert[],
    createdBy: string,
    session?: PersistenceSession
  ): Promise<TrackedCharge[]>

  createOrUpdateMany(
    chargesInput: Array<
      (Partial<TrackedChargeInsert> & { id: string }) | TrackedChargeInsert
    >,
    createdBy: string,
    session?: PersistenceSession
  ): Promise<TrackedCharge[]>
}
