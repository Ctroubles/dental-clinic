import { createModule } from "@evyweb/ioctopus"
import { createLocationUseCase } from "@/application/use-cases/locations/create-location.use-case"
import { deleteLocationUseCase } from "@/application/use-cases/locations/delete-location.use-case"
import { getLocationUseCase } from "@/application/use-cases/locations/get-location.use-case"
import { getLocationsUseCase } from "@/application/use-cases/locations/get-locations.use-case"
import { updateLocationUseCase } from "@/application/use-cases/locations/update-location.use-case"
import { LocationRepository } from "@/infrastructure/persistence/repositories/location.repository"
import { createLocationController } from "@/interface-adapters/controllers/locations/create-location.controller"
import { deleteLocationController } from "@/interface-adapters/controllers/locations/delete-location.controller"
import { getLocationController } from "@/interface-adapters/controllers/locations/get-location.controller"
import { getLocationsController } from "@/interface-adapters/controllers/locations/get-locations.controller"
import { updateLocationController } from "@/interface-adapters/controllers/locations/update-location.controller"
import { DI_SYMBOLS } from "../types"

export function createLocationsModule() {
  const locationsModule = createModule()

  // Repositories
  locationsModule
    .bind(DI_SYMBOLS.ILocationRepository)
    .toClass(LocationRepository)

  // Use Cases
  locationsModule
    .bind(DI_SYMBOLS.ICreateLocationUseCase)
    .toHigherOrderFunction(createLocationUseCase, [
      DI_SYMBOLS.ILocationRepository,
    ])

  locationsModule
    .bind(DI_SYMBOLS.IGetLocationsUseCase)
    .toHigherOrderFunction(getLocationsUseCase, [
      DI_SYMBOLS.ILocationRepository,
    ])

  locationsModule
    .bind(DI_SYMBOLS.IGetLocationUseCase)
    .toHigherOrderFunction(getLocationUseCase, [DI_SYMBOLS.ILocationRepository])

  locationsModule
    .bind(DI_SYMBOLS.IUpdateLocationUseCase)
    .toHigherOrderFunction(updateLocationUseCase, [
      DI_SYMBOLS.ILocationRepository,
    ])

  locationsModule
    .bind(DI_SYMBOLS.IDeleteLocationUseCase)
    .toHigherOrderFunction(deleteLocationUseCase, [
      DI_SYMBOLS.ILocationRepository,
    ])

  // Controllers
  locationsModule
    .bind(DI_SYMBOLS.ICreateLocationController)
    .toHigherOrderFunction(createLocationController, [
      DI_SYMBOLS.ICreateLocationUseCase,
    ])

  locationsModule
    .bind(DI_SYMBOLS.IGetLocationsController)
    .toHigherOrderFunction(getLocationsController, [
      DI_SYMBOLS.IGetLocationsUseCase,
    ])

  locationsModule
    .bind(DI_SYMBOLS.IGetLocationController)
    .toHigherOrderFunction(getLocationController, [
      DI_SYMBOLS.IGetLocationUseCase,
    ])

  locationsModule
    .bind(DI_SYMBOLS.IUpdateLocationController)
    .toHigherOrderFunction(updateLocationController, [
      DI_SYMBOLS.IUpdateLocationUseCase,
    ])

  locationsModule
    .bind(DI_SYMBOLS.IDeleteLocationController)
    .toHigherOrderFunction(deleteLocationController, [
      DI_SYMBOLS.IDeleteLocationUseCase,
    ])

  return locationsModule
}
