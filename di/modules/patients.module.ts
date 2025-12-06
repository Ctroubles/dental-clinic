import { createModule } from "@evyweb/ioctopus"
import { createPatientUseCase } from "@/application/use-cases/patients/create-patient.use-case"
import { deletePatientUseCase } from "@/application/use-cases/patients/delete-patient.use-case"
import { getPatientUseCase } from "@/application/use-cases/patients/get-patient.use-case"
import { getPatientsUseCase } from "@/application/use-cases/patients/get-patients.use-case"
import { updatePatientUseCase } from "@/application/use-cases/patients/update-patient.use-case"
import { PatientRepository } from "@/infrastructure/persistence/repositories/patient.repository"
import { createPatientController } from "@/interface-adapters/controllers/patients/create-patient.controller"
import { deletePatientController } from "@/interface-adapters/controllers/patients/delete-patient.controller"
import { getPatientController } from "@/interface-adapters/controllers/patients/get-patient.controller"
import { getPatientsController } from "@/interface-adapters/controllers/patients/get-patients.controller"
import { updatePatientController } from "@/interface-adapters/controllers/patients/update-patient.controller"
import { DI_SYMBOLS } from "../types"

export function createPatientsModule() {
  const todosModule = createModule()

  if (process.env.NODE_ENV === "test" && false) {
    // todosModule.bind(DI_SYMBOLS.ITodosRepository).toClass(MockTodosRepository)
  } else {
    // Repositories
    todosModule.bind(DI_SYMBOLS.IPatientRepository).toClass(PatientRepository)

    // Use Cases
    todosModule
      .bind(DI_SYMBOLS.ICreatePatientUseCase)
      .toHigherOrderFunction(createPatientUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    todosModule
      .bind(DI_SYMBOLS.IGetPatientsUseCase)
      .toHigherOrderFunction(getPatientsUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    todosModule
      .bind(DI_SYMBOLS.IGetPatientUseCase)
      .toHigherOrderFunction(getPatientUseCase, [DI_SYMBOLS.IPatientRepository])

    todosModule
      .bind(DI_SYMBOLS.IUpdatePatientUseCase)
      .toHigherOrderFunction(updatePatientUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    todosModule
      .bind(DI_SYMBOLS.IDeletePatientUseCase)
      .toHigherOrderFunction(deletePatientUseCase, [
        DI_SYMBOLS.IPatientRepository,
      ])

    // Controllers
    todosModule
      .bind(DI_SYMBOLS.ICreatePatientController)
      .toHigherOrderFunction(createPatientController, [
        DI_SYMBOLS.ICreatePatientUseCase,
      ])

    todosModule
      .bind(DI_SYMBOLS.IGetPatientsController)
      .toHigherOrderFunction(getPatientsController, [
        DI_SYMBOLS.IGetPatientsUseCase,
      ])

    todosModule
      .bind(DI_SYMBOLS.IGetPatientController)
      .toHigherOrderFunction(getPatientController, [
        DI_SYMBOLS.IGetPatientUseCase,
      ])

    todosModule
      .bind(DI_SYMBOLS.IUpdatePatientController)
      .toHigherOrderFunction(updatePatientController, [
        DI_SYMBOLS.IUpdatePatientUseCase,
      ])

    todosModule
      .bind(DI_SYMBOLS.IDeletePatientController)
      .toHigherOrderFunction(deletePatientController, [
        DI_SYMBOLS.IDeletePatientUseCase,
      ])
  }

  return todosModule
}
