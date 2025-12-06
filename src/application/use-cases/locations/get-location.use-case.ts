import { ILocationRepository } from "@/application/repositories/location.repository.interface"
import { Location } from "@/domain/entities/location"

export type IGetLocationUseCaseInput = {
  id: string
}

export type IGetLocationUseCase = ReturnType<typeof getLocationUseCase>

export const getLocationUseCase =
  (locationRepository: ILocationRepository) =>
  async (input: IGetLocationUseCaseInput): Promise<Location | null> => {
    return await locationRepository.findById(input.id)
  }
