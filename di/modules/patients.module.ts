import { createModule } from "@evyweb/ioctopus"
import { createPatientUseCase } from "@/application/use-cases/patients/create-patient.use-case"
import { deletePatientUseCase } from "@/application/use-cases/patients/delete-patient.use-case"
import { getPatientUseCase } from "@/application/use-cases/patients/get-patient.use-case"
import { getPatientsUseCase } from "@/application/use-cases/patients/get-patients.use-case"
import { lookupPatientByDniUseCase } from "@/application/use-cases/patients/lookup-patient-by-dni.use-case"
import { updatePatientUseCase } from "@/application/use-cases/patients/update-patient.use-case"
import { PatientRepository } from "@/infrastructure/persistence/repositories/patient.repository"
import { ApiPeruDevService } from "@/infrastructure/services/api-peru-dev.service"
import { ConsultasPeruService } from "@/infrastructure/services/consultas-peru.service"
import { createPatientController } from "@/interface-adapters/controllers/patients/create-patient.controller"
import { deletePatientController } from "@/interface-adapters/controllers/patients/delete-patient.controller"
import { getPatientController } from "@/interface-adapters/controllers/patients/get-patient.controller"
import { getPatientsController } from "@/interface-adapters/controllers/patients/get-patients.controller"
import { lookupPatientByDniController } from "@/interface-adapters/controllers/patients/lookup-patient-by-dni.controller"
import { updatePatientController } from "@/interface-adapters/controllers/patients/update-patient.controller"
import { DI_SYMBOLS } from "../types"

export function createPatientsModule() {
  const patientsModule = createModule()

  if (process.env.NODE_ENV === "test" && false) {
    // todosModule.bind(DI_SYMBOLS.ITodosRepository).toClass(MockTodosRepository)
  } else {
    // Services (External)
    patientsModule
      .bind(DI_SYMBOLS.IPatientLookupService)
      .toClass(ConsultasPeruService)

    // Repositories
    patientsModule
      .bind(DI_SYMBOLS.IPatientRepository)
      .toClass(PatientRepository)

    // Use Cases
    patientsModule
      .bind(DI_SYMBOLS.ICreatePatientUseCase)
      .toHigherOrderFunction(createPatientUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    patientsModule
      .bind(DI_SYMBOLS.IGetPatientsUseCase)
      .toHigherOrderFunction(getPatientsUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    patientsModule
      .bind(DI_SYMBOLS.IGetPatientUseCase)
      .toHigherOrderFunction(getPatientUseCase, [DI_SYMBOLS.IPatientRepository])

    patientsModule
      .bind(DI_SYMBOLS.IUpdatePatientUseCase)
      .toHigherOrderFunction(updatePatientUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    patientsModule
      .bind(DI_SYMBOLS.IDeletePatientUseCase)
      .toHigherOrderFunction(deletePatientUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    patientsModule
      .bind(DI_SYMBOLS.ILookupPatientByDniUseCase)
      .toHigherOrderFunction(lookupPatientByDniUseCase, [
        DI_SYMBOLS.IPatientLookupService,
      ])

    // Controllers
    patientsModule
      .bind(DI_SYMBOLS.ICreatePatientController)
      .toHigherOrderFunction(createPatientController, [
        DI_SYMBOLS.ICreatePatientUseCase,
      ])

    patientsModule
      .bind(DI_SYMBOLS.IGetPatientsController)
      .toHigherOrderFunction(getPatientsController, [
        DI_SYMBOLS.IGetPatientsUseCase,
      ])

    patientsModule
      .bind(DI_SYMBOLS.IGetPatientController)
      .toHigherOrderFunction(getPatientController, [
        DI_SYMBOLS.IGetPatientUseCase,
      ])

    patientsModule
      .bind(DI_SYMBOLS.IUpdatePatientController)
      .toHigherOrderFunction(updatePatientController, [
        DI_SYMBOLS.IUpdatePatientUseCase,
      ])

    patientsModule
      .bind(DI_SYMBOLS.IDeletePatientController)
      .toHigherOrderFunction(deletePatientController, [
        DI_SYMBOLS.IDeletePatientUseCase,
      ])

    patientsModule
      .bind(DI_SYMBOLS.ILookupPatientByDniController)
      .toHigherOrderFunction(lookupPatientByDniController, [
        DI_SYMBOLS.ILookupPatientByDniUseCase,
      ])
  }

  return patientsModule
}
