import { RecentPayment } from "@/application/repositories/analytics.repository.interface"
import {
  IGetRecentPaymentsUseCase,
  IGetRecentPaymentsUseCaseInput,
} from "@/application/use-cases/analytics/get-recent-payments.use-case"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetRecentPaymentsController = ReturnType<
  typeof getRecentPaymentsController
>

export const getRecentPaymentsController =
  (getRecentPaymentsUseCase: IGetRecentPaymentsUseCase) =>
  async (
    input: IGetRecentPaymentsUseCaseInput
  ): Promise<DataResult<RecentPayment[]>> => {
    const recentPayments = await getRecentPaymentsUseCase(input)
    return DataResult.success(recentPayments)
  }
