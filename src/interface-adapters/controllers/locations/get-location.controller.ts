import { NotFoundError } from "@/application/errors"
import { IGetLocationUseCase } from "@/application/use-cases/locations/get-location.use-case"
import { Location } from "@/domain/entities/location"
import { DataResult } from "@/shared/result-handling/data-result"

function presenter(location: Location): Location {
  return {
    ...location,
    id: location.id.toString(),
    createdBy: location.createdBy.toString(),
    updatedBy: location.updatedBy?.toString(),
  }
}

export type IGetLocationController = ReturnType<typeof getLocationController>

export const getLocationController =
  (getLocationUseCase: IGetLocationUseCase) =>
  async (input: { id: string }): Promise<DataResult<Location>> => {
    const response = await getLocationUseCase(input)
    if (!response) {
      return DataResult.failure(new NotFoundError("Location not found"))
    }
    return DataResult.success(presenter(response))
  }
