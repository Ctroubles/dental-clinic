import { createModule } from "@evyweb/ioctopus"
import { createDoctorUseCase } from "@/application/use-cases/doctors/create-doctor.use-case"
import { deleteDoctorUseCase } from "@/application/use-cases/doctors/delete-doctor.use-case"
import { getDoctorUseCase } from "@/application/use-cases/doctors/get-doctor.use-case"
import { getDoctorsUseCase } from "@/application/use-cases/doctors/get-doctors.use-case"
import { updateDoctorUseCase } from "@/application/use-cases/doctors/update-doctor.use-case"
import { DoctorRepository } from "@/infrastructure/persistence/repositories/doctor.repository"
import { createDoctorController } from "@/interface-adapters/controllers/doctors/create-doctor.controller"
import { deleteDoctorController } from "@/interface-adapters/controllers/doctors/delete-doctor.controller"
import { getDoctorController } from "@/interface-adapters/controllers/doctors/get-doctor.controller"
import { getDoctorsController } from "@/interface-adapters/controllers/doctors/get-doctors.controller"
import { updateDoctorController } from "@/interface-adapters/controllers/doctors/update-doctor.controller"
import { DI_SYMBOLS } from "../types"

export function createDoctorsModule() {
  const doctorsModule = createModule()

  if (process.env.NODE_ENV === "test" && false) {
    // doctorsModule.bind(DI_SYMBOLS.IDoctorRepository).toClass(MockDoctorRepository)
  } else {
    // Repositories
    doctorsModule.bind(DI_SYMBOLS.IDoctorRepository).toClass(DoctorRepository)

    // Use Cases
    doctorsModule
      .bind(DI_SYMBOLS.ICreateDoctorUseCase)
      .toHigherOrderFunction(createDoctorUseCase, [
        DI_SYMBOLS.IDoctorRepository,
      ])

    doctorsModule
      .bind(DI_SYMBOLS.IGetDoctorsUseCase)
      .toHigherOrderFunction(getDoctorsUseCase, [DI_SYMBOLS.IDoctorRepository])

    doctorsModule
      .bind(DI_SYMBOLS.IGetDoctorUseCase)
      .toHigherOrderFunction(getDoctorUseCase, [DI_SYMBOLS.IDoctorRepository])

    doctorsModule
      .bind(DI_SYMBOLS.IUpdateDoctorUseCase)
      .toHigherOrderFunction(updateDoctorUseCase, [
        DI_SYMBOLS.IDoctorRepository,
      ])

    doctorsModule
      .bind(DI_SYMBOLS.IDeleteDoctorUseCase)
      .toHigherOrderFunction(deleteDoctorUseCase, [
        DI_SYMBOLS.IDoctorRepository,
      ])

    // Controllers
    doctorsModule
      .bind(DI_SYMBOLS.ICreateDoctorController)
      .toHigherOrderFunction(createDoctorController, [
        DI_SYMBOLS.ICreateDoctorUseCase,
      ])

    doctorsModule
      .bind(DI_SYMBOLS.IGetDoctorsController)
      .toHigherOrderFunction(getDoctorsController, [
        DI_SYMBOLS.IGetDoctorsUseCase,
      ])

    doctorsModule
      .bind(DI_SYMBOLS.IGetDoctorController)
      .toHigherOrderFunction(getDoctorController, [
        DI_SYMBOLS.IGetDoctorUseCase,
      ])

    doctorsModule
      .bind(DI_SYMBOLS.IUpdateDoctorController)
      .toHigherOrderFunction(updateDoctorController, [
        DI_SYMBOLS.IUpdateDoctorUseCase,
      ])

    doctorsModule
      .bind(DI_SYMBOLS.IDeleteDoctorController)
      .toHigherOrderFunction(deleteDoctorController, [
        DI_SYMBOLS.IDeleteDoctorUseCase,
        DI_SYMBOLS.IGetDoctorUseCase,
      ])
  }

  return doctorsModule
}
