import { type IDoctorRepository } from "@/application/repositories/doctor.repository.interface"
import { type IItemRepository } from "@/application/repositories/item.repository.interface"
import { type ILocationRepository } from "@/application/repositories/location.repository.interface"
import { IPatientRepository } from "@/application/repositories/patient.repository.interface"
import { type IPaymentRepository } from "@/application/repositories/payment.repository.interface"
import { type ITrackedChargesRepository } from "@/application/repositories/tracked-charges.repository.interface"
import { type IVisitRepository } from "@/application/repositories/visit.repository.interface"
import { ICreateDoctorUseCase } from "@/application/use-cases/doctors/create-doctor.use-case"
import { type IDeleteDoctorUseCase } from "@/application/use-cases/doctors/delete-doctor.use-case"
import { type IGetDoctorUseCase } from "@/application/use-cases/doctors/get-doctor.use-case"
import { type IGetDoctorsUseCase } from "@/application/use-cases/doctors/get-doctors.use-case"
import { type IUpdateDoctorUseCase } from "@/application/use-cases/doctors/update-doctor.use-case"
import { type ICreateItemUseCase } from "@/application/use-cases/items/create-item.use-case"
import { type IDeleteItemUseCase } from "@/application/use-cases/items/delete-item.use-case"
import { type IGetItemUseCase } from "@/application/use-cases/items/get-item.use-case"
import { type IGetItemsUseCase } from "@/application/use-cases/items/get-items.use-case"
import { type IToggleItemStatusUseCase } from "@/application/use-cases/items/toggle-item-status.use-case"
import { type IUpdateItemUseCase } from "@/application/use-cases/items/update-item.use-case"
import { type ICreateLocationUseCase } from "@/application/use-cases/locations/create-location.use-case"
import { type IDeleteLocationUseCase } from "@/application/use-cases/locations/delete-location.use-case"
import { type IGetLocationUseCase } from "@/application/use-cases/locations/get-location.use-case"
import { type IGetLocationsUseCase } from "@/application/use-cases/locations/get-locations.use-case"
import { type IUpdateLocationUseCase } from "@/application/use-cases/locations/update-location.use-case"
import { type ICreatePatientUseCase } from "@/application/use-cases/patients/create-patient.use-case"
import { type IDeletePatientUseCase } from "@/application/use-cases/patients/delete-patient.use-case"
import { type IGetPatientUseCase } from "@/application/use-cases/patients/get-patient.use-case"
import { type IGetPatientsUseCase } from "@/application/use-cases/patients/get-patients.use-case"
import { type IUpdatePatientUseCase } from "@/application/use-cases/patients/update-patient.use-case"
import { type IGetAllPaymentsUseCase } from "@/application/use-cases/payments/get-all-payments.use-case"
import { IGetPaymentByIdUseCase } from "@/application/use-cases/payments/get-payment-by-id.use-case"
import { type ICreateTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/create-tracked-charge.use-case"
import { type IDeleteTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/delete-tracked-charge.use-case"
import { type IGetTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charge.use-case"
import { type IGetTrackedChargesByPatientUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges-by-patient.use-case"
import { type IGetTrackedChargesByVisitUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges-by-visit.use-case"
import { type IGetTrackedChargesUseCase } from "@/application/use-cases/tracked-charges/get-tracked-charges.use-case"
import { type IUpdateTrackedChargeUseCase } from "@/application/use-cases/tracked-charges/update-tracked-charge.use-case"
import { type ICreateVisitUseCase } from "@/application/use-cases/visits/create-visit.use-case"
import { type IDeleteVisitUseCase } from "@/application/use-cases/visits/delete-visit.use-case"
import { type IGetVisitByIdUseCase } from "@/application/use-cases/visits/get-visit.use-case"
import { type IGetVisitsByPatientUseCase } from "@/application/use-cases/visits/get-visits-by-patient.use-case"
import { type IGetVisitsUseCase } from "@/application/use-cases/visits/get-visits.use-case"
import { type IRegisterChargesForVisitUseCase } from "@/application/use-cases/visits/register-charges-for-visit"
import { type IUpdateVisitUseCase } from "@/application/use-cases/visits/update-visit.use-case"
import { ICreateDoctorController } from "@/interface-adapters/controllers/doctors/create-doctor.controller"
import { type IDeleteDoctorController } from "@/interface-adapters/controllers/doctors/delete-doctor.controller"
import { type IGetDoctorController } from "@/interface-adapters/controllers/doctors/get-doctor.controller"
import { type IGetDoctorsController } from "@/interface-adapters/controllers/doctors/get-doctors.controller"
import { type IUpdateDoctorController } from "@/interface-adapters/controllers/doctors/update-doctor.controller"
import { ICreateItemController } from "@/interface-adapters/controllers/items/create-item.controller"
import { IDeleteItemController } from "@/interface-adapters/controllers/items/delete-item.controller"
import { IGetItemController } from "@/interface-adapters/controllers/items/get-item.controller"
import { IGetItemsController } from "@/interface-adapters/controllers/items/get-items.controller"
import { type IToggleItemStatusController } from "@/interface-adapters/controllers/items/toggle-item-status.controller"
import { type IUpdateItemController } from "@/interface-adapters/controllers/items/update-item.controller"
import { type ICreateLocationController } from "@/interface-adapters/controllers/locations/create-location.controller"
import { type IDeleteLocationController } from "@/interface-adapters/controllers/locations/delete-location.controller"
import { type IGetLocationController } from "@/interface-adapters/controllers/locations/get-location.controller"
import { type IGetLocationsController } from "@/interface-adapters/controllers/locations/get-locations.controller"
import { type IUpdateLocationController } from "@/interface-adapters/controllers/locations/update-location.controller"
import { type ICreatePatientController } from "@/interface-adapters/controllers/patients/create-patient.controller"
import { type IDeletePatientController } from "@/interface-adapters/controllers/patients/delete-patient.controller"
import { IGetPatientController } from "@/interface-adapters/controllers/patients/get-patient.controller"
import { type IGetPatientsController } from "@/interface-adapters/controllers/patients/get-patients.controller"
import { type IUpdatePatientController } from "@/interface-adapters/controllers/patients/update-patient.controller"
import { IGetAllPaymentsController } from "@/interface-adapters/controllers/payments/get-all-payments.controller"
import { type IGetPaymentByIdController } from "@/interface-adapters/controllers/payments/get-payment-by-id.controller"
import { type ICreateTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/create-tracked-charge.controller"
import { type IDeleteTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/delete-tracked-charge.controller"
import { type IGetTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charge.controller"
import { type IGetTrackedChargesByPatientController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charges-by-patient.controller"
import { type IGetTrackedChargesByVisitController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charges-by-visit.controller"
import { type IGetTrackedChargesController } from "@/interface-adapters/controllers/tracked-charges/get-tracked-charges.controller"
import { type IUpdateTrackedChargeController } from "@/interface-adapters/controllers/tracked-charges/update-tracked-charge.controller"
import { type ICreateVisitController } from "@/interface-adapters/controllers/visits/create-visit.controller"
import { type IDeleteVisitController } from "@/interface-adapters/controllers/visits/delete-visit.controller"
import { type IGetVisitByIdController } from "@/interface-adapters/controllers/visits/get-visit.controller"
import { type IGetVisitsByPatientController } from "@/interface-adapters/controllers/visits/get-visits-by-patient.controller"
import { type IGetVisitsController } from "@/interface-adapters/controllers/visits/get-visits.controller"
import { type IRegisterChargesForVisitController } from "@/interface-adapters/controllers/visits/register-charges-for-visit.controller"
import { type IUpdateVisitController } from "@/interface-adapters/controllers/visits/update-visit.controller"

export const DI_SYMBOLS = {
  // Services
  IDoctorRepository: Symbol.for("IDoctorRepository"),
  IPatientRepository: Symbol.for("IPatientRepository"),
  IItemRepository: Symbol.for("IItemRepository"),
  IPaymentRepository: Symbol.for("IPaymentRepository"),
  ITrackedChargesRepository: Symbol.for("ITrackedChargesRepository"),
  IVisitRepository: Symbol.for("IVisitRepository"),
  ILocationRepository: Symbol.for("ILocationRepository"),

  // Use Cases
  ICreateDoctorUseCase: Symbol.for("ICreateDoctorUseCase"),
  IGetDoctorUseCase: Symbol.for("IGetDoctorUseCase"),
  IGetDoctorsUseCase: Symbol.for("IGetDoctorsUseCase"),
  IUpdateDoctorUseCase: Symbol.for("IUpdateDoctorUseCase"),
  IDeleteDoctorUseCase: Symbol.for("IDeleteDoctorUseCase"),
  ICreatePatientUseCase: Symbol.for("ICreatePatientUseCase"),
  IGetPatientUseCase: Symbol.for("IGetPatientUseCase"),
  IGetPatientsUseCase: Symbol.for("IGetPatientsUseCase"),
  IUpdatePatientUseCase: Symbol.for("IUpdatePatientUseCase"),
  IDeletePatientUseCase: Symbol.for("IDeletePatientUseCase"),
  ICreateVisitUseCase: Symbol.for("ICreateVisitUseCase"),
  IGetVisitUseCase: Symbol.for("IGetVisitUseCase"),
  IGetVisitsUseCase: Symbol.for("IGetVisitsUseCase"),
  IGetVisitsByPatientUseCase: Symbol.for("IGetVisitsByPatientUseCase"),
  IRegisterChargesForVisitUseCase: Symbol.for(
    "IRegisterChargesForVisitUseCase"
  ),
  IUpdateVisitUseCase: Symbol.for("IUpdateVisitUseCase"),
  IDeleteVisitUseCase: Symbol.for("IDeleteVisitUseCase"),
  ICreateItemUseCase: Symbol.for("ICreateItemUseCase"),
  IGetItemUseCase: Symbol.for("IGetItemUseCase"),
  IGetItemsUseCase: Symbol.for("IGetItemsUseCase"),
  IUpdateItemUseCase: Symbol.for("IUpdateItemUseCase"),
  IDeleteItemUseCase: Symbol.for("IDeleteItemUseCase"),
  IToggleItemStatusUseCase: Symbol.for("IToggleItemStatusUseCase"),
  ICreateTrackedChargeUseCase: Symbol.for("ICreateTrackedChargeUseCase"),
  IDeleteTrackedChargeUseCase: Symbol.for("IDeleteTrackedChargeUseCase"),
  IGetTrackedChargeUseCase: Symbol.for("IGetTrackedChargeUseCase"),
  IGetTrackedChargesUseCase: Symbol.for("IGetTrackedChargesUseCase"),
  IUpdateTrackedChargeUseCase: Symbol.for("IUpdateTrackedChargeUseCase"),
  IGetTrackedChargesByPatientUseCase: Symbol.for(
    "IGetTrackedChargesByPatientUseCase"
  ),
  IGetTrackedChargesByVisitUseCase: Symbol.for(
    "IGetTrackedChargesByVisitUseCase"
  ),
  IGetAllPaymentsUseCase: Symbol.for("IGetAllPaymentsUseCase"),
  IGetPaymentByIdUseCase: Symbol.for("IGetPaymentByIdUseCase"),
  IGetLocationsUseCase: Symbol.for("IGetLocationsUseCase"),
  ICreateLocationUseCase: Symbol.for("ICreateLocationUseCase"),
  IUpdateLocationUseCase: Symbol.for("IUpdateLocationUseCase"),
  IDeleteLocationUseCase: Symbol.for("IDeleteLocationUseCase"),
  IGetLocationUseCase: Symbol.for("IGetLocationUseCase"),

  // Controllers
  ICreateDoctorController: Symbol.for("ICreateDoctorController"),
  IGetDoctorController: Symbol.for("IGetDoctorController"),
  IGetDoctorsController: Symbol.for("IGetDoctorsController"),
  IDeleteDoctorController: Symbol.for("IDeleteDoctorController"),
  IUpdateDoctorController: Symbol.for("IUpdateDoctorController"),
  ICreatePatientController: Symbol.for("ICreatePatientController"),
  IGetPatientController: Symbol.for("IGetPatientController"),
  IGetPatientsController: Symbol.for("IGetPatientsController"),
  IDeletePatientController: Symbol.for("IDeletePatientController"),
  IUpdatePatientController: Symbol.for("IUpdatePatientController"),
  ICreateVisitController: Symbol.for("ICreateVisitController"),
  IGetVisitController: Symbol.for("IGetVisitController"),
  IGetVisitsController: Symbol.for("IGetVisitsController"),
  IGetVisitsByPatientController: Symbol.for("IGetVisitsByPatientController"),
  IRegisterChargesForVisitController: Symbol.for(
    "IRegisterChargesForVisitController"
  ),
  IDeleteVisitController: Symbol.for("IDeleteVisitController"),
  IUpdateVisitController: Symbol.for("IUpdateVisitController"),
  ICreateItemController: Symbol.for("ICreateItemController"),
  IGetItemController: Symbol.for("IGetItemController"),
  IGetItemsController: Symbol.for("IGetItemsController"),
  IDeleteItemController: Symbol.for("IDeleteItemController"),
  IUpdateItemController: Symbol.for("IUpdateItemController"),
  IToggleItemStatusController: Symbol.for("IToggleItemStatusController"),
  ICreateTrackedChargeController: Symbol.for("ICreateTrackedChargeController"),
  IDeleteTrackedChargeController: Symbol.for("IDeleteTrackedChargeController"),
  IGetTrackedChargeController: Symbol.for("IGetTrackedChargeController"),
  IGetTrackedChargesController: Symbol.for("IGetTrackedChargesController"),
  IUpdateTrackedChargeController: Symbol.for("IUpdateTrackedChargeController"),
  IGetTrackedChargesByPatientController: Symbol.for(
    "IGetTrackedChargesByPatientController"
  ),
  IGetTrackedChargesByVisitController: Symbol.for(
    "IGetTrackedChargesByVisitController"
  ),
  IGetAllPaymentsController: Symbol.for("IGetAllPaymentsController"),
  IGetPaymentByIdController: Symbol.for("IGetPaymentByIdController"),
  IGetLocationsController: Symbol.for("IGetLocationsController"),
  ICreateLocationController: Symbol.for("ICreateLocationController"),
  IUpdateLocationController: Symbol.for("IUpdateLocationController"),
  IDeleteLocationController: Symbol.for("IDeleteLocationController"),
  IGetLocationController: Symbol.for("IGetLocationController"),
}

export interface DI_RETURN_TYPES {
  // Services
  // IAuthenticationService: IAuthenticationService

  // Repositories
  IDoctorRepository: IDoctorRepository
  IPatientRepository: IPatientRepository
  IItemRepository: IItemRepository
  IPaymentRepository: IPaymentRepository
  ITrackedChargesRepository: ITrackedChargesRepository
  IVisitRepository: IVisitRepository
  ILocationRepository: ILocationRepository

  // Use Cases
  ICreateDoctorUseCase: ICreateDoctorUseCase
  IGetDoctorUseCase: IGetDoctorUseCase
  IGetDoctorsUseCase: IGetDoctorsUseCase
  IUpdateDoctorUseCase: IUpdateDoctorUseCase
  IDeleteDoctorUseCase: IDeleteDoctorUseCase
  ICreatePatientUseCase: ICreatePatientUseCase
  IGetPatientUseCase: IGetPatientUseCase
  IGetPatientsUseCase: IGetPatientsUseCase
  IUpdatePatientUseCase: IUpdatePatientUseCase
  IDeletePatientUseCase: IDeletePatientUseCase
  ICreateVisitUseCase: ICreateVisitUseCase
  IGetVisitUseCase: IGetVisitByIdUseCase
  IGetVisitsUseCase: IGetVisitsUseCase
  IGetVisitsByPatientUseCase: IGetVisitsByPatientUseCase
  IRegisterChargesForVisitUseCase: IRegisterChargesForVisitUseCase
  IUpdateVisitUseCase: IUpdateVisitUseCase
  IDeleteVisitUseCase: IDeleteVisitUseCase
  ICreateItemUseCase: ICreateItemUseCase
  IGetItemUseCase: IGetItemUseCase
  IGetItemsUseCase: IGetItemsUseCase
  IUpdateItemUseCase: IUpdateItemUseCase
  IDeleteItemUseCase: IDeleteItemUseCase
  IToggleItemStatusUseCase: IToggleItemStatusUseCase
  ICreateTrackedChargeUseCase: ICreateTrackedChargeUseCase
  IDeleteTrackedChargeUseCase: IDeleteTrackedChargeUseCase
  IGetTrackedChargeUseCase: IGetTrackedChargeUseCase
  IGetTrackedChargesUseCase: IGetTrackedChargesUseCase
  IUpdateTrackedChargeUseCase: IUpdateTrackedChargeUseCase
  IGetTrackedChargesByPatientUseCase: IGetTrackedChargesByPatientUseCase
  IGetTrackedChargesByVisitUseCase: IGetTrackedChargesByVisitUseCase
  IGetAllPaymentsUseCase: IGetAllPaymentsUseCase
  IGetPaymentByIdUseCase: IGetPaymentByIdUseCase
  IGetLocationsUseCase: IGetLocationsUseCase
  ICreateLocationUseCase: ICreateLocationUseCase
  IUpdateLocationUseCase: IUpdateLocationUseCase
  IDeleteLocationUseCase: IDeleteLocationUseCase
  IGetLocationUseCase: IGetLocationUseCase

  // Controllers
  ICreateDoctorController: ICreateDoctorController
  IGetDoctorController: IGetDoctorController
  IGetDoctorsController: IGetDoctorsController
  IDeleteDoctorController: IDeleteDoctorController
  IUpdateDoctorController: IUpdateDoctorController
  ICreatePatientController: ICreatePatientController
  IGetPatientController: IGetPatientController
  IGetPatientsController: IGetPatientsController
  IDeletePatientController: IDeletePatientController
  IUpdatePatientController: IUpdatePatientController
  ICreateVisitController: ICreateVisitController
  IGetVisitController: IGetVisitByIdController
  IGetVisitsController: IGetVisitsController
  IGetVisitsByPatientController: IGetVisitsByPatientController
  IRegisterChargesForVisitController: IRegisterChargesForVisitController
  IDeleteVisitController: IDeleteVisitController
  IUpdateVisitController: IUpdateVisitController
  ICreateItemController: ICreateItemController
  IGetItemController: IGetItemController
  IGetItemsController: IGetItemsController
  IDeleteItemController: IDeleteItemController
  IUpdateItemController: IUpdateItemController
  IToggleItemStatusController: IToggleItemStatusController
  ICreateTrackedChargeController: ICreateTrackedChargeController
  IDeleteTrackedChargeController: IDeleteTrackedChargeController
  IGetTrackedChargeController: IGetTrackedChargeController
  IGetTrackedChargesController: IGetTrackedChargesController
  IUpdateTrackedChargeController: IUpdateTrackedChargeController
  IGetTrackedChargesByPatientController: IGetTrackedChargesByPatientController
  IGetTrackedChargesByVisitController: IGetTrackedChargesByVisitController
  IGetAllPaymentsController: IGetAllPaymentsController
  IGetPaymentByIdController: IGetPaymentByIdController
  IGetLocationsController: IGetLocationsController
  ICreateLocationController: ICreateLocationController
  IUpdateLocationController: IUpdateLocationController
  IDeleteLocationController: IDeleteLocationController
  IGetLocationController: IGetLocationController
}
