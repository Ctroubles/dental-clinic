import { PageableResult } from "@/application/common/pagination"
import {
  IGetVisitsUseCase,
  IGetVisitsUseCaseInput,
} from "@/application/use-cases/visits/get-visits.use-case"
import { Visit } from "@/domain/entities/visit"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetVisitsController = ReturnType<typeof getVisitsController>

export const getVisitsController =
  (getVisitsUseCase: IGetVisitsUseCase) =>
  async (
    input: IGetVisitsUseCaseInput
  ): Promise<DataResult<PageableResult<Visit>>> => {
    const response = await getVisitsUseCase(input)
    return DataResult.success(response)
  }
