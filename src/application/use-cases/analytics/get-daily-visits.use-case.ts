import {
  DailyVisit,
  DateRange,
  IAnalyticsRepository,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetDailyVisitsUseCaseInput {
  dateRange: DateRange
}

export interface IGetDailyVisitsUseCase {
  (input: IGetDailyVisitsUseCaseInput): Promise<DailyVisit[]>
}

export function getDailyVisitsUseCase(
  analyticsRepository: IAnalyticsRepository
): IGetDailyVisitsUseCase {
  return async (input: IGetDailyVisitsUseCaseInput): Promise<DailyVisit[]> => {
    return analyticsRepository.getDailyVisits(input.dateRange)
  }
}
