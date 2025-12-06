import { PageableResult } from "@/application/common/pagination"
import {
  IGetDoctorsUseCase,
  IGetDoctorsUseCaseInput,
} from "@/application/use-cases/doctors/get-doctors.use-case"
import { Doctor } from "@/domain/entities/doctor"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetDoctorsController = ReturnType<typeof getDoctorsController>

export const getDoctorsController =
  (getDoctorsUseCase: IGetDoctorsUseCase) =>
  async (
    input: IGetDoctorsUseCaseInput
  ): Promise<DataResult<PageableResult<Doctor>>> => {
    const doctors = await getDoctorsUseCase(input)
    return DataResult.success(doctors)
  }
