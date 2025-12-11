import { MonthlyVisit } from "@/application/repositories/analytics.repository.interface"
import {
  IGetMonthlyVisitsUseCase,
  IGetMonthlyVisitsUseCaseInput,
} from "@/application/use-cases/analytics/get-monthly-visits.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetMonthlyVisitsController = ReturnType<
  typeof getMonthlyVisitsController
>

export const getMonthlyVisitsController =
  (getMonthlyVisitsUseCase: IGetMonthlyVisitsUseCase) =>
  async (
    input: IGetMonthlyVisitsUseCaseInput
  ): Promise<DataResult<MonthlyVisit[]>> => {
    const monthlyVisits = await getMonthlyVisitsUseCase(input)
    return DataResult.success(monthlyVisits)
  }
