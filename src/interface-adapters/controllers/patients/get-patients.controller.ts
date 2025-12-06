import { PageableResult } from "@/application/common/pagination"
import {
  IGetPatientsUseCase,
  IGetPatientsUseCaseInput,
} from "@/application/use-cases/patients/get-patients.use-case"
import { Patient } from "@/domain/entities/patient"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetPatientsController = ReturnType<typeof getPatientsController>

export const getPatientsController =
  (getPatientsUseCase: IGetPatientsUseCase) =>
  async (
    input: IGetPatientsUseCaseInput
  ): Promise<DataResult<PageableResult<Patient>>> => {
    const patients = await getPatientsUseCase(input)
    return DataResult.success(patients)
  }
