import { NotFoundError } from "@/application/errors"
import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import {
  TrackedCharge,
  TrackedChargeInsert,
} from "@/domain/entities/tracked-charge"

export type IUpdateTrackedChargeUseCase = ReturnType<
  typeof updateTrackedChargeUseCase
>

export const updateTrackedChargeUseCase =
  (trackedChargesRepository: ITrackedChargesRepository) =>
  async (
    {
      trackedChargeId,
      updatedTrackedCharge,
    }: { trackedChargeId: string; updatedTrackedCharge: TrackedChargeInsert },
    userId: string
  ): Promise<TrackedCharge> => {
    const existingTrackedCharge =
      await trackedChargesRepository.findById(trackedChargeId)

    if (!existingTrackedCharge) {
      throw new NotFoundError(
        `Tracked charge with id ${trackedChargeId} not found`
      )
    }

    const trackedChargeToUpdate: TrackedCharge = {
      ...existingTrackedCharge,
      ...updatedTrackedCharge,
      id: trackedChargeId,
      updatedBy: userId,
      updatedAt: new Date(),
    }

    const result = await trackedChargesRepository.update(trackedChargeToUpdate)
    if (!result) {
      throw new NotFoundError(
        `Tracked charge with id ${trackedChargeId} not found`
      )
    }
    return result
  }
