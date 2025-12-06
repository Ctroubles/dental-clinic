import { ILocationRepository } from "@/application/repositories/location.repository.interface"
import { Location, LocationInsert } from "@/domain/entities/location"

export type IUpdateLocationUseCaseInput = {
  location: LocationInsert & { id: string }
  updatedBy: string
}

export type IUpdateLocationUseCase = ReturnType<typeof updateLocationUseCase>

export const updateLocationUseCase =
  (locationRepository: ILocationRepository) =>
  async (input: IUpdateLocationUseCaseInput): Promise<Location | null> => {
    const location = await locationRepository.findById(input.location.id)
    if (!location) {
      return null
    }

    const updatedLocation = {
      ...location,
      ...input.location,
      updatedBy: input.updatedBy,
    }

    return await locationRepository.update(updatedLocation)
  }
