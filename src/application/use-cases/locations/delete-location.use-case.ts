import { ILocationRepository } from "@/application/repositories/location.repository.interface"
import { Location } from "@/domain/entities/location"

export type IDeleteLocationUseCaseInput = {
  id: string
}

export type IDeleteLocationUseCase = ReturnType<typeof deleteLocationUseCase>

export const deleteLocationUseCase =
  (locationRepository: ILocationRepository) =>
  async (input: IDeleteLocationUseCaseInput): Promise<Location | null> => {
    return await locationRepository.delete(input.id)
  }
