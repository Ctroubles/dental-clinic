import {
  AnalyticsOverview,
  DateRange,
  IAnalyticsRepository,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetAnalyticsOverviewUseCaseInput {
  dateRange: DateRange
}

export interface IGetAnalyticsOverviewUseCase {
  (input: IGetAnalyticsOverviewUseCaseInput): Promise<AnalyticsOverview>
}

export function getAnalyticsOverviewUseCase(
  analyticsRepository: IAnalyticsRepository
): IGetAnalyticsOverviewUseCase {
  return async (
    input: IGetAnalyticsOverviewUseCaseInput
  ): Promise<AnalyticsOverview> => {
    return analyticsRepository.getOverview(input.dateRange)
  }
}
