import { NotFoundError } from "@/application/errors"
import { IDeleteLocationUseCase } from "@/application/use-cases/locations/delete-location.use-case"
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

export type IDeleteLocationController = ReturnType<
  typeof deleteLocationController
>

export const deleteLocationController =
  (deleteLocationUseCase: IDeleteLocationUseCase) =>
  async (input: { id: string }): Promise<DataResult<Location>> => {
    const response = await deleteLocationUseCase(input)
    if (!response) {
      return DataResult.failure(new NotFoundError("Location not found"))
    }
    return DataResult.success(presenter(response))
  }
