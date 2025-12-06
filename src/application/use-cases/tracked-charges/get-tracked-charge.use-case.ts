import { NotFoundError } from "@/application/errors"
import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import { TrackedCharge } from "@/domain/entities/tracked-charge"

export type IGetTrackedChargeUseCase = ReturnType<
  typeof getTrackedChargeUseCase
>

export const getTrackedChargeUseCase =
  (trackedChargesRepository: ITrackedChargesRepository) =>
  async (trackedChargeId: string): Promise<TrackedCharge> => {
    const trackedCharge =
      await trackedChargesRepository.findById(trackedChargeId)

    if (!trackedCharge) {
      throw new NotFoundError(
        `Tracked charge with id ${trackedChargeId} not found`
      )
    }

    return trackedCharge
  }
