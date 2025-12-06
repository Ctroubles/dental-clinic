import { ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import { TrackedCharge, TrackedChargeInsert } from "@/domain/entities/tracked-charge"

export type ICreateTrackedChargeUseCase = ReturnType<typeof createTrackedChargeUseCase>

export const createTrackedChargeUseCase =
  (trackedChargesRepository: ITrackedChargesRepository) =>
  async (
    input: {
      newTrackedCharge: TrackedChargeInsert
    },
    userId: string
  ): Promise<TrackedCharge> => {
    const trackedCharge = await trackedChargesRepository.create(
      input.newTrackedCharge,
      userId
    )
    return trackedCharge
  }
