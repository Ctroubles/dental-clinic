import {
  AnalyticsOverview,
  IAnalyticsRepository,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetAnalyticsOverviewUseCase {
  (): Promise<AnalyticsOverview>
}

export function getAnalyticsOverviewUseCase(
  analyticsRepository: IAnalyticsRepository
): IGetAnalyticsOverviewUseCase {
  return async (): Promise<AnalyticsOverview> => {
    return analyticsRepository.getOverview()
  }
}
