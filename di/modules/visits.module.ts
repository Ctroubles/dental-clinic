import { createModule } from "@evyweb/ioctopus"
import { createVisitUseCase } from "@/application/use-cases/visits/create-visit.use-case"
import { deleteVisitUseCase } from "@/application/use-cases/visits/delete-visit.use-case"
import { getVisitByIdUseCase } from "@/application/use-cases/visits/get-visit.use-case"
import { getVisitsByPatientUseCase } from "@/application/use-cases/visits/get-visits-by-patient.use-case"
import { getVisitsUseCase } from "@/application/use-cases/visits/get-visits.use-case"
import { registerChargesForVisitUseCase } from "@/application/use-cases/visits/register-charges-for-visit"
import { updateVisitUseCase } from "@/application/use-cases/visits/update-visit.use-case"
import { VisitRepository } from "@/infrastructure/persistence/repositories/visit.repository"
import { createVisitController } from "@/interface-adapters/controllers/visits/create-visit.controller"
import { deleteVisitController } from "@/interface-adapters/controllers/visits/delete-visit.controller"
import { getVisitByIdController } from "@/interface-adapters/controllers/visits/get-visit.controller"
import { getVisitsByPatientController } from "@/interface-adapters/controllers/visits/get-visits-by-patient.controller"
import { getVisitsController } from "@/interface-adapters/controllers/visits/get-visits.controller"
import { registerChargesForVisitController } from "@/interface-adapters/controllers/visits/register-charges-for-visit.controller"
import { updateVisitController } from "@/interface-adapters/controllers/visits/update-visit.controller"
import { DI_SYMBOLS } from "../types"

export function createVisitsModule() {
  const visitsModule = createModule()

  if (process.env.NODE_ENV === "test" && false) {
    // visitsModule.bind(DI_SYMBOLS.IVisitRepository).toClass(MockVisitRepository)
  } else {
    // Repositories
    visitsModule.bind(DI_SYMBOLS.IVisitRepository).toClass(VisitRepository)

    // Use Cases
    visitsModule
      .bind(DI_SYMBOLS.ICreateVisitUseCase)
      .toHigherOrderFunction(createVisitUseCase, [DI_SYMBOLS.IVisitRepository])

    visitsModule
      .bind(DI_SYMBOLS.IGetVisitsUseCase)
      .toHigherOrderFunction(getVisitsUseCase, [DI_SYMBOLS.IVisitRepository])

    visitsModule
      .bind(DI_SYMBOLS.IGetVisitUseCase)
      .toHigherOrderFunction(getVisitByIdUseCase, [DI_SYMBOLS.IVisitRepository])

    visitsModule
      .bind(DI_SYMBOLS.IGetVisitsByPatientUseCase)
      .toHigherOrderFunction(getVisitsByPatientUseCase, [
        DI_SYMBOLS.IVisitRepository,
      ])

    visitsModule
      .bind(DI_SYMBOLS.IUpdateVisitUseCase)
      .toHigherOrderFunction(updateVisitUseCase, [DI_SYMBOLS.IVisitRepository])

    visitsModule
      .bind(DI_SYMBOLS.IDeleteVisitUseCase)
      .toHigherOrderFunction(deleteVisitUseCase, [DI_SYMBOLS.IVisitRepository])

    visitsModule
      .bind(DI_SYMBOLS.IRegisterChargesForVisitUseCase)
      .toHigherOrderFunction(registerChargesForVisitUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
        DI_SYMBOLS.IPaymentRepository,
        DI_SYMBOLS.IVisitRepository,
      ])

    // Controllers
    visitsModule
      .bind(DI_SYMBOLS.ICreateVisitController)
      .toHigherOrderFunction(createVisitController, [
        DI_SYMBOLS.ICreateVisitUseCase,
      ])

    visitsModule
      .bind(DI_SYMBOLS.IGetVisitsController)
      .toHigherOrderFunction(getVisitsController, [
        DI_SYMBOLS.IGetVisitsUseCase,
      ])

    visitsModule
      .bind(DI_SYMBOLS.IGetVisitController)
      .toHigherOrderFunction(getVisitByIdController, [
        DI_SYMBOLS.IGetVisitUseCase,
      ])

    visitsModule
      .bind(DI_SYMBOLS.IGetVisitsByPatientController)
      .toHigherOrderFunction(getVisitsByPatientController, [
        DI_SYMBOLS.IGetVisitsByPatientUseCase,
      ])

    visitsModule
      .bind(DI_SYMBOLS.IUpdateVisitController)
      .toHigherOrderFunction(updateVisitController, [
        DI_SYMBOLS.IUpdateVisitUseCase,
      ])

    visitsModule
      .bind(DI_SYMBOLS.IDeleteVisitController)
      .toHigherOrderFunction(deleteVisitController, [
        DI_SYMBOLS.IDeleteVisitUseCase,
      ])

    visitsModule
      .bind(DI_SYMBOLS.IRegisterChargesForVisitController)
      .toHigherOrderFunction(registerChargesForVisitController, [
        DI_SYMBOLS.IRegisterChargesForVisitUseCase,
      ])
  }

  return visitsModule
}
