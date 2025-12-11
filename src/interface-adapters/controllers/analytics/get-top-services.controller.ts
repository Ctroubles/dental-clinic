import { TopService } from "@/application/repositories/analytics.repository.interface"
import {
  IGetTopServicesUseCase,
  IGetTopServicesUseCaseInput,
} from "@/application/use-cases/analytics/get-top-services.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetTopServicesController = ReturnType<
  typeof getTopServicesController
>

export const getTopServicesController =
  (getTopServicesUseCase: IGetTopServicesUseCase) =>
  async (
    input: IGetTopServicesUseCaseInput
  ): Promise<DataResult<TopService[]>> => {
    const topServices = await getTopServicesUseCase(input)
    return DataResult.success(topServices)
  }
