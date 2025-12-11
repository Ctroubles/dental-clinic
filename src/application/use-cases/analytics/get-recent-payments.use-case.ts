import {
  IAnalyticsRepository,
  RecentPayment,
} from "@/application/repositories/analytics.repository.interface"

export interface IGetRecentPaymentsUseCaseInput {
  limit: number
}

export interface IGetRecentPaymentsUseCase {
  (input: IGetRecentPaymentsUseCaseInput): Promise<RecentPayment[]>
}

export function getRecentPaymentsUseCase(
  analyticsRepository: IAnalyticsRepository
): IGetRecentPaymentsUseCase {
  return async (
    input: IGetRecentPaymentsUseCaseInput
  ): Promise<RecentPayment[]> => {
    return analyticsRepository.getRecentPayments(input.limit)
  }
}
