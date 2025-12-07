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
    { id, data }: { id: string; data: TrackedChargeInsert },
    userId: string
  ): Promise<TrackedCharge> => {
    const existingTrackedCharge = await trackedChargesRepository.findById(id)

    if (!existingTrackedCharge) {
      throw new NotFoundError(`Tracked charge with id ${id} not found`)
    }

    const result = await trackedChargesRepository.update(id, data, userId)
    if (!result) {
      throw new NotFoundError(`Tracked charge with id ${id} not found`)
    }

    return result
  }
