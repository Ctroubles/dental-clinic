import { PageableResult } from "@/application/common/pagination"
import { IPageableRequest } from "@/application/common/pagination"
import {
  DoctorsFilters,
  IDoctorRepository,
} from "@/application/repositories/doctor.repository.interface"
import { Doctor } from "@/domain/entities/doctor"

export interface IGetDoctorsUseCaseInput
  extends IPageableRequest<DoctorsFilters> {}

export type IGetDoctorsUseCase = ReturnType<typeof getDoctorsUseCase>

export const getDoctorsUseCase =
  (doctorRepository: IDoctorRepository) =>
  async (input: IGetDoctorsUseCaseInput): Promise<PageableResult<Doctor>> => {
    const result = await doctorRepository.findAll({
      page: input.page,
      pageSize: input.pageSize,
      filters: input.filters,
    })

    return result
  }
