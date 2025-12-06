import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import { TrackedCharge } from "@/domain/entities/tracked-charge"

export interface IGetTrackedChargesByPatientUseCase {
  (patientId: string): Promise<TrackedCharge[]>
}

export function getTrackedChargesByPatientUseCase(
  trackedChargesRepository: ITrackedChargesRepository
): IGetTrackedChargesByPatientUseCase {
  return async (patientId: string): Promise<TrackedCharge[]> => {
    return await trackedChargesRepository.findByPatientId(patientId)
  }
}
