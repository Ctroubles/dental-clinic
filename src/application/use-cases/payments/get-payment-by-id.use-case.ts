import { IPaymentRepository } from "@/application/repositories/payment.repository.interface"
import { Payment } from "@/domain/entities/payment"

export interface IGetPaymentByIdUseCase {
  (paymentId: Payment["id"]): Promise<Payment | null>
}

export function getPaymentByIdUseCase(
  paymentRepository: IPaymentRepository
): IGetPaymentByIdUseCase {
  return async (paymentId: Payment["id"]): Promise<Payment | null> => {
    return paymentRepository.findById(paymentId, [
      "charge",
      "invoice",
      "patient",
      "doctor",
    ])
  }
}
