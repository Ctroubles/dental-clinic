import { DailyVisit } from "@/application/repositories/analytics.repository.interface"
import {
  IGetDailyVisitsUseCase,
  IGetDailyVisitsUseCaseInput,
} from "@/application/use-cases/analytics/get-daily-visits.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetDailyVisitsController = ReturnType<
  typeof getDailyVisitsController
>

export const getDailyVisitsController =
  (getDailyVisitsUseCase: IGetDailyVisitsUseCase) =>
  async (
    input: IGetDailyVisitsUseCaseInput
  ): Promise<DataResult<DailyVisit[]>> => {
    const dailyVisits = await getDailyVisitsUseCase(input)
    return DataResult.success(dailyVisits)
  }
