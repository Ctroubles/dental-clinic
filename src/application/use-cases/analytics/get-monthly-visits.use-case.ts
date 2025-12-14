import {
  DateRange,
  IAnalyticsRepository,
  MonthlyVisit,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetMonthlyVisitsUseCaseInput {
  dateRange: DateRange
}

export interface IGetMonthlyVisitsUseCase {
  (input: IGetMonthlyVisitsUseCaseInput): Promise<MonthlyVisit[]>
}

export function getMonthlyVisitsUseCase(
  analyticsRepository: IAnalyticsRepository
): IGetMonthlyVisitsUseCase {
  return async (
    input: IGetMonthlyVisitsUseCaseInput
  ): Promise<MonthlyVisit[]> => {
    return analyticsRepository.getMonthlyVisits(input.dateRange)
  }
}
