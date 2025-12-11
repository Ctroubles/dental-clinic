import { DailyRevenue } from "@/application/repositories/analytics.repository.interface"
import {
  IGetDailyRevenueUseCase,
  IGetDailyRevenueUseCaseInput,
} from "@/application/use-cases/analytics/get-daily-revenue.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetDailyRevenueController = ReturnType<
  typeof getDailyRevenueController
>

export const getDailyRevenueController =
  (getDailyRevenueUseCase: IGetDailyRevenueUseCase) =>
  async (
    input: IGetDailyRevenueUseCaseInput
  ): Promise<DataResult<DailyRevenue[]>> => {
    const dailyRevenue = await getDailyRevenueUseCase(input)
    return DataResult.success(dailyRevenue)
  }
