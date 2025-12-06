import { NotFoundError, ValidationError } from "@/application/errors"
import { IUpdateTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/update-tracked-charge.use-case"
import {
  TrackedCharge,
  TrackedChargeInsert,
  trackedChargeInsertSchema,
} from "@/domain/entities/tracked-charge"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(trackedCharge: TrackedCharge): TrackedCharge {
  return {
    ...trackedCharge,
    id: trackedCharge.id.toString(),
    createdBy: trackedCharge.createdBy.toString(),
    updatedBy: trackedCharge.updatedBy?.toString(),
  }
}

export type IUpdateTrackedChargeController = ReturnType<
  typeof updateTrackedChargeController
>

export const updateTrackedChargeController =
  (updateTrackedChargeUseCase: IUpdateTrackedChargeUseCase) =>
  async (
    input: {
      trackedChargeId: string
      updatedTrackedCharge: TrackedChargeInsert
    },
    userId: string
  ): Promise<DataResult<TrackedCharge>> => {
    const { data, error: parseError } = trackedChargeInsertSchema.safeParse(
      input.updatedTrackedCharge
    )
    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await updateTrackedChargeUseCase(
      { trackedChargeId: input.trackedChargeId, updatedTrackedCharge: data },
      userId
    )
    if (!response) {
      return DataResult.failure(
        new NotFoundError(
          `Tracked charge con ID ${input.trackedChargeId} no encontrado.`
        )
      )
    }
    return DataResult.success(presenter(response))
  }
