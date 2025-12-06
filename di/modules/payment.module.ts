import { createModule } from "@evyweb/ioctopus"
import { getAllPaymentsUseCase } from "@/application/use-cases/payments/get-all-payments.use-case"
import { getPaymentByIdUseCase } from "@/application/use-cases/payments/get-payment-by-id.use-case"
import { PaymentRepository } from "@/infrastructure/persistence/repositories/payment.repository"
import { getAllPaymentsController } from "@/interface-adapters/controllers/payments/get-all-payments.controller"
import { getPaymentByIdController } from "@/interface-adapters/controllers/payments/get-payment-by-id.controller"
import { DI_SYMBOLS } from "../types"

export function createPaymentModule() {
  const paymentModule = createModule()

  if (process.env.NODE_ENV === "test" && false) {
    // paymentModule.bind(DI_SYMBOLS.IPaymentRepository).toClass(MockPaymentRepository)
  } else {
    // Repositories
    paymentModule.bind(DI_SYMBOLS.IPaymentRepository).toClass(PaymentRepository)
  }

  // Use Cases
  paymentModule
    .bind(DI_SYMBOLS.IGetAllPaymentsUseCase)
    .toHigherOrderFunction(getAllPaymentsUseCase, [
      DI_SYMBOLS.IPaymentRepository,
    ])
  paymentModule
    .bind(DI_SYMBOLS.IGetPaymentByIdUseCase)
    .toHigherOrderFunction(getPaymentByIdUseCase, [
      DI_SYMBOLS.IPaymentRepository,
    ])

  // Controllers
  paymentModule
    .bind(DI_SYMBOLS.IGetAllPaymentsController)
    .toHigherOrderFunction(getAllPaymentsController, [
      DI_SYMBOLS.IGetAllPaymentsUseCase,
    ])
  paymentModule
    .bind(DI_SYMBOLS.IGetPaymentByIdController)
    .toHigherOrderFunction(getPaymentByIdController, [
      DI_SYMBOLS.IGetPaymentByIdUseCase,
    ])

  return paymentModule
}
