import { NotFoundError } from "@/application/errors"
import { IDeletePatientUseCase } from "@/application/use-cases/patients/delete-patient.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IDeletePatientController = ReturnType<
  typeof deletePatientController
>

export const deletePatientController =
  (deletePatientUseCase: IDeletePatientUseCase) =>
  async (patientId: string): Promise<DataResult<void>> => {
    try {
      await deletePatientUseCase({ patientId })
      return DataResult.success(null)
    } catch (error) {
      if (error instanceof NotFoundError) {
        return DataResult.failure(error)
      }
      // Re-throw to let middleware handle unknown errors
      throw error
    }
  }
