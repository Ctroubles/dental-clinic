import { NotFoundError } from "@/application/errors"
import { IDeleteTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/delete-tracked-charge.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IDeleteTrackedChargeController = ReturnType<
  typeof deleteTrackedChargeController
>

export const deleteTrackedChargeController =
  (deleteTrackedChargeUseCase: IDeleteTrackedChargeUseCase) =>
  async (id: string): Promise<DataResult<void>> => {
    try {
      await deleteTrackedChargeUseCase(id)
      return DataResult.success(null)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return DataResult.failure(error)
      }
      // Re-throw to let middleware handle unknown errors
      throw error
    }
  }
