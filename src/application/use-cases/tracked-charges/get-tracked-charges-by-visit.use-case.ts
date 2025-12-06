import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import { TrackedCharge } from "@/domain/entities/tracked-charge"

export interface IGetTrackedChargesByVisitUseCase {
  (visitId: string): Promise<TrackedCharge[]>
}

export function getTrackedChargesByVisitUseCase(
  trackedChargesRepository: ITrackedChargesRepository
): IGetTrackedChargesByVisitUseCase {
  return async (visitId: string): Promise<TrackedCharge[]> => {
    return await trackedChargesRepository.findByVisitId(visitId)
  }
}
