import {
  IAnalyticsRepository,
  TopService,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetTopServicesUseCaseInput {
  limit: number
}

export interface IGetTopServicesUseCase {
  (input: IGetTopServicesUseCaseInput): Promise<TopService[]>
}

export function getTopServicesUseCase(
  analyticsRepository: IAnalyticsRepository
): IGetTopServicesUseCase {
  return async (input: IGetTopServicesUseCaseInput): Promise<TopService[]> => {
    return analyticsRepository.getTopServices(input.limit)
  }
}
