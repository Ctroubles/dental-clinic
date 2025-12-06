import { Model, PopulateOption, PopulateOptions } from "mongoose"
import {
  ILocationRepository,
  LocationsFilters,
} from "@/application/repositories/location.repository.interface"
import { Location, LocationInsert } from "@/domain/entities/location"
import { DatabaseOperationError } from "@/infrastructure/persistence/errors"
import {
  LocationDocument,
  LocationModel,
} from "@/infrastructure/persistence/mongoose/models"
import {
  mapLocationDocumentsToEntities,
  mapLocationDocumentToEntity,
} from "../mappers"
import { BaseRepository } from "./base.repository"

export class LocationRepository
  extends BaseRepository<Location, LocationDocument, LocationsFilters>
  implements ILocationRepository
{
  protected readonly model: Model<LocationDocument>
  protected readonly mapDocumentToEntity: (
    doc: LocationDocument | null
  ) => Location | null
  protected readonly mapDocumentsToEntities: (
    docs: LocationDocument[]
  ) => Location[]

  constructor() {
    super()
    this.model = LocationModel
    this.mapDocumentToEntity = mapLocationDocumentToEntity
    this.mapDocumentsToEntities = mapLocationDocumentsToEntities
  }

  protected async buildQuery(
    filters?: LocationsFilters
  ): Promise<Record<string, unknown>> {
    const query: Record<string, unknown> = {}

    if (filters?.search) {
      const searchRegex = new RegExp(filters.search, "i")
      query.$or = [{ name: searchRegex }, { description: searchRegex }]
    }

    return query
  }

  protected getPopulateConfig(
    includes?: Array<keyof Location>
  ): (PopulateOptions | string)[] {
    if (!includes) return []

    return []
  }

  async findByName(name: Location["name"]): Promise<Location | null> {
    const location = (await LocationModel.findOne({
      name,
    })) as LocationDocument | null
    return mapLocationDocumentToEntity(location)
  }

  async create(location: LocationInsert, createdBy: string): Promise<Location> {
    const locationData = {
      ...location,
      createdBy,
    }
    const newLocation = await LocationModel.create(locationData)
    if (!newLocation) {
      throw new DatabaseOperationError("Error creating location")
    }
    return mapLocationDocumentToEntity(newLocation)!
  }

  async update(location: Location): Promise<Location | null> {
    try {
      const locationData = {
        ...location,
        updatedBy: location.updatedBy,
        updatedAt: new Date(),
      }

      const updatedLocation = await LocationModel.findByIdAndUpdate(
        location.id,
        locationData
      )

      return mapLocationDocumentToEntity(updatedLocation)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error"
      throw new DatabaseOperationError(
        `Error updating Location: ${errorMessage}`
      )
    }
  }

  async delete(id: Location["id"]): Promise<Location | null> {
    const deletedLocation = await LocationModel.findByIdAndDelete(id)
    return mapLocationDocumentToEntity(deletedLocation)
  }
}
