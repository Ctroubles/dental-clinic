import { PageableResult } from "@/application/common/pagination"
import {
  IGetLocationsUseCase,
  IGetLocationsUseCaseInput,
} from "@/application/use-cases/locations/get-locations.use-case"
import { Location } from "@/domain/entities/location"
import { DataResult } from "@/shared/result-handling/data-result"

export type IGetLocationsController = ReturnType<typeof getLocationsController>

export const getLocationsController =
  (getLocationsUseCase: IGetLocationsUseCase) =>
  async (
    input: IGetLocationsUseCaseInput
  ): Promise<DataResult<PageableResult<Location>>> => {
    const locations = await getLocationsUseCase(input)
    return DataResult.success(locations)
  }
