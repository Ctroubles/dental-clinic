import { PageableResult } from "@/application/common/pagination"
import { IPageableRequest } from "@/application/common/pagination"
import {
  IPatientRepository,
  PatientsFilters,
} from "@/application/repositories/patient.repository.interface"
import { Patient } from "@/domain/entities/patient"

export interface IGetPatientsUseCaseInput
  extends IPageableRequest<PatientsFilters> {}

export type IGetPatientsUseCase = ReturnType<typeof getPatientsUseCase>

export const getPatientsUseCase =
  (patientRepository: IPatientRepository) =>
  async (input: IGetPatientsUseCaseInput): Promise<PageableResult<Patient>> => {
    const result = await patientRepository.findAll({
      page: input.page,
      pageSize: input.pageSize,
      filters: input.filters,
    })

    return result
  }
