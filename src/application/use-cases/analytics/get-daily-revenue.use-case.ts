import {
  DailyRevenue,
  DateRange,
  IAnalyticsRepository,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetDailyRevenueUseCaseInput {
  dateRange: DateRange
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
    return analyticsRepository.getDailyRevenue(input.dateRange)
  }
}
