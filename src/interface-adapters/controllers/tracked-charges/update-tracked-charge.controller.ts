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
      id: string
      data: TrackedChargeInsert
    },
    updatedBy: string
  ): Promise<DataResult<TrackedCharge>> => {
    const { data, error: parseError } = trackedChargeInsertSchema.safeParse(
      input.data
    )

    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }
    const response = await updateTrackedChargeUseCase(
      { id: input.id, data },
      updatedBy
    )

    if (!response) {
      return DataResult.failure(
        new NotFoundError(`Tracked charge con ID ${input.id} no encontrado.`)
      )
    }
    return DataResult.success(presenter(response))
  }
