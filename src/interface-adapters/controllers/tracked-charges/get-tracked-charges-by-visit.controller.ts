import { ValidationError } from "@/application/errors"
import { IGetTrackedChargesByVisitUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges-by-visit.use-case"
import { mongoObjectId } from "@/domain/entities/_base"
import { TrackedCharge } from "@/domain/entities/tracked-charge"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetTrackedChargesByVisitController = ReturnType<
  typeof getTrackedChargesByVisitController
>

export const getTrackedChargesByVisitController =
  (getTrackedChargesByVisitUseCase: IGetTrackedChargesByVisitUseCase) =>
  async (visitId: string): Promise<DataResult<TrackedCharge[]>> => {
    const validationResult = controllerValidator(visitId)
    if (!validationResult.success) {
      return DataResult.failure(validationResult.error)
    }
    const trackedCharges = await getTrackedChargesByVisitUseCase(
      validationResult.data
    )
    return DataResult.success(trackedCharges)
  }

const controllerValidator = (visitId: string) => {
  const parseResult = mongoObjectId.safeParse(visitId)
  if (!parseResult.success) {
    return {
      success: false as const,
      error: new ValidationError(parseResult.error),
    }
  }
  return {
    success: true as const,
    data: parseResult.data,
  }
}
