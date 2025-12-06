import { NotFoundError } from "@/application/errors"
import { IGetTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charge.use-case"
import { TrackedCharge } from "@/domain/entities/tracked-charge"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(trackedCharge: TrackedCharge): TrackedCharge {
  return {
    ...trackedCharge,
    id: trackedCharge.id.toString(),
    createdBy: trackedCharge.createdBy.toString(),
    updatedBy: trackedCharge.updatedBy?.toString(),
  }
}

export type IGetTrackedChargeController = ReturnType<
  typeof getTrackedChargeController
>

export const getTrackedChargeController =
  (getTrackedChargeUseCase: IGetTrackedChargeUseCase) =>
  async (trackedChargeId: string): Promise<DataResult<TrackedCharge>> => {
    try {
      const trackedCharge = await getTrackedChargeUseCase(trackedChargeId)
      return DataResult.success(presenter(trackedCharge))
    } catch (error) {
      if (error instanceof NotFoundError) {
        return DataResult.failure(error)
      }
      // Re-throw to let middleware handle unknown errors
      throw error
    }
  }
