import { PageableResult } from "@/application/common/pagination"
import { IPageableRequest } from "@/application/common/pagination"
import {
  IVisitRepository,
  VisitsFilters,
} from "@/application/repositories/visit.repository.interface"
import { Visit } from "@/domain/entities/visit"

export interface IGetVisitsUseCaseInput
  extends IPageableRequest<VisitsFilters> {}

export type IGetVisitsUseCase = ReturnType<typeof getVisitsUseCase>

export const getVisitsUseCase =
  (visitRepository: IVisitRepository) =>
  async (input: IGetVisitsUseCaseInput): Promise<PageableResult<Visit>> => {
    const result = await visitRepository.findAll(
      {
        page: input.page,
        pageSize: input.pageSize,
        filters: input.filters,
      },
      ["patient", "doctor", "location"]
    )

    return result
  }
