import {
  DailyRevenue,
  IAnalyticsRepository,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetDailyRevenueUseCaseInput {
  from: Date
  to: Date
}

export interface IGetDailyRevenueUseCase {
  (input: IGetDailyRevenueUseCaseInput): Promise<DailyRevenue[]>
}

export function getDailyRevenueUseCase(
  analyticsRepository: IAnalyticsRepository
): IGetDailyRevenueUseCase {
  return async (
    input: IGetDailyRevenueUseCaseInput
  ): Promise<DailyRevenue[]> => {
    return analyticsRepository.getDailyRevenue(input.from, input.to)
  }
}
