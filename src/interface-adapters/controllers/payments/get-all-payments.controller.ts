import { PageableResult } from "@/application/common/pagination"
import {
  IGetAllPaymentsUseCase,
  IGetAllPaymentsUseCaseInput,
} from "@/application/use-cases/payments/get-all-payments.use-case"
import { Payment } from "@/domain/entities/payment"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetAllPaymentsController = ReturnType<
  typeof getAllPaymentsController
>

export const getAllPaymentsController =
  (getAllPaymentsUseCase: IGetAllPaymentsUseCase) =>
  async (
    input: IGetAllPaymentsUseCaseInput
  ): Promise<DataResult<PageableResult<Payment>>> => {
    const payments = await getAllPaymentsUseCase(input)
    return DataResult.success(payments)
  }
