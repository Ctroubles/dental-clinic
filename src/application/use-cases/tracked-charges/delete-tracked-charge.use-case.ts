import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"

export interface IDeleteTrackedChargeUseCase {
  (id: string): Promise<void>
}

export function deleteTrackedChargeUseCase(
  trackedChargesRepository: ITrackedChargesRepository
): IDeleteTrackedChargeUseCase {
  return async (id: string): Promise<void> => {
    await trackedChargesRepository.delete(id)
  }
}
