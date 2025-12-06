import { createContainer } from "@evyweb/ioctopus"
import { AsyncLocalStorage } from "async_hooks"
import { createDoctorsModule } from "./modules/doctors.module"
import { createItemsModule } from "./modules/items.module"
import { createLocationsModule } from "./modules/locations.module"
import { createPatientsModule } from "./modules/patients.module"
import { createPaymentModule } from "./modules/payment.module"
import { createTrackedChargesModule } from "./modules/tracked-charges.module"
import { createVisitsModule } from "./modules/visits.module"
import { DI_RETURN_TYPES, DI_SYMBOLS } from "./types"

const ApplicationContainer = createContainer()

// // AsyncLocalStorage to maintain scope context across async operations
const scopeStorage = new AsyncLocalStorage<boolean>()

ApplicationContainer.load(Symbol("DoctorsModule"), createDoctorsModule())
ApplicationContainer.load(Symbol("PatientsModule"), createPatientsModule())
ApplicationContainer.load(Symbol("ItemsModule"), createItemsModule())
ApplicationContainer.load(Symbol("PaymentModule"), createPaymentModule())
ApplicationContainer.load(Symbol("VisitsModule"), createVisitsModule())
ApplicationContainer.load(
  Symbol("TrackedChargesModule"),
  createTrackedChargesModule()
)
ApplicationContainer.load(Symbol("LocationsModule"), createLocationsModule())

export function getInjection<K extends keyof typeof DI_SYMBOLS>(
  symbol: K
): DI_RETURN_TYPES[K] {
  return ApplicationContainer.get(DI_SYMBOLS[symbol])
}

/**
 * Runs a callback within a dependency injection scope.
 * This is required for resolving scoped bindings.
 * Each request should have its own scope to ensure proper lifecycle management.
 */
export function runInScope<T>(callback: () => T): T {
  return ApplicationContainer.runInScope(callback)
}

/**
 * Runs an async callback within a dependency injection scope.
 * This ensures the scope remains active until all async operations complete.
 * This is necessary for handlers that use async/await.
 *
 * Uses AsyncLocalStorage to maintain scope context across async boundaries,
 * ensuring that getInjection can resolve scoped bindings even after await points.
 */
export async function runInScopeAsync<T>(
  callback: () => Promise<T>
): Promise<T> {
  return scopeStorage.run(true, async () => {
    return ApplicationContainer.runInScope(async () => {
      const result = await callback()
      return result
    })
  })
}
