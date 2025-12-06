import { PageableResult } from "@/application/common/pagination"
import {
  IGetTrackedChargesUseCase,
  IGetTrackedChargesUseCaseInput,
} from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import { TrackedCharge } from "@/domain/entities/tracked-charge"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetTrackedChargesController = ReturnType<
  typeof getTrackedChargesController
>

export const getTrackedChargesController =
  (getTrackedChargesUseCase: IGetTrackedChargesUseCase) =>
  async (
    input: IGetTrackedChargesUseCaseInput
  ): Promise<DataResult<PageableResult<TrackedCharge>>> => {
    const result = await getTrackedChargesUseCase(input)
    return DataResult.success(result)
  }
