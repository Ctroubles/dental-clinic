import { PageableResult } from "@/application/common/pagination"
import { IPageableRequest } from "@/application/common/pagination"
import {
  ILocationRepository,
  LocationsFilters,
} from "@/application/repositories/location.repository.interface"
import { Location } from "@/domain/entities/location"

export interface IGetLocationsUseCaseInput
  extends IPageableRequest<LocationsFilters> {}

export type IGetLocationsUseCase = ReturnType<typeof getLocationsUseCase>

export const getLocationsUseCase =
  (locationRepository: ILocationRepository) =>
  async (
    input: IGetLocationsUseCaseInput
  ): Promise<PageableResult<Location>> => {
    const result = await locationRepository.findAll({
      page: input.page,
      pageSize: input.pageSize,
      filters: input.filters,
    })

    return result
  }
