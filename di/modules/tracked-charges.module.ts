import { createModule } from "@evyweb/ioctopus"
import { createTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/create-tracked-charge.use-case"
import { deleteTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/delete-tracked-charge.use-case"
import { getTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charge.use-case"
import { getTrackedChargesByPatientUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges-by-patient.use-case"
import { getTrackedChargesByVisitUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges-by-visit.use-case"
import { getTrackedChargesUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import { updateTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/update-tracked-charge.use-case"
import { TrackedChargesRepository } from "@/infrastructure/persistence/repositories/tracked-charges.repository"
import { createTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/create-tracked-charge.controller"
import { deleteTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/delete-tracked-charge.controller"
import { getTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charge.controller"
import { getTrackedChargesByPatientController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charges-by-patient.controller"
import { getTrackedChargesByVisitController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charges-by-visit.controller"
import { getTrackedChargesController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charges.controller"
import { updateTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/update-tracked-charge.controller"
import { DI_SYMBOLS } from "../types"

export function createTrackedChargesModule() {
  const trackedChargesModule = createModule()

  if (process.env.NODE_ENV === "test" && false) {
    // trackedChargesModule.bind(DI_SYMBOLS.ITrackedChargesRepository).toClass(MockTrackedChargesRepository)
  } else {
    // Repositories
    trackedChargesModule
      .bind(DI_SYMBOLS.ITrackedChargesRepository)
      .toClass(TrackedChargesRepository)

    // Use Cases
    trackedChargesModule
      .bind(DI_SYMBOLS.ICreateTrackedChargeUseCase)
      .toHigherOrderFunction(createTrackedChargeUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargesUseCase)
      .toHigherOrderFunction(getTrackedChargesUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargeUseCase)
      .toHigherOrderFunction(getTrackedChargeUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IUpdateTrackedChargeUseCase)
      .toHigherOrderFunction(updateTrackedChargeUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargesByPatientUseCase)
      .toHigherOrderFunction(getTrackedChargesByPatientUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargesByVisitUseCase)
      .toHigherOrderFunction(getTrackedChargesByVisitUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IDeleteTrackedChargeUseCase)
      .toHigherOrderFunction(deleteTrackedChargeUseCase, [
        DI_SYMBOLS.ITrackedChargesRepository,
      ])

    // Controllers
    trackedChargesModule
      .bind(DI_SYMBOLS.ICreateTrackedChargeController)
      .toHigherOrderFunction(createTrackedChargeController, [
        DI_SYMBOLS.ICreateTrackedChargeUseCase,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargesController)
      .toHigherOrderFunction(getTrackedChargesController, [
        DI_SYMBOLS.IGetTrackedChargesUseCase,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargeController)
      .toHigherOrderFunction(getTrackedChargeController, [
        DI_SYMBOLS.IGetTrackedChargeUseCase,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IUpdateTrackedChargeController)
      .toHigherOrderFunction(updateTrackedChargeController, [
        DI_SYMBOLS.IUpdateTrackedChargeUseCase,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargesByPatientController)
      .toHigherOrderFunction(getTrackedChargesByPatientController, [
        DI_SYMBOLS.IGetTrackedChargesByPatientUseCase,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IGetTrackedChargesByVisitController)
      .toHigherOrderFunction(getTrackedChargesByVisitController, [
        DI_SYMBOLS.IGetTrackedChargesByVisitUseCase,
      ])

    trackedChargesModule
      .bind(DI_SYMBOLS.IDeleteTrackedChargeController)
      .toHigherOrderFunction(deleteTrackedChargeController, [
        DI_SYMBOLS.IDeleteTrackedChargeUseCase,
      ])
  }

  return trackedChargesModule
}
