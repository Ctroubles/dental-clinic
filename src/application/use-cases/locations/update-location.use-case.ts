import { NotFoundError } from "@/application/errors"
import { ILocationRepository } from "@/application/repositories/location.repository.interface"
import { Location, LocationInsert } from "@/domain/entities/location"

export type IUpdateLocationUseCaseInput = {
  id: string
  data: LocationInsert
  updatedBy: string
}

export type IUpdateLocationUseCase = ReturnType<typeof updateLocationUseCase>

export const updateLocationUseCase =
  (locationRepository: ILocationRepository) =>
  async (input: IUpdateLocationUseCaseInput): Promise<Location> => {
    const updatedLocation = await locationRepository.update(
      input.id,
      input.data,
      input.updatedBy
    )

    if (!updatedLocation) {
      throw new NotFoundError(`Ubicación con id ${input.id} no encontrada`)
    }

    return updatedLocation
  }
