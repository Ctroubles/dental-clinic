import { AnalyticsOverview } from "@/application/repositories/analytics.repository.interface"
import { IGetAnalyticsOverviewUseCase } from "@/application/use-cases/analytics/get-analytics-overview.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetAnalyticsOverviewController = ReturnType<
  typeof getAnalyticsOverviewController
>

export const getAnalyticsOverviewController =
  (getAnalyticsOverviewUseCase: IGetAnalyticsOverviewUseCase) =>
  async (): Promise<DataResult<AnalyticsOverview>> => {
    const overview = await getAnalyticsOverviewUseCase()
    return DataResult.success(overview)
  }
