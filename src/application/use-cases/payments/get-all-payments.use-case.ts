import {
  IPageableRequest,
  PageableResult,
} from "@/application/common/pagination"
import {
  IPaymentRepository,
  PaymentsFilters,
} from "@/application/repositories/payment.repository.interface"
import { Payment } from "@/domain/entities/payment"

export interface IGetAllPaymentsUseCaseInput
  extends IPageableRequest<PaymentsFilters> {}

export interface IGetAllPaymentsUseCase {
  (input: IGetAllPaymentsUseCaseInput): Promise<PageableResult<Payment>>
}

export function getAllPaymentsUseCase(
  paymentRepository: IPaymentRepository
): IGetAllPaymentsUseCase {
  return async (
    input: IGetAllPaymentsUseCaseInput
  ): Promise<PageableResult<Payment>> => {
    return paymentRepository.findAll(
      {
        page: input.page,
        pageSize: input.pageSize,
        filters: input.filters,
      },
      ["charge", "patient", "doctor"]
    )
  }
}
