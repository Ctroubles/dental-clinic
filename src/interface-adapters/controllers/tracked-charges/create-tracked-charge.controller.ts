import { ValidationError } from "@/application/errors"
import { ICreateTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/create-tracked-charge.use-case"
import {
  TrackedCharge,
  TrackedChargeInsert,
  trackedChargeInsertSchema,
} from "@/domain/entities/tracked-charge"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(trackedCharge: TrackedCharge): TrackedCharge {
  return {
    ...trackedCharge,
    id: trackedCharge.id,
    createdBy: trackedCharge.createdBy,
    updatedBy: trackedCharge.updatedBy,
  }
}

export type ICreateTrackedChargeController = ReturnType<
  typeof createTrackedChargeController
>

export const createTrackedChargeController =
  (createTrackedChargeUseCase: ICreateTrackedChargeUseCase) =>
  async (
    input: {
      newTrackedCharge: TrackedChargeInsert
    },
    userId: string
  ): Promise<DataResult<TrackedCharge>> => {
    const { data, error: parseError } = trackedChargeInsertSchema.safeParse(
      input.newTrackedCharge
    )

    if (parseError) {
      return DataResult.failure(new ValidationError(parseError))
    }

    const response = await createTrackedChargeUseCase(
      { newTrackedCharge: data },
      userId
    )
    return DataResult.success(presenter(response))
  }
