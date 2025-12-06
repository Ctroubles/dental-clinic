import { Location, LocationInsert } from "@/domain/entities/location"
import { IBaseRepository } from "./base.repository.interface"

export type LocationsFilters = {
  search?: string | null
}

export interface ILocationRepository
  extends IBaseRepository<Location, LocationsFilters> {
  findByName(name: Location["name"]): Promise<Location | null>
  create(location: LocationInsert, createdBy: string): Promise<Location>
  update(location: Location): Promise<Location | null>
  delete(id: Location["id"]): Promise<Location | null>
}
