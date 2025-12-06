import { NotFoundError } from "@/application/errors"
import { IGetPaymentByIdUseCase } from "@/application/use-cases/payments/get-payment-by-id.use-case"
import { Payment } from "@/domain/entities/payment"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetPaymentByIdController = ReturnType<
  typeof getPaymentByIdController
>

export const getPaymentByIdController =
  (getPaymentByIdUseCase: IGetPaymentByIdUseCase) =>
  async (paymentId: Payment["id"]): Promise<DataResult<Payment>> => {
    const payment = await getPaymentByIdUseCase(paymentId)
    if (!payment) {
      return DataResult.failure(
        new NotFoundError(`Pago con ID ${paymentId} no encontrado.`)
      )
    }
    return DataResult.success(payment)
  }
