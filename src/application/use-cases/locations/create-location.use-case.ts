import { ValidationError } from "@/application/errors"
import { ILocationRepository } from "@/application/repositories/location.repository.interface"
import { Location, LocationInsert } from "@/domain/entities/location"

export type ICreateLocationUseCaseInput = {
  newLocation: LocationInsert
}

export type ICreateLocationUseCase = ReturnType<typeof createLocationUseCase>

export const createLocationUseCase =
  (locationRepository: ILocationRepository) =>
  async (
    input: ICreateLocationUseCaseInput,
    userId: string
  ): Promise<Location> => {
    const withSameName = await locationRepository.findByName(
      input.newLocation.name
    )

    if (withSameName) {
      throw new ValidationError("Ya existe una ubicación con el mismo nombre.")
    }

    return await locationRepository.create(input.newLocation, userId)
  }
