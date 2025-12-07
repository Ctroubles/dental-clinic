import { Location, LocationInsert } from "@/domain/entities/location"
import { IBaseRepository } from "./base.repository.interface"

export type LocationsFilters = {
  search?: string | null
}

export interface ILocationRepository
  extends IBaseRepository<Location, LocationInsert, LocationsFilters> {
  findByName(name: Location["name"]): Promise<Location | null>
  create(location: LocationInsert, createdBy: string): Promise<Location>
  delete(id: Location["id"]): Promise<Location | null>
}
